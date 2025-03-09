
import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Application, 
  ApplicationStatus, 
  useApplications 
} from '@/hooks/useApplications';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';

interface ApplicationHistoryProps {
  className?: string;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({ className }) => {
  const { 
    applications, 
    isLoading, 
    error, 
    refreshApplications,
    updateApplicationStatus,
    withdrawApplication
  } = useApplications();
  
  const [confirmWithdraw, setConfirmWithdraw] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Function to render status badge with appropriate styling and icon
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'reviewing':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case 'interviewing':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            <Calendar className="w-3 h-3 mr-1" />
            Interview Stage
          </Badge>
        );
      case 'offered':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Job Offered
          </Badge>
        );
      case 'hired':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
            <Briefcase className="w-3 h-3 mr-1" />
            Hired
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Not Selected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-28" />
            </div>
            <Skeleton className="h-4 w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg my-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>Error loading applications: {error.message}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => refreshApplications()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                    <p className="text-sm sm:text-base text-gray-700">{application.company}</p>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end space-y-2">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 inline" />
                      Applied {format(application.appliedDate, 'MMM d, yyyy')}
                    </div>
                    {renderStatusBadge(application.status)}
                  </div>
                </div>
                
                {application.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{application.notes}</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setConfirmWithdraw(application.id)}
                        className="text-red-600"
                      >
                        Withdraw Application
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">
              When you apply for jobs, they will appear here so you can track your application progress.
            </p>
          </div>
        )}
      </div>

      {/* Withdraw confirmation dialog */}
      <Dialog open={!!confirmWithdraw} onOpenChange={() => setConfirmWithdraw(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Application</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to withdraw this application? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmWithdraw(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (confirmWithdraw) {
                  withdrawApplication(confirmWithdraw);
                  setConfirmWithdraw(null);
                }
              }}
            >
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application details dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">{selectedApplication.jobTitle}</h3>
                <p className="text-gray-600">{selectedApplication.company}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Status</h4>
                  <div className="mt-1">{renderStatusBadge(selectedApplication.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Applied On</h4>
                  <p className="mt-1">{format(selectedApplication.appliedDate, 'MMMM d, yyyy')}</p>
                </div>
              </div>
              
              {selectedApplication.coverLetter && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Your Cover Letter</h4>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}
              
              {selectedApplication.resumeUrl && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Resume</h4>
                  <div className="mt-1">
                    <a 
                      href={selectedApplication.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              )}
              
              {selectedApplication.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Employer Notes</h4>
                  <div className="mt-1 p-3 bg-blue-50 rounded-md text-sm">
                    {selectedApplication.notes}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setSelectedApplication(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationHistory;
