
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, Check, X, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Mock job listing data
const mockJobs = [
  { 
    id: '1', 
    title: 'Software Developer', 
    company: 'Tech Solutions Inc.', 
    location: 'Toronto, ON',
    type: 'Full-time',
    status: 'pending',
    datePosted: '2023-06-14T09:30:00Z',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl ultricies nisl, nec aliquam nisl nisl nec.'
  },
  { 
    id: '2', 
    title: 'Network Engineer', 
    company: 'NetWorks Canada', 
    location: 'Vancouver, BC',
    type: 'Full-time',
    status: 'pending',
    datePosted: '2023-06-15T11:45:00Z',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  { 
    id: '3', 
    title: 'IT Support Specialist', 
    company: 'Government of Canada', 
    location: 'Ottawa, ON',
    type: 'Contract',
    status: 'approved',
    datePosted: '2023-06-13T14:20:00Z',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  { 
    id: '4', 
    title: 'Cybersecurity Analyst', 
    company: 'SecureNet Corp', 
    location: 'Montreal, QC',
    type: 'Full-time',
    status: 'rejected',
    datePosted: '2023-06-12T10:15:00Z',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  },
  { 
    id: '5', 
    title: 'Project Manager', 
    company: 'Construction Canada', 
    location: 'Calgary, AB',
    type: 'Full-time',
    status: 'pending',
    datePosted: '2023-06-16T08:45:00Z',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
  }
];

interface JobModerationProps {
  isLoading?: boolean;
}

const JobModeration: React.FC<JobModerationProps> = ({ isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Filter jobs based on search query and status filter
  const filteredJobs = mockJobs
    .filter(job => 
      (filter === 'all' || job.status === filter) &&
      (
        searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  const handleJobAction = (job: typeof mockJobs[0], action: 'approve' | 'reject') => {
    setSelectedJob(job);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    // In a real app, this would call a Supabase function to update the job status
    console.log(`${actionType === 'approve' ? 'Approved' : 'Rejected'} job:`, selectedJob?.id);
    setActionDialogOpen(false);
  };

  const viewJobDetails = (job: typeof mockJobs[0]) => {
    setSelectedJob(job);
    setJobDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-60" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title or company"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              onClick={() => setFilter('all')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              All
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'} 
              onClick={() => setFilter('pending')}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Pending
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No jobs found</p>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="border rounded-lg p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-medium">{job.title}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <p className="text-sm">{job.company} • {job.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">Posted: {formatDate(job.datePosted)}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm" onClick={() => viewJobDetails(job)}>
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {job.status === 'pending' && (
                    <>
                      <Button variant="default" size="sm" onClick={() => handleJobAction(job, 'approve')}>
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleJobAction(job, 'reject')}>
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Job Details Dialog */}
      <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              Review this job posting before approving or rejecting.
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{selectedJob.title}</h3>
                  <p className="text-sm">{selectedJob.company} • {selectedJob.location}</p>
                </div>
                {getStatusBadge(selectedJob.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Job Type:</div>
                <div className="text-sm">{selectedJob.type}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Date Posted:</div>
                <div className="text-sm">{formatDate(selectedJob.datePosted)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Job Description:</h4>
                <div className="text-sm border rounded-md p-3 bg-gray-50">
                  {selectedJob.description}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setJobDialogOpen(false)}>Close</Button>
            {selectedJob?.status === 'pending' && (
              <>
                <Button 
                  variant="default" 
                  onClick={() => {
                    setJobDialogOpen(false);
                    handleJobAction(selectedJob, 'approve');
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setJobDialogOpen(false);
                    handleJobAction(selectedJob, 'reject');
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Job Posting' : 'Reject Job Posting'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'This job posting will be visible to all users on the platform.' 
                : 'This job posting will be rejected and not visible to users.'}
            </DialogDescription>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} this job posting?
            <br />
            <span className="font-medium">{selectedJob?.title}</span> at <span className="font-medium">{selectedJob?.company}</span>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'} 
              onClick={confirmAction}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'} Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default JobModeration;
