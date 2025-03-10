
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/context/JobContext';
import { Briefcase, MapPin, Building, Clock, ExternalLink, BookmarkPlus, Check, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';

interface JobListingProps {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  date?: string; // Make date optional
  source?: string;
  url?: string;
  matchScore?: number;
  matchingSkills?: string[];
  className?: string; // Add className prop
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
  const [expanded, setExpanded] = useState(false);
  const isJobSaved = savedJobs.some(job => job.id === jobId);
  
  const cleanHtml = DOMPurify.sanitize(description);
  const MAX_DESCRIPTION_LENGTH = 250;
  const shortDescription = description.length > MAX_DESCRIPTION_LENGTH ? 
    `${description.substring(0, MAX_DESCRIPTION_LENGTH)}...` : 
    description;
  
  const getSourceBadgeColor = (source?: string) => {
    if (!source) return "secondary";
    
    const sourceMap: Record<string, "default" | "destructive" | "outline" | "secondary" | "warning" | "info" | "success" | "purple" | "orange"> = {
      'jobbank': 'default',
      'indeed': 'orange',
      'linkedin': 'purple',
      'jobicy': 'blue' as "info" // Type cast 'blue' to 'info' which is an allowed variant
    };
    
    return sourceMap[source.toLowerCase()] || "secondary";
  };
  
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
      date: date || new Date().toISOString(), // Provide fallback for date
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
  
  const highlightMatchingSkills = (text: string) => {
    if (!matchingSkills || matchingSkills.length === 0) {
      return text;
    }
    
    let highlightedText = text;
    
    // We're doing a simple replacement here, but this could be improved
    // with a more sophisticated algorithm that respects HTML tags
    matchingSkills.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="bg-yellow-100 font-medium px-1 rounded dark:bg-yellow-900 dark:text-yellow-100">${skill}</span>`
      );
    });
    
    return highlightedText;
  };
  
  const sanitizedHighlightedDescription = expanded ? 
    DOMPurify.sanitize(highlightMatchingSkills(description)) : 
    DOMPurify.sanitize(highlightMatchingSkills(shortDescription));
  
  return (
    <Card className={`overflow-hidden ${className || ''}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Building className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>{company}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>{location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-start mt-1 sm:mt-0 sm:items-end">
            {source && (
              <Badge variant={getSourceBadgeColor(source)}>
                {source || t("External")}
              </Badge>
            )}
            
            {matchScore && (
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900 dark:text-green-100">
                {matchScore}% {t("Match")}
              </Badge>
            )}
          </div>
        </div>
        
        {matchingSkills && matchingSkills.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800">
                <Search className="h-3 w-3 mr-1" aria-hidden="true" />
                {t("Matched Skills")}:
              </Badge>
              
              {matchingSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div 
          className="mt-4 text-sm text-gray-700 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: sanitizedHighlightedDescription }}
          aria-label={expanded ? t("Full job description") : t("Job description preview")}
        />
        
        {description.length > MAX_DESCRIPTION_LENGTH && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-expanded={expanded}
            aria-controls={`job-description-${jobId}`}
          >
            {expanded ? t("Show less") : t("Show more")}
          </button>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-wrap justify-between gap-2 bg-gray-50 dark:bg-gray-800 py-3 border-t">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveJob}
            disabled={isJobSaved}
            aria-label={isJobSaved ? t("Job already saved") : t("Save this job")}
          >
            {isJobSaved ? (
              <>
                <Check className="h-4 w-4 mr-1" aria-hidden="true" />
                {t("Saved")}
              </>
            ) : (
              <>
                <BookmarkPlus className="h-4 w-4 mr-1" aria-hidden="true" />
                {t("Save")}
              </>
            )}
          </Button>
        </div>
        <div>
          {url ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(url, '_blank')}
              aria-label={t("View job listing at original source")}
            >
              <Briefcase className="h-4 w-4 mr-1" aria-hidden="true" />
              {t("View Job")}
              <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/jobs/${jobId}`, '_self')}
              aria-label={t("View detailed job information")}
            >
              <Briefcase className="h-4 w-4 mr-1" aria-hidden="true" />
              {t("View Details")}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobListing;
