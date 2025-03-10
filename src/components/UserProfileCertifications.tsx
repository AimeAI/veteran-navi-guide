import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { LmsCertification } from '@/services/lms/types';

interface UserProfileCertificationsProps {
  certifications: LmsCertification[];
  isLoading?: boolean;
}

const UserProfileCertifications: React.FC<UserProfileCertificationsProps> = ({ 
  certifications, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>Professional certifications and qualifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (certifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>Professional certifications and qualifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Award className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No certifications listed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
        <CardDescription>Professional certifications and qualifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {certifications.map((certification) => (
          <div key={certification.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{certification.name}</h3>
              {certification.credential_url && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:text-gray-900"
                  onClick={() => window.open(certification.credential_url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <p className="text-sm text-gray-600">Issued by {certification.issuer}</p>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              <span>
                Issued: {format(new Date(certification.issue_date), 'MMMM yyyy')}
                {certification.expiry_date && ` · Expires: ${format(new Date(certification.expiry_date), 'MMMM yyyy')}`}
              </span>
            </div>
            
            {certification.credential_id && (
              <p className="text-xs text-gray-500">
                Credential ID: {certification.credential_id}
              </p>
            )}
            
            {certification.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {certification.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserProfileCertifications;
