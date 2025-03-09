
import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Building, Globe, Mail, Phone, Edit, Save, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import LoadingButton from '@/components/ui/LoadingButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmployerProfileFormProps {
  isEditing?: boolean;
  initialData?: Partial<EmployerProfile>;
}

export interface EmployerProfile {
  id: string;
  company_name: string;
  company_website: string;
  company_description: string | null;
  contact_email: string | null;
  contact_person: string | null;
  contact_phone: string | null;
  company_mission: string | null;
  veteran_benefits: string | null;
  industry: string | null;
  company_size: string | null;
  company_logo_url: string | null;
  location: string | null;
}

const EmployerProfileForm: React.FC<EmployerProfileFormProps> = ({ isEditing = false, initialData = {} }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData.company_logo_url || null);
  
  const [formData, setFormData] = useState<Partial<EmployerProfile>>({
    company_name: '',
    company_website: '',
    company_description: '',
    contact_email: '',
    contact_person: '',
    contact_phone: '',
    company_mission: '',
    veteran_benefits: '',
    industry: '',
    company_size: '',
    location: '',
    ...initialData
  });
  
  useEffect(() => {
    if (user?.email && !formData.contact_email) {
      setFormData(prev => ({ ...prev, contact_email: user.email }));
    }
  }, [user, formData.contact_email]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };
  
  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return formData.company_logo_url || null;
    
    try {
      const fileExt = logoFile.name.split('.').pop();
      const filePath = `company-logos/${formData.company_name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('employer-logos')
        .upload(filePath, logoFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('employer-logos')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload company logo');
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name || !formData.company_website) {
      toast.error('Please provide company name and website');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload logo if it exists
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }
      
      const finalData = {
        ...formData,
        company_logo_url: logoUrl || formData.company_logo_url
      };
      
      // Create or update employer profile in Supabase
      let response;
      
      if (isEditing && initialData.id) {
        // Update existing profile
        response = await supabase
          .from('employers')
          .update({
            company_name: finalData.company_name,
            company_website: finalData.company_website,
            company_description: finalData.company_description,
            contact_email: finalData.contact_email,
            contact_person: finalData.contact_person,
            contact_phone: finalData.contact_phone,
            company_mission: finalData.company_mission,
            veteran_benefits: finalData.veteran_benefits,
            industry: finalData.industry,
            company_size: finalData.company_size,
            company_logo_url: finalData.company_logo_url,
            location: finalData.location
          })
          .eq('id', initialData.id);
      } else {
        // Create new profile
        response = await supabase
          .from('employers')
          .insert({
            user_id: user?.id,
            company_name: finalData.company_name,
            company_website: finalData.company_website,
            company_description: finalData.company_description,
            contact_email: finalData.contact_email,
            contact_person: finalData.contact_person,
            contact_phone: finalData.contact_phone,
            company_mission: finalData.company_mission,
            veteran_benefits: finalData.veteran_benefits,
            industry: finalData.industry,
            company_size: finalData.company_size,
            company_logo_url: finalData.company_logo_url,
            location: finalData.location
          });
      }
      
      if (response.error) throw response.error;
      
      toast.success(isEditing ? 'Profile updated successfully!' : 'Profile created successfully!');
      
      // Navigate to profile view
      navigate('/employer-profile');
    } catch (error) {
      console.error('Error saving employer profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {isEditing ? 'Edit Employer Profile' : 'Create Employer Profile'}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your company information to help veterans find the right opportunities'
            : 'Tell us about your company to help veterans find the right opportunities'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Company Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 relative border rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company logo" className="h-full w-full object-contain" />
                ) : (
                  <Building className="h-12 w-12 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 200x200px. Max size: 2MB
                </p>
              </div>
            </div>
          </div>
          
          {/* Basic Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_website">Company Website *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Globe className="h-4 w-4" />
                </span>
                <Input
                  id="company_website"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleInputChange}
                  placeholder="https://www.example.com"
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry || ''} 
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="financial">Financial Services</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="logistics">Logistics & Transportation</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_size">Company Size</Label>
              <Select 
                value={formData.company_size || ''} 
                onValueChange={(value) => handleSelectChange('company_size', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501-1000">501-1000 employees</SelectItem>
                  <SelectItem value="1001+">1001+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Company Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              placeholder="City, State/Province, Country"
            />
          </div>
          
          {/* Company Description */}
          <div className="space-y-2">
            <Label htmlFor="company_description">Company Description *</Label>
            <Textarea
              id="company_description"
              name="company_description"
              value={formData.company_description || ''}
              onChange={handleInputChange}
              placeholder="Describe your company, products, services, and work environment"
              className="min-h-32"
              required
            />
          </div>
          
          {/* Company Mission */}
          <div className="space-y-2">
            <Label htmlFor="company_mission">Company Mission and Values</Label>
            <Textarea
              id="company_mission"
              name="company_mission"
              value={formData.company_mission || ''}
              onChange={handleInputChange}
              placeholder="Describe your company's mission and core values"
              className="min-h-24"
            />
          </div>
          
          {/* Benefits for Veterans */}
          <div className="space-y-2">
            <Label htmlFor="veteran_benefits">Benefits for Veterans</Label>
            <Textarea
              id="veteran_benefits"
              name="veteran_benefits"
              value={formData.veteran_benefits || ''}
              onChange={handleInputChange}
              placeholder="Describe specific benefits, programs, or opportunities your company offers to veterans"
              className="min-h-24"
            />
          </div>
          
          {/* Contact Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person || ''}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Phone className="h-4 w-4" />
                </span>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone || ''}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/employer-profile')}
          >
            Cancel
          </Button>
          
          <LoadingButton 
            type="submit"
            isLoading={isLoading}
            loadingText={isEditing ? "Updating..." : "Creating..."}
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Profile' : 'Create Profile'}
          </LoadingButton>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmployerProfileForm;
