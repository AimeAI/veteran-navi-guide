
import React from "react";
import { 
  Award, 
  Trophy, 
  CheckCheck, 
  Star, 
  BookOpen, 
  BadgeCheck, 
  Briefcase, 
  Medal,
  Building,
  Linkedin,
  Globe,
  FileText
} from "lucide-react";

export type BadgeIconType = 
  | "award"
  | "trophy"
  | "check"
  | "star"
  | "book"
  | "badge"
  | "briefcase"
  | "medal"
  | "linkedin"
  | "indeed"
  | "jobbank"
  | "jobicy"
  | "external";

export const badgeIcons = {
  award: Award,
  trophy: Trophy,
  check: CheckCheck,
  star: Star,
  book: BookOpen,
  badge: BadgeCheck,
  briefcase: Briefcase,
  medal: Medal,
  linkedin: Linkedin,
  indeed: Building,
  jobbank: FileText,
  jobicy: Globe,
  external: Globe
};

interface BadgeIconProps {
  icon: BadgeIconType;
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ icon, className }) => {
  const IconComponent = badgeIcons[icon];
  return <IconComponent className={className} />;
};
