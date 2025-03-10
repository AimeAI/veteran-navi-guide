
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BadgeIcon } from "./badge-icons";
import { badgeColors } from "./badge-styles";

export interface SourceBadgeProps {
  source?: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ 
  source, 
  className,
  showIcon = true,
  size = "sm"
}) => {
  if (!source) return null;
  
  const normalizedSource = source.toLowerCase();
  
  // Map source names to types used in our badge system
  const getSourceType = (src: string): string => {
    const sourceMap: Record<string, string> = {
      'jobbank': 'jobbank',
      'indeed': 'indeed',
      'linkedin': 'linkedin',
      'jobicy': 'jobicy'
    };
    
    return sourceMap[src] || 'external';
  };
  
  // Map sources to badge types for styling
  const getBadgeType = (src: string): "default" | "destructive" | "outline" | "secondary" => {
    const typeMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
      'jobbank': 'default',
      'indeed': 'secondary',
      'linkedin': 'outline',
      'jobicy': 'default'
    };
    
    return typeMap[src] || "secondary";
  };
  
  const sourceType = getSourceType(normalizedSource);
  const badgeType = getBadgeType(normalizedSource);
  const colors = badgeColors[badgeType];
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "px-3 py-1"
  };
  
  return (
    <Badge 
      variant={badgeType}
      className={cn(
        sizeClasses[size],
        "font-medium",
        colors?.bg,
        colors?.text,
        colors?.border,
        className
      )}
    >
      {showIcon && (
        <BadgeIcon 
          icon={sourceType as any} 
          className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} 
        />
      )}
      {source}
    </Badge>
  );
};
