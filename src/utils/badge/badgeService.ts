
import { VeteranBadge } from "./types";
import { BadgeType } from "@/components/ui/veteran-badge";
import { availableBadges } from "./badgeDefinitions";
import { supabase } from "@/integrations/supabase/client";

// This would be used with Supabase to get the user's badges
export const fetchUserBadges = async (userId: string): Promise<VeteranBadge[]> => {
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
};

// This would be used to award a new badge to a user in Supabase
export const awardBadge = async (userId: string, badgeType: BadgeType): Promise<boolean> => {
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
};

