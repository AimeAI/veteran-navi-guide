
import React from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { JobFairEvent } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface EventDetailsProps {
  event: JobFairEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (eventId: string) => void;
  onAddToCalendar: (event: JobFairEvent) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  open,
  onOpenChange,
  onRegister,
  onAddToCalendar,
}) => {
  if (!event) return null;

  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 mt-2">
            <Badge 
              variant="outline" 
              className={
                event.status === 'upcoming' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : event.status === 'ongoing'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
            {event.virtual ? (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Virtual
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                In-Person
              </Badge>
            )}
            {event.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}</span>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {event.attendees && event.capacity
                  ? `${event.attendees} / ${event.capacity} registered`
                  : 'Registration details not available'}
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Organized by:</h3>
            <p>{event.organizerName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Description:</h3>
            <p className="text-sm whitespace-pre-line">{event.description}</p>
          </div>
        </div>
        
        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={() => onRegister(event.id)}
            disabled={event.status === 'past'}
          >
            Register Now
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onAddToCalendar(event)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
          
          {event.registrationUrl && (
            <Button 
              variant="outline" 
              asChild
            >
              <a 
                href={event.registrationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                External Link
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
