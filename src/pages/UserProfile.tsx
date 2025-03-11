
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useJobs } from "@/context/JobContext";
import { determineEarnedBadges } from "@/utils/badgeUtils";
import { useLocation, useNavigate } from "react-router-dom";

// Import Tab Components
import ProfileTab from "@/components/profile/ProfileTab";
import ResumeTab from "@/components/profile/ResumeTab";
import ResumeParser from "@/components/resume/ResumeParser";
import ApplicationsTab from "@/components/profile/ApplicationsTab";
import SettingsTab from "@/components/profile/settings/SettingsTab";

const UserProfile = () => {
  const { user } = useUser();
  const { appliedJobs } = useJobs();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);

  useEffect(() => {
    // Set the active tab based on the URL path
    const path = location.pathname;
    if (path.includes('/profile/resume')) {
      setActiveTab("resume");
    } else if (path.includes('/profile/settings')) {
      setActiveTab("settings");
    } else if (path.includes('/profile/resume-parser')) {
      setActiveTab("resume-parser");
    } else if (path.includes('/profile/applications')) {
      setActiveTab("applications");
    } else {
      setActiveTab("profile");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      const badges = determineEarnedBadges(
        user,
        appliedJobs || [],
        0, // forum posts count
        false, // interview prep completed
        Boolean(selectedFile), // resume uploaded
        0, // connections count
        false // verified skills
      );
      setEarnedBadges(badges);
    }
  }, [user, appliedJobs, selectedFile]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update the URL to match the tab without reloading
    switch (value) {
      case "resume":
        navigate("/user/profile/resume", { replace: true });
        break;
      case "settings":
        navigate("/user/profile/settings", { replace: true });
        break;
      case "resume-parser":
        navigate("/user/profile/resume-parser", { replace: true });
        break;
      case "applications":
        navigate("/user/profile/applications", { replace: true });
        break;
      default:
        navigate("/user/profile", { replace: true });
        break;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume/CV</TabsTrigger>
          <TabsTrigger value="resume-parser">Resume Analysis</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileTab earnedBadges={earnedBadges} />
        </TabsContent>
        
        <TabsContent value="resume">
          <ResumeTab />
        </TabsContent>
        
        <TabsContent value="resume-parser">
          <ResumeParser />
        </TabsContent>
        
        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
