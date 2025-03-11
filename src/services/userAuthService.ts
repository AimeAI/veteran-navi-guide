
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const userAuthService = {
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof Error) {
        toast.error("Login failed", {
          description: error.message || "Please try again"
        });
      } else {
        toast.error("Login failed", {
          description: "An unexpected error occurred. Please try again."
        });
      }
      
      return { data: null, error };
    }
  },

  signup: async (
    email: string, 
    password: string, 
    metadata: { [key: string]: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully!", {
        description: "Please check your email for a verification link."
      });
      
      return { data, error: null };
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error instanceof Error) {
        toast.error("Sign up failed", {
          description: error.message || "Please try again"
        });
      } else {
        toast.error("Sign up failed", {
          description: "An unexpected error occurred. Please try again."
        });
      }
      
      return { data: null, error };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
      return { error };
    }
  },

  resendVerificationEmail: async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent!", {
        description: "Please check your inbox for the verification link."
      });
      
      return { error: null };
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast.error("Failed to resend verification email", {
        description: "Please try again later."
      });
      
      return { error };
    }
  },

  socialLogin: async (provider: 'google' | 'facebook' | 'github', options?: { [key: string]: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: options
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error(`Social login error with ${provider}:`, error);
      
      toast.error(`${provider} login failed`, {
        description: "An unexpected error occurred. Please try again."
      });
      
      return { data: null, error };
    }
  }
};
