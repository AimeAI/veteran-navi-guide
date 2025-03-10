
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { MentorshipProfile } from '@/services/mentorship/types';

const formSchema = z.object({
  is_mentor: z.boolean().default(false),
  mentor_bio: z.string().optional(),
  industry: z.string().optional(),
  years_experience: z.coerce.number().int().min(0).max(50).optional(),
  availability: z.string().optional(),
  max_mentees: z.coerce.number().int().min(1).max(10).optional(),
  mentoring_topics: z.array(z.string()).optional()
});

interface MentorshipProfileFormProps {
  initialData?: Partial<MentorshipProfile>;
  onSubmit: (data: Partial<MentorshipProfile>) => Promise<void>;
  isLoading?: boolean;
}

const MentorshipProfileForm: React.FC<MentorshipProfileFormProps> = ({ 
  initialData, 
  onSubmit,
  isLoading = false
}) => {
  const [topicInput, setTopicInput] = React.useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_mentor: initialData?.is_mentor || false,
      mentor_bio: initialData?.mentor_bio || '',
      industry: initialData?.industry || '',
      years_experience: initialData?.years_experience || undefined,
      availability: initialData?.availability || '',
      max_mentees: initialData?.max_mentees || 3,
      mentoring_topics: initialData?.mentoring_topics || []
    }
  });
  
  const handleAddTopic = () => {
    if (!topicInput.trim()) return;
    
    const currentTopics = form.getValues('mentoring_topics') || [];
    if (!currentTopics.includes(topicInput.trim())) {
      form.setValue('mentoring_topics', [...currentTopics, topicInput.trim()]);
    }
    setTopicInput('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };
  
  const handleRemoveTopic = (topic: string) => {
    const currentTopics = form.getValues('mentoring_topics') || [];
    form.setValue('mentoring_topics', currentTopics.filter(t => t !== topic));
  };
  
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="is_mentor"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Available as a Mentor</FormLabel>
                <FormDescription>
                  Toggle this option if you want to serve as a mentor to other veterans
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {form.watch('is_mentor') && (
          <>
            <FormField
              control={form.control}
              name="mentor_bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentor Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your background, skills, and how you can help mentees..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be shown to potential mentees. Be specific about how you can help.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="defense">Defense</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={50}
                        placeholder="Years of experience"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="asneeded">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_mentees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Mentees</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        placeholder="Max number of mentees"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="mentoring_topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mentoring Topics</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Add a topic (e.g., Career Transition, Interview Prep)"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                    </FormControl>
                    <Button type="button" onClick={handleAddTopic} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="px-2 py-1">
                        {topic}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTopic(topic)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Add topics you can mentor others on
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default MentorshipProfileForm;
