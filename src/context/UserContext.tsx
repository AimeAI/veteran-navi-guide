
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

  // Check and set user session on mount and auth state changes
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Check for stored user in localStorage first (fallback for development)
      const storedUser = localStorage.getItem("user");
      
      if (supabase) {
        try {
          // Get the current session from Supabase
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // User is logged in with Supabase
            const { user: supabaseUser } = session;
            
            // Verify if email is confirmed
            const emailVerified = supabaseUser.email_confirmed_at !== null;
            
            // Get user profile from Supabase or create a new one
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', supabaseUser.id)
              .single();
            
            if (profile) {
              // Use profile from database
              setUser({
                id: supabaseUser.id,
                name: profile.name || supabaseUser.email?.split('@')[0] || '',
                email: supabaseUser.email || '',
                phone: profile.phone || '',
                location: profile.location || '',
                militaryBranch: profile.military_branch || '',
                yearsOfService: profile.years_of_service || '',
                rank: profile.rank || '',
                bio: profile.bio || '',
                isAuthenticated: true,
                emailVerified: emailVerified,
                profilePicture: profile.profile_picture || undefined,
                profilePictureFilePath: profile.profile_picture_path || undefined
              });
            } else {
              // Create a basic profile for a new user
              setUser({
                id: supabaseUser.id,
                name: supabaseUser.email?.split('@')[0] || '',
                email: supabaseUser.email || '',
                phone: '',
                location: '',
                militaryBranch: '',
                yearsOfService: '',
                rank: '',
                bio: '',
                isAuthenticated: true,
                emailVerified: emailVerified,
                profilePicture: undefined
              });
            }
          } else if (storedUser) {
            // Fallback to localStorage for development
            setUser(JSON.parse(storedUser));
          } else {
            // For development only - remove in production
            setUser({ ...initialUserProfile, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          if (storedUser) {
            // Fallback to localStorage
            setUser(JSON.parse(storedUser));
          }
        }
      } else if (storedUser) {
        // Fallback to localStorage when Supabase is not configured
        setUser(JSON.parse(storedUser));
      } else {
        // For development only - remove in production
        setUser({ ...initialUserProfile, isAuthenticated: false });
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
    
    // Set up auth state change listener for Supabase if available
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            if (session?.user) {
              const supabaseUser = session.user;
              // Update user state with latest session info
              setUser(current => {
                if (current?.id === supabaseUser.id) {
                  return {
                    ...current,
                    emailVerified: supabaseUser.email_confirmed_at !== null
                  };
                }
                return current;
              });
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        }
      );
      
      // Clean up subscription
      return () => {
        subscription.unsubscribe();
      };
    }
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
      if (supabase) {
        // Use Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        // Auth state change listener will handle updating the user state
        toast.success("Login successful!");
      } else {
        // Fallback for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("Login request for:", email);
        
        // Simulate authentication failure
        if (password === "wrongpassword") {
          throw new Error("Invalid email or password");
        }
        
        // Hardcoded authentication for demo purposes
        setUser({ ...initialUserProfile, email, isAuthenticated: true });
        toast.success("Login successful!");
      }
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
      if (supabase) {
        // Use Supabase authentication with email verification
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { militaryBranch },
            // Enable email verification
            emailRedirectTo: `${window.location.origin}/verify-email`
          }
        });
        
        if (error) throw error;
        
        // When email verification is required
        if (data.user && !data.user.email_confirmed_at) {
          // Email verification is required
          setUser({
            id: data.user.id,
            name: email.split('@')[0],
            email,
            phone: '',
            location: '',
            militaryBranch,
            yearsOfService: '',
            rank: '',
            bio: '',
            isAuthenticated: true,
            emailVerified: false
          });
          
          toast.success("Account created successfully!", {
            description: "Please check your email for a verification link."
          });
        } else {
          // Email verification was not required (depends on Supabase settings)
          // Auth state change listener will handle updating the user state
          toast.success("Account created successfully!");
        }
      } else {
        // Fallback for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("Signup request for:", { email, militaryBranch });
        
        // Simulate email already in use error
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
      }
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
    if (supabase) {
      supabase.auth.signOut().then(() => {
        localStorage.removeItem("user");
        setUser(null);
        toast.info("You have been logged out");
      });
    } else {
      localStorage.removeItem("user");
      setUser(null);
      toast.info("You have been logged out");
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      try {
        setIsLoading(true);
        
        if (supabase && user.id) {
          // Update the profile in Supabase
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              name: updatedProfile.name || user.name,
              phone: updatedProfile.phone || user.phone,
              location: updatedProfile.location || user.location,
              military_branch: updatedProfile.militaryBranch || user.militaryBranch,
              years_of_service: updatedProfile.yearsOfService || user.yearsOfService,
              rank: updatedProfile.rank || user.rank,
              bio: updatedProfile.bio || user.bio,
              profile_picture: updatedProfile.profilePicture || user.profilePicture,
              profile_picture_path: updatedProfile.profilePictureFilePath || user.profilePictureFilePath,
              updated_at: new Date().toISOString()
            });
          
          if (error) throw error;
        }
        
        // Update local state
        const newProfile = { ...user, ...updatedProfile };
        setUser(newProfile);
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update profile", {
          description: "Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resendVerificationEmail = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      if (supabase) {
        // Use Supabase to resend verification email
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
          options: {
            emailRedirectTo: `${window.location.origin}/verify-email`
          }
        });
        
        if (error) throw error;
        
        toast.success("Verification email sent!", {
          description: "Please check your inbox for the verification link."
        });
      } else {
        // Fallback for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("Resending verification email to:", user.email);
        
        toast.success("Verification email sent!", {
          description: "Please check your inbox for the verification link."
        });
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast.error("Failed to resend verification email", {
        description: error instanceof Error ? error.message : "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle profile picture uploads with Supabase support
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
      
      if (supabase && user?.id) {
        // Use Supabase storage for file upload
        const fileName = `${user.id}-${Date.now()}`;
        const fileExt = file.name.split('.').pop();
        const path = `profile-pictures/${fileName}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(path);
        
        fileUrl = urlData.publicUrl;
        filePath = path;
      } else if (publicUrl) {
        // If we received a public URL from Supabase, use it
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
        
        // Update user profile
        await updateProfile(updatedUser);
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
