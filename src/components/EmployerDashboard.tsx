import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserRound, 
  XCircle, 
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import FilterBar from '@/components/FilterBar';
import { Application, ApplicationStatus } from '@/types/application';
import { useToast } from "@/hooks/use-toast";

const sampleApplications: Application[] = [
  {
    id: 'app-1',
    applicantName: 'John Smith',
    jobTitle: 'Software Engineer',
    company: 'TechVets Inc.',
    appliedDate: new Date(2023, 9, 5),
    status: 'reviewing',
    resume: 'resume-john-smith.pdf',
    coverLetter: true,
    matchScore: 92
  },
  {
    id: 'app-2',
    applicantName: 'Maria Rodriguez',
    jobTitle: 'Network Administrator',
    company: 'TechVets Inc.',
    appliedDate: new Date(2023, 9, 10),
    status: 'pending',
    resume: 'resume-maria-rodriguez.pdf',
    matchScore: 85
  },
  {
    id: 'app-3',
    applicantName: 'David Washington',
    jobTitle: 'Cybersecurity Analyst',
    company: 'TechVets Inc.',
    appliedDate: new Date(2023, 9, 12),
    status: 'interviewing',
    resume: 'resume-david-washington.pdf',
    coverLetter: true,
    matchScore: 95
  },
  {
    id: 'app-4',
    applicantName: 'Sarah Johnson',
    jobTitle: 'Project Manager',
    company: 'DefenseLogistics Corp',
    appliedDate: new Date(2023, 9, 15),
    status: 'hired',
    resume: 'resume-sarah-johnson.pdf',
    coverLetter: true,
    matchScore: 98
  },
  {
    id: 'app-5',
    applicantName: 'Michael Chen',
    jobTitle: 'Data Analyst',
    company: 'DefenseLogistics Corp',
    appliedDate: new Date(2023, 9, 18),
    status: 'rejected',
    resume: 'resume-michael-chen.pdf',
    matchScore: 72
  }
];

const EmployerDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [jobTitleFilter, setJobTitleFilter] = useState('');

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setJobTitleFilter('');
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesName = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesJobTitle = jobTitleFilter === '' || 
        app.jobTitle.toLowerCase().includes(jobTitleFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesName && matchesJobTitle && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter, jobTitleFilter]);

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prevApps => 
      prevApps.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
    
    const application = applications.find(app => app.id === appId);
    toast({
      title: `Status Updated`,
      description: `${application?.applicantName}'s application is now ${newStatus}`,
      variant: newStatus === 'rejected' ? 'destructive' : 'default',
    });
  };

  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'reviewing':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Reviewing
          </Badge>
        );
      case 'interviewing':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Calendar className="w-3 h-3 mr-1" />
            Interviewing
          </Badge>
        );
      case 'hired':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Hired
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getButtonVariant = (appStatus: ApplicationStatus, buttonStatus: ApplicationStatus) => {
    if (appStatus === buttonStatus) {
      return "default";
    }
    return "outline";
  };

  const getButtonStyle = (appStatus: ApplicationStatus, buttonStatus: ApplicationStatus) => {
    if (appStatus === buttonStatus) {
      if (buttonStatus === 'hired') return "bg-green-600 hover:bg-green-700";
      if (buttonStatus === 'rejected') return "bg-red-600 hover:bg-red-700";
      return "";
    }
    return "";
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">Manage applicants for your posted jobs</p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        jobTitleFilter={jobTitleFilter}
        setJobTitleFilter={setJobTitleFilter}
        resetFilters={resetFilters}
      />

      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
                      <UserRound className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.applicantName}</h3>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {application.jobTitle}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied {format(application.appliedDate, 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="mt-2">
                        {renderStatusBadge(application.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Match:</span>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        application.matchScore && application.matchScore >= 90 ? "bg-green-100 text-green-800" :
                        application.matchScore && application.matchScore >= 75 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      )}>
                        {application.matchScore}%
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant={getButtonVariant(application.status, 'reviewing')}
                        onClick={() => handleStatusChange(application.id, 'reviewing')}
                        className="transition-all duration-200"
                      >
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Review
                      </Button>
                      <Button 
                        size="sm" 
                        variant={getButtonVariant(application.status, 'interviewing')}
                        onClick={() => handleStatusChange(application.id, 'interviewing')}
                        className="transition-all duration-200"
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Interview
                      </Button>
                      <Button 
                        size="sm" 
                        variant={getButtonVariant(application.status, 'hired')}
                        className={cn("transition-all duration-200", 
                          getButtonStyle(application.status, 'hired'))}
                        onClick={() => handleStatusChange(application.id, 'hired')}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Hire
                      </Button>
                      <Button 
                        size="sm" 
                        variant={getButtonVariant(application.status, 'rejected')}
                        className={cn("transition-all duration-200", 
                          getButtonStyle(application.status, 'rejected'))}
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 justify-between">
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="text-primary">
                      <User className="mr-1 h-4 w-4" />
                      View Profile
                    </Button>
                    {application.resume && (
                      <Button variant="ghost" size="sm" className="text-primary ml-2">
                        Download Resume
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' || jobTitleFilter
                ? "Try adjusting your search or filters to see more results." 
                : "When candidates apply to your job postings, they will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
