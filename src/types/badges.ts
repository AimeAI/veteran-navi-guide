
export type BadgeType = 
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
