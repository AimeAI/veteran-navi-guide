
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import PasswordSection from "./PasswordSection";
import EmailPreferences from "./EmailPreferences";
import NotificationSettings from "./NotificationSettings";
import { Save } from "lucide-react";

const SettingsTab = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [emailPreferences, setEmailPreferences] = useState({
    marketingEmails: true,
    jobAlerts: true,
    applicationUpdates: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newMessages: true,
    applicationStatusChanges: true,
    jobRecommendations: false,
    newJobMatches: true
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleEmailPreferenceChange = (preference: keyof typeof emailPreferences) => {
    setEmailPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const validatePasswordChange = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:");
    console.log("Password Data:", passwordData);
    console.log("Email Preferences:", emailPreferences);
    console.log("Notification Settings:", notificationSettings);
    
    if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword) {
      if (!validatePasswordChange()) {
        toast.error("Please fix the errors before saving");
        return;
      }
    }
    
    toast.success("Settings saved successfully!");
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PasswordSection
          passwordData={passwordData}
          passwordErrors={passwordErrors}
          handlePasswordChange={handlePasswordChange}
        />

        <EmailPreferences
          emailPreferences={emailPreferences}
          handleEmailPreferenceChange={handleEmailPreferenceChange}
        />

        <NotificationSettings
          notificationSettings={notificationSettings}
          handleNotificationChange={handleNotificationChange}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} className="ml-auto">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsTab;
