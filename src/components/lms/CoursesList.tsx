
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LmsCourse } from '@/services/lms';
import { BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CoursesListProps {
  courses: LmsCourse[];
  isLoading: boolean;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses, isLoading }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'invited':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Courses Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Connect your LMS and refresh courses to see your learning progress.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>{course.course_code}</CardDescription>
                </div>
                <Badge className={getStatusColor(course.enrollment_status)}>
                  {course.enrollment_status.charAt(0).toUpperCase() + course.enrollment_status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {course.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
              )}
              {(course.start_date || course.end_date) && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {course.start_date && course.end_date ? (
                    <>
                      {format(new Date(course.start_date), 'MMM d, yyyy')} - {format(new Date(course.end_date), 'MMM d, yyyy')}
                    </>
                  ) : course.start_date ? (
                    <>Started {format(new Date(course.start_date), 'MMM d, yyyy')}</>
                  ) : (
                    <>Ends {format(new Date(course.end_date!), 'MMM d, yyyy')}</>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesList;
