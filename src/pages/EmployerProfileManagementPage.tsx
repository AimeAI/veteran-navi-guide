
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import EmployerProfileForm from '@/components/employer/EmployerProfileForm';

const EmployerProfileManagementPage: React.FC = () => {
  const { action } = useParams<{ action: 'create' | 'edit' }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch profile data if in edit mode and user is authenticated
    if (action === 'edit' && user?.id) {
      fetchEmployerProfile();
    } else {
      setIsLoading(false);
    }
  }, [action, user?.id]);
  
  const fetchEmployerProfile = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found for this user
          toast.error('No employer profile found. Create one now.');
          navigate('/employer-profile/create');
          return;
        }
        throw error;
      }
      
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Unauthorized Access</h2>
          <p className="mt-2 text-gray-600">
            You must be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }
  
  if (user.role !== 'employer') {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Unauthorized Access</h2>
          <p className="mt-2 text-gray-600">
            This page is available only to employer accounts.
          </p>
        </div>
      </div>
    );
  }
  
  const isEditMode = action === 'edit';
  const pageTitle = isEditMode ? 'Edit Employer Profile' : 'Create Employer Profile';
  
  return (
    <div className="container py-8">
      <Helmet>
        <title>{pageTitle} - Veteran Career Compass</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Building className="mr-2 h-8 w-8" />
        {pageTitle}
      </h1>
      
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent text-primary"></div>
          <p className="mt-4">Loading profile data...</p>
        </div>
      ) : (
        <EmployerProfileForm
          isEditing={isEditMode}
          initialData={profileData}
        />
      )}
    </div>
  );
};

export default EmployerProfileManagementPage;
