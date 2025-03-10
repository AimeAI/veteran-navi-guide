
// Export all mentorship services
export * from "./types";
export * from "./profiles";
export * from "./connections";
export * from "./messages";
export * from "./meetings";

// Ensure these are exported for compatibility
export { 
  getProfileByUserId as getMentorshipProfile,
  upsertMentorshipProfile as updateProfile,
  upsertMentorshipProfile as createProfile
} from "./profiles";
