
import React, { useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { userAuthService } from "@/services/userAuthService";
import { userProfileService } from "@/services/userProfileService";
import { UserProfile, UserContextType } from "./UserTypes";
import { EmployerProfile } from "@/types/application";
import { toast } from "sonner";
import { UserContext } from "./useUserContext";

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

      // Skip auth if Supabase is not configured
      if (!supabase) {
        console.log('⚠️ Auth disabled - Supabase not configured');
        setIsLoading(false);
        return;
      }

      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        setSupabaseUser(currentSession.user);

        // Fetch user profile
        const { profile, error } = await userProfileService.fetchUserProfile(currentSession.user);

        if (profile) {
          setUser(profile);
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
            setIsLoading(true);
            // Fetch user profile on sign in
            const { profile } = await userProfileService.fetchUserProfile(newSession.user);

            if (profile) {
              setUser(profile);
              toast.success("Welcome back!");
            }
            setIsLoading(false);
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
      const { error } = await userAuthService.login(email, password);
      if (error) throw error;
      
      toast.success("Login successful!");
    } catch (error) {
      // Error handling is done in the service
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
      
      const { error } = await userAuthService.signup(email, password, metadata);
      if (error) throw error;
      
      // Profile will be created automatically through the trigger
    } catch (error) {
      // Error handling is done in the service
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await userAuthService.logout();
      if (error) throw error;
      
      // State will be cleared by the auth listener
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!supabaseUser || !user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await userProfileService.updateProfile(supabaseUser.id, updatedProfile);
      if (error) throw error;
      
      // Update local state
      setUser({ ...user, ...updatedProfile });
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployerProfile = async (updatedProfile: Partial<EmployerProfile>) => {
    if (!supabaseUser || !user || user.role !== "employer") return;
    
    try {
      await userProfileService.updateEmployerProfile(supabaseUser.id, updatedProfile);
      
      if (user.employerProfile) {
        // Update local state
        const newEmployerProfile = { ...user.employerProfile, ...updatedProfile };
        setUser({
          ...user,
          employerProfile: newEmployerProfile
        });
      }
    } catch (error) {
      // Error handling is done in the service
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await userAuthService.resendVerificationEmail(user.email);
      if (error) throw error;
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!supabaseUser) throw new Error("User not authenticated");
    
    setIsLoading(true);
    
    try {
      const { url, error } = await userProfileService.uploadProfilePicture(supabaseUser.id, file);
      
      if (error) throw error;
      if (!url) throw new Error("Failed to get profile picture URL");
      
      // Update local state
      if (user) {
        setUser({ ...user, profilePicture: url });
      }
      
      return url;
    } catch (error) {
      // Error handling is done in the service
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
      
      const options = isEmployer ? { isEmployer: 'true' } : { isEmployer: 'false' };
      
      const { error } = await userAuthService.socialLogin(providerName, options);
      if (error) throw error;
      
      // The redirect happens automatically
      // State will be handled by the auth listener when redirected back
    } catch (error) {
      // Error handling is done in the service
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

export default UserProvider;
