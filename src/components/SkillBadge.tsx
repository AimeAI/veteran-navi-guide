
import React from 'react';
import { Trophy, Award, Star, BookOpen, Lightbulb, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  type?: 'technical' | 'soft' | 'military' | 'leadership' | 'certification';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tooltipText?: string;
  className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  type = 'technical',
  level = 'intermediate',
  tooltipText,
  className
}) => {
  // Get badge color based on type
  const getBadgeColor = () => {
    switch (type) {
      case 'technical': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'soft': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'military': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'leadership': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'certification': return 'bg-pink-100 text-pink-800 hover:bg-pink-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'technical': return <Lightbulb className="h-3.5 w-3.5 mr-1" />;
      case 'soft': return <Star className="h-3.5 w-3.5 mr-1" />;
      case 'military': return <Trophy className="h-3.5 w-3.5 mr-1" />;
      case 'leadership': return <Award className="h-3.5 w-3.5 mr-1" />;
      case 'certification': return <BookOpen className="h-3.5 w-3.5 mr-1" />;
      default: return <Briefcase className="h-3.5 w-3.5 mr-1" />;
    }
  };

  // Get level indicator
  const getLevelIndicator = () => {
    switch (level) {
      case 'beginner': return '•';
      case 'intermediate': return '••';
      case 'advanced': return '•••';
      case 'expert': return '••••';
      default: return '';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              "flex items-center py-1 font-normal transition-colors",
              getBadgeColor(),
              className
            )}
          >
            {getIcon()}
            <span>{skill}</span>
            {level && (
              <span className="ml-1.5 text-xs opacity-70">{getLevelIndicator()}</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-sm max-w-xs">
          <p>{tooltipText || `${level.charAt(0).toUpperCase() + level.slice(1)} level ${type} skill`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SkillBadge;
