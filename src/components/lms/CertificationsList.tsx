
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LmsCertification } from '@/services/lms';
import { Award, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface CertificationsListProps {
  certifications: LmsCertification[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const CertificationsList: React.FC<CertificationsListProps> = ({ certifications, onDelete, isLoading }) => {
  const [viewCertification, setViewCertification] = useState<LmsCertification | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (certifications.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Certifications</h2>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Certifications Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add your certifications to showcase your skills and achievements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((certification) => (
            <Card key={certification.id} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2">{certification.name}</CardTitle>
                <CardDescription className="line-clamp-1">
                  Issued by {certification.issuer}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  Issued {format(new Date(certification.issue_date), 'MMM d, yyyy')}
                </div>
                {certification.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {certification.skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {certification.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{certification.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewCertification(certification)}
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(certification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Certification details dialog */}
      <Dialog open={!!viewCertification} onOpenChange={(open) => !open && setViewCertification(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{viewCertification?.name}</DialogTitle>
            <DialogDescription>
              Issued by {viewCertification?.issuer}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-500">Issue Date</span>
              <span>
                {viewCertification?.issue_date && 
                  format(new Date(viewCertification.issue_date), 'MMMM d, yyyy')}
              </span>
            </div>

            {viewCertification?.expiry_date && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Expiry Date</span>
                <span>{format(new Date(viewCertification.expiry_date), 'MMMM d, yyyy')}</span>
              </div>
            )}

            {viewCertification?.credential_id && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Credential ID</span>
                <span>{viewCertification.credential_id}</span>
              </div>
            )}

            {viewCertification?.description && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Description</span>
                <span className="text-sm">{viewCertification.description}</span>
              </div>
            )}

            {viewCertification?.skills && viewCertification.skills.length > 0 && (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500">Skills</span>
                <div className="flex flex-wrap gap-1">
                  {viewCertification.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex sm:justify-between">
            {viewCertification?.credential_url && (
              <Button 
                variant="outline"
                onClick={() => window.open(viewCertification.credential_url, '_blank')}
                className="mr-auto"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Credential
              </Button>
            )}
            <Button 
              variant="destructive"
              onClick={() => {
                if (viewCertification) {
                  onDelete(viewCertification.id);
                  setViewCertification(null);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CertificationsList;
