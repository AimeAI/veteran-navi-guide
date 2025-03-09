
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { UserRole, EmployerProfile } from "@/types/application";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// Define types for our user profile
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  militaryBranch: string;
  yearsOfService: string;
  rank: string;
  bio: string;
  isAuthenticated: boolean;
  emailVerified: boolean;
  profilePicture?: string;
  role: UserRole;
  employerProfile?: EmployerProfile;
  authProvider?: string; // Add auth provider to track how user is authenticated
}

// Interface for the context
interface UserContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string, isEmployer?: boolean) => Promise<void>;
  signup: (email: string, password: string, militaryBranch: string, isEmployer?: boolean, companyName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedProfile: Partial<UserProfile>) => void;
  updateEmployerProfile: (updatedProfile: Partial<EmployerProfile>) => void;
  resendVerificationEmail: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  socialLogin: (provider: string, isEmployer?: boolean) => Promise<void>; // Add new social login method
}

// Create the context with initial values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        setSupabaseUser(currentSession.user);
        
        // Fetch profile data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error fetching profile:", profileError);
          toast.error("Failed to load user profile");
        }
        
        // Transform the data to match our UserProfile structure
        if (profileData) {
          setUser({
            name: profileData.full_name || currentSession.user.email?.split('@')[0] || '',
            email: currentSession.user.email || '',
            phone: profileData.phone || '',
            location: profileData.location || '',
            militaryBranch: profileData.military_branch || '',
            yearsOfService: profileData.years_of_service || '',
            rank: profileData.rank || '',
            bio: profileData.bio || '',
            isAuthenticated: true,
            emailVerified: currentSession.user.email_confirmed_at !== null,
            profilePicture: profileData.avatar_url,
            role: "veteran", // Default to veteran, update based on actual role when implemented
            authProvider: currentSession.user.app_metadata.provider || "email"
          });
        } else {
          // Create basic profile if none exists
          setUser({
            name: currentSession.user.email?.split('@')[0] || '',
            email: currentSession.user.email || '',
            phone: '',
            location: '',
            militaryBranch: '',
            yearsOfService: '',
            rank: '',
            bio: '',
            isAuthenticated: true,
            emailVerified: currentSession.user.email_confirmed_at !== null,
            role: "veteran",
            authProvider: currentSession.user.app_metadata.provider || "email"
          });
        }
      } else {
        setUser(null);
        setSupabaseUser(null);
      }
      
      setIsLoading(false);
      
      // Set up auth subscription for real-time updates
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth state changed:", event);
          setSession(newSession);
          setSupabaseUser(newSession?.user || null);
          
          if (event === 'SIGNED_IN' && newSession?.user) {
            // Similar logic as above for handling sign in
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (profileData) {
              setUser({
                name: profileData.full_name || newSession.user.email?.split('@')[0] || '',
                email: newSession.user.email || '',
                phone: profileData.phone || '',
                location: profileData.location || '',
                militaryBranch: profileData.military_branch || '',
                yearsOfService: profileData.years_of_service || '',
                rank: profileData.rank || '',
                bio: profileData.bio || '',
                isAuthenticated: true,
                emailVerified: newSession.user.email_confirmed_at !== null,
                profilePicture: profileData.avatar_url,
                role: "veteran",
                authProvider: newSession.user.app_metadata.provider || "email"
              });
              
              toast.success("Welcome back!");
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            toast.info("You have been logged out");
          }
        }
      );
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string, isEmployer = false) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // User data is handled by the onAuthStateChange listener
      // We don't need to set it manually here
      
      // Later, we'll implement role-based redirects
      if (isEmployer) {
        // We'll need to check if user has an employer profile
        // and set the role accordingly
      }
      
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      
      // Show appropriate error message
      if (error instanceof Error) {
        toast.error("Login failed", {
          description: error.message || "Please try again"
        });
      } else {
        toast.error("Login failed", {
          description: "An unexpected error occurred. Please try again."
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    militaryBranch: string, 
    isEmployer = false,
    companyName?: string
  ) => {
    setIsLoading(true);
    
    try {
      // Create user metadata to pass to Supabase
      const metadata: { [key: string]: string } = {
        militaryBranch: militaryBranch || ''
      };
      
      if (isEmployer && companyName) {
        metadata.companyName = companyName;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // Profile will be created automatically through the trigger
      
      // Show success message
      toast.success("Account created successfully!", {
        description: "Please check your email for a verification link."
      });
    } catch (error) {
      console.error("Signup error:", error);
      
      // Show appropriate error message
      if (error instanceof Error) {
        toast.error("Sign up failed", {
          description: error.message || "Please try again"
        });
      } else {
        toast.error("Sign up failed", {
          description: "An unexpected error occurred. Please try again."
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // State will be cleared by the auth listener
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!supabaseUser || !user) return;
    
    setIsLoading(true);
    
    try {
      // Map from our UserProfile to the database profile
      const profileUpdate: { [key: string]: any } = {};
      
      if (updatedProfile.name) profileUpdate.full_name = updatedProfile.name;
      if (updatedProfile.phone) profileUpdate.phone = updatedProfile.phone;
      if (updatedProfile.location) profileUpdate.location = updatedProfile.location;
      if (updatedProfile.militaryBranch) profileUpdate.military_branch = updatedProfile.militaryBranch;
      if (updatedProfile.yearsOfService) profileUpdate.years_of_service = updatedProfile.yearsOfService;
      if (updatedProfile.rank) profileUpdate.rank = updatedProfile.rank;
      if (updatedProfile.bio) profileUpdate.bio = updatedProfile.bio;
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', supabaseUser.id);
      
      if (error) throw error;
      
      // Update local state
      setUser({ ...user, ...updatedProfile });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployerProfile = (updatedProfile: Partial<EmployerProfile>) => {
    if (user && user.role === "employer" && user.employerProfile) {
      try {
        // This will need to be implemented with actual Supabase calls
        // when we add the employers table
        
        // For now, just update the local state
        const newEmployerProfile = { ...user.employerProfile, ...updatedProfile };
        setUser({
          ...user,
          employerProfile: newEmployerProfile
        });
        
        toast.success("Company profile updated successfully!");
      } catch (error) {
        console.error("Employer profile update error:", error);
        toast.error("Failed to update company profile", {
          description: "Please try again later."
        });
      }
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent!", {
        description: "Please check your inbox for the verification link."
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast.error("Failed to resend verification email", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle profile picture uploads
  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!supabaseUser) throw new Error("User not authenticated");
    
    setIsLoading(true);
    
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
      const fileName = `${supabaseUser.id}-${Date.now()}.${fileExt}`;
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
        .eq('id', supabaseUser.id);
      
      if (updateError) throw updateError;
      
      // Update local state
      if (user) {
        setUser({ ...user, profilePicture: publicUrl });
      }
      
      toast.success("Profile picture updated successfully!");
      return publicUrl;
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
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Implement the socialLogin method
  const socialLogin = async (provider: string, isEmployer = false) => {
    setIsLoading(true);
    
    try {
      let providerName: 'google' | 'facebook' | 'github' = 'google';
      
      switch (provider.toLowerCase()) {
        case 'google':
          providerName = 'google';
          break;
        case 'facebook':
          providerName = 'facebook';
          break;
        case 'github':
          providerName = 'github';
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerName,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Pass the employer role if needed
            isEmployer: isEmployer ? 'true' : 'false'
          }
        }
      });
      
      if (error) throw error;
      
      // The redirect happens automatically
      // State will be handled by the auth listener when redirected back
    } catch (error) {
      console.error(`Social login error with ${provider}:`, error);
      
      // Show appropriate error message
      toast.error(`${provider} login failed`, {
        description: "An unexpected error occurred. Please try again."
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      supabaseUser,
      session,
      isLoading, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      updateEmployerProfile,
      resendVerificationEmail,
      uploadProfilePicture,
      socialLogin
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
