
import React, { useState } from 'react';
import { JobFairEvent } from '@/types/event';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { parseISO, format } from 'date-fns';

interface AddToCalendarDialogProps {
  event: JobFairEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddToCalendarDialog: React.FC<AddToCalendarDialogProps> = ({
  event,
  open,
  onOpenChange,
}) => {
  if (!event) return null;

  const handleAddToGoogle = () => {
    if (!event) return;

    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.append('text', event.title);
    googleCalendarUrl.searchParams.append('dates', `${format(startDate, 'yyyyMMdd\'T\'HHmmss')}/${format(endDate, 'yyyyMMdd\'T\'HHmmss')}`);
    googleCalendarUrl.searchParams.append('details', event.description);
    googleCalendarUrl.searchParams.append('location', event.location);

    window.open(googleCalendarUrl.toString(), '_blank');
    
    toast.success('Event added to Google Calendar');
    onOpenChange(false);
  };

  const handleAddToOutlook = () => {
    if (!event) return;

    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    
    const outlookCalendarUrl = new URL('https://outlook.office.com/calendar/0/deeplink/compose');
    outlookCalendarUrl.searchParams.append('subject', event.title);
    outlookCalendarUrl.searchParams.append('startdt', event.startDate);
    outlookCalendarUrl.searchParams.append('enddt', event.endDate);
    outlookCalendarUrl.searchParams.append('body', event.description);
    outlookCalendarUrl.searchParams.append('location', event.location);

    window.open(outlookCalendarUrl.toString(), '_blank');
    
    toast.success('Event added to Outlook Calendar');
    onOpenChange(false);
  };
  
  const handleDownloadICS = () => {
    if (!event) return;

    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    
    // Create ICS content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VeteranJobBoard//NONSGML v1.0//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${event.id}@veteranjobboard.com`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      `DTSTART:${format(startDate, 'yyyyMMdd\'T\'HHmmss')}`,
      `DTEND:${format(endDate, 'yyyyMMdd\'T\'HHmmss')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    // Create and click a download link
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Calendar file downloaded');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            Choose a calendar service to add "{event.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-2 py-4">
          <Button 
            onClick={handleAddToGoogle}
            className="w-full justify-start text-left"
          >
            Google Calendar
          </Button>
          
          <Button 
            onClick={handleAddToOutlook}
            variant="outline"
            className="w-full justify-start text-left"
          >
            Outlook Calendar
          </Button>
          
          <Button 
            onClick={handleDownloadICS}
            variant="outline"
            className="w-full justify-start text-left"
          >
            Download ICS File (Apple Calendar, etc.)
          </Button>
        </div>
        
        <DialogFooter className="flex justify-end">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCalendarDialog;
