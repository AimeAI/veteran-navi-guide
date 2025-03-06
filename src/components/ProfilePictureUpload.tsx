
import React, { useState, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

interface ProfilePictureUploadProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

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
      // Validate file
      if (!validateFile(file)) {
        return;
      }
      
      // If Supabase is configured, upload to Supabase Storage
      if (supabaseUrl && supabaseKey) {
        const userId = user?.id || 'anonymous';
        const filePath = `profile-pictures/${userId}/${Date.now()}-${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, file, {
            upsert: true,
            cacheControl: '3600',
          });
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);
          
        await uploadProfilePicture(file, urlData.publicUrl);
      } else {
        // If Supabase is not configured, use the existing function
        await uploadProfilePicture(file);
      }
      
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      if (error instanceof Error) {
        toast.error("Upload failed", {
          description: error.message
        });
      } else {
        toast.error("Upload failed", {
          description: "An unexpected error occurred"
        });
      }
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG, PNG, or GIF image"
      });
      return false;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB"
      });
      return false;
    }
    
    return true;
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user?.profilePicture) return;
    
    try {
      setIsUploading(true);
      
      // If using Supabase and we have the file path
      if (supabaseUrl && supabaseKey && user.profilePictureFilePath) {
        const { error } = await supabase.storage
          .from('profile-pictures')
          .remove([user.profilePictureFilePath]);
          
        if (error) {
          throw new Error(error.message);
        }
      }
      
      // Update the user profile to remove the profile picture
      if (user) {
        const updatedUser = { ...user };
        delete updatedUser.profilePicture;
        delete updatedUser.profilePictureFilePath;
        
        // This would call an API in a real app
        if (typeof window !== 'undefined') {
          localStorage.setItem("user", JSON.stringify(updatedUser));
          window.location.reload(); // Simple way to refresh the state
        }
      }
      
      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      if (error instanceof Error) {
        toast.error("Failed to remove profile picture", {
          description: error.message
        });
      } else {
        toast.error("Failed to remove profile picture");
      }
    } finally {
      setIsUploading(false);
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
