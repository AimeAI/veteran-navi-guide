
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MatchScoreBadgeProps {
  matchScore?: number;
}

const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({ matchScore }) => {
  if (!matchScore) return null;
  
  return (
    <Badge variant="outline" className="bg-green-50 dark:bg-green-900 dark:text-green-100">
      {matchScore}% Match
    </Badge>
  );
};

export default MatchScoreBadge;
