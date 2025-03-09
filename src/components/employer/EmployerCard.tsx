
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, ExternalLink, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EmployerCardProps {
  id: string;
  companyName: string;
  industry?: string;
  location?: string;
  companySize?: string;
  logoUrl?: string;
  description: string;
  jobCount?: number;
}

const EmployerCard: React.FC<EmployerCardProps> = ({
  id,
  companyName,
  industry,
  location,
  companySize,
  logoUrl,
  description,
  jobCount = 0
}) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-md border bg-gray-50 overflow-hidden flex-shrink-0">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${companyName} logo`} 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <Building className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-lg">{companyName}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {industry && (
                <Badge variant="outline" className="text-xs">
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </Badge>
              )}
              
              {companySize && (
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {companySize}
                </Badge>
              )}
            </div>
            
            {location && (
              <div className="text-sm flex items-center text-gray-500 mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {location}
              </div>
            )}
          </div>
        </div>
        
        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {description}
        </p>
        
        {jobCount > 0 && (
          <div className="mt-3 text-sm text-primary font-medium">
            {jobCount} open position{jobCount !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/employers/${id}`}>
            View Employer Profile
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmployerCard;
