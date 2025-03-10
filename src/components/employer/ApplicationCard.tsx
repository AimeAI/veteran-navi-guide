
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, AlertCircle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Define the application status types
export type ApplicationStatus = 
  'pending' | 'reviewed' | 'accepted' | 'rejected' | 
  'Under Review' | 'Screening' | 'Interview Scheduled' | 'Offered' | 'Hired' | 'Rejected';

export interface Application {
  id: string;
  candidateName: string;
  candidatePhoto?: string;
  jobTitle: string;
  applicationDate: string;
  status: ApplicationStatus;
  skills: string[];
}

interface ApplicationCardProps {
  application: Application;
  onUpdateStatus: (applicationId: string, newStatus: string) => void;
}

const ApplicationCard = ({ application, onUpdateStatus }: ApplicationCardProps) => {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleStatusUpdate = (newStatus: string) => {
    onUpdateStatus(application.id, newStatus);
  };
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In a real app, this would send the message to the candidate
    console.log(`Sending message to ${application.candidateName}: ${message}`);
    setMessage('');
    setShowMessageDialog(false);
  };

  const getStatusColor = () => {
    switch (application.status) {
      case 'pending':
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewed':
      case 'Screening':
        return 'bg-blue-100 text-blue-700';
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-700';
      case 'Offered':
        return 'bg-indigo-100 text-indigo-700';
      case 'accepted':
      case 'Hired':
        return 'bg-green-100 text-green-700';
      case 'rejected':
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (application.status) {
      case 'pending':
      case 'Under Review':
        return <AlertCircle className="mr-2 h-4 w-4" />;
      case 'reviewed':
      case 'Screening':
      case 'Interview Scheduled':
        return <Clock className="mr-2 h-4 w-4" />;
      case 'Offered':
        return <Send className="mr-2 h-4 w-4" />;
      case 'accepted':
      case 'Hired':
        return <CheckCircle className="mr-2 h-4 w-4" />;
      case 'rejected':
      case 'Rejected':
        return <XCircle className="mr-2 h-4 w-4" />;
      default:
        return <Clock className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{application.candidateName}</CardTitle>
        <Badge className={getStatusColor()}>
          {getStatusIcon()}
          {application.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            {application.candidatePhoto ? (
              <AvatarImage src={application.candidatePhoto} alt={application.candidateName} />
            ) : (
              <AvatarFallback>{application.candidateName.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <CardDescription>{application.jobTitle}</CardDescription>
            <p className="text-sm text-gray-500">Applied on {application.applicationDate}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="mb-2 font-medium text-gray-700">Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {application.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Message</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {application.candidateName}</DialogTitle>
              <DialogDescription>
                This message will be sent to the candidate's email and will appear in their message inbox.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              className="min-h-[100px]"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {application.status === 'Under Review' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('Rejected')}>
              Reject
            </Button>
            <Button size="sm" onClick={() => handleStatusUpdate('Screening')}>
              Move to Screening
            </Button>
          </div>
        )}
        
        {application.status === 'Screening' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('Rejected')}>
              Reject
            </Button>
            <Button size="sm" onClick={() => handleStatusUpdate('Interview Scheduled')}>
              Schedule Interview
            </Button>
          </div>
        )}
        
        {application.status === 'Interview Scheduled' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('Rejected')}>
              Reject
            </Button>
            <Button size="sm" onClick={() => handleStatusUpdate('Offered')}>
              Make Offer
            </Button>
          </div>
        )}
        
        {application.status === 'Offered' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('Rejected')}>
              Candidate Declined
            </Button>
            <Button size="sm" onClick={() => handleStatusUpdate('Hired')}>
              Candidate Accepted
            </Button>
          </div>
        )}
        
        {(application.status === 'Hired' || application.status === 'Rejected') && (
          <Button variant="outline" size="sm" disabled>
            {application.status === 'Hired' ? 'Candidate Hired' : 'Application Rejected'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
