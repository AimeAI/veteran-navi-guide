
import React from 'react';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobListingProps {
  title: string;
  company: string;
  location: string;
  description: string;
  jobId: string;
  logoUrl?: string;
  className?: string;
}

const JobListing: React.FC<JobListingProps> = ({
  title,
  company,
  location,
  description,
  jobId,
  logoUrl,
  className,
}) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="hidden sm:block flex-shrink-0">
            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${company} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Briefcase className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>
          
          {/* Job Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
                  {title}
                </h3>
                <p className="text-gray-700 font-medium">{company}</p>
                <div className="flex items-center mt-1 text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              {/* Add any badges or tags here */}
              <div className="flex gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Full-time
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Veteran-friendly
                </span>
              </div>
              
              {/* View Details Button */}
              <a
                href={`/jobs/${jobId}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
