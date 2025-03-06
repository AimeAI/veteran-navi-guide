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
import FormErrorMessage from "@/components/ui/form-error-message";
import { AlertCircle, Bell, BellOff, Mail, Lock, Save } from "lucide-react";

const UserProfile = () => {
  const { user, updateProfile } = useUser();
  const { savedJobs, appliedJobs } = useJobs();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  
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
    
    if (value !== "alerts") {
      setShowCreateAlert(false);
      
      if (window.location.hash === "#create-alert") {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  };

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume/CV</TabsTrigger>
          <TabsTrigger value="alerts">Job Alerts</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
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
                </div>
              ) : (
                <p>No applications found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Change Password</h3>
                </div>
                <Separator />
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      aria-invalid={!!passwordErrors.currentPassword}
                    />
                    <FormErrorMessage message={passwordErrors.currentPassword} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      aria-invalid={!!passwordErrors.newPassword}
                    />
                    <FormErrorMessage message={passwordErrors.newPassword} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      aria-invalid={!!passwordErrors.confirmPassword}
                    />
                    <FormErrorMessage message={passwordErrors.confirmPassword} />
                  </div>
                </div>
              </div>

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
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
