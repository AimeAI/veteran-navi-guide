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
}

const JobListing: React.FC<JobListingProps> = ({ jobId, title, company, location, description, source, url }) => {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-1 text-sm text-gray-500">
        <p>{company} - {location}</p>
      </div>
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
