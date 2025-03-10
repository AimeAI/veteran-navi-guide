
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { Loader2, LinkedinIcon, CheckCircle, XCircle } from 'lucide-react';

const LinkedInIntegration: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [importedData, setImportedData] = useState(null);

  // Mock function to simulate LinkedIn OAuth connection
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // In a real implementation, this would redirect to LinkedIn OAuth
      // For demo purposes, we'll simulate a successful connection after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsConnected(true);
      toast.success("LinkedIn account connected successfully");
    } catch (error) {
      toast.error("Failed to connect LinkedIn account");
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Mock function to simulate importing profile data
  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      // In a real implementation, this would call an API to import LinkedIn data
      // For demo purposes, we'll simulate successful data import after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock imported data
      const mockData = {
        name: user?.name || "John Doe",
        headline: "Veteran Software Engineer",
        skills: ["Leadership", "Team Management", "Java", "Python", "Project Management"],
        experience: [
          {
            title: "Software Engineer",
            company: "Tech Solutions Inc.",
            duration: "2019 - Present"
          },
          {
            title: "IT Specialist",
            company: "U.S. Army",
            duration: "2015 - 2019"
          }
        ]
      };
      
      setImportedData(mockData);
      toast.success(t('integrations.importSuccessful'), {
        description: t('integrations.linkedinDataImported')
      });
    } catch (error) {
      toast.error("Failed to import LinkedIn data");
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <div className="flex flex-col gap-4">
          <p className="text-base">{t('integrations.notConnected')}</p>
          <p className="text-sm text-muted-foreground">{t('integrations.connectToImport')}</p>
          
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full sm:w-auto"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('integrations.connecting')}
              </>
            ) : (
              <>
                <LinkedinIcon className="mr-2 h-4 w-4" />
                {t('integrations.connectLinkedin')}
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p className="font-medium">{t('integrations.linkedinConnected')}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t('integrations.clickToImport')}</p>
          
          <Button 
            onClick={handleImport} 
            disabled={isImporting || importedData !== null}
            className="w-full sm:w-auto"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('integrations.importing')}
              </>
            ) : importedData ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('integrations.imported')}
              </>
            ) : (
              <>
                <LinkedinIcon className="mr-2 h-4 w-4" />
                {t('integrations.importProfile')}
              </>
            )}
          </Button>
        </div>
      )}
      
      {importedData && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">{t('integrations.previewImport')}</h3>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t('profile.name')}</h4>
                  <p>{(importedData as any).name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t('profile.headline')}</h4>
                  <p>{(importedData as any).headline}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t('profile.skills')}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(importedData as any).skills.map((skill: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t('profile.experience')}</h4>
                  <div className="space-y-2 mt-1">
                    {(importedData as any).experience.map((exp: any, index: number) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LinkedInIntegration;
