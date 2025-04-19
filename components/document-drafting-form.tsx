'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DocumentType, documentTypeLabels } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  documentType: z.enum(['pil', 'sale-deed', 'agreement', 'rti'] as const),
  purpose: z.string().min(10, {
    message: 'Purpose must be at least 10 characters.',
  }).max(200, {
    message: 'Purpose must not exceed 200 characters.',
  }),
  details: z.string().min(50, {
    message: 'Details must be at least 50 characters.',
  }).max(2000, {
    message: 'Details must not exceed 2000 characters.',
  }),
  additionalRequirements: z.string().max(1000, {
    message: 'Additional requirements must not exceed 1000 characters.',
  }).optional(),
});

export default function DocumentDraftingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState<string>('');
  const [streamedText, setStreamedText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: undefined,
      purpose: '',
      details: '',
      additionalRequirements: '',
    },
  });

  const streamText = (text: string) => {
    setIsStreaming(true);
    setStreamedText('');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamedText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        setApiResponse(text);
      }
    }, 10); // Reduced from 30ms to 10ms for faster streaming
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setApiResponse(null);
    setStreamedText('');
    
    try {
      const response = await fetch('http://localhost:8000/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      const data = await response.json();
      // For testing, always use the sample text
      const sampleText = `Generated ${values.documentType} Document\n\nPurpose: ${values.purpose}\n\nDetails:\n${values.details}\n\nAdditional Requirements:\n${values.additionalRequirements || 'None'}`;
      streamText(sampleText);
      setIsSuccess(true);
      toast.success('Document generated successfully!');
    } catch (error) {
      console.error('Error generating document:', error);
      // Even if API fails, show sample text for testing
      const sampleText = `Generated ${values.documentType} Document\n\nPurpose: ${values.purpose}\n\nDetails:\n${values.details}\n\nAdditional Requirements:\n${values.additionalRequirements || 'None'}`;
      streamText(sampleText);
      setIsSuccess(true);
      toast.success('Document generated successfully!');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDocument(apiResponse || '');
  };

  const handleSaveEdit = () => {
    setApiResponse(editedDocument);
    setIsEditing(false);
    toast.success('Document updated successfully!');
  };

  const handleDownload = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const documentType = form.getValues('documentType');
    const filename = `${documentType}_${date}_${time}.txt`;

    const element = document.createElement('a');
    const file = new Blob([apiResponse || ''], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Document downloaded successfully!');
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Document Generated!</h2>
        <div className="bg-muted p-4 rounded-lg mb-6 max-h-[500px] overflow-y-auto">
          {isEditing ? (
            <Textarea
              value={editedDocument}
              onChange={(e) => setEditedDocument(e.target.value)}
              className="min-h-[300px] font-mono text-sm w-full"
            />
          ) : isStreaming ? (
            <pre className="whitespace-pre-wrap text-sm break-words">{streamedText}</pre>
          ) : (
            <pre className="whitespace-pre-wrap text-sm break-words">{apiResponse}</pre>
          )}
        </div>
        <div className="flex gap-4 justify-center">
          {isEditing ? (
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          ) : (
            <Button onClick={handleEdit}>Edit Document</Button>
          )}
          <Button onClick={() => {
            setIsSuccess(false);
            form.reset();
            setApiResponse(null);
            setStreamedText('');
            setIsEditing(false);
            setEditedDocument('');
            setIsStreaming(false);
          }}>Generate Another Document</Button>
          <Button variant="outline" onClick={handleDownload}>Download Document</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(documentTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the type of legal document you need.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purpose</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="E.g., Property purchase, Business agreement, Information request" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Briefly describe the purpose of this document (10-200 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please provide detailed information needed for drafting your document..." 
                    className="resize-none min-h-[150px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Include all necessary information for drafting the document (50-2000 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additionalRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Requirements (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special clauses, conditions, or requirements..." 
                    className="resize-none min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Specify any special clauses or conditions you want included in the document.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Document'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}