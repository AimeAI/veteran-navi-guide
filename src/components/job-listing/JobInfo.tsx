
import React from 'react';
import { Building, MapPin, Clock } from 'lucide-react';

interface JobInfoProps {
  company: string;
  location: string;
  formattedDate: string;
}

const JobInfo: React.FC<JobInfoProps> = ({ company, location, formattedDate }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <div className="flex items-center">
        <Building className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
        <span>{company}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
        <span>{location}</span>
      </div>
      <div className="flex items-center">
        <Clock className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default JobInfo;
