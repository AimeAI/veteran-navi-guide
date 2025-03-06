import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Define types for our user profile
export interface UserProfile {
  id?: string;
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
  profilePictureFilePath?: string; // Store the file path for Supabase storage
}

// Interface for the context
interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, militaryBranch: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedProfile: Partial<UserProfile>) => void;
  resendVerificationEmail: () => Promise<void>;
  uploadProfilePicture: (file: File, publicUrl?: string) => Promise<string>;
}

// Create the context with initial values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Initial user profile data
const initialUserProfile: UserProfile = {
  id: "user-1",
  name: "James Wilson",
  email: "james.wilson@example.com",
  phone: "613-555-7890",
  location: "Ottawa, ON",
  militaryBranch: "Canadian Armed Forces",
  yearsOfService: "2008-2019",
  rank: "Master Corporal",
  bio: "Software Engineer with 4 years of experience. Former CAF member with background in communications and logistics. Skilled in team leadership and project management.",
  isAuthenticated: false,
  emailVerified: false,
  profilePicture: undefined
};

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading the user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // For development purposes only - remove in production
      setUser({ ...initialUserProfile, isAuthenticated: false });
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to verify credentials
      console.log("Login request for:", email);
      
      // Simulate authentication failure (for demo purposes)
      if (password === "wrongpassword") {
        throw new Error("Invalid email or password");
      }
      
      // Hardcoded authentication for demo purposes
      setUser({ ...initialUserProfile, email, isAuthenticated: true });
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

  const signup = async (email: string, password: string, militaryBranch: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app with Supabase, this would be:
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     data: { militaryBranch }
      //   }
      // });
      
      console.log("Signup request for:", { email, militaryBranch });
      
      // Simulate email already in use error (for demo purposes)
      if (email === "taken@example.com") {
        throw new Error("Email is already registered");
      }
      
      // Create new user with provided data
      setUser({
        ...initialUserProfile,
        email,
        militaryBranch,
        isAuthenticated: true,
        emailVerified: false
      });
      
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

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("You have been logged out");
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      try {
        // Simulate API call in a real app
        const newProfile = { ...user, ...updatedProfile };
        setUser(newProfile);
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update profile", {
          description: "Please try again later."
        });
      }
    }
  };

  const resendVerificationEmail = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app with Supabase, this would be:
      // const { error } = await supabase.auth.resend({
      //   type: 'signup',
      //   email: user.email,
      // });
      
      console.log("Resending verification email to:", user.email);
      
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

  // New function to handle profile picture uploads with Supabase support
  const uploadProfilePicture = async (file: File, publicUrl?: string): Promise<string> => {
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
      
      let fileUrl: string;
      let filePath: string | undefined;
      
      // If we received a public URL from Supabase, use it
      if (publicUrl) {
        fileUrl = publicUrl;
        // Extract the file path from the URL
        const urlParts = publicUrl.split('/');
        filePath = urlParts.slice(urlParts.indexOf('profile-pictures')).join('/');
      } else {
        // Fallback to creating a local object URL
        fileUrl = URL.createObjectURL(file);
        console.log("Profile picture uploaded (local):", fileUrl);
      }
      
      // Update user profile with the new picture URL
      if (user) {
        const updatedUser: UserProfile = { 
          ...user, 
          profilePicture: fileUrl 
        };
        
        if (filePath) {
          updatedUser.profilePictureFilePath = filePath;
        }
        
        setUser(updatedUser);
      }
      
      return fileUrl;
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

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      resendVerificationEmail,
      uploadProfilePicture 
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
