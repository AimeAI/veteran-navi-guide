
import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ExternalLink, Calendar } from "lucide-react";
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
        return 'purple';
      default:
        return 'secondary';
    }
  };
  
  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if URL is valid
    if (!url || !isValidUrl) {
      e.preventDefault();
      toast.error("This job doesn't have a valid application link");
      return;
    }
    
    // Log application click for analytics
    console.log('User clicked Apply Now for job:', jobId, title, company);
    
    // Open application in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Show a toast notification
    const sourceName = getSourceLabel(source) || 'job board';
    toast.success(`Opening ${title} at ${company} on ${sourceName}`);
    
    // Prevent default navigation in current tab
    e.preventDefault();
  };
  
  // Determine if the URL is valid
  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  
  // Format date properly for recent jobs
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently posted';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const formattedDate = formatDate(date);
  
  // Get the destination label for the Apply button
  const getApplyDestination = (source?: string) => {
    if (!source) return "View Job";
    
    switch(source.toLowerCase()) {
      case 'jobbank':
        return "Apply on Job Bank";
      case 'indeed':
        return "Apply on Indeed";
      case 'linkedin':
        return "Apply on LinkedIn";
      default:
        return "Apply Now";
    }
  };
  
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
          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-500">Posted: {formattedDate}</span>
        </div>
        
        {isValidUrl ? (
          <a 
            href={url} 
            onClick={handleApplyClick}
            className="flex items-center text-primary hover:text-primary/80 text-sm font-medium"
          >
            {getApplyDestination(source)} <ExternalLink className="h-3 w-3 ml-1" />
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
