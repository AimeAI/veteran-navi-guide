
import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Define application status types
type ApplicationStatus = 'pending' | 'reviewing' | 'interview' | 'offered' | 'rejected';

// Define application data structure
interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: Date;
  status: ApplicationStatus;
  notes?: string;
}

interface ApplicationHistoryProps {
  applications: Application[];
  className?: string;
}

const ApplicationHistory: React.FC<ApplicationHistoryProps> = ({
  applications,
  className,
}) => {
  // Function to render status badge with appropriate styling and icon
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </div>
        );
      case 'reviewing':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </div>
        );
      case 'interview':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Calendar className="w-3 h-3 mr-1" />
            Interview Stage
          </div>
        );
      case 'offered':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Job Offered
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Not Selected
          </div>
        );
      default:
        return null;
    }
  };

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
                
                <div className="mt-4 flex justify-end">
                  <a 
                    href={`/applications/${application.id}`}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View Details
                  </a>
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
    </div>
  );
};

export default ApplicationHistory;
