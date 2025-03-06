
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Trophy, 
  CheckCheck, 
  Star, 
  BookOpen, 
  BadgeCheck, 
  Briefcase, 
  Medal
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeType = 
  | "profile-complete" 
  | "first-application" 
  | "community-contributor" 
  | "interview-ace" 
  | "resume-master" 
  | "job-seeker" 
  | "network-builder"
  | "skill-certified";

export interface VeteranBadge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedDate?: string;
  icon: keyof typeof badgeIcons;
  level?: 1 | 2 | 3;
}

const badgeIcons = {
  award: Award,
  trophy: Trophy,
  check: CheckCheck,
  star: Star,
  book: BookOpen,
  badge: BadgeCheck,
  briefcase: Briefcase,
  medal: Medal
};

const badgeColors: Record<BadgeType, { bg: string, text: string, border: string }> = {
  "profile-complete": { 
    bg: "bg-blue-50", 
    text: "text-blue-700", 
    border: "border-blue-200" 
  },
  "first-application": { 
    bg: "bg-green-50", 
    text: "text-green-700", 
    border: "border-green-200" 
  },
  "community-contributor": { 
    bg: "bg-purple-50", 
    text: "text-purple-700", 
    border: "border-purple-200" 
  },
  "interview-ace": { 
    bg: "bg-yellow-50", 
    text: "text-yellow-700", 
    border: "border-yellow-200" 
  },
  "resume-master": { 
    bg: "bg-indigo-50", 
    text: "text-indigo-700", 
    border: "border-indigo-200" 
  },
  "job-seeker": { 
    bg: "bg-pink-50", 
    text: "text-pink-700", 
    border: "border-pink-200" 
  },
  "network-builder": { 
    bg: "bg-orange-50", 
    text: "text-orange-700", 
    border: "border-orange-200" 
  },
  "skill-certified": { 
    bg: "bg-teal-50", 
    text: "text-teal-700", 
    border: "border-teal-200" 
  }
};

interface VeteranBadgeProps {
  badge: VeteranBadge;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export const VeteranBadgeComponent: React.FC<VeteranBadgeProps> = ({
  badge,
  size = "md",
  showTooltip = true,
  className
}) => {
  const IconComponent = badgeIcons[badge.icon];
  const colors = badgeColors[badge.type];
  
  // Determine icon size based on badge size
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  // Determine badge padding based on size
  const badgeSizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  };
  
  return (
    <div className={cn("relative group", className)}>
      <Badge 
        variant="outline" 
        className={cn(
          badgeSizes[size],
          colors.bg, 
          colors.text, 
          colors.border,
          "font-medium gap-1.5 transition-all"
        )}
      >
        <IconComponent className={iconSizes[size]} />
        {badge.name}
        {badge.level && (
          <span className="ml-0.5 bg-white bg-opacity-30 px-1 rounded-sm text-[0.65rem]">
            L{badge.level}
          </span>
        )}
      </Badge>
      
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <p className="font-medium mb-0.5">{badge.name}</p>
          <p className="text-gray-300 text-[0.65rem]">{badge.description}</p>
          {badge.earnedDate && (
            <p className="text-gray-400 text-[0.65rem] mt-1">
              Earned on {new Date(badge.earnedDate).toLocaleDateString()}
            </p>
          )}
          <div className="absolute left-1/2 top-full transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};
