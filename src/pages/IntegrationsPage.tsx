
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InfoCircle } from 'lucide-react';
import LinkedInIntegration from '@/components/integrations/LinkedInIntegration';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RequireAuth from '@/components/RequireAuth';

const IntegrationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <RequireAuth>
      <div className="container py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('integrations.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('integrations.description')}</p>
          </div>

          <Alert>
            <InfoCircle className="h-4 w-4" />
            <AlertTitle>{t('integrations.securityNote')}</AlertTitle>
            <AlertDescription>
              {t('integrations.securityDescription')}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 gap-6">
            <LinkedInIntegration />
            
            {/* Future integrations would be added here */}
            {/* <IndeedIntegration /> */}
            {/* <VeteranOrgIntegration /> */}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default IntegrationsPage;
