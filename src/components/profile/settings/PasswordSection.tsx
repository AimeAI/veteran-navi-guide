
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";
import FormErrorMessage from "@/components/ui/form-error-message";

interface PasswordSectionProps {
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  passwordErrors: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
  passwordData,
  passwordErrors,
  handlePasswordChange
}) => {
  return (
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
  );
};

export default PasswordSection;
