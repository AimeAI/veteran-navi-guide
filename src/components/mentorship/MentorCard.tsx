
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Award, Briefcase, Users } from 'lucide-react';
import { MentorshipProfile } from '@/services/mentorship/types';

interface MentorCardProps {
  mentor: MentorshipProfile;
  onRequestMentorship: (mentorId: string) => void;
  isRequested?: boolean;
  disabled?: boolean;
}

const MentorCard: React.FC<MentorCardProps> = ({ 
  mentor, 
  onRequestMentorship, 
  isRequested = false,
  disabled = false
}) => {
  const handleRequestClick = () => {
    if (!disabled && !isRequested) {
      onRequestMentorship(mentor.id);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'MR';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = mentor.user_name || mentor.full_name || 'Mentor';
  const displayAvatar = mentor.user_avatar || mentor.avatar_url;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{displayName}</CardTitle>
            <CardDescription>{mentor.industry || 'Veteran Mentor'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {mentor.mentor_bio && (
            <p className="text-sm text-gray-600 line-clamp-3">{mentor.mentor_bio}</p>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {mentor.mentoring_topics?.map((topic, i) => (
              <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {topic}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            {mentor.years_experience && (
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1 text-primary" />
                <span>{mentor.years_experience} years exp.</span>
              </div>
            )}
            {mentor.military_branch && (
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1 text-primary" />
                <span>{mentor.military_branch}</span>
              </div>
            )}
            {mentor.availability && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                <span>{mentor.availability}</span>
              </div>
            )}
            {mentor.max_mentees && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-primary" />
                <span>Max {mentor.max_mentees} mentees</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRequestClick} 
          className="w-full"
          disabled={disabled || isRequested}
          variant={isRequested ? "outline" : "default"}
        >
          {isRequested ? 'Request Sent' : 'Request Mentorship'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
