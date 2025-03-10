
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Award, CheckCircle, BadgeCheck, Clock, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type GameActivity = {
  id: string;
  type: 'points' | 'badge' | 'level' | 'challenge';
  title: string;
  description: string;
  points?: number;
  timestamp: string;
  badgeName?: string;
};

interface GameActivityCardProps {
  activities: GameActivity[];
  className?: string;
}

export default function GameActivityCard({ activities, className }: GameActivityCardProps) {
  const getActivityIcon = (type: GameActivity['type']) => {
    switch (type) {
      case 'points':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'badge':
        return <BadgeCheck className="h-5 w-5 text-blue-500" />;
      case 'level':
        return <Rocket className="h-5 w-5 text-purple-500" />;
      case 'challenge':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Award className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Award className="h-5 w-5 mr-2 text-blue-500" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Your latest achievements and progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recent activity found
            </div>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3 p-3 rounded-md bg-gray-50"
              >
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-muted-foreground">{activity.description}</div>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()} 
                    </span>
                    
                    {activity.points && (
                      <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700">
                        +{activity.points} points
                      </Badge>
                    )}
                    
                    {activity.badgeName && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700">
                        {activity.badgeName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
