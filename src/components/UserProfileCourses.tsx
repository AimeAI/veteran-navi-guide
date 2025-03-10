import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { LmsCourse } from '@/services/lms/types';

interface UserProfileCoursesProps {
  courses: LmsCourse[];
  maxCourses?: number;
  isLoading?: boolean;
}

const UserProfileCourses: React.FC<UserProfileCoursesProps> = ({ 
  courses, 
  maxCourses = 5,
  isLoading = false 
}) => {
  // Show only active and completed courses, prioritize active ones
  const sortedCourses = [...courses]
    .filter(c => c.enrollment_status === 'active' || c.enrollment_status === 'completed')
    .sort((a, b) => {
      // Sort by status (active first)
      if (a.enrollment_status === 'active' && b.enrollment_status !== 'active') return -1;
      if (a.enrollment_status !== 'active' && b.enrollment_status === 'active') return 1;
      
      // Then by date (newest first)
      const dateA = a.end_date ? new Date(a.end_date) : new Date(a.start_date || '');
      const dateB = b.end_date ? new Date(b.end_date) : new Date(b.start_date || '');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, maxCourses);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Learning and development courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sortedCourses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Learning and development courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No courses listed</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>Learning and development courses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCourses.map((course) => (
          <div key={course.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{course.name}</h3>
              <Badge className={getStatusColor(course.enrollment_status)}>
                {course.enrollment_status.charAt(0).toUpperCase() + course.enrollment_status.slice(1)}
              </Badge>
            </div>
            
            {course.course_code && (
              <p className="text-sm text-gray-600">{course.course_code}</p>
            )}
            
            {(course.start_date || course.end_date) && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="mr-1 h-3 w-3" />
                {course.start_date && course.end_date ? (
                  <>
                    {format(new Date(course.start_date), 'MMM yyyy')} - {format(new Date(course.end_date), 'MMM yyyy')}
                  </>
                ) : course.start_date ? (
                  <>Started {format(new Date(course.start_date), 'MMM yyyy')}</>
                ) : (
                  <>Completed {format(new Date(course.end_date!), 'MMM yyyy')}</>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserProfileCourses;
