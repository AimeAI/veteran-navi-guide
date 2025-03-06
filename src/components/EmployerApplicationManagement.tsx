
import React, { useState } from 'react';
import { Briefcase, Calendar, CheckCircle2, Clock, UserRound, XCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationFilters } from '@/components/employer/ApplicationFilters';
import { ApplicationCard } from '@/components/employer/ApplicationCard';
import { ApplicationStatus, JobApplication } from '@/types/application';
import { useEmployerApplications } from '@/hooks/useEmployerApplications';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ApplicationsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60 mb-2" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div>
              <Skeleton className="h-8 w-24 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EmployerApplicationManagement() {
  const { applications, isLoading, updateApplicationStatus, sendMessageToApplicant } = useEmployerApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [jobTitleFilter, setJobTitleFilter] = useState('');

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setJobTitleFilter('');
  };

  const filteredApplications = applications.filter(app => {
    const matchesName = app.applicant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJobTitle = jobTitleFilter === '' || 
      app.job.title.toLowerCase().includes(jobTitleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesName && matchesJobTitle && matchesStatus;
  });

  // Calculate status counts for the dashboard
  const statusCounts = applications.reduce((counts, app) => {
    const status = app.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {} as Record<ApplicationStatus, number>);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Management</h1>
        <p className="text-gray-600">Manage and review job applications</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="mb-2 text-blue-500">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold">{statusCounts.pending || 0}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="mb-2 text-yellow-500">
              <Clock className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold">{statusCounts.reviewing || 0}</p>
            <p className="text-sm text-gray-500">Reviewing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="mb-2 text-purple-500">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold">{statusCounts.interviewing || 0}</p>
            <p className="text-sm text-gray-500">Interviewing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="mb-2 text-indigo-500">
              <Briefcase className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold">{statusCounts.offered || 0}</p>
            <p className="text-sm text-gray-500">Offered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="mb-2 text-green-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold">{statusCounts.hired || 0}</p>
            <p className="text-sm text-gray-500">Hired</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="mb-2 text-red-500">
              <XCircle className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold">{statusCounts.rejected || 0}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <ApplicationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          jobTitleFilter={jobTitleFilter}
          setJobTitleFilter={setJobTitleFilter}
          resetFilters={resetFilters}
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <ApplicationsLoadingSkeleton />
        ) : filteredApplications.length > 0 ? (
          filteredApplications.map((application: JobApplication) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusChange={updateApplicationStatus}
              onSendMessage={sendMessageToApplicant}
            />
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
}
