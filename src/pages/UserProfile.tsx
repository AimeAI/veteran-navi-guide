
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useJobs } from "@/context/JobContext";
import { determineEarnedBadges } from "@/utils/badgeUtils";

// Import Tab Components
import ProfileTab from "@/components/profile/ProfileTab";
import ResumeTab from "@/components/profile/ResumeTab";
import ResumeParser from "@/components/resume/ResumeParser";
import JobAlertsTab from "@/components/profile/JobAlertsTab";
import ApplicationsTab from "@/components/profile/ApplicationsTab";
import SettingsTab from "@/components/profile/settings/SettingsTab";

const UserProfile = () => {
  const { user } = useUser();
  const { appliedJobs } = useJobs();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#create-alert") {
        setActiveTab("alerts");
        setShowCreateAlert(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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
    
    if (value !== "alerts") {
      setShowCreateAlert(false);
      
      if (window.location.hash === "#create-alert") {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume/CV</TabsTrigger>
          <TabsTrigger value="resume-parser">Resume Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Job Alerts</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="resume">
          <ResumeTab />
        </TabsContent>
        
        <TabsContent value="resume-parser">
          <ResumeParser />
        </TabsContent>
        
        <TabsContent value="alerts">
          <JobAlertsTab showCreate={showCreateAlert} />
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
