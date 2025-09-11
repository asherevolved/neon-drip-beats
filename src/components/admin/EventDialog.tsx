import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ImageUploader } from './ImageUploader';
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react';
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
  gallery_images?: string[];
}

interface TicketType {
  id?: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
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
    starts_at: '',
    venue: '',
    city: '',
    category: 'upcoming' as 'upcoming' | 'past',
  });
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [bannerImage, setBannerImage] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        starts_at: event.starts_at,
        venue: event.venue,
        city: event.city,
        category: event.category,
      });
      setBannerImage(event.banner_image_url || '');
      setGalleryImages(event.gallery_images || []);
      fetchTicketTypes();
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        starts_at: '',
        venue: '',
        city: '',
        category: 'upcoming',
      });
      setBannerImage('');
      setGalleryImages([]);
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
        capacity: 100,
        sold: 0,
        enabled: true,
      },
    ]);
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: any) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
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
            banner_image_url: bannerImage || null,
            gallery_images: galleryImages,
            updated_at: new Date().toISOString(),
          })
          .eq('id', event.id);

        if (error) throw error;
      } else {
        // Create new event
        // Auto-set category based on date
        const eventDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const category: 'upcoming' | 'past' = eventDate >= today ? 'upcoming' : 'past';
        
        const eventData = {
          ...formData,
          category,
          banner_image_url: bannerImage || null,
          gallery_images: galleryImages,
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
                capacity: ticket.capacity,
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
                capacity: ticket.capacity,
                sold: ticket.sold,
                enabled: ticket.enabled,
              });

            if (error) throw error;
          }
        }
      }

      toast({
        title: "Success",
        description: `Event saved to ${formData.category === 'upcoming' ? 'Upcoming' : 'Past'}`,
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
              <Label htmlFor="starts_at">Start Time</Label>
              <Input
                id="starts_at"
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
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

          <div>
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: 'upcoming' | 'past') => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose Upcoming or Past" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label>Banner Image</Label>
            {bannerImage && (
              <div className="mt-2">
                <img src={bannerImage} alt="Banner preview" className="w-full h-auto rounded-lg object-cover" />
              </div>
            )}
            <ImageUploader
              bucketName="event-images"
              allowMultiple={false}
              value={bannerImage}
              onChange={(value) => setBannerImage(value as string)}
              placeholder="Upload event banner image"
            />
          </div>

          {/* Gallery Images */}
          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <ImageUploader
              bucketName="event-images"
              allowMultiple={true}
              allowReorder={true}
              value={galleryImages}
              onChange={(value) => setGalleryImages(value as string[])}
              placeholder="Upload multiple gallery images"
            />
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
                    value={ticket.price || ''}
                    onChange={(e) => updateTicketType(index, 'price', e.target.value ? parseFloat(e.target.value) : 0)}
                    required
                  />
                </div>
                <div>
                  <Label>Total Capacity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={ticket.capacity || ''}
                    onChange={(e) => updateTicketType(index, 'capacity', e.target.value ? parseInt(e.target.value) : 0)}
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