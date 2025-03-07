
import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import VettedEmployerJobs from '@/components/VettedEmployerJobs';

const VettedJobsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('Vetted Employer Jobs - Veteran Career Compass')}</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">{t('Vetted Employer Jobs')}</h1>
        </div>
        <p className="text-gray-600">
          {t('Browse job opportunities from employers who have been verified and approved by our team')}
        </p>
      </div>
      
      <VettedEmployerJobs />
    </div>
  );
};

export default VettedJobsPage;
