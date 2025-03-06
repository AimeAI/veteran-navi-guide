import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

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
}

// Interface for the context
interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, militaryBranch: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedProfile: Partial<UserProfile>) => void;
}

// Create the context with initial values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Initial user profile data
const initialUserProfile: UserProfile = {
  name: "James Wilson",
  email: "james.wilson@example.com",
  phone: "613-555-7890",
  location: "Ottawa, ON",
  militaryBranch: "Canadian Armed Forces",
  yearsOfService: "2008-2019",
  rank: "Master Corporal",
  bio: "Software Engineer with 4 years of experience. Former CAF member with background in communications and logistics. Skilled in team leadership and project management.",
  isAuthenticated: false,
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
      
      // In a real app, this would be an API call to create an account
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
        isAuthenticated: true
      });
      
      toast.success("Account created successfully!");
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

  return (
    <UserContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
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
