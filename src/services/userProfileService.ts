
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/context/UserTypes";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { EmployerProfile } from "@/types/application";

export const userProfileService = {
  updateProfile: async (userId: string, profileData: Partial<UserProfile>) => {
    try {
      // Map from our UserProfile to the database profile
      const profileUpdate: { [key: string]: any } = {};
      
      if (profileData.name) profileUpdate.full_name = profileData.name;
      if (profileData.phone) profileUpdate.phone = profileData.phone;
      if (profileData.location) profileUpdate.location = profileData.location;
      if (profileData.militaryBranch) profileUpdate.military_branch = profileData.militaryBranch;
      if (profileData.yearsOfService) profileUpdate.years_of_service = profileData.yearsOfService;
      if (profileData.rank) profileUpdate.rank = profileData.rank;
      if (profileData.bio) profileUpdate.bio = profileData.bio;
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      return { error: null };
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later."
      });
      return { error };
    }
  },

  uploadProfilePicture: async (userId: string, file: File): Promise<{ url?: string; error?: Error }> => {
    try {
      // Validate file
      if (!file) {
        throw new Error("No file selected");
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
      }
      
      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error("File is too large. Maximum size is 5MB.");
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      toast.success("Profile picture updated successfully!");
      return { url: publicUrl };
    } catch (error) {
      console.error("Profile picture upload error:", error);
      
      // Show appropriate error message
      if (error instanceof Error) {
        toast.error("Upload failed", {
          description: error.message || "Please try again"
        });
      } else {
        toast.error("Upload failed", {
          description: "An unexpected error occurred. Please try again."
        });
      }
      
      return { error: error instanceof Error ? error : new Error("Unknown error") };
    }
  },

  // Placeholder for employer profile updates that will be implemented with actual Supabase calls later
  updateEmployerProfile: async (userId: string, updatedProfile: Partial<EmployerProfile>) => {
    try {
      // This will need to be implemented with actual Supabase calls
      // when we add the employers table
      
      toast.success("Company profile updated successfully!");
      return { error: null };
    } catch (error) {
      console.error("Employer profile update error:", error);
      toast.error("Failed to update company profile", {
        description: "Please try again later."
      });
      return { error };
    }
  },

  fetchUserProfile: async (user: User) => {
    try {
      // Fetch profile data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
        toast.error("Failed to load user profile");
        return { profile: null, error: profileError };
      }
      
      if (profileData) {
        const userProfile: UserProfile = {
          name: profileData.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          militaryBranch: profileData.military_branch || '',
          yearsOfService: profileData.years_of_service || '',
          rank: profileData.rank || '',
          bio: profileData.bio || '',
          isAuthenticated: true,
          emailVerified: user.email_confirmed_at !== null,
          profilePicture: profileData.avatar_url,
          role: "veteran", // Default to veteran, update based on actual role when implemented
          authProvider: user.app_metadata.provider || "email"
        };
        
        return { profile: userProfile, error: null };
      } else {
        // Create basic profile if none exists
        const userProfile: UserProfile = {
          name: user.email?.split('@')[0] || '',
          email: user.email || '',
          phone: '',
          location: '',
          militaryBranch: '',
          yearsOfService: '',
          rank: '',
          bio: '',
          isAuthenticated: true,
          emailVerified: user.email_confirmed_at !== null,
          role: "veteran",
          authProvider: user.app_metadata.provider || "email"
        };
        
        return { profile: userProfile, error: null };
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { profile: null, error };
    }
  }
};
