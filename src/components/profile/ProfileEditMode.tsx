
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  militaryBranch: string;
  yearsOfService: string;
  rank: string;
  bio: string;
}

interface ProfileEditModeProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileEditMode: React.FC<ProfileEditModeProps> = ({ 
  formData, 
  handleInputChange 
}) => {
  return (
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
};

export default ProfileEditMode;
