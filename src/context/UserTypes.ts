
import { User, Session } from "@supabase/supabase-js";
import { UserRole, EmployerProfile } from "@/types/application";

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
  authProvider?: string; // Track how user is authenticated
}

// Interface for the context
export interface UserContextType {
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
  socialLogin: (provider: string, isEmployer?: boolean) => Promise<void>;
}
