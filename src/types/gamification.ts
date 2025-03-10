
import { BadgeType } from "./badges";

export type GamificationAction = 
  | 'profile_update'
  | 'job_application'
  | 'resume_upload'
  | 'login'
  | 'app_session'
  | 'forum_post'
  | 'interview_complete'
  | 'job_saved'
  | 'challenge_complete'
  | 'connections_add'
  | 'review_complete'
  | 'message_send'
  | 'event_registration';

export interface GamificationPoints {
  action: GamificationAction;
  points: number;
  description: string;
  dailyLimit?: number;
  weeklyLimit?: number;
}

export interface UserLevel {
  level: number;
  minPoints: number;
  title: string;
  benefits: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  requiredActions: {
    action: GamificationAction;
    count: number;
  }[];
  reward: {
    points: number;
    badgeId?: string;
  };
  expires?: string; // ISO date string
}

export interface UserGamificationState {
  userId: string;
  points: number;
  level: number;
  badgesEarned: BadgeType[];
  challengesCompleted: string[]; // challenge ids
  challengesInProgress: {
    challengeId: string;
    progress: {
      action: GamificationAction;
      current: number;
      required: number;
    }[];
  }[];
  rewards: {
    rewardId: string;
    isUnlocked: boolean;
    isClaimed: boolean;
    claimedDate?: string;
  }[];
  lastPointsEarned: {
    action: GamificationAction;
    points: number;
    timestamp: string;
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  userDisplayName: string;
  userAvatarUrl?: string;
  rank: number;
  points: number;
  level: number;
  badgeCount: number;
}
