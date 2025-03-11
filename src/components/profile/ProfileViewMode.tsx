
import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/context/UserTypes";

interface ProfileViewModeProps {
  user: UserProfile | null;
}

const ProfileViewMode: React.FC<ProfileViewModeProps> = ({ user }) => {
  return (
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
};

export default ProfileViewMode;
