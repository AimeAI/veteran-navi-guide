
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Check, Briefcase, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface JobListingActionsProps {
  jobId: string;
  url?: string;
  isJobSaved: boolean;
  onSaveJob: () => void;
}

const JobListingActions: React.FC<JobListingActionsProps> = ({ jobId, url, isJobSaved, onSaveJob }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-between gap-2 bg-gray-50 dark:bg-gray-800 py-3 border-t">
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
  );
};

export default JobListingActions;
