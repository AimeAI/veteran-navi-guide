
import React from 'react';
import { cn } from "@/lib/utils";

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
  matchScore 
}) => {
  return (
    <div className={cn("bg-white rounded-md shadow-sm border border-gray-200 p-4", className)}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-1 text-sm text-gray-500">
        <p>{company} - {location}</p>
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
        {source && (
          <span className="text-xs text-gray-500">Source: {source}</span>
        )}
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-sm font-medium">
            Apply Now
          </a>
        )}
      </div>
    </div>
  );
};

export default JobListing;
