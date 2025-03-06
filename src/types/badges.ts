
// Define the badge types as a specific string literal union type
export type BadgeType = 
  | 'achievement' 
  | 'skill' 
  | 'engagement' 
  | 'milestone'
  | 'activity'
  | 'professional'
  | 'education'
  | 'certification';

// Define the structure of a veteran badge
export interface VeteranBadge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  earnedDate: string;
  icon: string;
  level: number;
}
