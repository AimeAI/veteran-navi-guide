
import { GamificationAction, GamificationPoints, UserLevel, Challenge, UserGamificationState } from "@/types/gamification";
import { VeteranBadge } from "@/types/badges";
import { toast } from "sonner";

// Define point values for different actions
export const GAMIFICATION_POINTS: Record<GamificationAction, GamificationPoints> = {
  profile_update: {
    action: 'profile_update',
    points: 10,
    description: 'Update your profile information',
    dailyLimit: 1
  },
  job_application: {
    action: 'job_application',
    points: 25,
    description: 'Apply for a job',
    dailyLimit: 5
  },
  resume_upload: {
    action: 'resume_upload',
    points: 15,
    description: 'Upload or update your resume',
    dailyLimit: 1
  },
  login: {
    action: 'login',
    points: 5,
    description: 'Log in to the platform',
    dailyLimit: 1
  },
  app_session: {
    action: 'app_session',
    points: 10,
    description: 'Session lasting more than 5 minutes',
    dailyLimit: 3
  },
  forum_post: {
    action: 'forum_post',
    points: 15,
    description: 'Post in the community forum',
    dailyLimit: 3
  },
  interview_complete: {
    action: 'interview_complete',
    points: 30,
    description: 'Complete an interview',
  },
  job_saved: {
    action: 'job_saved',
    points: 5,
    description: 'Save a job for later',
    dailyLimit: 5
  },
  challenge_complete: {
    action: 'challenge_complete',
    points: 50,
    description: 'Complete a challenge',
  },
  connections_add: {
    action: 'connections_add',
    points: 10,
    description: 'Add a new connection',
    dailyLimit: 5
  },
  review_complete: {
    action: 'review_complete',
    points: 20,
    description: 'Complete a company review',
    weeklyLimit: 3
  },
  message_send: {
    action: 'message_send',
    points: 5,
    description: 'Send a message',
    dailyLimit: 10
  },
  event_registration: {
    action: 'event_registration',
    points: 15,
    description: 'Register for an event',
    weeklyLimit: 3
  },
};

// Define user levels
export const USER_LEVELS: UserLevel[] = [
  {
    level: 1,
    minPoints: 0,
    title: "Recruit",
    benefits: ["Basic profile features"]
  },
  {
    level: 2,
    minPoints: 100,
    title: "Private",
    benefits: ["Application tracking", "Job alerts"]
  },
  {
    level: 3,
    minPoints: 250,
    title: "Specialist",
    benefits: ["Resume visibility boost to employers"]
  },
  {
    level: 4,
    minPoints: 500,
    title: "Corporal",
    benefits: ["One free resume review"]
  },
  {
    level: 5,
    minPoints: 750,
    title: "Sergeant",
    benefits: ["Profile highlighting", "Message priority"]
  },
  {
    level: 6,
    minPoints: 1000,
    title: "Staff Sergeant",
    benefits: ["Featured profile for 1 week", "Early access to job postings"]
  },
  {
    level: 7,
    minPoints: 1500,
    title: "Master Sergeant",
    benefits: ["One free mock interview", "Priority application status"]
  },
  {
    level: 8,
    minPoints: 2000,
    title: "First Sergeant",
    benefits: ["Career coaching session", "Application highlights"]
  },
  {
    level: 9,
    minPoints: 3000,
    title: "Command Sergeant Major",
    benefits: ["Direct employer introductions", "Premium profile status"]
  },
  {
    level: 10,
    minPoints: 5000,
    title: "Veteran Career Master",
    benefits: ["All platform benefits", "Mentor status", "Advisory board eligibility"]
  }
];

// Active challenges
export const ACTIVE_CHALLENGES: Challenge[] = [
  {
    id: "weekly-applications",
    title: "Application Streak",
    description: "Apply to 5 jobs in one week",
    requiredActions: [
      { action: "job_application", count: 5 }
    ],
    reward: {
      points: 100,
      badgeId: "application-streak-1"
    },
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "profile-perfection",
    title: "Profile Perfection",
    description: "Complete all profile sections and upload a resume",
    requiredActions: [
      { action: "profile_update", count: 1 },
      { action: "resume_upload", count: 1 }
    ],
    reward: {
      points: 75,
      badgeId: "profile-master-1"
    }
  },
  {
    id: "networking-pro",
    title: "Networking Pro",
    description: "Add 3 connections and send 5 messages",
    requiredActions: [
      { action: "connections_add", count: 3 },
      { action: "message_send", count: 5 }
    ],
    reward: {
      points: 125,
      badgeId: "networking-1"
    }
  }
];

// Get current user level based on points
export const getUserLevel = (points: number): UserLevel => {
  // Find the highest level the user qualifies for
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    if (points >= USER_LEVELS[i].minPoints) {
      return USER_LEVELS[i];
    }
  }
  
  // Default to level 1
  return USER_LEVELS[0];
};

// Calculate points needed for next level
export const getPointsForNextLevel = (currentPoints: number): number => {
  const currentLevel = getUserLevel(currentPoints);
  const currentLevelIndex = USER_LEVELS.findIndex(level => level.level === currentLevel.level);
  
  // If at max level, return current points
  if (currentLevelIndex === USER_LEVELS.length - 1) {
    return currentPoints;
  }
  
  return USER_LEVELS[currentLevelIndex + 1].minPoints;
};

// Award points to user for an action
export const awardPoints = async (
  userId: string,
  action: GamificationAction,
  customPoints?: number
): Promise<{ success: boolean; points?: number; newTotal?: number; message?: string }> => {
  try {
    const actionConfig = GAMIFICATION_POINTS[action];
    
    if (!actionConfig) {
      console.error(`Invalid action type: ${action}`);
      return { success: false, message: "Invalid action type" };
    }
    
    const pointsToAward = customPoints ?? actionConfig.points;
    
    // In production, this would be a Supabase call to award points
    // const { data, error } = await supabase.rpc('award_gamification_points', {
    //   user_id: userId,
    //   action_type: action,
    //   points_amount: pointsToAward
    // });
    
    // if (error) throw error;
    
    // For now, just show a toast and return success
    toast.success(`+${pointsToAward} points awarded!`, {
      description: actionConfig.description
    });
    
    return {
      success: true,
      points: pointsToAward,
      newTotal: 625 + pointsToAward, // Mock value, would come from the database
      message: `Awarded ${pointsToAward} points for ${actionConfig.description}`
    };
  } catch (error) {
    console.error("Error awarding points:", error);
    return { success: false, message: "Failed to award points" };
  }
};

// Check if user has earned any new badges
export const checkForBadges = async (userId: string): Promise<{ 
  newBadges: VeteranBadge[]; 
  totalBadges: number;
}> => {
  // In production, this would call a Supabase function to check for new badges
  // const { data, error } = await supabase.rpc('check_for_new_badges', {
  //   user_id: userId
  // });
  
  // For demo, return an empty array
  return {
    newBadges: [],
    totalBadges: 6 // Mock value
  };
};

// Generate a leaderboard
export const getLeaderboard = async (limit: number = 10): Promise<any[]> => {
  // In production, fetch from Supabase
  // const { data, error } = await supabase
  //   .from('user_points')
  //   .select('user_id, points, levels, user_profiles(display_name, avatar_url)')
  //   .order('points', { ascending: false })
  //   .limit(limit);
  
  // Mock data for leaderboard
  return Array(limit).fill(null).map((_, i) => ({
    userId: `user-${i+1}`,
    userDisplayName: `Veteran ${i+1}`,
    rank: i+1,
    points: 1000 - (i * 50),
    level: Math.max(1, Math.floor((1000 - (i * 50)) / 500) + 1),
    badgeCount: Math.max(1, 10 - i)
  }));
};
