import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { UserRole, EmployerProfile } from "@/types/application";

// Define types for our user profile
export interface UserProfile {
  id: string; // Added missing id property
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
  isLoading: boolean;
  login: (email: string, password: string, isEmployer?: boolean) => Promise<void>;
  signup: (email: string, password: string, militaryBranch: string, isEmployer?: boolean, companyName?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedProfile: Partial<UserProfile>) => void;
  updateEmployerProfile: (updatedProfile: Partial<EmployerProfile>) => void;
  resendVerificationEmail: () => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  socialLogin: (provider: string, isEmployer?: boolean) => Promise<void>; // Add new social login method
}

// Create the context with initial values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Initial user profile data
const initialUserProfile: UserProfile = {
  id: "user-1", // Added id value
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
  profilePicture: undefined,
  role: "veteran",
  authProvider: "local"
};

// Initial employer profile data
const initialEmployerProfile: EmployerProfile = {
  id: "emp1",
  companyName: "TechVets Solutions Inc.",
  industry: "Information Technology",
  companySize: "50-100",
  location: "Ottawa, ON",
  website: "https://www.techvets-example.com",
  description: "A technology company dedicated to hiring and supporting veterans in the tech industry. We provide software solutions for government and private sector clients.",
  contactEmail: "hr@techvets-example.com",
  contactPhone: "613-555-1234",
  isVerified: true
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

  const login = async (email: string, password: string, isEmployer = false) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to verify credentials
      console.log("Login request for:", email, isEmployer ? "(employer)" : "(veteran)");
      
      // Simulate authentication failure (for demo purposes)
      if (password === "wrongpassword") {
        throw new Error("Invalid email or password");
      }
      
      if (isEmployer) {
        // Hardcoded employer authentication for demo purposes
        setUser({ 
          id: `emp-${Date.now()}`, // Add id for employer
          name: "TechVets Solutions Inc.", 
          email, 
          phone: "613-555-1234",
          location: "Ottawa, ON",
          militaryBranch: "",
          yearsOfService: "",
          rank: "",
          bio: "A technology company dedicated to hiring and supporting veterans in the tech industry.",
          isAuthenticated: true,
          emailVerified: true,
          role: "employer",
          employerProfile: initialEmployerProfile
        });
      } else {
        // Hardcoded veteran authentication for demo purposes
        setUser({ ...initialUserProfile, email, isAuthenticated: true, role: "veteran", id: `vet-${Date.now()}` });
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isEmployer && !companyName) {
        throw new Error("Company name is required for employer accounts");
      }
      
      console.log("Signup request for:", { 
        email, 
        militaryBranch, 
        isEmployer, 
        companyName 
      });
      
      // Simulate email already in use error (for demo purposes)
      if (email === "taken@example.com") {
        throw new Error("Email is already registered");
      }
      
      if (isEmployer) {
        // Create new employer user with provided data
        setUser({
          id: `emp-${Date.now()}`, // Add id for employer
          name: companyName || "",
          email,
          phone: "",
          location: "",
          militaryBranch: "",
          yearsOfService: "",
          rank: "",
          bio: "",
          isAuthenticated: true,
          emailVerified: false,
          role: "employer",
          employerProfile: {
            ...initialEmployerProfile,
            companyName: companyName || "",
            id: `emp-${Date.now()}`,
            contactEmail: email,
            isVerified: false
          }
        });
      } else {
        // Create new veteran user with provided data
        setUser({
          ...initialUserProfile,
          id: `vet-${Date.now()}`, // Add id for veteran
          email,
          militaryBranch,
          isAuthenticated: true,
          emailVerified: false,
          role: "veteran"
        });
      }
      
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

  const updateEmployerProfile = (updatedProfile: Partial<EmployerProfile>) => {
    if (user && user.role === "employer" && user.employerProfile) {
      try {
        // Simulate API call in a real app
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

  // New function to handle profile picture uploads
  const uploadProfilePicture = async (file: File): Promise<string> => {
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
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a local URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      console.log("Profile picture uploaded:", fileUrl);
      
      // Update user profile with the new picture URL
      if (user) {
        const updatedUser = { ...user, profilePicture: fileUrl };
        setUser(updatedUser);
      }
      
      toast.success("Profile picture updated successfully!");
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

  // Implement the socialLogin method
  const socialLogin = async (provider: string, isEmployer = false) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to authenticate with the provider
      console.log(`Social login request for provider: ${provider}, isEmployer: ${isEmployer}`);
      
      if (isEmployer) {
        // Hardcoded employer authentication for demo purposes
        setUser({ 
          id: `emp-${Date.now()}`, // Add id for employer
          name: "TechVets Solutions Inc.", 
          email: `demo_${provider}@example.com`, 
          phone: "613-555-1234",
          location: "Ottawa, ON",
          militaryBranch: "",
          yearsOfService: "",
          rank: "",
          bio: "A technology company dedicated to hiring and supporting veterans in the tech industry.",
          isAuthenticated: true,
          emailVerified: true,
          role: "employer",
          employerProfile: initialEmployerProfile,
          authProvider: provider
        });
      } else {
        // Hardcoded veteran authentication for demo purposes
        setUser({ 
          id: `vet-${Date.now()}`, // Add id for veteran
          ...initialUserProfile, 
          email: `demo_${provider}@example.com`, 
          isAuthenticated: true, 
          role: "veteran",
          authProvider: provider
        });
      }
      
      toast.success(`${provider} login successful!`);
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
      isLoading, 
      login, 
      signup, 
      logout, 
      updateProfile, 
      updateEmployerProfile,
      resendVerificationEmail,
      uploadProfilePicture,
      socialLogin // Add the new method to the context
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
