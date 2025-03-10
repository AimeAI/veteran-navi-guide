
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MatchingSkillsProps {
  matchingSkills?: string[];
}

const MatchingSkills: React.FC<MatchingSkillsProps> = ({ matchingSkills }) => {
  const { t } = useTranslation();
  
  if (!matchingSkills || matchingSkills.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800">
          <Search className="h-3 w-3 mr-1" aria-hidden="true" />
          {t("Matched Skills")}:
        </Badge>
        
        {matchingSkills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MatchingSkills;
