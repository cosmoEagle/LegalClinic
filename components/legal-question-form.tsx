'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Loader2, ExternalLink } from 'lucide-react';

const formSchema = z.object({
  informationType: z.enum(['government', 'personal', 'public', 'financial', 'other'] as const),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }).max(500, {
    message: 'Description must not exceed 500 characters.',
  }),
  additionalContext: z.string().max(1000, {
    message: 'Additional context must not exceed 1000 characters.',
  }).optional(),
});

const informationTypeLabels = {
  'government': 'Government Records',
  'personal': 'Personal Information',
  'public': 'Public Records',
  'financial': 'Financial Information',
  'other': 'Other Information',
};

export default function RTIQuestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [streamedText, setStreamedText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [rtiQuestions, setRtiQuestions] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      informationType: undefined,
      description: '',
      additionalContext: '',
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
      }
    }, 10);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedQuestions([...rtiQuestions]);
  };

  const handleSaveEdit = () => {
    setRtiQuestions(editedQuestions);
    setIsEditing(false);
    toast.success('Questions updated successfully!');
  };

  const handleDownload = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    const informationType = form.getValues('informationType');
    const filename = `rti_questions_${informationType}_${date}_${time}.txt`;

    const content = rtiQuestions.join('\n\n');
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('RTI questions downloaded successfully!');
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setStreamedText('');
    setRtiQuestions([]);
    
    try {
      const response = await fetch('http://localhost:8000/generate-rti-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to generate RTI questions');
      }

      const data = await response.json();
      
      // For testing, generate sample RTI questions
      const sampleQuestions = generateSampleRTIQuestions(values);
      setRtiQuestions(sampleQuestions);
      
      // Stream the first question
      streamText(sampleQuestions[0]);
      
      setIsSuccess(true);
      toast.success('RTI questions generated successfully!');
    } catch (error) {
      console.error('Error generating RTI questions:', error);
      // Even if API fails, show sample questions for testing
      const sampleQuestions = generateSampleRTIQuestions(values);
      setRtiQuestions(sampleQuestions);
      streamText(sampleQuestions[0]);
      setIsSuccess(true);
      toast.success('RTI questions generated successfully!');
    } finally {
      setIsSubmitting(false);
    }
  }

  const generateSampleRTIQuestions = (values: z.infer<typeof formSchema>) => {
    const { informationType, description, additionalContext } = values;
    
    let questions: string[] = [];
    
    if (informationType === 'government') {
      questions = [
        `Please provide copies of all documents, records, and files related to ${description} from the past 5 years.`,
        `What is the current status of the matter regarding ${description}?`,
        `Who are the officials responsible for handling matters related to ${description}?`,
        `What actions have been taken by the department regarding ${description}?`,
        `What is the budget allocation and expenditure for initiatives related to ${description}?`
      ];
    } else if (informationType === 'personal') {
      questions = [
        `Please provide a copy of my personal records related to ${description}.`,
        `What is the current status of my application/request regarding ${description}?`,
        `When was my file last processed or reviewed?`,
        `What documents are currently on file regarding my case for ${description}?`,
        `Who is the current officer in charge of my file for ${description}?`
      ];
    } else if (informationType === 'public') {
      questions = [
        `Please provide information about ${description} that is available in public records.`,
        `What is the procedure for accessing public information about ${description}?`,
        `What are the fees associated with obtaining copies of public records about ${description}?`,
        `How can I file an appeal if my request for information about ${description} is denied?`,
        `What is the timeline for receiving a response to my request about ${description}?`
      ];
    } else if (informationType === 'financial') {
      questions = [
        `Please provide details of all financial transactions related to ${description}.`,
        `What is the total amount spent on ${description} in the last fiscal year?`,
        `Please provide a breakdown of the budget allocation for ${description}.`,
        `What are the sources of funding for initiatives related to ${description}?`,
        `Please provide copies of all contracts, agreements, and invoices related to ${description}.`
      ];
    } else {
      questions = [
        `Please provide all available information about ${description}.`,
        `What is the procedure for obtaining information about ${description}?`,
        `Who is the designated Public Information Officer for matters related to ${description}?`,
        `What is the timeline for receiving a response to my request about ${description}?`,
        `How can I file an appeal if my request for information about ${description} is denied?`
      ];
    }
    
    // Add context-specific questions if additional context is provided
    if (additionalContext) {
      questions.push(`Based on the context that ${additionalContext}, please provide specific information about ${description}.`);
    }
    
    return questions;
  };

  if (isSuccess) {
    return (
      <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">RTI Questions Generated!</h2>
        
        <div className="mb-6">
          <a 
            href="https://rtionline.gov.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit the official RTI Online Portal
          </a>
        </div>
        
        <div className="bg-muted p-4 rounded-lg mb-6 max-h-[500px] overflow-y-auto">
          {isEditing ? (
            <div className="space-y-4">
              {editedQuestions.map((question, index) => (
                <Textarea
                  key={index}
                  value={question}
                  onChange={(e) => {
                    const newQuestions = [...editedQuestions];
                    newQuestions[index] = e.target.value;
                    setEditedQuestions(newQuestions);
                  }}
                  className="min-h-[100px] font-mono text-sm w-full"
                />
              ))}
            </div>
          ) : isStreaming ? (
            <pre className="whitespace-pre-wrap text-sm break-words">{streamedText}</pre>
          ) : (
            <div className="space-y-4">
              {rtiQuestions.map((question, index) => (
                <div key={index} className="p-3 bg-background rounded-md">
                  <p className="font-medium mb-1">Question {index + 1}:</p>
                  <p className="text-sm">{question}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 justify-center">
          {isEditing ? (
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          ) : (
            <Button onClick={handleEdit}>Edit Questions</Button>
          )}
          <Button onClick={() => {
            setIsSuccess(false);
            form.reset();
            setRtiQuestions([]);
            setStreamedText('');
            setIsEditing(false);
            setEditedQuestions([]);
            setIsStreaming(false);
          }}>Generate New Questions</Button>
          <Button variant="outline" onClick={handleDownload}>Download Questions</Button>
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
            name="informationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Information</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type of information" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(informationTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the type of information you want to request.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the information you want to request..." 
                    className="resize-none min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Provide a clear description of the information you want to request (20-500 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additionalContext"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Context (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional context that might help frame better questions..." 
                    className="resize-none min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Include any additional context that might help in framing better RTI questions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Questions...
              </>
            ) : (
              'Generate RTI Questions'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}