
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BadgeType, VeteranBadge as VeteranBadgeType } from "@/types/badges";
import { BadgeIcon, BadgeIconType } from "./badge-icons";
import { badgeColors, badgeSizes, iconSizes } from "./badge-styles";
import { BadgeTooltip } from "./badge-tooltip";

// Re-export the BadgeType for external use
export type BadgeType = BadgeType;

// Re-export the VeteranBadge type from the global types
export interface VeteranBadge extends VeteranBadgeType {}

interface VeteranBadgeProps {
  badge: VeteranBadge;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export const VeteranBadgeComponent: React.FC<VeteranBadgeProps> = ({
  badge,
  size = "md",
  showTooltip = true,
  className
}) => {
  const colors = badgeColors[badge.type];
  
  return (
    <div className={cn("relative group", className)}>
      <Badge 
        variant="outline" 
        className={cn(
          badgeSizes[size],
          colors.bg, 
          colors.text, 
          colors.border,
          "font-medium gap-1.5 transition-all"
        )}
      >
        <BadgeIcon icon={badge.icon} className={iconSizes[size]} />
        {badge.name}
        {badge.level && (
          <span className="ml-0.5 bg-white bg-opacity-30 px-1 rounded-sm text-[0.65rem]">
            L{badge.level}
          </span>
        )}
      </Badge>
      
      <BadgeTooltip badge={badge} show={showTooltip} />
    </div>
  );
};
