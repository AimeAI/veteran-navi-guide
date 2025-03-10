
import { SkillLevel, BadgeType } from "@/types/badges";

interface BadgeConfig {
  background: string;
  text: string;
  border: string;
  icon: "badge" | "award" | "trophy" | "check" | "star" | "book" | "briefcase" | "medal";
}

export const getSkillLevelBadgeConfig = (level: SkillLevel): BadgeConfig => {
  const configs: Record<SkillLevel, BadgeConfig> = {
    beginner: {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-100",
      border: "border-blue-200 dark:border-blue-700",
      icon: "badge"
    },
    intermediate: {
      background: "bg-green-50 dark:bg-green-900",
      text: "text-green-800 dark:text-green-100",
      border: "border-green-200 dark:border-green-700",
      icon: "badge"
    },
    advanced: {
      background: "bg-purple-50 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-100",
      border: "border-purple-200 dark:border-purple-700",
      icon: "award"
    },
    expert: {
      background: "bg-amber-50 dark:bg-amber-900",
      text: "text-amber-800 dark:text-amber-100",
      border: "border-amber-200 dark:border-amber-700",
      icon: "trophy"
    }
  };
  
  return configs[level];
};

export const getSkillTypeBadgeConfig = (type: BadgeType): BadgeConfig => {
  const configs: Record<BadgeType, BadgeConfig> = {
    military: {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-100",
      border: "border-blue-200 dark:border-blue-700",
      icon: "medal"
    },
    technical: {
      background: "bg-slate-50 dark:bg-slate-900",
      text: "text-slate-800 dark:text-slate-100",
      border: "border-slate-200 dark:border-slate-700",
      icon: "book"
    },
    soft: {
      background: "bg-emerald-50 dark:bg-emerald-900",
      text: "text-emerald-800 dark:text-emerald-100",
      border: "border-emerald-200 dark:border-emerald-700",
      icon: "check"
    },
    leadership: {
      background: "bg-purple-50 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-100",
      border: "border-purple-200 dark:border-purple-700",
      icon: "star"
    },
    industry: {
      background: "bg-amber-50 dark:bg-amber-900",
      text: "text-amber-800 dark:text-amber-100",
      border: "border-amber-200 dark:border-amber-700",
      icon: "briefcase"
    }
  };
  
  return configs[type];
};
