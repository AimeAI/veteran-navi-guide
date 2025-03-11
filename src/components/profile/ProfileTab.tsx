import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import VeteranBadges from "@/components/VeteranBadges";
import ProfileCompletionProgress from "@/components/ProfileCompletionProgress";

const ProfileTab = () => {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    militaryBranch: user?.militaryBranch || "",
    yearsOfService: user?.yearsOfService || "",
    rank: user?.rank || "",
    bio: user?.bio || ""
  });

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
    toast.success("Profile updated successfully!");
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
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 space-y-6">
            <ProfilePictureUpload size="lg" className="mx-auto md:mx-0" />
            <ProfileCompletionProgress />
          </div>
          
          <div className="flex-1">
            {isEditing ? renderProfileEditMode() : renderProfileViewMode()}
          </div>
        </div>
        
        <div className="mt-8">
          <VeteranBadges earnedBadges={[]} />
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileTab;
