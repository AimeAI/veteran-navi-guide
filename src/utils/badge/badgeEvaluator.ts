
import { VeteranBadge } from "./types";
import { UserProfile } from "@/context/UserTypes";
import { availableBadges } from "./badgeDefinitions";
import { checkProfileCompleteBadge, checkFirstApplicationBadge, checkJobSeekerBadge } from "./badgeCheckers";

// Function to determine which badges a user has earned
export const determineEarnedBadges = (
  user: UserProfile,
  appliedJobs: any[] = [],
  forumPosts: number = 0,
  interviewPrep: boolean = false,
  resumeUploaded: boolean = false,
  connections: number = 0,
  verifiedSkills: boolean = false
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
