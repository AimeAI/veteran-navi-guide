
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { ApplicationStatus } from '@/types/application';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case 'reviewing':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Reviewing
        </Badge>
      );
    case 'interviewing':
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <Calendar className="w-3 h-3 mr-1" />
          Interviewing
        </Badge>
      );
    case 'offered':
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
          <Mail className="w-3 h-3 mr-1" />
          Offered
        </Badge>
      );
    case 'hired':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Hired
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return null;
  }
}
