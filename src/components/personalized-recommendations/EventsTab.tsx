
import React from 'react';
import { Calendar } from 'lucide-react';
import EventItem from './EventItem';
import EmptyState from './EmptyState';
import SeeAllLink from './SeeAllLink';

interface RecommendedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  virtual: boolean;
  relevanceScore: number;
}

interface EventsTabProps {
  isLoading: boolean;
  events?: RecommendedEvent[];
}

const EventsTab: React.FC<EventsTabProps> = ({ isLoading, events }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-12 w-12" />}
        title="No event recommendations yet"
        description="Complete your profile to get relevant events"
        actionLink="/profile"
        actionText="Update Profile"
      />
    );
  }

  return (
    <>
      {events.map((event) => (
        <EventItem
          key={event.id}
          id={event.id}
          title={event.title}
          date={event.date}
          location={event.location}
          virtual={event.virtual}
          relevanceScore={event.relevanceScore}
        />
      ))}
      <SeeAllLink url="/events" text="See all events" />
    </>
  );
};

export default EventsTab;
