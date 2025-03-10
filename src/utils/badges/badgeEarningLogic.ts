
import { VeteranBadge } from "@/types/badges";

type User = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  militaryBranch?: string;
  yearsOfService?: string;
  rank?: string;
  bio?: string;
};

export const determineEarnedBadges = (
  user: User | null,
  appliedJobs: any[],
  forumPosts: number,
  interviewPrepCompleted: boolean,
  resumeUploaded: boolean,
  connectionsCount: number,
  verifiedSkills: boolean
): VeteranBadge[] => {
  const earnedBadges: VeteranBadge[] = [];

  if (user && user.name && user.email && user.militaryBranch && user.rank) {
    earnedBadges.push({
      id: "profile-complete-1",
      type: "profile-complete",
      name: "Profile Complete",
      description: "Completed your veteran profile",
      earnedDate: new Date().toISOString(),
      icon: "badge",
      level: 1
    });
  }

  if (appliedJobs.length > 0) {
    earnedBadges.push({
      id: "first-application-1",
      type: "first-application",
      name: "First Application",
      description: "Submitted your first job application",
      earnedDate: new Date().toISOString(),
      icon: "medal",
      level: 1
    });
  }

  if (resumeUploaded) {
    earnedBadges.push({
      id: "resume-master-1",
      type: "resume-master",
      name: "Resume Master",
      description: "Uploaded and optimized your resume",
      earnedDate: new Date().toISOString(),
      icon: "book",
      level: 1
    });
  }

  return earnedBadges;
};
