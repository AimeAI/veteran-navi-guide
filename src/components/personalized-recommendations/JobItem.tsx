
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface JobItemProps {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  location: string;
  remote?: boolean;
}

const JobItem: React.FC<JobItemProps> = ({
  id,
  title,
  company,
  matchScore,
  location,
  remote
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-gray-600 text-sm">{company}</p>
          <div className="flex items-center mt-1 text-sm text-gray-500 space-x-3">
            <span>{location}</span>
            {remote && <Badge variant="outline">Remote</Badge>}
          </div>
        </div>
        <Badge className={
          matchScore >= 90 ? "bg-green-100 text-green-800 border-green-200" :
          matchScore >= 80 ? "bg-blue-100 text-blue-800 border-blue-200" :
          "bg-gray-100 text-gray-800 border-gray-200"
        }>
          {matchScore}% Match
        </Badge>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="outline" size="sm" className="mr-2">
          Save
        </Button>
        <Button asChild size="sm">
          <Link to={`/job-details/${id}`}>
            View Job
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default JobItem;
