
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, Users, Clock, ExternalLink } from 'lucide-react';
import { JobFairEvent } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: JobFairEvent;
  onRegister: (eventId: string) => void;
  onAddToCalendar: (event: JobFairEvent) => void;
  onViewDetails: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onRegister, 
  onAddToCalendar, 
  onViewDetails 
}) => {
  const startDate = parseISO(event.startDate);
  const endDate = parseISO(event.endDate);
  
  // Different background colors based on event type
  const cardBgColor = event.virtual
    ? 'bg-blue-50 dark:bg-blue-950/30'
    : 'bg-green-50 dark:bg-green-950/30';
  
  // Different badge colors based on event status
  const statusBadgeColor = {
    upcoming: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    ongoing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    past: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  };
  
  return (
    <Card className={cn("transition-all hover:shadow-md", cardBgColor)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge 
              variant="outline" 
              className={statusBadgeColor[event.status]}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
            {event.virtual && (
              <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                Virtual
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-xl mt-2">{event.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(startDate, 'EEE, MMM d, yyyy')}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}</span>
          </div>
          
          {event.attendees && event.capacity && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.attendees} / {event.capacity} registered</span>
            </div>
          )}
          
          <p className="line-clamp-3 text-sm text-muted-foreground mt-2">
            {event.description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          variant="default" 
          className="w-full sm:w-auto"
          disabled={event.status === 'past'}
          onClick={() => onRegister(event.id)}
        >
          Register
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={() => onViewDetails(event.id)}
        >
          View Details
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full sm:w-auto"
          onClick={() => onAddToCalendar(event)}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
