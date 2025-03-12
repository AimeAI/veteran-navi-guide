import { UserProfile } from "@/context/UserTypes";
import { VeteranBadge, BadgeType } from "./badge/types";
import { availableBadges } from "./badge/badgeDefinitions";
import { 
  checkProfileCompleteBadge,
  checkFirstApplicationBadge,
  checkJobSeekerBadge
} from "./badge/badgeCheckers";
import { determineEarnedBadges } from "./badge/badgeEvaluator";
import { fetchUserBadges, awardBadge } from "./badge/badgeService";

export {
  availableBadges,
  checkProfileCompleteBadge,
  checkFirstApplicationBadge,
  checkJobSeekerBadge,
  determineEarnedBadges,
  fetchUserBadges,
  awardBadge
};
