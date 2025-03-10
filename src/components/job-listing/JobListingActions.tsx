
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Check, Briefcase, ExternalLink, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import JobShareButtons from './JobShareButtons';

interface JobListingActionsProps {
  jobId: string;
  title?: string;
  company?: string;
  url?: string;
  isJobSaved: boolean;
  onSaveJob: () => void;
}

const JobListingActions: React.FC<JobListingActionsProps> = ({ 
  jobId, 
  title = '',
  company = '',
  url, 
  isJobSaved, 
  onSaveJob 
}) => {
  const { t } = useTranslation();
  const [showShareButtons, setShowShareButtons] = useState(false);

  const toggleShareButtons = () => {
    setShowShareButtons(!showShareButtons);
  };

  return (
    <div className="flex flex-col space-y-3 bg-gray-50 dark:bg-gray-800 py-3 border-t">
      <div className="flex flex-wrap justify-between gap-2 px-3">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveJob}
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleShareButtons}
            aria-label={t("Share this job")}
            className="ml-1"
          >
            <Share2 className="h-4 w-4 mr-1" aria-hidden="true" />
            {t("Share")}
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
      </div>
      
      {showShareButtons && (
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("Share this job")}</p>
          <JobShareButtons 
            jobId={jobId} 
            title={title}
            company={company}
            url={url}
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

export default JobListingActions;
