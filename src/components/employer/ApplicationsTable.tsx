
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageCircle } from 'lucide-react';
import { Application } from '@/components/employer/ApplicationCard';

interface ApplicationsTableProps {
  applications: Application[];
}

export default function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Screening':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'Offered':
        return 'bg-indigo-100 text-indigo-800';
      case 'Hired':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const viewApplication = (applicationId: string) => {
    navigate(`/employer/applications/${applicationId}`);
  };
  
  const messageCandidate = (applicationId: string) => {
    navigate(`/messages?application=${applicationId}`);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No applications found
              </TableCell>
            </TableRow>
          )}
          
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.candidateName}</TableCell>
              <TableCell>{application.jobTitle}</TableCell>
              <TableCell>{application.applicationDate}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(application.status)}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => viewApplication(application.id)}
                    title="View Application"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => messageCandidate(application.id)}
                    title="Message Candidate"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
