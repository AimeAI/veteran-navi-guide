
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LmsCourse } from "./types";

// Get user's courses from an LMS connection
export const getUserCourses = async (connectionId: string): Promise<LmsCourse[]> => {
  try {
    const { data, error } = await supabase
      .from('lms_courses')
      .select('*')
      .eq('lms_connection_id', connectionId);
    
    if (error) throw error;
    
    return data as LmsCourse[];
  } catch (error) {
    console.error('Error fetching courses:', error);
    toast.error('Failed to load courses');
    return [];
  }
};

// Add courses for a user
export const addUserCourses = async (courses: Omit<LmsCourse, 'id'>[]): Promise<LmsCourse[]> => {
  try {
    const { data, error } = await supabase
      .from('lms_courses')
      .insert(courses)
      .select();
    
    if (error) throw error;
    
    toast.success('Courses imported successfully');
    return data as LmsCourse[];
  } catch (error) {
    console.error('Error importing courses:', error);
    toast.error('Failed to import courses');
    return [];
  }
};
