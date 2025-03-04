
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
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "555-123-4567",
  location: "San Diego, CA",
  militaryBranch: "U.S. Marine Corps",
  yearsOfService: "2010-2018",
  rank: "Staff Sergeant",
  bio: "Software Engineer with 5 years of experience. Marine Corps veteran with expertise in cybersecurity and leadership.",
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
      console.log("Login request for:", email, password);
      
      // Hardcoded authentication for demo purposes
      setUser({ ...initialUserProfile, email, isAuthenticated: true });
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
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
      console.log("Signup request for:", { email, password, militaryBranch });
      
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
      toast.error("Signup failed. Please try again.");
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
      const newProfile = { ...user, ...updatedProfile };
      setUser(newProfile);
      toast.success("Profile updated successfully!");
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
