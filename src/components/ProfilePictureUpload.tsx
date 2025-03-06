
import React, { useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProfilePictureUploadProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  className = "", 
  size = "md" 
}) => {
  const { user, uploadProfilePicture, isLoading } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar size based on the size prop
  const avatarSizeClass = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40"
  }[size];

  // Get initials for the avatar fallback
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    
    try {
      await uploadProfilePicture(file);
    } catch (error) {
      // Error is already handled in the uploadProfilePicture function
      console.error("Error in handleFileChange:", error);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveProfilePicture = () => {
    if (!user?.profilePicture) return;
    
    // In a real app with Supabase, this would delete the file from storage
    // For now, just update the user profile
    if (user) {
      const updatedUser = { ...user };
      delete updatedUser.profilePicture;
      
      // This would call an API in a real app
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload(); // Simple way to refresh the state
      
      toast.success("Profile picture removed");
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative group">
        <Avatar className={`${avatarSizeClass} border-2 border-primary/10`}>
          {user?.profilePicture ? (
            <AvatarImage src={user.profilePicture} alt={user.name} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/40 text-white"
            onClick={handleUploadClick}
            disabled={isLoading || isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleFileChange}
      />
      
      <div className="mt-3 flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          className="text-xs"
          onClick={handleUploadClick}
          disabled={isLoading || isUploading}
        >
          <Upload className="h-3 w-3 mr-1" />
          {isUploading ? "Uploading..." : "Upload Picture"}
        </Button>
        
        {user?.profilePicture && (
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemoveProfilePicture}
            disabled={isLoading || isUploading}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
