
import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface JobListingProps {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  source?: string;
  url?: string;
  className?: string;
  matchScore?: number;
  date?: string;
}

const JobListing: React.FC<JobListingProps> = ({ 
  jobId, 
  title, 
  company, 
  location, 
  description, 
  source, 
  url, 
  className,
  matchScore,
  date
}) => {
  // Format job source for display
  const getSourceLabel = (source?: string) => {
    if (!source) return null;
    
    switch (source.toLowerCase()) {
      case 'jobbank':
        return 'Job Bank';
      case 'jobicy':
        return 'Jobicy';
      case 'lightcast':
        return 'Lightcast';
      case 'indeed':
        return 'Indeed';
      case 'linkedin':
        return 'LinkedIn';
      default:
        return source;
    }
  };
  
  // Get badge color based on source
  const getSourceColor = (source?: string) => {
    if (!source) return 'secondary';
    
    switch (source.toLowerCase()) {
      case 'jobbank':
        return 'default';
      case 'jobicy':
        return 'blue';
      case 'lightcast':
        return 'green';
      case 'indeed':
        return 'orange';
      case 'linkedin':
        return 'indigo';
      default:
        return 'secondary';
    }
  };
  
  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Log application click for analytics
    console.log('User clicked Apply Now for job:', jobId, title, company);
    
    // Determine job source from URL for better tracking
    let detectedSource = source || 'job board';
    if (url) {
      if (url.includes('jobbank.gc.ca')) detectedSource = 'Job Bank Canada';
      else if (url.includes('indeed.com')) detectedSource = 'Indeed';
      else if (url.includes('linkedin.com')) detectedSource = 'LinkedIn';
      else if (url.includes('workopolis.com')) detectedSource = 'Workopolis';
      else if (url.includes('monster.ca')) detectedSource = 'Monster';
    }
    
    // Show a toast notification
    toast.success(`Opening application for ${title} at ${company}`);
    
    // Log click with more details for analytics
    console.log(`User is applying via ${detectedSource}. URL: ${url}`);
  };
  
  // Determine if the URL is valid
  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  
  return (
    <div className={cn("bg-white rounded-md shadow-sm border border-gray-200 p-4", className)}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-1 text-sm text-gray-500 flex items-center flex-wrap gap-1">
        <span>{company} - {location}</span>
        {getSourceLabel(source) && (
          <Badge variant={getSourceColor(source) as any} className="ml-2 text-xs">
            {getSourceLabel(source)}
          </Badge>
        )}
      </div>
      
      {matchScore !== undefined && (
        <div className="mt-1 text-xs font-medium text-blue-600">
          Match score: {Math.round(matchScore)}%
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-700">
        {description.substring(0, 150)}...
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">Posted: {new Date(date || new Date()).toLocaleDateString()}</span>
        </div>
        
        {isValidUrl ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-primary hover:text-primary/80 text-sm font-medium"
            onClick={handleApplyClick}
          >
            Apply Now <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            disabled
          >
            No application link
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobListing;
