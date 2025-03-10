
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Linkedin, Upload, Check, AlertCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LinkedInProfileData {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  headline?: string;
  skills?: string[];
  experience?: {
    companyName: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }[];
}

const LinkedInIntegration = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useUser();
  const [isConnecting, setIsConnecting] = useState(false);
  const [importedData, setImportedData] = useState<LinkedInProfileData | null>(null);
  const [importSuccessful, setImportSuccessful] = useState(false);
  
  // Check if user is linked to LinkedIn through their auth provider
  const isLinkedToLinkedIn = user?.authProvider === 'linkedin_oidc';
  
  const handleConnectLinkedIn = () => {
    setIsConnecting(true);
    
    // LinkedIn OAuth configuration
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || "77adzd1m3qyfr6"; // Demo ID, replace with yours
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
    const state = Math.random().toString(36).substring(2);
    
    // Save state to localStorage to verify when the user comes back
    localStorage.setItem('linkedin_oauth_state', state);
    
    // Redirect to LinkedIn OAuth page
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
    
    // If using supabase auth with LinkedIn provider
    if (user?.supabaseUser) {
      // This is the recommended approach for users already authenticated with Supabase
      toast.info("Redirecting to LinkedIn...");
      window.location.href = authUrl;
    } else {
      toast.error("Please sign in to connect your LinkedIn account");
      setIsConnecting(false);
    }
  };
  
  const importLinkedInData = async () => {
    // In a real implementation, this would be handled by a secure backend
    // to exchange the auth code for an access token and fetch profile data
    
    // For demo, we'll simulate fetching profile data
    setIsConnecting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock profile data
      const mockProfileData: LinkedInProfileData = {
        firstName: "John",
        lastName: "Veteran",
        headline: "Software Engineer | US Army Veteran",
        profilePicture: "https://randomuser.me/api/portraits/men/45.jpg",
        skills: ["Java", "Leadership", "Teamwork", "Problem Solving", "JavaScript"],
        experience: [
          {
            companyName: "US Army",
            title: "Infantry Team Leader",
            description: "Led a team of 5 in combat operations",
            startDate: "2015-06",
            endDate: "2019-06"
          },
          {
            companyName: "Tech Solutions Inc",
            title: "Junior Developer",
            description: "Full-stack development with focus on Java",
            startDate: "2019-08",
            endDate: ""
          }
        ]
      };
      
      setImportedData(mockProfileData);
      
      // Update user profile with imported data
      if (updateProfile) {
        await updateProfile({
          name: `${mockProfileData.firstName} ${mockProfileData.lastName}`,
          skills: mockProfileData.skills
        });
        
        toast.success("LinkedIn profile data imported successfully!");
        setImportSuccessful(true);
      }
    } catch (error) {
      console.error("Error importing LinkedIn data:", error);
      toast.error("Failed to import LinkedIn profile data");
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Linkedin className="mr-2 h-5 w-5 text-[#0A66C2]" />
          {t('integrations.linkedinTitle')}
        </CardTitle>
        <CardDescription>
          {t('integrations.linkedinDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {importSuccessful ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>{t('integrations.importSuccessful')}</AlertTitle>
            <AlertDescription>
              {t('integrations.linkedinDataImported')}
            </AlertDescription>
          </Alert>
        ) : isLinkedToLinkedIn ? (
          <div className="space-y-4">
            <Alert>
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>{t('integrations.linkedinConnected')}</AlertTitle>
              <AlertDescription>
                {t('integrations.clickToImport')}
              </AlertDescription>
            </Alert>
            
            {importedData && (
              <div className="rounded-md bg-slate-50 p-4 border border-slate-100">
                <h4 className="font-medium mb-2">{t('integrations.previewImport')}</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">{t('profile.name')}:</span> {importedData.firstName} {importedData.lastName}
                  </p>
                  {importedData.headline && (
                    <p>
                      <span className="font-medium">{t('profile.headline')}:</span> {importedData.headline}
                    </p>
                  )}
                  {importedData.skills && importedData.skills.length > 0 && (
                    <div>
                      <span className="font-medium">{t('profile.skills')}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {importedData.skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-slate-200 rounded-md text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>{t('integrations.notConnected')}</AlertTitle>
            <AlertDescription>
              {t('integrations.connectToImport')}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {isLinkedToLinkedIn ? (
          <Button 
            variant="default" 
            onClick={importLinkedInData} 
            disabled={isConnecting || importSuccessful}
            className="w-full sm:w-auto"
          >
            {isConnecting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {t('integrations.importing')}
              </>
            ) : importSuccessful ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('integrations.imported')}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {t('integrations.importProfile')}
              </>
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleConnectLinkedIn} 
            disabled={isConnecting}
            className="w-full sm:w-auto"
          >
            {isConnecting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {t('integrations.connecting')}
              </>
            ) : (
              <>
                <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" />
                {t('integrations.connectLinkedin')}
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LinkedInIntegration;
