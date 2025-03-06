
import { JobFairEvent } from '../types/event';
import { addDays, format, isFuture, isPast, isToday } from 'date-fns';

// Helper to determine event status
const determineEventStatus = (startDate: string, endDate: string): 'upcoming' | 'ongoing' | 'past' => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  
  if (isPast(endDateObj)) return 'past';
  if (isFuture(startDateObj)) return 'upcoming';
  return 'ongoing';
};

// Generate mock events starting from today
const generateMockEvents = (): JobFairEvent[] => {
  const today = new Date();
  const events: JobFairEvent[] = [];
  
  // Virtual events
  for (let i = 0; i < 5; i++) {
    const startDate = addDays(today, i * 7); // One event per week
    const endDate = addDays(startDate, 1); // Each event lasts one day
    
    events.push({
      id: `event-v-${i}`,
      title: `Virtual Military Career Fair ${i + 1}`,
      description: `Join employers from across Canada for this virtual job fair specifically for veterans transitioning to civilian careers. Connect with employers who value your military experience.`,
      startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      location: 'Online',
      organizerName: 'VeteranJobBoard',
      virtual: true,
      attendees: Math.floor(Math.random() * 500) + 200,
      capacity: 1000,
      tags: ['Virtual', 'All Industries', 'Entry-Level', 'Mid-Level', 'Senior-Level'],
      status: determineEventStatus(
        format(startDate, "yyyy-MM-dd'T'HH:mm:ss"), 
        format(endDate, "yyyy-MM-dd'T'HH:mm:ss")
      ),
      registrationUrl: 'https://example.com/register'
    });
  }
  
  // In-person events
  const locations = [
    'Ottawa Convention Centre, Ottawa, ON',
    'Metro Toronto Convention Centre, Toronto, ON',
    'Vancouver Convention Centre, Vancouver, BC',
    'BMO Centre, Calgary, AB',
    'Halifax Convention Centre, Halifax, NS'
  ];
  
  for (let i = 0; i < 5; i++) {
    const startDate = addDays(today, i * 14 + 3); // Every two weeks, offset from virtual
    const endDate = addDays(startDate, 1); // Each event lasts one day
    
    events.push({
      id: `event-p-${i}`,
      title: `${locations[i].split(',')[1].trim()} Military to Civilian Career Expo`,
      description: `Meet face-to-face with employers seeking to hire veterans, transitioning military personnel, and military spouses. Bring your resume and be prepared for on-site interviews.`,
      startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      location: locations[i],
      organizerName: 'Military Transition Alliance',
      virtual: false,
      attendees: Math.floor(Math.random() * 200) + 100,
      capacity: 500,
      tags: ['In-Person', 'Multiple Industries', 'All Levels'],
      status: determineEventStatus(
        format(startDate, "yyyy-MM-dd'T'HH:mm:ss"), 
        format(endDate, "yyyy-MM-dd'T'HH:mm:ss")
      ),
      imageUrl: 'https://placehold.co/600x400?text=Career+Event',
      registrationUrl: 'https://example.com/register'
    });
  }
  
  // Add a few past events
  for (let i = 0; i < 3; i++) {
    const startDate = addDays(today, -((i + 1) * 14)); // Past events
    const endDate = addDays(startDate, 1);
    
    events.push({
      id: `event-past-${i}`,
      title: `Past Career Fair ${i + 1}`,
      description: 'This event has already taken place.',
      startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      location: i % 2 === 0 ? 'Online' : 'Various Locations, Canada',
      organizerName: 'VeteranJobBoard',
      virtual: i % 2 === 0,
      attendees: Math.floor(Math.random() * 300) + 100,
      capacity: 500,
      tags: ['Past Event'],
      status: 'past',
    });
  }
  
  return events;
};

export const mockEvents = generateMockEvents();

// Basic function to fetch events (simulating API call)
export const fetchEvents = async (): Promise<JobFairEvent[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockEvents;
};

// Filter events by status
export const getEventsByStatus = (status: 'upcoming' | 'ongoing' | 'past'): JobFairEvent[] => {
  return mockEvents.filter(event => event.status === status);
};

// Get event by ID
export const getEventById = (id: string): JobFairEvent | undefined => {
  return mockEvents.find(event => event.id === id);
};
