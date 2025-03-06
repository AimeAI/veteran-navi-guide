
export interface JobFairEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizerName: string;
  organizerId?: string;
  imageUrl?: string;
  registrationUrl?: string;
  virtual: boolean;
  attendees?: number;
  capacity?: number;
  tags?: string[];
  status: 'upcoming' | 'ongoing' | 'past';
}

export interface EventRegistration {
  eventId: string;
  userId: string;
  registrationDate: string;
  status: 'registered' | 'waitlisted' | 'cancelled';
  attended?: boolean;
}
