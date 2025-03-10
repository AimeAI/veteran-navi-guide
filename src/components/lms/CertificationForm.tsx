
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';
import { LmsCertification, addUserCertification } from '@/services/lmsService';
import { Badge } from '@/components/ui/badge';

interface CertificationFormProps {
  onSuccess: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onSuccess }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    skills: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to add a certification');
      return;
    }
    
    if (!formData.name || !formData.issuer || !formData.issueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const certification: Omit<LmsCertification, 'id'> = {
        user_id: user.email,
        name: formData.name,
        issuer: formData.issuer,
        issue_date: formData.issueDate,
        expiry_date: formData.expiryDate || undefined,
        credential_id: formData.credentialId || undefined,
        credential_url: formData.credentialUrl || undefined,
        description: formData.description || undefined,
        skills: formData.skills
      };
      
      const result = await addUserCertification(certification);
      
      if (result) {
        toast.success('Certification added successfully');
        onSuccess();
        
        // Reset form
        setFormData({
          name: '',
          issuer: '',
          issueDate: '',
          expiryDate: '',
          credentialId: '',
          credentialUrl: '',
          description: '',
          skills: []
        });
      }
    } catch (error) {
      console.error('Error adding certification:', error);
      toast.error('Failed to add certification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Certification</CardTitle>
        <CardDescription>
          Add your certifications to showcase your skills and achievements
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Certification Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. AWS Certified Solutions Architect"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuing Organization *</Label>
            <Input
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleInputChange}
              placeholder="e.g. Amazon Web Services"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="credentialId">Credential ID (Optional)</Label>
            <Input
              id="credentialId"
              name="credentialId"
              value={formData.credentialId}
              onChange={handleInputChange}
              placeholder="e.g. ABC123XYZ"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
            <Input
              id="credentialUrl"
              name="credentialUrl"
              type="url"
              value={formData.credentialUrl}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the certification and what it covers"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                placeholder="e.g. Leadership, Project Management"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{skill}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Certification'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CertificationForm;
