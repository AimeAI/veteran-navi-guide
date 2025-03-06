import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import ApplicationCard, { Application, ApplicationStatus } from '@/components/employer/ApplicationCard';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Mock applications data
const applications: Application[] = [
  {
    id: "app-001",
    candidateName: "James Wilson",
    candidatePhoto: "/assets/avatar-1.jpg",
    jobTitle: "Security Operations Manager",
    applicationDate: "2023-05-16",
    status: "pending",
    skills: ["Leadership", "Security Operations", "Team Management"]
  },
  {
    id: "app-002",
    candidateName: "Sarah Johnson",
    candidatePhoto: "/assets/avatar-2.jpg",
    jobTitle: "Security Operations Manager",
    applicationDate: "2023-05-17",
    status: "reviewed",
    skills: ["Project Management", "Security Systems", "Communication"]
  },
  {
    id: "app-003",
    candidateName: "Michael Rodriguez",
    candidatePhoto: "/assets/avatar-3.jpg",
    jobTitle: "Logistics Coordinator",
    applicationDate: "2023-05-12",
    status: "accepted",
    skills: ["Logistics", "Inventory Management", "Operations"]
  }
];

const EmployerApplicationManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter applications based on search query and status filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle application status update
  const handleUpdateStatus = (applicationId: string, newStatus: string) => {
    console.log(`Updating application ${applicationId} to status: ${newStatus}`);
    // In a real app, this would update the database
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search-applications" className="sr-only">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-applications"
                type="search"
                placeholder="Search by candidate or job title..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-[200px]">
            <Label htmlFor="status-filter" className="sr-only">Filter by status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map(application => (
              <ApplicationCard 
                key={application.id} 
                application={application} 
                onUpdateStatus={handleUpdateStatus} 
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applications found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployerApplicationManagement;
