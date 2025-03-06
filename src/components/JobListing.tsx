import React, { useEffect, useState } from 'react';
import { Briefcase, Building, MapPin, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import MilitarySkillsBadge from './MilitarySkillsBadge';
import { useJobs } from '@/context/JobContext';
import EmployerRating from './EmployerRating';
import { getEmployerRatingSummary } from '@/data/employerReviews';

interface JobListingProps {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  className?: string;
  matchScore?: number; // Optional match score for recommendations
  variantId?: string; // Optional variant ID for A/B testing
  source?: string; // Add source property
  url?: string; // Add URL property for external job links
}

const JobListing: React.FC<JobListingProps> = ({
  jobId,
  title,
  company,
  location,
  description,
  className,
  matchScore,
  variantId,
  source,
  url
}) => {
  const { getJobById } = useJobs();
  const job = getJobById(jobId);
  const militarySkills = job?.requiredSkills || [];
  
  // Get employer rating if available - using mock data
  const employerId = 'emp1'; // In a real app, this would come from the job data
  const ratingSummary = getEmployerRatingSummary(employerId);
  const hasRating = ratingSummary.totalReviews > 0;

  // A/B testing view tracking
  useEffect(() => {
    if (variantId) {
      // In a real implementation, this would report a view to the A/B testing system
      console.log(`Variant view tracked: ${variantId} for job ${jobId}`);
    }
  }, [jobId, variantId]);

  // Handle click for A/B testing
  const handleLinkClick = () => {
    if (variantId) {
      // In a real implementation, this would report a click to the A/B testing system
      console.log(`Variant click tracked: ${variantId} for job ${jobId}`);
    }
  };

  return (
    <article 
      className={cn(
        "block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden",
        className
      )}
    >
      <Link 
        to={`/job/${jobId}`}
        className="block p-6 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        aria-labelledby={`job-title-${jobId}`}
        onClick={handleLinkClick}
        data-variant-id={variantId} // For tracking purposes
      >
        <div className="sm:flex sm:items-start sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center gap-2">
              <h3 id={`job-title-${jobId}`} className="text-lg font-semibold text-gray-900">{title}</h3>
              {matchScore && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {Math.round(matchScore)}% Match
                </span>
              )}
              {variantId && (
                <span className="hidden">Variant: {variantId}</span>
              )}
              {source && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {source}
                </span>
              )}
            </div>
            
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                <span>{company}</span>
                {hasRating && (
                  <span className="flex items-center ml-2">
                    <EmployerRating rating={ratingSummary.avgRating} size="sm" />
                    <span className="ml-1 text-xs">({ratingSummary.totalReviews})</span>
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                <span>{location}</span>
              </div>
            </div>
            
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">{description}</p>
            
            {/* Display military skills if available */}
            {militarySkills.length > 0 && (
              <div className="mt-3">
                <MilitarySkillsBadge skills={militarySkills} />
              </div>
            )}
          </div>
          
          <div className="ml-0 sm:ml-4 flex items-center justify-end sm:justify-center self-start flex-shrink-0">
            <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default JobListing;
