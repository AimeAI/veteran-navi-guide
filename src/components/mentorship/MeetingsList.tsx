import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MentorshipMeeting } from '@/services/mentorship/types';
import { format, isBefore, isToday } from 'date-fns';

interface MeetingsListProps {
  meetings: MentorshipMeeting[];
  onCompleteMeeting: (meetingId: string) => void;
  onCancelMeeting: (meetingId: string) => void;
  isLoading?: boolean;
}

const MeetingsList: React.FC<MeetingsListProps> = ({
  meetings,
  onCompleteMeeting,
  onCancelMeeting,
  isLoading = false,
}) => {
  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled' && !isBefore(new Date(m.meeting_time), new Date()));
  const pastMeetings = meetings.filter(m => m.status === 'completed' || isBefore(new Date(m.meeting_time), new Date()));
  
  const formatMeetingTime = (meeting: MentorshipMeeting) => {
    const meetingDate = new Date(meeting.meeting_time);
    const dateStr = isToday(meetingDate) ? 'Today' : format(meetingDate, 'MMM d, yyyy');
    const timeStr = format(meetingDate, 'h:mm a');
    return `${dateStr} at ${timeStr}`;
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };
  
  const getStatusBadge = (meeting: MentorshipMeeting) => {
    if (meeting.status === 'completed') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Completed</Badge>;
    }
    
    if (meeting.status === 'cancelled') {
      return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Cancelled</Badge>;
    }
    
    const meetingDate = new Date(meeting.meeting_time);
    if (isBefore(meetingDate, new Date())) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Missed</Badge>;
    }
    
    if (isToday(meetingDate)) {
      return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Today</Badge>;
    }
    
    return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">Upcoming</Badge>;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Scheduled Meetings</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse flex flex-col space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No meetings scheduled</p>
            <p className="text-sm text-gray-400 mt-1">Use the form to schedule a meeting</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-6">
              {upcomingMeetings.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Upcoming</h3>
                  <div className="space-y-4">
                    {upcomingMeetings.map(meeting => (
                      <div key={meeting.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">{meeting.title}</h4>
                          {getStatusBadge(meeting)}
                        </div>
                        
                        {meeting.description && (
                          <p className="text-sm text-gray-600 mt-1">{meeting.description}</p>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatMeetingTime(meeting)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDuration(meeting.duration)}</span>
                        </div>
                        
                        {meeting.meeting_link && (
                          <div className="mt-3">
                            <a
                              href={meeting.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => onCancelMeeting(meeting.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => onCompleteMeeting(meeting.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {pastMeetings.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Past Meetings</h3>
                  <div className="space-y-3">
                    {pastMeetings.map(meeting => (
                      <div key={meeting.id} className="border rounded-md p-3 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{meeting.title}</h4>
                          {getStatusBadge(meeting)}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatMeetingTime(meeting)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingsList;
