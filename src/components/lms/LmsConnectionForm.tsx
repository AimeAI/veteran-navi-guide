
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addLmsConnection, LmsConnection } from '@/services/lmsService';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface LmsConnectionFormProps {
  onSuccess: () => void;
}

const LmsConnectionForm: React.FC<LmsConnectionFormProps> = ({ onSuccess }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    lmsType: 'canvas' as 'canvas' | 'moodle' | 'blackboard' | 'other',
    instanceUrl: '',
    apiKey: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLmsTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      lmsType: value as 'canvas' | 'moodle' | 'blackboard' | 'other' 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to connect an LMS');
      return;
    }
    
    if (!formData.instanceUrl) {
      toast.error('Please enter the LMS URL');
      return;
    }
    
    if (!formData.apiKey) {
      toast.error('Please enter your API key');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const connection: Omit<LmsConnection, 'id' | 'connected_at'> = {
        user_id: user.email,
        lms_type: formData.lmsType,
        access_token: formData.apiKey,
        instance_url: formData.instanceUrl,
        is_active: true
      };
      
      const result = await addLmsConnection(connection);
      
      if (result) {
        toast.success(`Successfully connected to ${formData.lmsType}`);
        onSuccess();
        
        // Reset form
        setFormData({
          lmsType: 'canvas',
          instanceUrl: '',
          apiKey: '',
        });
      }
    } catch (error) {
      console.error('Error connecting LMS:', error);
      toast.error('Failed to connect to LMS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect LMS Platform</CardTitle>
        <CardDescription>
          Link your Learning Management System to import your courses and certifications
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lmsType">LMS Platform</Label>
            <Select 
              value={formData.lmsType} 
              onValueChange={handleLmsTypeChange}
            >
              <SelectTrigger id="lmsType">
                <SelectValue placeholder="Select LMS platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="canvas">Canvas LMS</SelectItem>
                <SelectItem value="moodle">Moodle</SelectItem>
                <SelectItem value="blackboard">Blackboard</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {formData.lmsType === 'canvas' && 'Connect to Canvas LMS to import your courses and achievements'}
              {formData.lmsType === 'moodle' && 'Connect to Moodle to import your courses and achievements'}
              {formData.lmsType === 'blackboard' && 'Connect to Blackboard to import your courses and achievements'}
              {formData.lmsType === 'other' && 'Connect to other LMS platforms to import your courses and achievements'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instanceUrl">LMS URL</Label>
            <Input
              id="instanceUrl"
              name="instanceUrl"
              value={formData.instanceUrl}
              onChange={handleInputChange}
              placeholder={formData.lmsType === 'canvas' ? 'https://example.instructure.com' : 'https://your-lms-url.com'}
              required
            />
            <p className="text-xs text-gray-500">
              The URL of your LMS instance
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key / Access Token</Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={handleInputChange}
              placeholder="Enter your API key or access token"
              required
            />
            <p className="text-xs text-gray-500">
              {formData.lmsType === 'canvas' && (
                <>You can generate an access token in your Canvas account settings. <a href="https://community.canvaslms.com/t5/Admin-Guide/How-do-I-manage-API-access-tokens-as-an-admin/ta-p/89" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Learn more</a></>
              )}
              {formData.lmsType === 'moodle' && 'You can generate an API key in your Moodle account settings'}
              {formData.lmsType === 'blackboard' && 'You can generate an API key in your Blackboard account settings'}
              {formData.lmsType === 'other' && 'Enter the API key or access token for your LMS'}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect LMS'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LmsConnectionForm;
