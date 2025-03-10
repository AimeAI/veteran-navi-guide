import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import { Building, Mail, Phone, MapPin, Globe, Save } from 'lucide-react';
import LoadingButton from '@/components/ui/LoadingButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { EmployerProfile } from '@/types/application';
import ProfileCompletionProgress from '@/components/ProfileCompletionProgress';
import EmployerRating from '@/components/EmployerRating';
import EmployerReviewDialog from '@/components/reviews/EmployerReviewDialog';
import EmployerReviewsList from '@/components/reviews/EmployerReviewsList';
import EmployerRatingSummary from '@/components/reviews/EmployerRatingSummary';
import { getEmployerRatingSummary } from '@/services/reviewService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmployerProfilePage = () => {
  const { user, updateEmployerProfile, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [ratingSummary, setRatingSummary] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);
  
  const [formData, setFormData] = useState<Partial<EmployerProfile>>(
    user?.employerProfile || {
      companyName: '',
      industry: '',
      companySize: '',
      location: '',
      website: '',
      description: '',
      contactEmail: '',
      contactPhone: '',
    }
  );
  
  // Fetch employer rating
  useEffect(() => {
    const fetchRatingSummary = async () => {
      if (user?.employerProfile?.id) {
        setIsLoadingRatings(true);
        try {
          const summary = await getEmployerRatingSummary(user.employerProfile.id);
          setRatingSummary(summary);
        } catch (error) {
          console.error('Error fetching rating summary:', error);
        } finally {
          setIsLoadingRatings(false);
        }
      }
    };
    
    fetchRatingSummary();
  }, [user?.employerProfile?.id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployerProfile(formData);
  };
  
  const handleNewReview = () => {
    // Refresh rating summary
    if (user?.employerProfile?.id) {
      getEmployerRatingSummary(user.employerProfile.id)
        .then(summary => setRatingSummary(summary))
        .catch(err => console.error('Error refreshing rating summary:', err));
    }
  };
  
  if (!user || user.role !== 'employer') {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900">Unauthorized Access</h2>
              <p className="mt-2 text-gray-600">
                You must be logged in as an employer to view this page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const employerId = user?.employerProfile?.id || '';
  const companyName = formData.companyName || user?.employerProfile?.companyName || 'Your Company';
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Building className="mr-2 h-8 w-8" />
        Employer Profile
      </h1>
      
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <ProfileCompletionProgress />
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews
            {ratingSummary.totalReviews > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {ratingSummary.totalReviews}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details to help veterans understand your organization
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        name="companyName" 
                        value={formData.companyName} 
                        onChange={handleInputChange} 
                        placeholder="Your company name"
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleInputChange} 
                        placeholder="e.g. Ottawa, ON" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select 
                        value={formData.industry} 
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
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select 
                        value={formData.companySize} 
                        onValueChange={(value) => handleSelectChange('companySize', value)}
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
                    <Label htmlFor="website">Website</Label>
                    <Input 
                      id="website" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleInputChange} 
                      placeholder="https://www.example.com" 
                      type="url"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      placeholder="Tell veterans about your company, mission, and why you're interested in hiring veterans..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        name="contactEmail" 
                        value={formData.contactEmail} 
                        onChange={handleInputChange} 
                        placeholder="hr@example.com" 
                        type="email"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                      <Input 
                        id="contactPhone" 
                        name="contactPhone" 
                        value={formData.contactPhone} 
                        onChange={handleInputChange} 
                        placeholder="(123) 456-7890" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <LoadingButton 
                  type="submit" 
                  className="w-full md:w-auto" 
                  isLoading={isLoading}
                  loadingText="Saving..."
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </LoadingButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Ratings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingRatings ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmployerRatingSummary summary={ratingSummary} />
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4 flex-col">
                  <p className="text-sm text-gray-500 mb-4">
                    Veterans can write reviews about their experiences with your company.
                  </p>
                  <EmployerReviewDialog 
                    employerId={employerId} 
                    isOpen={false}
                    onClose={() => {}}
                    onSuccess={handleNewReview} 
                  />
                </CardFooter>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Employee Reviews</h3>
              <EmployerReviewsList 
                employerId={employerId} 
                isLoading={isLoadingRatings} 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerProfilePage;
