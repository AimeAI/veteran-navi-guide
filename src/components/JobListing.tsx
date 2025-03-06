
import React from 'react';
import { Briefcase, Building, MapPin, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import MilitarySkillsBadge from './MilitarySkillsBadge';
import { useJobs } from '@/context/JobContext';

interface JobListingProps {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  className?: string;
}

const JobListing: React.FC<JobListingProps> = ({
  jobId,
  title,
  company,
  location,
  description,
  className
}) => {
  const { getJobById } = useJobs();
  const job = getJobById(jobId);
  const militarySkills = job?.requiredSkills || [];

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
      >
        <div className="sm:flex sm:items-start sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 id={`job-title-${jobId}`} className="text-lg font-semibold text-gray-900">{title}</h3>
            
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1.5 text-gray-400" aria-hidden="true" />
                <span>{company}</span>
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
