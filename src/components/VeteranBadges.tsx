
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VeteranBadgeComponent, VeteranBadge } from "@/components/ui/veteran-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import { availableBadges } from "@/utils/badgeUtils";

interface VeteranBadgesProps {
  earnedBadges: VeteranBadge[];
  className?: string;
  showAvailable?: boolean;
}

const VeteranBadges: React.FC<VeteranBadgesProps> = ({ 
  earnedBadges, 
  className,
  showAvailable = true
}) => {
  const [displayMode, setDisplayMode] = useState<"earned" | "available">("earned");
  
  const earnedBadgeTypes = earnedBadges.map(badge => badge.type);
  const availableBadgeList = availableBadges.filter(
    badge => !earnedBadgeTypes.includes(badge.type)
  );
  
  if (!earnedBadges.length && !showAvailable) {
    return null;
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-primary" />
              Veteran Achievements
            </CardTitle>
            <CardDescription>
              Badges earned through your veteran job search journey
            </CardDescription>
          </div>
          {showAvailable && (
            <div className="flex space-x-1">
              <Button 
                variant={displayMode === "earned" ? "default" : "outline"}
                size="sm"
                onClick={() => setDisplayMode("earned")}
                className="text-xs px-2.5"
              >
                Earned ({earnedBadges.length})
              </Button>
              <Button 
                variant={displayMode === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setDisplayMode("available")}
                className="text-xs px-2.5"
              >
                Available ({availableBadgeList.length})
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayMode === "earned" ? (
          earnedBadges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((badge) => (
                <VeteranBadgeComponent 
                  key={badge.id} 
                  badge={badge} 
                  size="md"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              <Trophy className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>You haven't earned any badges yet.</p>
              <p>Complete actions on the platform to earn badges!</p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {availableBadgeList.map((badge) => (
              <div key={badge.id} className="flex items-start p-2 border border-dashed border-gray-200 rounded-md bg-gray-50">
                <VeteranBadgeComponent 
                  badge={badge} 
                  size="md" 
                  showTooltip={false}
                  className="mt-0.5"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VeteranBadges;
