
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
  date: string;
  source?: string;
  url?: string;
  matchScore?: number;
  matchingSkills?: string[]; // Add this prop
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
  matchingSkills
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
    
    const sourceMap: Record<string, string> = {
      'jobbank': 'default',
      'indeed': 'orange',
      'linkedin': 'purple',
      'jobicy': 'blue'
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
      date,
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
        `<span class="bg-yellow-100 font-medium px-1 rounded">${skill}</span>`
      );
    });
    
    return highlightedText;
  };
  
  const sanitizedHighlightedDescription = expanded ? 
    DOMPurify.sanitize(highlightMatchingSkills(description)) : 
    DOMPurify.sanitize(highlightMatchingSkills(shortDescription));
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Building className="h-3.5 w-3.5 mr-1" />
                {company}
              </div>
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {location}
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {formattedDate}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={getSourceBadgeColor(source)}>
              {source || t("External")}
            </Badge>
            
            {matchScore && (
              <Badge variant="outline" className="bg-green-50">
                {matchScore}% {t("Match")}
              </Badge>
            )}
          </div>
        </div>
        
        {matchingSkills && matchingSkills.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <Search className="h-3 w-3 mr-1" />
                {t("Matched Skills")}:
              </Badge>
              
              {matchingSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-yellow-50 border-yellow-200 text-yellow-800"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div 
          className="mt-4 text-sm text-gray-600"
          dangerouslySetInnerHTML={{ __html: sanitizedHighlightedDescription }}
        />
        
        {description.length > MAX_DESCRIPTION_LENGTH && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-sm text-blue-600 hover:text-blue-800"
          >
            {expanded ? t("Show less") : t("Show more")}
          </button>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 py-3 border-t">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveJob}
            disabled={isJobSaved}
          >
            {isJobSaved ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                {t("Saved")}
              </>
            ) : (
              <>
                <BookmarkPlus className="h-4 w-4 mr-1" />
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
            >
              <Briefcase className="h-4 w-4 mr-1" />
              {t("View Job")}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/jobs/${jobId}`, '_self')}
            >
              <Briefcase className="h-4 w-4 mr-1" />
              {t("View Details")}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobListing;
