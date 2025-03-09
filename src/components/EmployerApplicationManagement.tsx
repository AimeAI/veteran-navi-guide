
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, RefreshCw, Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEmployerApplications, JobApplicant } from '@/hooks/useEmployerApplications';
import { ApplicationStatus } from '@/hooks/useApplications';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const EmployerApplicationManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplicant | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | "">("");
  const [statusNotes, setStatusNotes] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { 
    applications, 
    isLoading, 
    error, 
    updateApplicationStatus,
    refreshApplications
  } = useEmployerApplications();

  // Filter applications based on search query and status filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    // For the tabs
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pending" && ["pending", "reviewing"].includes(app.status)) ||
      (activeTab === "interviewing" && app.status === "interviewing") ||
      (activeTab === "offered" && ["offered", "hired"].includes(app.status)) ||
      (activeTab === "rejected" && app.status === "rejected");
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Handle application status update
  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus, notes?: string) => {
    await updateApplicationStatus(applicationId, newStatus, notes);
  };

  const openStatusChangeDialog = (applicant: JobApplicant) => {
    setSelectedApplicant(applicant);
    setNewStatus(applicant.status);
    setStatusNotes(applicant.notes || "");
  };

  const handleStatusUpdateSubmit = async () => {
    if (selectedApplicant && newStatus) {
      await handleUpdateStatus(
        selectedApplicant.applicationId, 
        newStatus as ApplicationStatus,
        statusNotes
      );
      setSelectedApplicant(null);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    let color = "";
    let icon = null;
    
    switch (status) {
      case "pending":
        color = "bg-blue-100 text-blue-800 border-blue-200";
        icon = <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />;
        break;
      case "reviewing":
        color = "bg-yellow-100 text-yellow-800 border-yellow-200";
        icon = <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />;
        break;
      case "interviewing":
        color = "bg-purple-100 text-purple-800 border-purple-200";
        icon = <div className="w-2 h-2 rounded-full bg-purple-500 mr-2" />;
        break;
      case "offered":
        color = "bg-green-100 text-green-800 border-green-200";
        icon = <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />;
        break;
      case "hired":
        color = "bg-emerald-100 text-emerald-800 border-emerald-200";
        icon = <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />;
        break;
      case "rejected":
        color = "bg-red-100 text-red-800 border-red-200";
        icon = <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />;
        break;
    }
    
    return (
      <Badge variant="outline" className={color}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Manage Applications
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshApplications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
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
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="interviewing">Interviewing</TabsTrigger>
            <TabsTrigger value="offered">Offered</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
              <p className="text-sm">An error occurred loading applications. Please try again.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={refreshApplications}
              >
                Retry
              </Button>
            </div>
          ) : filteredApplications.length > 0 ? (
            // Application cards
            filteredApplications.map(app => (
              <div 
                key={app.applicationId} 
                className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      {app.avatarUrl ? (
                        <AvatarImage src={app.avatarUrl} alt={app.fullName} />
                      ) : (
                        <AvatarFallback>{app.fullName.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{app.fullName}</h3>
                      <p className="text-sm text-gray-500">{app.jobTitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    {getStatusBadge(app.status)}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openStatusChangeDialog(app)}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
                
                {app.coverLetter && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Cover Letter:</h4>
                    <p className="text-sm text-gray-700 line-clamp-2">{app.coverLetter}</p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-1">
                      Read More
                    </Button>
                  </div>
                )}
                
                {app.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Notes:</h4>
                    <p className="text-sm text-gray-700">{app.notes}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            // Empty state
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">No applications found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Status Update Dialog */}
      <Dialog open={!!selectedApplicant} onOpenChange={(open) => !open && setSelectedApplicant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
          </DialogHeader>
          
          {selectedApplicant && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {selectedApplicant.avatarUrl ? (
                    <AvatarImage src={selectedApplicant.avatarUrl} alt={selectedApplicant.fullName} />
                  ) : (
                    <AvatarFallback>{selectedApplicant.fullName.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedApplicant.fullName}</h3>
                  <p className="text-sm text-gray-500">{selectedApplicant.jobTitle}</p>
                </div>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="application-status">Application Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="application-status">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="status-notes">Notes</Label>
                <Textarea 
                  id="status-notes"
                  placeholder="Add notes about this status change..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedApplicant(null)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdateSubmit}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmployerApplicationManagement;
