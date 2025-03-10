
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LmsConnection {
  id: string;
  user_id: string;
  lms_type: 'canvas' | 'moodle' | 'blackboard' | 'other';
  access_token: string;
  refresh_token?: string;
  instance_url: string;
  connected_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface LmsCourse {
  id: string;
  lms_connection_id: string;
  course_id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  enrollment_status: 'active' | 'completed' | 'invited';
  course_code?: string;
  image_url?: string;
}

export interface LmsCertification {
  id: string;
  user_id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  skills: string[];
}

// Get a user's LMS connections
export const getUserLmsConnections = async (userId: string): Promise<LmsConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('lms_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (error) throw error;
    
    return data as LmsConnection[];
  } catch (error) {
    console.error('Error fetching LMS connections:', error);
    toast.error('Failed to load LMS connections');
    return [];
  }
};

// Add a new LMS connection
export const addLmsConnection = async (connection: Omit<LmsConnection, 'id' | 'connected_at'>): Promise<LmsConnection | null> => {
  try {
    const { data, error } = await supabase
      .from('lms_connections')
      .insert({
        ...connection,
        connected_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('LMS connected successfully');
    return data as LmsConnection;
  } catch (error) {
    console.error('Error connecting LMS:', error);
    toast.error('Failed to connect LMS');
    return null;
  }
};

// Remove an LMS connection
export const removeLmsConnection = async (connectionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lms_connections')
      .update({ is_active: false })
      .eq('id', connectionId);
    
    if (error) throw error;
    
    toast.success('LMS disconnected successfully');
    return true;
  } catch (error) {
    console.error('Error disconnecting LMS:', error);
    toast.error('Failed to disconnect LMS');
    return false;
  }
};

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

// Canvas LMS specific functions
interface CanvasTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const fetchCanvasCourses = async (connectionId: string): Promise<LmsCourse[]> => {
  // This would typically call a Supabase Edge Function to handle the API request
  // For this example, we'll simulate a successful response
  console.log(`Fetching courses for connection ${connectionId}`);
  
  // In a real implementation, this would make an API call to Canvas LMS
  // For now, we return mock data
  const mockCourses: Omit<LmsCourse, 'id'>[] = [
    {
      lms_connection_id: connectionId,
      course_id: 'course_1',
      name: 'Leadership for Veterans',
      description: 'This course teaches leadership skills for veterans transitioning to civilian roles.',
      start_date: '2023-01-15',
      end_date: '2023-05-15',
      enrollment_status: 'completed',
      course_code: 'LDR101',
      image_url: 'https://example.com/leadership.jpg'
    },
    {
      lms_connection_id: connectionId,
      course_id: 'course_2',
      name: 'Project Management Fundamentals',
      description: 'Learn the basics of project management including Agile and Scrum methodologies.',
      start_date: '2023-06-01',
      end_date: '2023-08-30',
      enrollment_status: 'active',
      course_code: 'PM201',
      image_url: 'https://example.com/project-management.jpg'
    }
  ];
  
  // Add the courses to the database
  return await addUserCourses(mockCourses);
};
