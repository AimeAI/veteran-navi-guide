
import { VeteranBadge } from "@/types/badges";

export const availableBadges: VeteranBadge[] = [
  {
    id: "profile-complete-1",
    type: "profile-complete",
    name: "Profile Complete",
    description: "Completed your veteran profile",
    earnedDate: new Date().toISOString(),
    icon: "badge",
    level: 1
  },
  {
    id: "first-application-1",
    type: "first-application",
    name: "First Application",
    description: "Submitted your first job application",
    earnedDate: new Date().toISOString(),
    icon: "medal",
    level: 1
  },
  {
    id: "resume-master-1",
    type: "resume-master",
    name: "Resume Master",
    description: "Uploaded and optimized your resume",
    earnedDate: new Date().toISOString(),
    icon: "book",
    level: 1
  }
];
