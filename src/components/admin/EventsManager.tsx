import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventDialog } from './EventDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { Plus, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  starts_at: string;
  venue: string;
  city: string;
  category: 'upcoming' | 'past';
  banner_image_url?: string;
  created_at: string;
}

export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setEvents((data || []) as Event[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [deleteEvent, setDeleteEvent] = useState<Event | null>(null);

  const handleDeleteEvent = async () => {
    if (!deleteEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', deleteEvent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const handleEventSaved = () => {
    fetchEvents();
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.category === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">Manage your events and tickets</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEvent(null);
            setIsDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({events.length})
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('upcoming')}
        >
          Upcoming ({events.filter(e => e.category === 'upcoming').length})
        </Button>
        <Button
          variant={filter === 'past' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('past')}
        >
          Past ({events.filter(e => e.category === 'past').length})
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="bg-card/50 border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </div>
                <Badge 
                  variant={event.category === 'upcoming' ? 'default' : 'secondary'}
                  className={event.category === 'upcoming' ? 'bg-primary/20 text-primary' : ''}
                >
                  {event.category === 'upcoming' ? 'Upcoming' : 'Past'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(event.date), 'PPP')} at {format(new Date(event.starts_at), 'p')}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {event.venue}, {event.city}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsDialogOpen(true);
                  }}
                  className="flex-1 border-primary/20 hover:bg-primary/10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteEvent(event)}
                  className="border-destructive/20 hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && events.length > 0 && (
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No {filter} events</h3>
            <p className="text-muted-foreground text-center mb-4">
              Try selecting a different filter or create a new event
            </p>
          </CardContent>
        </Card>
      )}

      {events.length === 0 && (
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first event to get started with bookings
            </p>
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Event
            </Button>
          </CardContent>
        </Card>
      )}

      <EventDialog
        event={selectedEvent}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedEvent(null);
        }}
        onSaved={handleEventSaved}
      />

      <ConfirmDialog
        isOpen={!!deleteEvent}
        onClose={() => setDeleteEvent(null)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        description="This will remove the event from listings. Continue?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}