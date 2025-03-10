
import React from "react";
import { VeteranBadge } from "@/types/badges";

interface BadgeTooltipProps {
  badge: VeteranBadge;
  show: boolean;
}

export const BadgeTooltip: React.FC<BadgeTooltipProps> = ({ badge, show }) => {
  if (!show) return null;
  
  return (
    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
      <p className="font-medium mb-0.5">{badge.name}</p>
      <p className="text-gray-300 text-[0.65rem]">{badge.description}</p>
      {badge.earnedDate && (
        <p className="text-gray-400 text-[0.65rem] mt-1">
          Earned on {new Date(badge.earnedDate).toLocaleDateString()}
        </p>
      )}
      <div className="absolute left-1/2 top-full transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  );
};
