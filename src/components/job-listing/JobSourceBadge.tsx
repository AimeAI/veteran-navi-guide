
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface JobSourceBadgeProps {
  source?: string;
}

const JobSourceBadge: React.FC<JobSourceBadgeProps> = ({ source }) => {
  const { t } = useTranslation();
  
  const getSourceBadgeColor = (source?: string) => {
    if (!source) return "secondary";
    
    const sourceMap: Record<string, "default" | "destructive" | "outline" | "secondary" | "warning" | "info" | "success" | "purple" | "orange"> = {
      'jobbank': 'default',
      'indeed': 'orange',
      'linkedin': 'purple',
      'jobicy': 'blue' as "info" // Type cast 'blue' to 'info' which is an allowed variant
    };
    
    return sourceMap[source.toLowerCase()] || "secondary";
  };

  if (!source) return null;
  
  return (
    <Badge variant={getSourceBadgeColor(source)}>
      {source || t("External")}
    </Badge>
  );
};

export default JobSourceBadge;
