
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { JobVariant } from '@/types/abTest';

interface AbTestVariantFormProps {
  variant?: Partial<JobVariant>;
  onSubmit: (variant: Partial<JobVariant>) => void;
  onCancel: () => void;
}

const AbTestVariantForm: React.FC<AbTestVariantFormProps> = ({ 
  variant,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<JobVariant>>(
    variant || {
      title: '',
      description: '',
      callToAction: 'Apply Now',
      isControl: false
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isControl: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Senior Cybersecurity Analyst"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the position and requirements..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="callToAction">Call to Action Button Text</Label>
        <Input
          id="callToAction"
          name="callToAction"
          value={formData.callToAction}
          onChange={handleChange}
          placeholder="e.g. Apply Now, Submit Application"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isControl"
          checked={formData.isControl || false}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="isControl">Set as control variant</Label>
      </div>

      <div className="pt-2 flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {variant ? 'Update Variant' : 'Create Variant'}
        </Button>
      </div>
    </form>
  );
};

export default AbTestVariantForm;
