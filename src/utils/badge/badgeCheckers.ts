
import { UserProfile } from "@/context/UserTypes";

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
