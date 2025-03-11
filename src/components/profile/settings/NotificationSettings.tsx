
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

interface NotificationSettingsProps {
  notificationSettings: {
    newMessages: boolean;
    applicationStatusChanges: boolean;
    jobRecommendations: boolean;
    newJobMatches: boolean;
  };
  handleNotificationChange: (setting: keyof typeof props.notificationSettings) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = (props) => {
  const { notificationSettings, handleNotificationChange } = props;

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Notification Settings</h3>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">New Messages</h4>
            <p className="text-sm text-muted-foreground">Get notified when you receive a new message</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={notificationSettings.newMessages} 
              onChange={() => handleNotificationChange('newMessages')} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Application Status Changes</h4>
            <p className="text-sm text-muted-foreground">Get notified when your application status changes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={notificationSettings.applicationStatusChanges} 
              onChange={() => handleNotificationChange('applicationStatusChanges')} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Job Recommendations</h4>
            <p className="text-sm text-muted-foreground">Get notified about recommended jobs</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={notificationSettings.jobRecommendations} 
              onChange={() => handleNotificationChange('jobRecommendations')} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">New Job Matches</h4>
            <p className="text-sm text-muted-foreground">Get notified when new jobs match your profile</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={notificationSettings.newJobMatches} 
              onChange={() => handleNotificationChange('newJobMatches')} 
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
