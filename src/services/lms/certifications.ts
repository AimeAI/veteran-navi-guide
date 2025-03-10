
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LmsCertification } from "./types";

// Get user's certifications
export const getUserCertifications = async (userId: string): Promise<LmsCertification[]> => {
  try {
    const { data, error } = await supabase
      .from('lms_certifications')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data as LmsCertification[];
  } catch (error) {
    console.error('Error fetching certifications:', error);
    toast.error('Failed to load certifications');
    return [];
  }
};

// Add a certification for a user
export const addUserCertification = async (certification: Omit<LmsCertification, 'id'>): Promise<LmsCertification | null> => {
  try {
    const { data, error } = await supabase
      .from('lms_certifications')
      .insert(certification)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Certification added successfully');
    return data as LmsCertification;
  } catch (error) {
    console.error('Error adding certification:', error);
    toast.error('Failed to add certification');
    return null;
  }
};

// Delete a certification
export const deleteCertification = async (certificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lms_certifications')
      .delete()
      .eq('id', certificationId);
    
    if (error) throw error;
    
    toast.success('Certification deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting certification:', error);
    toast.error('Failed to delete certification');
    return false;
  }
};
