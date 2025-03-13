
import { VeteranBadge } from "./types";
import { BadgeType } from "@/components/ui/veteran-badge";
import { availableBadges } from "./badgeDefinitions";
import { supabase } from "@/integrations/supabase/client";

// This would be used with Supabase to get the user's badges
export const fetchUserBadges = async (userId: string): Promise<VeteranBadge[]> => {
  console.log('DEV MODE: fetchUserBadges returns mock badges');
  
  // Mock data for development
  return availableBadges.slice(0, 3).map(badge => ({
    ...badge,
    earned_date: new Date().toISOString()
  })) as VeteranBadge[];
  
  /* Real implementation commented out during development
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
  */
};

// This would be used to award a new badge to a user in Supabase
export const awardBadge = async (userId: string, badgeType: BadgeType): Promise<boolean> => {
  console.log('DEV MODE: awardBadge always returns true');
  return true;
  
  /* Real implementation commented out during development
  try {
    const badge = availableBadges.find(b => b.type === badgeType);
    if (!badge) return false;

    const { error } = await supabase
      .from('badges')
      .insert({
        user_id: userId,
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
  } catch (error) {
    console.error('Error awarding badge:', error);
    return false;
  }
  */
};
