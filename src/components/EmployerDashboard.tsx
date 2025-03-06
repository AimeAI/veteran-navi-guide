import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/context/UserContext';
import { Building, Briefcase, Users, Search, Filter, Download, Mail, Phone, MapPin } from 'lucide-react';
import { UserProfile } from '@/utils/recommendationAlgorithm';
import ApplicationCard from './employer/ApplicationCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';

// Mock data for the employer dashboard
const candidateProfiles = [
  {
    id: "veteran-001",
    email: "james.wilson@example.com",
    firstName: "James",
    lastName: "Wilson",
    photo: "/assets/avatar-1.jpg",
    militaryBranch: "Army",
    serviceYears: 8,
    skills: ["Leadership", "Communications", "Logistics"],
    mosId: "11B",
    clearanceLevel: "Secret",
    experience: 8,
    jobPreferences: {
      roles: ["Leadership", "Management"],
      locations: ["New York", "Remote"],
      remote: true,
      salary: [70000, 100000],
      industries: ["Defense", "Technology"]
    },
    education: {
      level: "Bachelor's",
      field: "Business Administration",
      institution: "Army University"
    },
    certifications: ["PMP", "Six Sigma"],
    availability: "Immediate"
  },
  {
    id: "veteran-002",
    email: "sarah.johnson@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    photo: "/assets/avatar-2.jpg",
    militaryBranch: "Air Force",
    serviceYears: 6,
    skills: ["Project Management", "Data Analysis", "Team Leadership"],
    mosId: "3D0X4",
    clearanceLevel: "Top Secret",
    experience: 6,
    jobPreferences: {
      roles: ["Project Manager", "Data Analyst"],
      locations: ["Washington DC", "Remote"],
      remote: true,
      salary: [80000, 110000],
      industries: ["Technology", "Consulting"]
    },
    education: {
      level: "Master's",
      field: "Information Technology",
      institution: "Air Force Institute of Technology"
    },
    certifications: ["CISSP", "PMP"],
    availability: "2 weeks"
  },
  {
    id: "veteran-003",
    email: "michael.rodriguez@example.com",
    firstName: "Michael",
    lastName: "Rodriguez",
    photo: "/assets/avatar-3.jpg",
    militaryBranch: "Marines",
    serviceYears: 10,
    skills: ["Security", "Operations", "Training"],
    mosId: "0369",
    clearanceLevel: "Secret",
    experience: 10,
    jobPreferences: {
      roles: ["Security Manager", "Operations Director"],
      locations: ["San Diego", "Los Angeles"],
      remote: false,
      salary: [90000, 120000],
      industries: ["Defense", "Security"]
    },
    education: {
      level: "Bachelor's",
      field: "Criminal Justice",
      institution: "San Diego State University"
    },
    certifications: ["Security+", "CPP"],
    availability: "Immediate"
  }
];

// Mock job postings data
const jobPostings = [
  {
    id: "job-001",
    title: "Security Operations Manager",
    location: "Ottawa, ON",
    type: "Full-time",
    posted: "2023-05-15",
    applicants: 12,
    status: "Active",
    description: "Looking for a Security Operations Manager with military background to lead our security team."
  },
  {
    id: "job-002",
    title: "Logistics Coordinator",
    location: "Toronto, ON",
    type: "Full-time",
    posted: "2023-05-10",
    applicants: 8,
    status: "Active",
    description: "Seeking a detail-oriented Logistics Coordinator to manage supply chain operations."
  },
  {
    id: "job-003",
    title: "IT Project Manager",
    location: "Remote",
    type: "Contract",
    posted: "2023-05-05",
    applicants: 15,
    status: "Closed",
    description: "IT Project Manager needed for a 6-month contract to oversee system implementation."
  }
];

// Mock applications data
const applications = [
  {
    id: "app-001",
    jobId: "job-001",
    candidateId: "veteran-001",
    candidateName: "James Wilson",
    jobTitle: "Security Operations Manager",
    applicationDate: "2023-05-16",
    status: "pending",
    resumeUrl: "/resumes/james-wilson.pdf",
    coverLetterUrl: "/cover-letters/james-wilson.pdf",
    notes: "Strong candidate with relevant experience.",
    skills: ["Leadership", "Security Operations", "Team Management"]
  },
  {
    id: "app-002",
    jobId: "job-001",
    candidateId: "veteran-002",
    candidateName: "Sarah Johnson",
    jobTitle: "Security Operations Manager",
    applicationDate: "2023-05-17",
    status: "reviewed",
    resumeUrl: "/resumes/sarah-johnson.pdf",
    coverLetterUrl: "/cover-letters/sarah-johnson.pdf",
    notes: "Excellent technical skills, schedule interview.",
    skills: ["Project Management", "Security Systems", "Communication"]
  },
  {
    id: "app-003",
    jobId: "job-002",
    candidateId: "veteran-003",
    candidateName: "Michael Rodriguez",
    jobTitle: "Logistics Coordinator",
    applicationDate: "2023-05-12",
    status: "accepted",
    resumeUrl: "/resumes/michael-rodriguez.pdf",
    coverLetterUrl: "/cover-letters/michael-rodriguez.pdf",
    notes: "Interview scheduled for May 25th at 2 PM.",
    skills: ["Logistics", "Inventory Management", "Operations"]
  }
];

const EmployerDashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  if (!user || user.role !== 'employer') {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900">Unauthorized Access</h2>
              <p className="mt-2 text-gray-600">
                You must be logged in as an employer to view this dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your job postings, applications, and candidate matches
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline">
            <Link to="/post-job">
              <Briefcase className="mr-2 h-4 w-4" />
              Post New Job
            </Link>
          </Button>
          <Button asChild>
            <Link to="/employer-profile">
              <Building className="mr-2 h-4 w-4" />
              Company Profile
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidate Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Active Jobs</CardTitle>
                <CardDescription>Currently active job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {jobPostings.filter(job => job.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From a total of {jobPostings.length} postings
                </p>
                <Separator className="my-4" />
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/employer/jobs">View All Jobs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Applications</CardTitle>
                <CardDescription>Recent job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {applications.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {applications.filter(app => app.status === "Under Review").length} awaiting review
                </p>
                <Separator className="my-4" />
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("applications")}>
                  Manage Applications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Candidate Matches</CardTitle>
                <CardDescription>Veterans matching your jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {candidateProfiles.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Potential candidates for your positions
                </p>
                <Separator className="my-4" />
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("candidates")}>
                  Browse Candidates
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest candidates who applied to your jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 3).map(application => (
                    <div key={application.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={candidateProfiles.find(c => c.id === application.candidateId)?.photo} />
                          <AvatarFallback>{application.candidateName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{application.candidateName}</p>
                          <p className="text-xs text-muted-foreground">{application.jobTitle}</p>
                        </div>
                      </div>
                      <Badge variant={
                        application.status === "Under Review" ? "outline" :
                        application.status === "Screening" ? "secondary" :
                        application.status === "Interview Scheduled" ? "default" :
                        "outline"
                      }>
                        {application.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                {applications.length > 3 && (
                  <Button variant="link" className="mt-4 p-0" onClick={() => setActiveTab("applications")}>
                    View all applications
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Your company profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Company Name</p>
                      <p className="text-sm text-muted-foreground">
                        {user.employerProfile?.companyName || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {user.employerProfile?.location || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Contact Email</p>
                      <p className="text-sm text-muted-foreground">
                        {user.employerProfile?.contactEmail || user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Contact Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {user.employerProfile?.contactPhone || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-6 w-full" asChild>
                  <Link to="/employer-profile">
                    Update Company Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Manage Applications</CardTitle>
              <CardDescription>
                Review and process applications from veterans
              </CardDescription>
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
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Screening">Screening</SelectItem>
                      <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="Offered">Offered</SelectItem>
                      <SelectItem value="Hired">Hired</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Job Postings</CardTitle>
                  <CardDescription>
                    Manage your current and past job listings
                  </CardDescription>
                </div>
                <Button className="mt-4 md:mt-0" asChild>
                  <Link to="/post-job">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post New Job
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posted Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicants
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobPostings.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.posted}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.applicants}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/jobs/${job.id}/edit`}>Edit</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/jobs/${job.id}/applications`}>View Applications</Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Search</CardTitle>
              <CardDescription>
                Find qualified veterans for your open positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search-candidates" className="sr-only">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-candidates"
                      type="search"
                      placeholder="Search by skills, experience, or military background..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Results
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {candidateProfiles.map((candidate) => (
                  <Card key={candidate.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={candidate.photo} />
                            <AvatarFallback>{`${candidate.firstName[0]}${candidate.lastName[0]}`}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{`${candidate.firstName} ${candidate.lastName}`}</h3>
                            <p className="text-sm text-muted-foreground">{candidate.militaryBranch} Veteran</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{candidate.serviceYears} years of service</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>MOS: {candidate.mosId}</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1.5">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {candidate.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-50">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1.5">Security Clearance</p>
                          <Badge variant="secondary">{candidate.clearanceLevel}</Badge>
                        </div>
                      </div>
                      
                      <div className="border-t p-3 bg-gray-50 flex justify-between">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm">Contact</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerDashboard;
