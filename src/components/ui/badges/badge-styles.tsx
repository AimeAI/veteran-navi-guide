
import { BadgeType } from "@/types/badges";

export interface BadgeColorScheme {
  bg: string;
  text: string;
  border: string;
}

// Badge colors configuration
export const badgeColors: Record<BadgeType, BadgeColorScheme> = {
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
  },
  "application": { 
    bg: "bg-green-50", 
    text: "text-green-700", 
    border: "border-green-200" 
  },
  "profile": { 
    bg: "bg-blue-50", 
    text: "text-blue-700", 
    border: "border-blue-200" 
  },
  "achievement": { 
    bg: "bg-yellow-50", 
    text: "text-yellow-700", 
    border: "border-yellow-200" 
  },
  "community": { 
    bg: "bg-purple-50", 
    text: "text-purple-700", 
    border: "border-purple-200" 
  },
  "event": { 
    bg: "bg-orange-50", 
    text: "text-orange-700", 
    border: "border-orange-200" 
  },
  "skill": { 
    bg: "bg-teal-50", 
    text: "text-teal-700", 
    border: "border-teal-200" 
  },
  "education": { 
    bg: "bg-indigo-50", 
    text: "text-indigo-700", 
    border: "border-indigo-200" 
  },
  "certification": { 
    bg: "bg-blue-50", 
    text: "text-blue-700", 
    border: "border-blue-200" 
  },
  "special": { 
    bg: "bg-pink-50", 
    text: "text-pink-700", 
    border: "border-pink-200" 
  }
};

// Badge size utilities
export const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm"
};

// Icon size utilities
export const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
};
