
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MentorshipMeeting } from '@/services/mentorshipService';
import { format, addDays } from 'date-fns';

interface MeetingSchedulerProps {
  onScheduleMeeting: (meeting: Omit<MentorshipMeeting, 'id' | 'connection_id' | 'created_at' | 'updated_at'>) => Promise<MentorshipMeeting | null>;
  isLoading?: boolean;
}

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  onScheduleMeeting,
  isLoading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('30');
  const [meetingLink, setMeetingLink] = useState('');
  
  const handleScheduleMeeting = async () => {
    if (!selectedDate || !meetingTitle || !meetingTime) return;
    
    // Combine date and time
    const [hours, minutes] = meetingTime.split(':').map(Number);
    const meetingDateTime = new Date(selectedDate);
    meetingDateTime.setHours(hours, minutes);
    
    const meetingData = {
      title: meetingTitle,
      description: meetingDescription,
      meeting_time: meetingDateTime.toISOString(),
      duration: parseInt(meetingDuration),
      meeting_link: meetingLink,
      status: 'scheduled' as const
    };
    
    await onScheduleMeeting(meetingData);
    
    // Reset form
    setMeetingTitle('');
    setMeetingDescription('');
    setMeetingTime('');
    setMeetingLink('');
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Meeting</CardTitle>
        <CardDescription>Plan your next mentorship session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="meetingTitle">Meeting Title</Label>
          <Input
            id="meetingTitle"
            placeholder="e.g., Career Planning Session"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="meetingDescription">Description (Optional)</Label>
          <Textarea
            id="meetingDescription"
            placeholder="What will you discuss in this meeting?"
            className="resize-none"
            value={meetingDescription}
            onChange={(e) => setMeetingDescription(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={{ before: new Date() }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="meetingTime">Time</Label>
            <Input
              id="meetingTime"
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="meetingDuration">Duration</Label>
            <Select
              value={meetingDuration}
              onValueChange={setMeetingDuration}
            >
              <SelectTrigger id="meetingDuration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
          <Input
            id="meetingLink"
            placeholder="e.g., Zoom or Google Meet link"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleScheduleMeeting}
          disabled={isLoading || !selectedDate || !meetingTitle || !meetingTime}
        >
          {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeetingScheduler;
