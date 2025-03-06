
import React, { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Clock, File, Mail, User, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { JobApplication, ApplicationStatus } from '@/types/application';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ApplicationCardProps {
  application: JobApplication;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => Promise<boolean>;
  onSendMessage: (applicationId: string, message: string) => Promise<boolean>;
}

export function ApplicationCard({ application, onStatusChange, onSendMessage }: ApplicationCardProps) {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (application.status === newStatus) return;
    
    setIsUpdatingStatus(true);
    await onStatusChange(application.id, newStatus);
    setIsUpdatingStatus(false);
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    const success = await onSendMessage(application.id, message);
    if (success) {
      setMessage('');
      setIsMessageDialogOpen(false);
    }
    setIsSending(false);
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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const { applicant, job, appliedDate, status, matchScore, resume, coverLetter } = application;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={applicant.photo} alt={applicant.name} />
              <AvatarFallback>{getInitials(applicant.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Applied {format(new Date(appliedDate), 'MMM d, yyyy')}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>For: {job.title}</span>
              </div>
              <div className="mt-2">
                <ApplicationStatusBadge status={status} />
              </div>
            </div>
          </div>
          
          <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">Match:</span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                matchScore && matchScore >= 90 ? "bg-green-100 text-green-800" :
                matchScore && matchScore >= 75 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {matchScore}%
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant={getButtonVariant(status, 'reviewing')}
                onClick={() => handleStatusChange('reviewing')}
                disabled={isUpdatingStatus}
                className="transition-all duration-200"
              >
                <Clock className="w-3.5 h-3.5 mr-1" />
                Review
              </Button>
              <Button 
                size="sm" 
                variant={getButtonVariant(status, 'interviewing')}
                onClick={() => handleStatusChange('interviewing')}
                disabled={isUpdatingStatus}
                className="transition-all duration-200"
              >
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Interview
              </Button>
              <Button 
                size="sm" 
                variant={getButtonVariant(status, 'offered')}
                onClick={() => handleStatusChange('offered')}
                disabled={isUpdatingStatus}
                className="transition-all duration-200"
              >
                <Mail className="w-3.5 h-3.5 mr-1" />
                Offer
              </Button>
              <Button 
                size="sm" 
                variant={getButtonVariant(status, 'hired')}
                className={cn("transition-all duration-200", 
                  getButtonStyle(status, 'hired'))}
                onClick={() => handleStatusChange('hired')}
                disabled={isUpdatingStatus}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Hire
              </Button>
              <Button 
                size="sm" 
                variant={getButtonVariant(status, 'rejected')}
                className={cn("transition-all duration-200", 
                  getButtonStyle(status, 'rejected'))}
                onClick={() => handleStatusChange('rejected')}
                disabled={isUpdatingStatus}
              >
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-primary">
              <User className="mr-1 h-4 w-4" />
              View Profile
            </Button>
            {resume && (
              <Button variant="ghost" size="sm" className="text-primary">
                <File className="mr-1 h-4 w-4" />
                Resume
              </Button>
            )}
          </div>
          
          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Mail className="mr-1 h-4 w-4" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Message to {applicant.name}</DialogTitle>
                <DialogDescription>
                  Send a message regarding their application for {job.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Textarea
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} disabled={!message.trim() || isSending}>
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
