
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ReviewStatusFilterProps {
  statusFilter: 'all' | 'pending' | 'approved' | 'rejected';
  setStatusFilter: (status: 'all' | 'pending' | 'approved' | 'rejected') => void;
  statusCounts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const ReviewStatusFilter: React.FC<ReviewStatusFilterProps> = ({
  statusFilter,
  setStatusFilter,
  statusCounts
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className={statusFilter === 'pending' ? 'bg-yellow-50' : ''}
        onClick={() => setStatusFilter('pending')}
      >
        <AlertCircle className="h-4 w-4 mr-1.5 text-yellow-500" />
        Pending ({statusCounts.pending})
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className={statusFilter === 'approved' ? 'bg-green-50' : ''}
        onClick={() => setStatusFilter('approved')}
      >
        <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
        Approved ({statusCounts.approved})
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className={statusFilter === 'rejected' ? 'bg-red-50' : ''}
        onClick={() => setStatusFilter('rejected')}
      >
        <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
        Rejected ({statusCounts.rejected})
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className={statusFilter === 'all' ? 'bg-gray-100' : ''}
        onClick={() => setStatusFilter('all')}
      >
        All ({statusCounts.all})
      </Button>
    </div>
  );
};

export default ReviewStatusFilter;
