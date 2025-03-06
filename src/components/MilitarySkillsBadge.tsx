
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface MilitarySkillsBadgeProps {
  skills: string[];
  limit?: number;
  className?: string;
}

const MilitarySkillsBadge: React.FC<MilitarySkillsBadgeProps> = ({ 
  skills, 
  limit = 3,
  className 
}) => {
  if (!skills || skills.length === 0) return null;

  const displaySkills = skills.slice(0, limit);
  const remainingCount = skills.length - limit;

  return (
    <div className={`flex items-center flex-wrap gap-1.5 ${className}`}>
      <Tag className="h-3.5 w-3.5 text-primary/70" />
      {displaySkills.map((skill, index) => (
        <Badge 
          key={index} 
          variant="outline" 
          className="text-xs font-normal text-gray-600 bg-gray-50"
        >
          {skill}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
};

export default MilitarySkillsBadge;
