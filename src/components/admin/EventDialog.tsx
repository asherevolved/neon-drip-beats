import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: 'upcoming' | 'past';
  banner_image_url?: string;
}

interface TicketType {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  available_quantity: number;
  enabled: boolean;
}

interface EventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EventDialog({ event, isOpen, onClose, onSaved }: EventDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    city: '',
  });
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        venue: event.venue,
        city: event.city,
      });
      fetchTicketTypes();
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        city: '',
      });
      setTicketTypes([]);
    }
  }, [event]);

  const fetchTicketTypes = async () => {
    if (!event) return;

    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at');

      if (error) throw error;
      setTicketTypes(data || []);
    } catch (error) {
      console.error('Error fetching ticket types:', error);
    }
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      {
        name: '',
        price: 0,
        quantity: 100,
        available_quantity: 100,
        enabled: true,
      },
    ]);
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: any) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    
    // Update available_quantity when quantity changes for new tickets
    if (field === 'quantity' && !updated[index].id) {
      updated[index].available_quantity = value;
    }
    
    setTicketTypes(updated);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let eventId = event?.id;

      if (event) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', event.id);

        if (error) throw error;
      } else {
        // Create new event
        const eventData = {
          ...formData,
          category: new Date(formData.date) < new Date() ? 'past' : 'upcoming'
        };
        
        const { data: newEvent, error } = await supabase
          .from('events')
          .insert(eventData)
          .select()
          .single();

        if (error) throw error;
        eventId = newEvent.id;
      }

      // Handle ticket types
      if (eventId) {
        // Delete removed ticket types
        if (event) {
          const existingIds = ticketTypes.filter(t => t.id).map(t => t.id);
          const { error: deleteError } = await supabase
            .from('ticket_types')
            .delete()
            .eq('event_id', eventId)
            .not('id', 'in', `(${existingIds.join(',')})`);

          if (deleteError) throw deleteError;
        }

        // Upsert ticket types
        for (const ticket of ticketTypes) {
          if (ticket.id) {
            // Update existing
            const { error } = await supabase
              .from('ticket_types')
              .update({
                name: ticket.name,
                price: ticket.price,
                quantity: ticket.quantity,
                enabled: ticket.enabled,
              })
              .eq('id', ticket.id);

            if (error) throw error;
          } else {
            // Create new
            const { error } = await supabase
              .from('ticket_types')
              .insert({
                event_id: eventId,
                name: ticket.name,
                price: ticket.price,
                quantity: ticket.quantity,
                available_quantity: ticket.available_quantity,
                enabled: ticket.enabled,
              });

            if (error) throw error;
          }
        }
      }

      toast({
        title: "Success",
        description: `Event ${event ? 'updated' : 'created'} successfully`,
      });

      onSaved();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${event ? 'update' : 'create'} event`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update event details and ticket types' : 'Create a new event with ticket options'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Ticket Types</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTicketType}
                className="border-primary/20 hover:bg-primary/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ticket Type
              </Button>
            </div>

            {ticketTypes.map((ticket, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-4 p-4 bg-background/50 rounded-lg border border-primary/10">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={ticket.name}
                    onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                    placeholder="e.g., Female Entry"
                    required
                  />
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ticket.price}
                    onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label>Total Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={ticket.quantity}
                    onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTicketType(index)}
                    className="border-destructive/20 hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {ticketTypes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No ticket types added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTicketType}
                  className="mt-2 border-primary/20 hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Ticket Type
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {event ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                event ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}