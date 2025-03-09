
import React from 'react';
import { useApplications, Application, ApplicationStatus } from '@/hooks/useApplications';
import { Briefcase, Clock, Calendar, ArrowUpRight, CircleDot, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ApplicationHistoryProps {
  applications?: Application[];
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ applications: propApplications }) => {
  const { applications: hookApplications, isLoading, error, withdrawApplication } = useApplications();
  
  // Use applications from props if provided, otherwise use from hook
  const applications = propApplications || hookApplications;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-1/4 mt-1" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 mt-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error Loading Applications</AlertTitle>
        <AlertDescription>
          {error.message || "There was an error loading your applications. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-500 mb-6">
          You haven't applied to any jobs yet. Start exploring jobs that match your military experience.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/jobs'}>
          <Briefcase className="h-4 w-4 mr-2" />
          Browse Jobs
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: ApplicationStatus) => {
    let color;
    let icon = <CircleDot className="h-3 w-3 mr-1" />;
    
    switch (status) {
      case 'pending':
        color = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case 'reviewing':
        color = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case 'interviewing':
        color = "bg-purple-100 text-purple-800 border-purple-200";
        break;
      case 'offered':
        color = "bg-green-100 text-green-800 border-green-200";
        break;
      case 'hired':
        color = "bg-emerald-100 text-emerald-800 border-emerald-200";
        break;
      case 'rejected':
        color = "bg-red-100 text-red-800 border-red-200";
        break;
      default:
        color = "bg-gray-100 text-gray-800 border-gray-200";
    }
    
    return (
      <Badge variant="outline" className={color}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleWithdraw = async (applicationId: string) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      await withdrawApplication(applicationId);
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="w-full hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between mb-1">
              <CardTitle>{application.jobTitle}</CardTitle>
              {getStatusBadge(application.status)}
            </div>
            <CardDescription>{application.company}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-500 space-y-2">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                <span>Job ID: {application.jobId.substring(0, 8)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>Applied: {formatDate(application.appliedDate)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <span>Last updated: {application.appliedDate ? formatDate(application.appliedDate) : 'N/A'}</span>
              </div>
            </div>
            
            {application.notes && (
              <>
                <Separator className="my-3" />
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Notes:</h4>
                  <p className="text-sm text-gray-600 mt-1">{application.notes}</p>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button variant="outline" size="sm">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              View Job
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open(`/jobs/${application.jobId}`, '_blank')}>
                  View Job Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleWithdraw(application.id)}>
                  Withdraw Application
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Contact Employer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationHistory;
