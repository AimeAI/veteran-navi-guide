
export type BadgeType = 
  | 'profile-complete'
  | 'first-application'
  | 'community-contributor'
  | 'interview-ace'
  | 'resume-master'
  | 'job-seeker'
  | 'network-builder'
  | 'skill-certified'
  | 'achievement'
  | 'profile'
  | 'application'
  | 'community'
  | 'event'
  | 'skill'
  | 'education'
  | 'certification'
  | 'special';

export interface VeteranBadge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedDate: string;
  icon: string;
  level: number;
}
