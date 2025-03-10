import React from "react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, Check, Circle, CircleOff, HelpCircle, Trophy } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export interface ProfileSection {
  id: string;
  name: string;
  description: string;
  isComplete: boolean;
  tooltipText: string;
  priority: number; // 1 = high priority, 2 = medium, 3 = low
  points?: number; // Points awarded for gamification
}

interface ProfileCompletionProgressProps {
  className?: string;
  showDetails?: boolean;
  showPoints?: boolean;
  sections?: ProfileSection[];
}

export const ProfileCompletionProgress = ({
  className,
  showDetails = true,
  showPoints = false,
  sections: providedSections,
}: ProfileCompletionProgressProps) => {
  const { user } = useUser();
  const isEmployer = user?.role === "employer";

  // Default sections for veteran profiles
  const defaultVeteranSections: ProfileSection[] = [
    {
      id: "basic-info",
      name: "Basic Information",
      description: "Name, location, contact details",
      isComplete: Boolean(user?.name && user?.email && user?.location),
      tooltipText: "Complete your basic information to help employers contact you",
      priority: 1,
      points: 10
    },
    {
      id: "military-service",
      name: "Military Service",
      description: "Branch, rank, years of service",
      isComplete: Boolean(user?.militaryBranch && user?.rank && user?.yearsOfService),
      tooltipText: "Add your military service details to enhance job matching with relevant positions",
      priority: 1,
      points: 15
    },
    {
      id: "bio",
      name: "Professional Summary",
      description: "Bio and summary of experience",
      isComplete: Boolean(user?.bio && user?.bio.length > 30),
      tooltipText: "Write a professional summary (at least 30 characters) to showcase your background",
      priority: 2,
      points: 10
    },
    {
      id: "profile-picture",
      name: "Profile Picture",
      description: "Add a professional photo",
      isComplete: Boolean(user?.profilePicture),
      tooltipText: "Upload a professional photo to make your profile more personable",
      priority: 2,
      points: 5
    },
    {
      id: "email-verification",
      name: "Email Verification",
      description: "Verify your email address",
      isComplete: Boolean(user?.emailVerified),
      tooltipText: "Verify your email to access all features and ensure you receive important notifications",
      priority: 1,
      points: 5
    },
    {
      id: "skills",
      name: "Skills",
      description: "Add your professional and military skills",
      isComplete: Boolean(user?.skills && user?.skills.length > 3),
      tooltipText: "Add at least 3 relevant skills to improve job matching and recommendations",
      priority: 1,
      points: 15
    }
  ];

  // Default sections for employer profiles
  const defaultEmployerSections: ProfileSection[] = [
    {
      id: "company-info",
      name: "Company Information",
      description: "Company name, location, size",
      isComplete: Boolean(
        user?.employerProfile?.companyName && 
        user?.employerProfile?.location && 
        user?.employerProfile?.companySize
      ),
      tooltipText: "Complete your company information",
      priority: 1,
    },
    {
      id: "industry",
      name: "Industry",
      description: "Company industry and sector",
      isComplete: Boolean(user?.employerProfile?.industry),
      tooltipText: "Select your company's industry",
      priority: 2,
    },
    {
      id: "description",
      name: "Company Description",
      description: "Description of your company",
      isComplete: Boolean(
        user?.employerProfile?.description && 
        user?.employerProfile?.description.length > 50
      ),
      tooltipText: "Add a detailed company description (at least 50 characters)",
      priority: 1,
    },
    {
      id: "contact-info",
      name: "Contact Information",
      description: "Contact email, phone, website",
      isComplete: Boolean(
        user?.employerProfile?.contactEmail && 
        (user?.employerProfile?.contactPhone || user?.employerProfile?.website)
      ),
      tooltipText: "Add contact information for your company",
      priority: 2,
    },
    {
      id: "email-verification",
      name: "Email Verification",
      description: "Verify your email address",
      isComplete: Boolean(user?.emailVerified),
      tooltipText: "Verify your email to access all features",
      priority: 1,
    }
  ];

  const sections = providedSections || (isEmployer ? defaultEmployerSections : defaultVeteranSections);
  
  // Calculate completion percentage
  const completedSections = sections.filter(section => section.isComplete).length;
  const totalSections = sections.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);
  
  // Calculate total points earned
  const totalPointsPossible = sections.reduce((sum, section) => sum + (section.points || 0), 0);
  const earnedPoints = sections
    .filter(section => section.isComplete)
    .reduce((sum, section) => sum + (section.points || 0), 0);
  
  // Get completion status
  const getCompletionStatus = () => {
    if (completionPercentage === 100) return "Complete";
    if (completionPercentage >= 80) return "Almost Complete";
    if (completionPercentage >= 50) return "Partially Complete";
    if (completionPercentage >= 20) return "Getting Started";
    return "Incomplete";
  };

  // Get color based on completion
  const getStatusColor = () => {
    if (completionPercentage === 100) return "text-green-600";
    if (completionPercentage >= 80) return "text-blue-600";
    if (completionPercentage >= 50) return "text-blue-500";
    if (completionPercentage >= 20) return "text-amber-500";
    return "text-red-500";
  };

  // Get progress bar color based on completion
  const getProgressColor = () => {
    if (completionPercentage === 100) return "bg-green-500";
    if (completionPercentage >= 80) return "bg-blue-600";
    if (completionPercentage >= 50) return "bg-blue-500";
    if (completionPercentage >= 20) return "bg-amber-500";
    return "bg-red-500";
  };

  const renderSectionStatus = (section: ProfileSection) => {
    if (section.isComplete) {
      return <Check className="h-5 w-5 text-green-500" />;
    }
    
    switch (section.priority) {
      case 1:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 2:
        return <Circle className="h-5 w-5 text-amber-500" />;
      default:
        return <CircleOff className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Profile Completion</p>
          <div className="flex items-center gap-2">
            {showPoints && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                <span>{earnedPoints}/{totalPointsPossible} points</span>
              </Badge>
            )}
            <p className={cn("text-sm font-semibold", getStatusColor())}>
              {completionPercentage}% - {getCompletionStatus()}
            </p>
          </div>
        </div>
        <div className="relative">
          <Progress 
            value={completionPercentage} 
            className="h-2 w-full bg-gray-100" 
            indicatorClassName={cn("transition-all", getProgressColor())}
          />
        </div>
      </div>

      {showDetails && (
        <div className="space-y-2 mt-4">
          {sections.map((section) => (
            <TooltipProvider key={section.id}>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer",
                      section.isComplete 
                        ? "bg-gray-50 hover:bg-gray-100" 
                        : section.priority === 1 
                          ? "bg-red-50 hover:bg-red-100"
                          : "bg-amber-50 hover:bg-amber-100"
                    )}
                  >
                    <div className="flex items-center">
                      {renderSectionStatus(section)}
                      <div className="ml-2">
                        <p className="text-sm font-medium">{section.name}</p>
                        <p className="text-xs text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {showPoints && section.points && (
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          section.isComplete ? "bg-green-50" : "bg-gray-50"
                        )}>
                          {section.points} pts
                        </Badge>
                      )}
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="p-2 max-w-xs">
                  <p className="text-sm">{section.tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionProgress;
