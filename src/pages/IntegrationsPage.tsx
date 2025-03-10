
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RequireAuth } from '@/components/RequireAuth';
import LinkedInIntegration from '@/components/integrations/LinkedInIntegration';

const IntegrationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <RequireAuth>
      <Helmet>
        <title>{t('integrations.title')} | VeteranJobBoard</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">{t('integrations.title')}</h1>
        <p className="text-gray-600 mb-6">{t('integrations.description')}</p>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t('integrations.securityNote')}: {t('integrations.securityDescription')}
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="linkedin" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="indeed">Indeed</TabsTrigger>
            <TabsTrigger value="veteran-orgs">{t('integrations.veteranOrgTitle')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>{t('integrations.linkedinTitle')}</CardTitle>
                <CardDescription>{t('integrations.linkedinDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <LinkedInIntegration />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="indeed">
            <Card>
              <CardHeader>
                <CardTitle>{t('integrations.indeedTitle')}</CardTitle>
                <CardDescription>{t('integrations.indeedDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Coming soon - Indeed integration will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="veteran-orgs">
            <Card>
              <CardHeader>
                <CardTitle>{t('integrations.veteranOrgTitle')}</CardTitle>
                <CardDescription>{t('integrations.veteranOrgDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Coming soon - Veteran Organization integrations will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  );
};

export default IntegrationsPage;
