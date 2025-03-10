
import React from 'react';
import { Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SavedJobsHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center mb-8">
      <Bookmark className="h-6 w-6 text-primary mr-3" />
      <h1 className="text-3xl font-bold text-gray-900">{t("Saved Jobs")}</h1>
    </div>
  );
};

export default SavedJobsHeader;
