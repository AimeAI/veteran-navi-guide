
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import ApplicationCard, { Application } from '@/components/employer/ApplicationCard';

export default function ApplicationManagement() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      // This would be replaced with actual Supabase fetch code
      // For demo purposes, we'll use mock data
      return [
        {
          id: 'app1',
          candidateName: 'John Smith',
          candidatePhoto: '',
          jobTitle: 'Software Engineer',
          applicationDate: '2023-07-15',
          status: 'Under Review',
          skills: ['JavaScript', 'React', 'Node.js']
        },
        {
          id: 'app2',
          candidateName: 'Anna Johnson',
          candidatePhoto: '',
          jobTitle: 'Project Manager',
          applicationDate: '2023-07-10',
          status: 'Interview Scheduled',
          skills: ['Agile', 'Scrum', 'Jira', 'Team Leadership']
        },
        {
          id: 'app3',
          candidateName: 'Mike Williams',
          candidatePhoto: '',
          jobTitle: 'UI Designer',
          applicationDate: '2023-07-05',
          status: 'Screening',
          skills: ['Figma', 'UI/UX', 'Adobe Creative Suite']
        },
        {
          id: 'app4',
          candidateName: 'Sarah Davis',
          candidatePhoto: '',
          jobTitle: 'DevOps Engineer',
          applicationDate: '2023-06-28',
          status: 'Offered',
          skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
        },
        {
          id: 'app5',
          candidateName: 'Robert Martinez',
          candidatePhoto: '',
          jobTitle: 'QA Analyst',
          applicationDate: '2023-06-20',
          status: 'Hired',
          skills: ['Test Automation', 'Selenium', 'JIRA', 'QA Methodologies']
        }
      ] as Application[];
    }
  });
  
  const handleUpdateStatus = (applicationId: string, newStatus: string) => {
    // In a real app, this would update the status in the database
    console.log(`Updating application ${applicationId} to ${newStatus}`);
    
    // After updating, we would refetch the applications
    refetch();
  };
  
  const filteredApplications = applications?.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="search">Search Applications</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or position..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="status-filter">Filter by Status</Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Screening">Screening</SelectItem>
              <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="Offered">Offered</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={() => refetch()} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading applications...</div>
      ) : filteredApplications?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No applications match your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApplications?.map(application => (
            <ApplicationCard
              key={application.id}
              application={application}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
