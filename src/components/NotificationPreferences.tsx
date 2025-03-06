
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, Mail, MessageCircle, Calendar, Users } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: "job_matches",
    label: "Job Matches",
    description: "Get notified when new jobs match your search criteria",
    icon: <Bell className="h-5 w-5 text-muted-foreground" />,
  },
  {
    id: "messages",
    label: "New Messages",
    description: "Receive notifications for new messages from employers or other users",
    icon: <MessageCircle className="h-5 w-5 text-muted-foreground" />,
  },
  {
    id: "application_updates",
    label: "Application Updates",
    description: "Stay informed about your job application status changes",
    icon: <Mail className="h-5 w-5 text-muted-foreground" />,
  },
  {
    id: "forum_activity",
    label: "Forum Activity",
    description: "Get notified about replies to your posts and followed topics",
    icon: <Users className="h-5 w-5 text-muted-foreground" />,
  },
  {
    id: "upcoming_events",
    label: "Upcoming Events",
    description: "Receive reminders about job fairs and other events",
    icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
  },
];

const NotificationPreferences = () => {
  const { user } = useUser();
  const [preferences, setPreferences] = React.useState<Record<string, boolean>>({
    job_matches: true,
    messages: true,
    application_updates: true,
    forum_activity: false,
    upcoming_events: true,
  });

  const handleToggle = (settingId: string) => {
    setPreferences((prev) => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
  };

  const handleSave = async () => {
    try {
      // This will be connected to Supabase later
      console.log("Saving notification preferences:", preferences);
      toast.success("Notification preferences saved successfully");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Email Notification Preferences</CardTitle>
        <CardDescription>
          Choose which notifications you'd like to receive via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationSettings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-start space-x-4 p-4 rounded-lg border"
          >
            <div className="mt-1">{setting.icon}</div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor={setting.id} className="text-base font-medium">
                  {setting.label}
                </Label>
                <Switch
                  id={setting.id}
                  checked={preferences[setting.id]}
                  onCheckedChange={() => handleToggle(setting.id)}
                />
              </div>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
