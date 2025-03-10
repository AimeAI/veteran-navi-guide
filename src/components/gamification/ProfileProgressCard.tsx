
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, AlertCircle, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';

export interface ProfileSection {
  id: string;
  name: string;
  isComplete: boolean;
  points: number;
  priority: 'high' | 'medium' | 'low';
}

export default function ProfileProgressCard() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Define profile sections to complete
  const profileSections: ProfileSection[] = [
    {
      id: 'basic-info',
      name: 'Basic Information',
      isComplete: Boolean(user?.name && user?.email && user?.location),
      points: 10,
      priority: 'high'
    },
    {
      id: 'military-service',
      name: 'Military Service',
      isComplete: Boolean(user?.militaryBranch && user?.rank && user?.yearsOfService),
      points: 20,
      priority: 'high'
    },
    {
      id: 'skills',
      name: 'Skills',
      isComplete: Boolean(user?.skills && user?.skills.length >= 3),
      points: 15,
      priority: 'medium'
    },
    {
      id: 'bio',
      name: 'Professional Summary',
      isComplete: Boolean(user?.bio && user?.bio.length > 30),
      points: 15,
      priority: 'medium'
    },
    {
      id: 'profile-picture',
      name: 'Profile Picture',
      isComplete: Boolean(user?.profilePicture),
      points: 10,
      priority: 'low'
    }
  ];
  
  // Calculate completion percentage
  const completedSections = profileSections.filter(section => section.isComplete).length;
  const totalSections = profileSections.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);
  
  // Calculate earned points
  const earnedPoints = profileSections
    .filter(section => section.isComplete)
    .reduce((sum, section) => sum + section.points, 0);
  
  const totalPoints = profileSections.reduce((sum, section) => sum + section.points, 0);
  
  // Navigate to profile page
  const goToProfile = () => {
    navigate('/profile');
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Profile Completion</CardTitle>
        <CardDescription>
          Complete your profile to earn points and stand out to employers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm">{completionPercentage}% complete</div>
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700">
                <Trophy className="h-3 w-3" />
                <span>{earnedPoints}/{totalPoints} points</span>
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="space-y-2">
            {profileSections
              .filter(section => !section.isComplete)
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .slice(0, 3)
              .map(section => (
                <div 
                  key={section.id} 
                  className={`flex items-center justify-between p-2 rounded-md ${
                    section.priority === 'high'
                      ? 'bg-red-50 border border-red-100'
                      : section.priority === 'medium'
                        ? 'bg-amber-50 border border-amber-100'
                        : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    {section.priority === 'high' ? (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    ) : section.priority === 'medium' ? (
                      <Circle className="h-4 w-4 text-amber-500 mr-2" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm">{section.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    +{section.points} pts
                  </Badge>
                </div>
              ))}
              
            {profileSections.filter(section => !section.isComplete).length === 0 && (
              <div className="text-center p-3 bg-green-50 rounded-md border border-green-100">
                <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                <p className="text-sm text-green-700">All profile sections completed!</p>
              </div>
            )}
          </div>
          
          {profileSections.filter(section => !section.isComplete).length > 0 && (
            <Button onClick={goToProfile} className="w-full">
              Complete Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
