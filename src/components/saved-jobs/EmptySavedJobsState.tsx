
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptySavedJobsState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 text-center">
      <div className="flex justify-center mb-4">
        <AlertCircle className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{t("No saved jobs yet")}</h3>
      <p className="text-gray-600 mb-6">
        {t("Jobs you save will appear here for easy access. Start browsing jobs and save ones that interest you.")}
      </p>
      <a
        href="/jobs/search"
        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors duration-200"
      >
        {t("Browse Jobs")}
      </a>
    </div>
  );
};

export default EmptySavedJobsState;
