
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EventItemProps {
  id: string;
  title: string;
  date: string;
  location: string;
  virtual: boolean;
  relevanceScore: number;
}

const EventItem: React.FC<EventItemProps> = ({
  id,
  title,
  date,
  location,
  virtual,
  relevanceScore
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary/40 transition-colors">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(date).toLocaleDateString(undefined, { 
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
            {' · '}
            {new Date(date).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <div className="mt-1">
            <Badge variant={virtual ? "outline" : "secondary"}>
              {virtual ? "Virtual" : location}
            </Badge>
          </div>
        </div>
        <Badge className="bg-orange-100 text-orange-800 border-orange-200 h-fit">
          {relevanceScore}% Relevant
        </Badge>
      </div>
      <div className="flex justify-end mt-4">
        <Button asChild size="sm">
          <Link to={`/events/${id}`}>
            View Event
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EventItem;
