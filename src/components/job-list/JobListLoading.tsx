
import React from 'react';
import { Loader2 } from 'lucide-react';

const JobListLoading: React.FC = () => {
  return (
    <div className="py-12 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-gray-100 h-32 rounded-lg flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ))}
    </div>
  );
};

export default JobListLoading;
