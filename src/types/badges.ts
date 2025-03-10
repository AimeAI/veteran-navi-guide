
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

export type ClearanceLevel = 'none' | 'confidential' | 'secret' | 'top_secret' | 'ts_sci';
export type MilitaryBranch = 'army' | 'navy' | 'air_force' | 'marines' | 'coast_guard' | 'space_force' | 'none';
export type EducationLevel = 'high_school' | 'associates' | 'bachelors' | 'masters' | 'doctorate' | 'none';
export type SalaryRange = 'under_50k' | '50k_75k' | '75k_100k' | '100k_150k' | 'over_150k' | 'not_specified';

