
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EmployerLead, LEAD_STATUS_OPTIONS } from '@/types/leads';
import { createLead, updateLead } from '@/services/leadService';
import FormErrorMessage from '@/components/ui/form-error-message';

// Create a schema for form validation
const leadFormSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  website_url: z.string().url('Please enter a valid URL including http:// or https://'),
  linkedin_url: z.string().url('Please enter a valid URL including http:// or https://').optional().or(z.literal('')),
  lead_status: z.enum(LEAD_STATUS_OPTIONS),
  notes: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadEditFormProps {
  lead?: EmployerLead;
  onSave: () => void;
  onCancel?: () => void;
}

const LeadEditForm: React.FC<LeadEditFormProps> = ({ lead, onSave, onCancel }) => {
  const isEditing = !!lead;
  
  // Initialize form with default values or existing lead data
  const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: lead ? {
      company_name: lead.company_name,
      website_url: lead.website_url,
      linkedin_url: lead.linkedin_url || '',
      lead_status: lead.lead_status,
      notes: lead.notes || '',
    } : {
      company_name: '',
      website_url: '',
      linkedin_url: '',
      lead_status: 'New',
      notes: '',
    }
  });
  
  // Handle form submission
  const onSubmit = async (data: LeadFormValues) => {
    if (isEditing && lead) {
      // Update existing lead
      const result = await updateLead(lead.id, data);
      if (result) {
        onSave();
      }
    } else {
      // Create new lead
      const result = await createLead(data);
      if (result) {
        onSave();
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="company_name">Company Name *</Label>
        <Input 
          id="company_name"
          {...register('company_name')}
          aria-invalid={!!errors.company_name}
        />
        <FormErrorMessage message={errors.company_name?.message} />
      </div>
      
      <div>
        <Label htmlFor="website_url">Website URL *</Label>
        <Input 
          id="website_url"
          type="url"
          placeholder="https://"
          {...register('website_url')}
          aria-invalid={!!errors.website_url}
        />
        <FormErrorMessage message={errors.website_url?.message} />
      </div>
      
      <div>
        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
        <Input 
          id="linkedin_url"
          type="url"
          placeholder="https://"
          {...register('linkedin_url')}
          aria-invalid={!!errors.linkedin_url}
        />
        <FormErrorMessage message={errors.linkedin_url?.message} />
      </div>
      
      <div>
        <Label htmlFor="lead_status">Lead Status *</Label>
        <Select
          defaultValue={lead?.lead_status || 'New'}
          onValueChange={(value) => setValue('lead_status', value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select lead status" />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('lead_status')} />
        <FormErrorMessage message={errors.lead_status?.message} />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes"
          placeholder="Add any relevant notes about this lead..."
          {...register('notes')}
          rows={4}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (isEditing ? 'Update Lead' : 'Add Lead')}
        </Button>
      </div>
    </form>
  );
};

export default LeadEditForm;
