'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LegalQuestion, LegalTopic, legalTopicLabels } from '@/types';
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
  topic: z.enum(['mva', 'sale-deeds', 'tpa', 'bail'] as const),
  question: z.string().min(10, {
    message: 'Question must be at least 10 characters.',
  }).max(500, {
    message: 'Question must not exceed 500 characters.',
  }),
  additionalDetails: z.string().max(1000, {
    message: 'Additional details must not exceed 1000 characters.',
  }).optional(),
});

export default function LegalQuestionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: undefined,
      question: '',
      additionalDetails: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Mock API call
    try {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Submitted question:', values);
      setIsSuccess(true);
      toast.success('Your legal question has been submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('Failed to submit your question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-card border border-border p-8 rounded-lg shadow-sm text-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Question Submitted!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for submitting your legal question. Our experts will review it and provide a response shortly.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Ask Another Question</Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Topic</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a legal topic" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(legalTopicLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the legal area related to your question.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Question</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please describe your legal question here..." 
                    className="resize-none min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Provide a clear and concise question (10-500 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additionalDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional context or details that may help answer your question..." 
                    className="resize-none min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Include any relevant information that may assist in answering your question.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Question'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}