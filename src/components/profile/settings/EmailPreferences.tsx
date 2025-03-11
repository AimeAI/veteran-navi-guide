
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";

interface EmailPreferencesProps {
  emailPreferences: {
    marketingEmails: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
  };
  handleEmailPreferenceChange: (preference: keyof typeof props.emailPreferences) => void;
}

const EmailPreferences: React.FC<EmailPreferencesProps> = (props) => {
  const { emailPreferences, handleEmailPreferenceChange } = props;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Email Preferences</h3>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Marketing Emails</h4>
            <p className="text-sm text-muted-foreground">Receive promotional emails and newsletters</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={emailPreferences.marketingEmails} 
              onChange={() => handleEmailPreferenceChange('marketingEmails')} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Job Alerts</h4>
            <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={emailPreferences.jobAlerts} 
              onChange={() => handleEmailPreferenceChange('jobAlerts')} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Application Updates</h4>
            <p className="text-sm text-muted-foreground">Updates about your job applications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={emailPreferences.applicationUpdates} 
              onChange={() => handleEmailPreferenceChange('applicationUpdates')} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferences;
