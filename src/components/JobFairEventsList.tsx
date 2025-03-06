
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, List, LayoutGrid, Filter } from 'lucide-react';
import { JobFairEvent } from '@/types/event';
import { fetchEvents } from '@/data/events';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/events/EventCard';
import EventCalendarView from '@/components/events/EventCalendarView';
import EventDetails from '@/components/events/EventDetails';
import AddToCalendarDialog from '@/components/events/AddToCalendarDialog';
import EventRegistrationDialog from '@/components/events/EventRegistrationDialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

const JobFairEventsList: React.FC = () => {
  // Query for fetching events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  // Filter and view state
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<JobFairEvent[]>([]);
  
  // Dialog states
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<JobFairEvent | null>(null);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  
  // Filter events based on current filter settings
  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    
    switch (filter) {
      case 'upcoming':
        return events.filter(event => event.status === 'upcoming' || event.status === 'ongoing');
      case 'past':
        return events.filter(event => event.status === 'past');
      default:
        return events;
    }
  }, [events, filter]);
  
  // Handle event registration
  const handleRegister = (eventId: string) => {
    const event = events?.find(e => e.id === eventId) || null;
    setSelectedEvent(event);
    setRegistrationDialogOpen(true);
  };
  
  // Handle adding event to calendar
  const handleAddToCalendar = (event: JobFairEvent) => {
    setSelectedEvent(event);
    setCalendarDialogOpen(true);
  };
  
  // Handle view event details
  const handleViewDetails = (eventId: string) => {
    const event = events?.find(e => e.id === eventId) || null;
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };
  
  // Handle selecting a date in calendar view
  const handleSelectDate = (date: Date, eventsForDate: JobFairEvent[]) => {
    setSelectedDate(date);
    setSelectedDateEvents(eventsForDate);
    
    if (eventsForDate.length > 0) {
      toast(`${eventsForDate.length} event${eventsForDate.length > 1 ? 's' : ''} on this date`);
    } else {
      toast('No events on this date');
    }
  };
  
  // If loading, show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <LoadingSpinner size="lg" text="Loading events..." />
      </div>
    );
  }
  
  // If there's an error, show error message
  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-md p-4 my-4 text-center">
        <h3 className="text-red-800 font-medium">Unable to load events</h3>
        <p className="text-red-600 mt-1">Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Job Fairs & Events</h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
            size="sm"
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            onClick={() => setFilter('past')}
            size="sm"
          >
            Past
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All
          </Button>
        </div>
        
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            aria-label="Calendar view"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={handleRegister}
                onAddToCalendar={handleAddToCalendar}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <EventCalendarView 
              events={events || []} 
              onSelectDate={handleSelectDate} 
            />
          </div>
          <div className="md:col-span-2">
            {selectedDate ? (
              <div>
                <h3 className="font-medium mb-4">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateEvents.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onRegister={handleRegister}
                        onAddToCalendar={handleAddToCalendar}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">No events scheduled for this date.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-6 text-center h-full flex items-center justify-center">
                <p className="text-muted-foreground">Select a date to view events.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Dialogs */}
      <EventDetails
        event={selectedEvent}
        open={eventDetailsOpen}
        onOpenChange={setEventDetailsOpen}
        onRegister={handleRegister}
        onAddToCalendar={handleAddToCalendar}
      />
      
      <AddToCalendarDialog
        event={selectedEvent}
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
      />
      
      <EventRegistrationDialog
        event={selectedEvent}
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
      />
    </div>
  );
};

export default JobFairEventsList;
