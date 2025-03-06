
import React from 'react';
import { UserProfile } from '@/utils/recommendationAlgorithm';
import { UserRound } from 'lucide-react';

interface ApplicationCardProps {
  applicant: UserProfile;
  // Add other props as needed
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ applicant }) => {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <div className="flex-shrink-0">
        {applicant.photo ? (
          <img 
            src={applicant.photo} 
            alt={applicant.name || 'Applicant'} 
            className="h-12 w-12 rounded-full" 
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <UserRound className="h-6 w-6 text-gray-500" />
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium">{applicant.name || `${applicant.firstName} ${applicant.lastName}`}</h3>
        <p className="text-sm text-gray-500">{applicant.militaryBranch}</p>
      </div>
    </div>
  );
};

export default ApplicationCard;
