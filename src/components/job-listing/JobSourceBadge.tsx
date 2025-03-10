
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SourceBadge } from '@/components/ui/badges';

interface JobSourceBadgeProps {
  source?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const JobSourceBadge: React.FC<JobSourceBadgeProps> = ({ 
  source,
  className,
  size = "sm"
}) => {
  const { t } = useTranslation();
  
  if (!source) return null;
  
  return (
    <SourceBadge 
      source={source} 
      className={className}
      size={size}
      showIcon={true}
    />
  );
};

export default JobSourceBadge;
