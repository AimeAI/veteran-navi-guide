
import { VeteranBadge } from "./types";

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
  }
];
