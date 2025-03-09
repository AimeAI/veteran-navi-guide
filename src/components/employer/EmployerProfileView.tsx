
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Globe, Mail, Phone, MapPin, Users, Shield, Edit, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { EmployerProfile } from './EmployerProfileForm';

interface EmployerProfileViewProps {
  profile: EmployerProfile;
  isLoading?: boolean;
  isCurrentUser?: boolean;
}

const EmployerProfileView: React.FC<EmployerProfileViewProps> = ({ 
  profile, 
  isLoading = false, 
  isCurrentUser = false 
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="h-24 w-24 flex items-center justify-center rounded-md border bg-gray-50 overflow-hidden">
            {profile.company_logo_url ? (
              <img 
                src={profile.company_logo_url} 
                alt={`${profile.company_name} logo`} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Building className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <div>
                <h2 className="text-2xl font-bold">{profile.company_name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {profile.industry && (
                    <Badge variant="outline">
                      {profile.industry.charAt(0).toUpperCase() + profile.industry.slice(1)}
                    </Badge>
                  )}
                  
                  {profile.company_size && (
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {profile.company_size}
                    </Badge>
                  )}
                  
                  {profile.location && (
                    <div className="text-sm flex items-center text-gray-500">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>
              
              {profile.company_website && (
                <a 
                  href={profile.company_website.startsWith('http') ? profile.company_website : `https://${profile.company_website}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary hover:underline mt-2 sm:mt-0"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Company Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Company Description */}
        <div>
          <h3 className="text-lg font-medium mb-2">About the Company</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {profile.company_description}
          </p>
        </div>
        
        {/* Company Mission */}
        {profile.company_mission && (
          <div>
            <h3 className="text-lg font-medium mb-2">Mission and Values</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {profile.company_mission}
            </p>
          </div>
        )}
        
        {/* Benefits for Veterans */}
        {profile.veteran_benefits && (
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Shield className="h-5 w-5 mr-1 text-primary" />
              Benefits for Veterans
            </h3>
            <p className="text-gray-700 whitespace-pre-line">
              {profile.veteran_benefits}
            </p>
          </div>
        )}
        
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium mb-3">Contact Information</h3>
          <div className="space-y-2">
            {profile.contact_person && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Contact Person:</span> {profile.contact_person}
              </p>
            )}
            
            {profile.contact_email && (
              <p className="text-sm text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a 
                  href={`mailto:${profile.contact_email}`} 
                  className="text-primary hover:underline"
                >
                  {profile.contact_email}
                </a>
              </p>
            )}
            
            {profile.contact_phone && (
              <p className="text-sm text-gray-700 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a 
                  href={`tel:${profile.contact_phone}`} 
                  className="text-primary hover:underline"
                >
                  {profile.contact_phone}
                </a>
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      {isCurrentUser && (
        <CardFooter className="border-t pt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/employer-profile/edit')}
            className="ml-auto"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EmployerProfileView;
