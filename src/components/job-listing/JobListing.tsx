
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useJobs } from '@/context/JobContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// Import our new components
import JobInfo from './JobInfo';
import JobSourceBadge from './JobSourceBadge';
import MatchScoreBadge from './MatchScoreBadge';
import MatchingSkills from './MatchingSkills';
import JobDescription from './JobDescription';
import JobListingActions from './JobListingActions';

interface JobListingProps {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  date?: string;
  source?: string;
  url?: string;
  matchScore?: number;
  matchingSkills?: string[];
  className?: string;
}

const JobListing: React.FC<JobListingProps> = ({ 
  jobId, 
  title, 
  company, 
  location, 
  description, 
  date, 
  source, 
  url,
  matchScore,
  matchingSkills,
  className
}) => {
  const { t } = useTranslation();
  const { savedJobs, saveJob } = useJobs();
  const isJobSaved = savedJobs.some(job => job.id === jobId);
  
  const formattedDate = date ? 
    formatDistanceToNow(new Date(date), { addSuffix: true }) : 
    "Recently";
  
  const handleSaveJob = () => {
    if (isJobSaved) {
      toast.info(t("Job already saved"));
      return;
    }
    
    saveJob({
      id: jobId,
      title,
      company,
      location,
      description,
      date: date || new Date().toISOString(),
      // Add required fields from Job interface
      category: "other",
      salaryRange: "",
      remote: false,
      clearanceLevel: "none",
      mosCode: "",
      requiredSkills: [],
      preferredSkills: [],
      jobType: "fulltime",
      industry: "",
      experienceLevel: "",
      educationLevel: "",
      source
    });
    
    toast.success(t("Job saved successfully"));
  };
  
  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <JobInfo 
              company={company} 
              location={location} 
              formattedDate={formattedDate} 
            />
          </div>
          <div className="flex flex-wrap gap-2 items-start mt-1 sm:mt-0 sm:items-end">
            <JobSourceBadge source={source} />
            <MatchScoreBadge matchScore={matchScore} />
          </div>
        </div>
        
        <MatchingSkills matchingSkills={matchingSkills} />
        
        <JobDescription description={description} matchingSkills={matchingSkills} />
      </CardContent>
      
      <CardFooter className="p-0">
        <JobListingActions 
          jobId={jobId} 
          url={url} 
          isJobSaved={isJobSaved} 
          onSaveJob={handleSaveJob} 
        />
      </CardFooter>
    </Card>
  );
};

export default JobListing;
