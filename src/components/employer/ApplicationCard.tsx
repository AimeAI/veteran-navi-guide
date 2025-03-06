import React from 'react';
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
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Application {
  id: string;
  candidateName: string;
  candidatePhoto?: string;
  jobTitle: string;
  applicationDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  skills: string[];
}

interface ApplicationCardProps {
  application: Application;
  onUpdateStatus: (applicationId: string, newStatus: string) => void;
}

const ApplicationCard = ({ application, onUpdateStatus }: ApplicationCardProps) => {
  const handleStatusUpdate = (newStatus: string) => {
    onUpdateStatus(application.id, newStatus);
  };

  const getStatusColor = () => {
    switch (application.status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (application.status) {
      case 'pending':
        return <Clock className="mr-2 h-4 w-4" />;
      case 'reviewed':
        return <Clock className="mr-2 h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="mr-2 h-4 w-4" />;
      case 'rejected':
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
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
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
      <CardFooter className="flex justify-end gap-2">
        {application.status === 'pending' && (
          <>
            <Button variant="outline" onClick={() => handleStatusUpdate('rejected')}>
              Reject
            </Button>
            <Button onClick={() => handleStatusUpdate('accepted')}>Accept</Button>
          </>
        )}
        {application.status === 'accepted' && (
          <Button variant="outline" disabled>
            Application Accepted
          </Button>
        )}
        {application.status === 'rejected' && (
          <Button variant="destructive" disabled>
            Application Rejected
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
