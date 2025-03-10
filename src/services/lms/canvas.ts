
import { toast } from "sonner";
import { addUserCourses } from "./courses";
import { LmsCourse } from "./types";

// Canvas LMS specific functions
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
