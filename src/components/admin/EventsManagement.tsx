
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash, Calendar, MapPin, Search, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { JobFairEvent } from '@/types/event';

const mockEvents: JobFairEvent[] = [
  {
    id: '1',
    title: 'Virtual Military Career Fair',
    description: 'Connect with employers specifically looking to hire veterans with your skills.',
    startDate: '2023-11-15T09:00:00',
    endDate: '2023-11-15T17:00:00',
    location: 'Online',
    organizerName: 'Veterans Job Network',
    virtual: true,
    attendees: 120,
    capacity: 200,
    tags: ['IT', 'Healthcare', 'Engineering'],
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'San Diego Veterans Job Expo',
    description: 'In-person job fair with over 50 employers ready to hire veterans.',
    startDate: '2023-12-05T10:00:00',
    endDate: '2023-12-05T15:00:00',
    location: 'San Diego Convention Center, Hall B, 111 W Harbor Dr, San Diego, CA',
    organizerName: 'Veterans Connect',
    organizerId: 'org2',
    imageUrl: '/events/sd-job-expo.jpg',
    registrationUrl: 'https://eventregistration.com/sd-veteran-expo',
    virtual: false,
    attendees: 85,
    capacity: 250,
    tags: ['All Industries', 'Entry Level', 'Management'],
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Federal Employment Workshop',
    description: 'Learn how to navigate the federal employment process and apply for government jobs.',
    startDate: '2023-10-25T13:00:00',
    endDate: '2023-10-25T16:00:00',
    location: 'Online - Zoom Webinar',
    organizerName: 'Federal Veterans Outreach',
    organizerId: 'org3',
    registrationUrl: 'https://zoom.us/register/fedvets-workshop',
    virtual: true,
    attendees: 65,
    capacity: 100,
    tags: ['Federal Jobs', 'Workshop', 'Resume Building'],
    status: 'past'
  }
];

const EventsManagement = () => {
  const [events, setEvents] = useState<JobFairEvent[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentEvent, setCurrentEvent] = useState<JobFairEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewEvent = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setCurrentEvent({
      id: Date.now().toString(),
      title: '',
      description: '',
      startDate: tomorrow.toISOString().split('.')[0],
      endDate: tomorrow.toISOString().split('.')[0],
      location: '',
      organizerName: '',
      virtual: false,
      attendees: 0,
      capacity: 100,
      tags: [],
      status: 'upcoming'
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditEvent = (event: JobFairEvent) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      toast.success('Event deleted successfully');
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;

    // Determine status based on date
    const now = new Date();
    const startDate = new Date(currentEvent.startDate);
    const endDate = new Date(currentEvent.endDate);
    
    let status: 'upcoming' | 'ongoing' | 'past' = 'upcoming';
    
    if (endDate < now) {
      status = 'past';
    } else if (startDate <= now && endDate >= now) {
      status = 'ongoing';
    }

    const updatedEvent = {
      ...currentEvent,
      status
    };

    if (isEditing) {
      setEvents(prevEvents => 
        prevEvents.map(event => event.id === currentEvent.id ? updatedEvent : event)
      );
      toast.success('Event updated successfully');
    } else {
      setEvents(prevEvents => [...prevEvents, updatedEvent]);
      toast.success('Event created successfully');
    }
    
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Events</h2>
        <Button onClick={handleNewEvent}>
          <Plus className="mr-2 h-4 w-4" /> New Event
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-gray-500">Create your first event to get started</p>
          <Button onClick={handleNewEvent} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
                    <CardDescription className="text-sm">
                      Organized by {event.organizerName}
                    </CardDescription>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                    event.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} {' '}
                      {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.virtual ? 'Virtual Event' : event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.attendees || 0} / {event.capacity || 'Unlimited'} Registered</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags?.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEvent} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Event Title</label>
              <Input
                id="title"
                value={currentEvent?.title || ''}
                onChange={(e) => setCurrentEvent(prev => prev ? {...prev, title: e.target.value} : null)}
                required
              />
            </div>
            <div>
              <label htmlFor="organizer" className="block text-sm font-medium mb-1">Organizer</label>
              <Input
                id="organizer"
                value={currentEvent?.organizerName || ''}
                onChange={(e) => setCurrentEvent(prev => prev ? {...prev, organizerName: e.target.value} : null)}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                id="description"
                value={currentEvent?.description || ''}
                onChange={(e) => setCurrentEvent(prev => prev ? {...prev, description: e.target.value} : null)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date & Time</label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={currentEvent?.startDate?.toString().split('.')[0] || ''}
                  onChange={(e) => setCurrentEvent(prev => prev ? {...prev, startDate: e.target.value} : null)}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date & Time</label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={currentEvent?.endDate?.toString().split('.')[0] || ''}
                  onChange={(e) => setCurrentEvent(prev => prev ? {...prev, endDate: e.target.value} : null)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="isVirtual" className="flex items-center text-sm font-medium mb-1">
                  <input
                    id="isVirtual"
                    type="checkbox"
                    checked={currentEvent?.virtual || false}
                    onChange={(e) => setCurrentEvent(prev => prev ? {...prev, virtual: e.target.checked} : null)}
                    className="mr-2 rounded border-gray-300"
                  />
                  Virtual Event
                </label>
              </div>
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium mb-1">Capacity (0 for unlimited)</label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={currentEvent?.capacity || 0}
                  onChange={(e) => setCurrentEvent(prev => prev ? {...prev, capacity: parseInt(e.target.value)} : null)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                {currentEvent?.virtual ? 'Virtual Meeting Link' : 'Location'}
              </label>
              <Input
                id="location"
                value={currentEvent?.location || ''}
                onChange={(e) => setCurrentEvent(prev => prev ? {...prev, location: e.target.value} : null)}
                placeholder={currentEvent?.virtual ? 'https://zoom.us/j/123456789' : 'Venue name and address'}
                required
              />
            </div>
            
            <div>
              <label htmlFor="registrationUrl" className="block text-sm font-medium mb-1">Registration URL (optional)</label>
              <Input
                id="registrationUrl"
                type="url"
                value={currentEvent?.registrationUrl || ''}
                onChange={(e) => setCurrentEvent(prev => prev ? {...prev, registrationUrl: e.target.value} : null)}
                placeholder="https://example.com/register"
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <Input
                id="tags"
                value={currentEvent?.tags?.join(', ') || ''}
                onChange={(e) => {
                  const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                  setCurrentEvent(prev => prev ? {...prev, tags: tagsArray} : null);
                }}
                placeholder="Job Fair, Tech, Healthcare, etc."
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManagement;
