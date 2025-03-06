
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MessageSquare, Bug, HelpCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { sanitizeInput, storeCSRFToken } from '@/utils/securityUtils';
import { isValidEmail } from '@/utils/validation';

type FeedbackType = 'suggestion' | 'bug' | 'support';

interface FeedbackFormData {
  type: FeedbackType;
  title: string;
  description: string;
  email: string;
  priority?: 'low' | 'medium' | 'high';
  attachScreenshot?: boolean;
}

const FeedbackForm = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>('suggestion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'suggestion',
    title: '',
    description: '',
    email: '',
    priority: 'medium',
  });
  const [csrfToken, setCsrfToken] = useState('');

  // Generate CSRF token on component mount
  React.useEffect(() => {
    setCsrfToken(storeCSRFToken());
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value as FeedbackType);
    setFormData(prev => ({
      ...prev,
      type: value as FeedbackType,
      title: '',
      description: '',
      priority: value === 'bug' ? 'medium' : undefined,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : sanitizeInput(value); // Sanitize input
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const validateFormData = (): boolean => {
    // Validate email
    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email address");
      return false;
    }

    // Validate title
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    // Validate description
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (!validateFormData()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would send data to Supabase
      // Example: await supabase.from('feedback').insert([
      //   {
      //     ...formData,
      //     csrf_token: csrfToken, // Include CSRF token for verification on server
      //     created_at: new Date().toISOString()
      //   }
      // ]);
      
      console.log('Submitting feedback:', formData, 'CSRF Token:', csrfToken);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Your ${activeTab} has been submitted successfully!`);
      setFormData({
        type: activeTab,
        title: '',
        description: '',
        email: '',
        priority: activeTab === 'bug' ? 'medium' : undefined,
      });
      
      // Generate new CSRF token for next submission
      setCsrfToken(storeCSRFToken());
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Help Us Improve</CardTitle>
        <CardDescription>
          We value your feedback and are here to support you
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="suggestion" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Suggestion
          </TabsTrigger>
          <TabsTrigger value="bug" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Report Bug
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Get Support
          </TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <TabsContent value="suggestion" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="suggestion-title">What's your suggestion?</Label>
                <Input
                  id="suggestion-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief title for your suggestion"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="suggestion-description">Details</Label>
                <Textarea
                  id="suggestion-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your suggestion and how it would improve your experience"
                  rows={5}
                  required
                />
              </div>
            </TabsContent>
            
            <TabsContent value="bug" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bug-title">What's not working?</Label>
                <Input
                  id="bug-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bug-description">Steps to reproduce</Label>
                <Textarea
                  id="bug-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please describe the steps to reproduce this issue"
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bug-priority">Priority</Label>
                <select
                  id="bug-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="low">Low - Minor issue</option>
                  <option value="medium">Medium - Affects functionality</option>
                  <option value="high">High - Critical issue</option>
                </select>
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="support-title">What do you need help with?</Label>
                <Input
                  id="support-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief title for your request"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="support-description">Details</Label>
                <Textarea
                  id="support-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Please provide details about your support request"
                  rows={5}
                  required
                />
              </div>
            </TabsContent>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="email">Your email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="So we can follow up with you"
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  );
};

export default FeedbackForm;
