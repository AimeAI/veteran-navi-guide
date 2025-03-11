
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import VeteranBadges from "@/components/VeteranBadges";
import ProfileCompletionProgress from "@/components/ProfileCompletionProgress";
import ProfileViewMode from "./ProfileViewMode";
import ProfileEditMode from "./ProfileEditMode";
import { VeteranBadge } from "@/components/ui/veteran-badge";

interface ProfileTabProps {
  earnedBadges: VeteranBadge[];
}

const ProfileTab: React.FC<ProfileTabProps> = ({ earnedBadges = [] }) => {
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
            {isEditing ? (
              <ProfileEditMode 
                formData={formData}
                handleInputChange={handleInputChange}
              />
            ) : (
              <ProfileViewMode user={user} />
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <VeteranBadges earnedBadges={earnedBadges} />
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
