
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

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

export type BadgeIconType = 'badge' | 'award' | 'trophy' | 'check' | 'star' | 'book' | 'briefcase' | 'medal';

export interface VeteranBadge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedDate: string;
  icon: BadgeIconType;
  level: 1 | 2 | 3;
}
