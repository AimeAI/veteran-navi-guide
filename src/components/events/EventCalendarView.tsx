
import React, { useState } from 'react';
import { format, parseISO, getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { JobFairEvent } from '@/types/event';
import { cn } from '@/lib/utils';

interface EventCalendarViewProps {
  events: JobFairEvent[];
  onSelectDate: (date: Date, events: JobFairEvent[]) => void;
}

const EventCalendarView: React.FC<EventCalendarViewProps> = ({ events, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = parseISO(event.startDate).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, JobFairEvent[]>);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(getYear(currentDate), getMonth(currentDate) - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(getYear(currentDate), getMonth(currentDate) + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    
    // Find events for the selected date
    const dateString = date.toISOString().split('T')[0];
    const eventsForDate = eventsByDate[dateString] || [];
    
    onSelectDate(date, eventsForDate);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, i) => {
          const dateString = day.toISOString().split('T')[0];
          const hasEvents = eventsByDate[dateString] && eventsByDate[dateString].length > 0;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <Button
              key={i}
              variant="ghost"
              className={cn(
                "h-12 p-0 relative",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                hasEvents && !isSelected && "border-2 border-primary/50"
              )}
              onClick={() => handleDateClick(day)}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              {hasEvents && !isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex">
                  {[...Array(Math.min(eventsByDate[dateString].length, 3))].map((_, index) => (
                    <div 
                      key={index} 
                      className="w-1 h-1 rounded-full bg-primary mx-0.5"
                    />
                  ))}
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default EventCalendarView;
