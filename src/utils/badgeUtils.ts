import { VeteranBadge, BadgeType } from "@/components/ui/veteran-badge";
import { UserProfile } from "@/context/UserContext";

// Pre-defined badges with their criteria
export const availableBadges: VeteranBadge[] = [
  {
    id: "profile-complete",
    type: "profile-complete",
    name: "Profile Complete",
    description: "Completed your veteran profile with all necessary information",
    icon: "badge",
    level: 1
  },
  {
    id: "first-application",
    type: "first-application",
    name: "First Application",
    description: "Submitted your first job application",
    icon: "briefcase",
    level: 1
  },
  {
    id: "community-contributor",
    type: "community-contributor",
    name: "Community Contributor",
    description: "Made your first post in the veteran community forums",
    icon: "star",
    level: 1
  },
  {
    id: "interview-ace",
    type: "interview-ace",
    name: "Interview Ace",
    description: "Completed interview preparation resources",
    icon: "trophy",
    level: 1
  },
  {
    id: "resume-master",
    type: "resume-master",
    name: "Resume Master",
    description: "Uploaded your resume and completed the resume review process",
    icon: "medal",
    level: 1
  },
  {
    id: "job-seeker",
    type: "job-seeker",
    name: "Job Seeker",
    description: "Applied to 5 or more jobs",
    icon: "check",
    level: 1
  },
  {
    id: "network-builder",
    type: "network-builder",
    name: "Network Builder",
    description: "Connected with 3 or more veterans or employers",
    icon: "award",
    level: 1
  },
  {
    id: "skill-certified",
    type: "skill-certified",
    name: "Skill Certified",
    description: "Added verified military skills to your profile",
    icon: "book",
    level: 1
  },
  {
    id: "onboarding-complete",
    type: "achievement",
    name: "Onboarding Complete",
    description: "Successfully completed the onboarding process",
    icon: "check-circle",
    level: 1
  },
  {
    id: "skills-specialist",
    type: "skill",
    name: "Skills Specialist",
    description: "Added 5 or more skills to your profile",
    icon: "award",
    level: 1
  }
];

// Check if a user qualifies for a profile complete badge
export const checkProfileCompleteBadge = (user: UserProfile): boolean => {
  if (!user) return false;
  
  // Check if all essential profile fields are filled
  return Boolean(
    user.name &&
    user.email &&
    user.phone &&
    user.location &&
    user.militaryBranch &&
    user.yearsOfService &&
    user.rank &&
    user.bio &&
    user.profilePicture
  );
};

// Check for first application badge
export const checkFirstApplicationBadge = (appliedJobs: any[]): boolean => {
  return appliedJobs && appliedJobs.length > 0;
};

// Check for job seeker badge (applied to 5+ jobs)
export const checkJobSeekerBadge = (appliedJobs: any[]): boolean => {
  return appliedJobs && appliedJobs.length >= 5;
};

// New function to check if user has completed onboarding
export const checkOnboardingCompleteBadge = (user: UserProfile): boolean => {
  if (!user) return false;
  
  // Check if essential onboarding fields are filled
  return Boolean(
    user.name &&
    user.email &&
    user.location &&
    user.militaryBranch
  );
};

// New function to check for skills specialist badge
export const checkSkillsSpecialistBadge = (skills: string[]): boolean => {
  return skills && skills.length >= 5;
};

// Function to determine which badges a user has earned
export const determineEarnedBadges = (
  user: UserProfile,
  appliedJobs: any[] = [],
  forumPosts: number = 0,
  interviewPrep: boolean = false,
  resumeUploaded: boolean = false,
  connections: number = 0,
  verifiedSkills: boolean = false,
  skills: string[] = []
): VeteranBadge[] => {
  if (!user) return [];
  
  const earnedBadges: VeteranBadge[] = [];
  const now = new Date().toISOString();
  
  // Check for profile complete badge
  if (checkProfileCompleteBadge(user)) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "profile-complete")!,
      earnedDate: now
    });
  }
  
  // Check for onboarding complete badge
  if (checkOnboardingCompleteBadge(user)) {
    earnedBadges.push({
      ...availableBadges.find(b => b.id === "onboarding-complete")!,
      earnedDate: now
    });
  }
  
  // Check for skills specialist badge
  if (checkSkillsSpecialistBadge(skills)) {
    earnedBadges.push({
      ...availableBadges.find(b => b.id === "skills-specialist")!,
      earnedDate: now
    });
  }
  
  // Check for first application badge
  if (checkFirstApplicationBadge(appliedJobs)) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "first-application")!,
      earnedDate: now
    });
  }
  
  // Check for job seeker badge
  if (checkJobSeekerBadge(appliedJobs)) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "job-seeker")!,
      earnedDate: now
    });
  }
  
  // Check for community contributor
  if (forumPosts > 0) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "community-contributor")!,
      earnedDate: now
    });
  }
  
  // Check for interview ace
  if (interviewPrep) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "interview-ace")!,
      earnedDate: now
    });
  }
  
  // Check for resume master
  if (resumeUploaded) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "resume-master")!,
      earnedDate: now
    });
  }
  
  // Check for network builder
  if (connections >= 3) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "network-builder")!,
      earnedDate: now
    });
  }
  
  // Check for verified skills
  if (verifiedSkills) {
    earnedBadges.push({
      ...availableBadges.find(b => b.type === "skill-certified")!,
      earnedDate: now
    });
  }
  
  return earnedBadges;
};

// This would be used with Supabase to get the user's badges
export const fetchUserBadges = async (userId: string): Promise<VeteranBadge[]> => {
  // In a real implementation, this would fetch from Supabase
  // For now, let's return mock data
  console.log(`Fetching badges for user ${userId}`);
  
  // Example of how this would work with Supabase
  /*
  const { data, error } = await supabase
    .from('veteran_badges')
    .select('*')
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
  
  return data;
  */
  
  // Mock implementation
  return availableBadges
    .slice(0, 3)
    .map(badge => ({
      ...badge,
      earnedDate: new Date().toISOString()
    }));
};

// This would be used to award a new badge to a user in Supabase
export const awardBadge = async (userId: string, badgeType: BadgeType): Promise<boolean> => {
  // In a real implementation, this would insert into Supabase
  console.log(`Awarding badge ${badgeType} to user ${userId}`);
  
  // Example of how this would work with Supabase
  /*
  const badge = availableBadges.find(b => b.type === badgeType);
  if (!badge) return false;
  
  const { data, error } = await supabase
    .from('veteran_badges')
    .insert({
      user_id: userId,
      badge_id: badge.id,
      badge_type: badgeType,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      level: badge.level,
      earned_date: new Date().toISOString()
    });
    
  if (error) {
    console.error('Error awarding badge:', error);
    return false;
  }
  
  return true;
  */
  
  // Mock implementation
  return true;
};
