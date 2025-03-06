import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import JobAlertForm from "@/components/JobAlertForm";
import JobAlertsList from "@/components/JobAlertsList";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { useJobs } from "@/context/JobContext";

const UserProfile = () => {
  const { user, updateProfile } = useUser();
  const { savedJobs, appliedJobs } = useJobs();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  
  // Form input state (for editing)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    militaryBranch: "",
    yearsOfService: "",
    rank: "",
    bio: ""
  });

  // Handle hash change for alert creation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#create-alert") {
        setActiveTab("alerts");
        setShowCreateAlert(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check hash on mount
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Set form data from user profile when it loads or changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        militaryBranch: user.militaryBranch,
        yearsOfService: user.yearsOfService,
        rank: user.rank,
        bio: user.bio
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      console.log("File name:", selectedFile.name);
      console.log("File size:", selectedFile.size, "bytes");
      console.log("File type:", selectedFile.type);
      toast.success("Resume uploaded successfully!");
    } else {
      toast.error("Please select a file first!");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset form data
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          militaryBranch: user.militaryBranch,
          yearsOfService: user.yearsOfService,
          rank: user.rank,
          bio: user.bio
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log("Profile data to be saved:", formData);
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Clear create alert mode when switching tabs
    if (value !== "alerts") {
      setShowCreateAlert(false);
      
      // Remove hash if it exists
      if (window.location.hash === "#create-alert") {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  };

  const renderProfileViewMode = () => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-muted-foreground">Name</Label>
        <p className="text-base">{user?.name}</p>
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
        <p className="text-base">{user?.email}</p>
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
        <p className="text-base">{user?.phone}</p>
      </div>
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
        <p className="text-base">{user?.location}</p>
      </div>
      <Separator className="my-1" />
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-muted-foreground">Military Background</Label>
        <div className="space-y-1">
          <p className="text-base">{user?.militaryBranch}</p>
          <p className="text-sm text-muted-foreground">Service: {user?.yearsOfService}</p>
          <p className="text-sm text-muted-foreground">Rank: {user?.rank}</p>
        </div>
      </div>
      <Separator className="my-1" />
      <div className="grid gap-2">
        <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
        <p className="text-base">{user?.bio}</p>
      </div>
    </div>
  );

  const renderProfileEditMode = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          onChange={handleInputChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          name="location" 
          value={formData.location} 
          onChange={handleInputChange}
        />
      </div>
      <Separator className="my-1" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="militaryBranch">Military Branch</Label>
          <Input 
            id="militaryBranch" 
            name="militaryBranch" 
            value={formData.militaryBranch} 
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="yearsOfService">Years of Service</Label>
          <Input 
            id="yearsOfService" 
            name="yearsOfService" 
            value={formData.yearsOfService} 
            onChange={handleInputChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rank">Rank</Label>
          <Input 
            id="rank" 
            name="rank" 
            value={formData.rank} 
            onChange={handleInputChange}
          />
        </div>
      </div>
      <Separator className="my-1" />
      <div className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          name="bio" 
          className="min-h-[100px]" 
          value={formData.bio} 
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume/CV</TabsTrigger>
          <TabsTrigger value="alerts">Job Alerts</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        
        {/* Profile tab content */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>
                    Manage your profile information here.
                  </CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "outline" : "default"} 
                  onClick={handleEditToggle}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? renderProfileEditMode() : renderProfileViewMode()}
            </CardContent>
            {isEditing && (
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        {/* Resume tab content */}
        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <CardTitle>Resume/CV Upload</CardTitle>
              <CardDescription>
                Upload your resume or CV to make it easier for employers to find you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="resume-upload">Upload Resume/CV</Label>
                <Input 
                  id="resume-upload" 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
              
              {selectedFile && (
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm font-medium">Selected file:</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    {selectedFile.name} <span className="text-xs">({Math.round(selectedFile.size / 1024)} KB)</span>
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={!selectedFile}>
                Upload Resume
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Job alerts tab content */}
        <TabsContent value="alerts">
          {showCreateAlert ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Create New Job Alert</h2>
                <Button variant="outline" onClick={() => setShowCreateAlert(false)}>
                  Back to Alerts
                </Button>
              </div>
              <JobAlertForm 
                onSuccess={() => {
                  setShowCreateAlert(false);
                  toast.success("Job alert created successfully");
                }}
              />
            </div>
          ) : (
            <JobAlertsList />
          )}
        </TabsContent>
        
        {/* Applications tab content */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>
                View your recent job applications and their statuses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appliedJobs && appliedJobs.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">You have applied to {appliedJobs.length} jobs.</p>
                  {/* We would map through applied jobs here */}
                </div>
              ) : (
                <p>No applications found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
