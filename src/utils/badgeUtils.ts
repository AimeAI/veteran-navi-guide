import { SkillLevel, BadgeType, VeteranBadge, BadgeIconType } from "@/types/badges";

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
    "profile-complete": {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-100",
      border: "border-blue-200 dark:border-blue-700",
      icon: "badge"
    },
    "first-application": {
      background: "bg-green-50 dark:bg-green-900",
      text: "text-green-800 dark:text-green-100", 
      border: "border-green-200 dark:border-green-700",
      icon: "medal"
    },
    "community-contributor": {
      background: "bg-purple-50 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-100",
      border: "border-purple-200 dark:border-purple-700",
      icon: "star"
    },
    "interview-ace": {
      background: "bg-amber-50 dark:bg-amber-900", 
      text: "text-amber-800 dark:text-amber-100",
      border: "border-amber-200 dark:border-amber-700",
      icon: "trophy"
    },
    "resume-master": {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-100",
      border: "border-blue-200 dark:border-blue-700",
      icon: "book"
    },
    "job-seeker": {
      background: "bg-green-50 dark:bg-green-900",
      text: "text-green-800 dark:text-green-100",
      border: "border-green-200 dark:border-green-700",
      icon: "briefcase"
    },
    "network-builder": {
      background: "bg-purple-50 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-100",
      border: "border-purple-200 dark:border-purple-700",
      icon: "medal"
    },
    "skill-certified": {
      background: "bg-amber-50 dark:bg-amber-900",
      text: "text-amber-800 dark:text-amber-100",
      border: "border-amber-200 dark:border-amber-700",
      icon: "badge"
    },
    "achievement": {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-100",
      border: "border-blue-200 dark:border-blue-700",
      icon: "trophy"
    },
    "profile": {
      background: "bg-green-50 dark:bg-green-900",
      text: "text-green-800 dark:text-green-100",
      border: "border-green-200 dark:border-green-700",
      icon: "badge"
    },
    "application": {
      background: "bg-purple-50 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-100",
      border: "border-purple-200 dark:border-purple-700",
      icon: "briefcase"
    },
    "community": {
      background: "bg-amber-50 dark:bg-amber-900",
      text: "text-amber-800 dark:text-amber-100",
      border: "border-amber-200 dark:border-amber-700",
      icon: "star"
    },
    "event": {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-100",
      border: "border-blue-200 dark:border-blue-700",
      icon: "medal"
    },
    "skill": {
      background: "bg-green-50 dark:bg-green-900",
      text: "text-green-800 dark:text-green-100",
      border: "border-green-200 dark:border-green-700",
      icon: "badge"
    },
    "education": {
      background: "bg-purple-50 dark:bg-purple-900",
      text: "text-purple-800 dark:text-purple-100",
      border: "border-purple-200 dark:border-purple-700",
      icon: "book"
    },
    "certification": {
      background: "bg-amber-50 dark:bg-amber-900",
      text: "text-amber-800 dark:text-amber-100",
      border: "border-amber-200 dark:border-amber-700",
      icon: "badge"
    },
    "special": {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-800 dark:text-blue-100",
      border: "border-blue-200 dark:border-blue-700",
      icon: "star"
    }
  };
  
  return configs[type];
};

export const availableBadges: VeteranBadge[] = [
  {
    id: "profile-complete-1",
    type: "profile-complete",
    name: "Profile Complete",
    description: "Completed your veteran profile",
    earnedDate: new Date().toISOString(),
    icon: "badge",
    level: 1
  },
  {
    id: "first-application-1",
    type: "first-application",
    name: "First Application",
    description: "Submitted your first job application",
    earnedDate: new Date().toISOString(),
    icon: "medal",
    level: 1
  },
  {
    id: "resume-master-1",
    type: "resume-master",
    name: "Resume Master",
    description: "Uploaded and optimized your resume",
    earnedDate: new Date().toISOString(),
    icon: "book",
    level: 1
  }
];

type User = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  militaryBranch?: string;
  yearsOfService?: string;
  rank?: string;
  bio?: string;
};

export const determineEarnedBadges = (
  user: User | null,
  appliedJobs: any[],
  forumPosts: number,
  interviewPrepCompleted: boolean,
  resumeUploaded: boolean,
  connectionsCount: number,
  verifiedSkills: boolean
): VeteranBadge[] => {
  const earnedBadges: VeteranBadge[] = [];

  if (user && user.name && user.email && user.militaryBranch && user.rank) {
    earnedBadges.push({
      id: "profile-complete-1",
      type: "profile-complete",
      name: "Profile Complete",
      description: "Completed your veteran profile",
      earnedDate: new Date().toISOString(),
      icon: "badge",
      level: 1
    });
  }

  if (appliedJobs.length > 0) {
    earnedBadges.push({
      id: "first-application-1",
      type: "first-application",
      name: "First Application",
      description: "Submitted your first job application",
      earnedDate: new Date().toISOString(),
      icon: "medal",
      level: 1
    });
  }

  if (resumeUploaded) {
    earnedBadges.push({
      id: "resume-master-1",
      type: "resume-master",
      name: "Resume Master",
      description: "Uploaded and optimized your resume",
      earnedDate: new Date().toISOString(),
      icon: "book",
      level: 1
    });
  }

  return earnedBadges;
};
