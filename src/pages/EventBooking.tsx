import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TicketSelector } from '@/components/booking/TicketSelector';
import { CheckoutForm } from '@/components/booking/CheckoutForm';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { formatINR } from '@/lib/formatCurrency';

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
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  enabled: boolean;
}

interface SelectedTicket {
  ticketTypeId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function EventBooking() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'checkout'>('select');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData as Event);

      // Fetch ticket types
      const { data: ticketData, error: ticketError } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', eventId)
        .eq('enabled', true)
        .order('price');

      if (ticketError) throw ticketError;
      setTicketTypes(ticketData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return selectedTickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const getTotalQuantity = () => {
    return selectedTickets.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  const handleBuyTickets = () => {
    if (selectedTickets.length === 0) return;
    
    const items = selectedTickets.map(ticket => ({
      tierId: ticket.ticketTypeId,
      name: ticket.name,
      price: ticket.price,
      qty: ticket.quantity
    }));

    navigate(`/checkout?eventId=${eventId}&eventTitle=${encodeURIComponent(event?.title || '')}&items=${encodeURIComponent(JSON.stringify(items))}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return <Navigate to="/" replace />;
  }

  // Don't allow booking for past events
  if (event.category === 'past') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md text-center bg-card/90 backdrop-blur-sm border-primary/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-2">Event Has Ended</h2>
            <p className="text-muted-foreground mb-4">
              Booking is no longer available for this event.
            </p>
            <Link to="/">
              <Button>Back to Events</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/10" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-primary/20 text-primary">
                      {event.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'PPP')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(event.starts_at), 'p')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-sm text-muted-foreground">
                          {event.venue}, {event.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ticket Selection or Checkout Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8"
            >
              <TicketSelector
                ticketTypes={ticketTypes}
                selectedTickets={selectedTickets}
                onTicketChange={setSelectedTickets}
                onContinue={handleBuyTickets}
              />
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-8"
            >
              <Card className="bg-card/90 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTickets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No tickets selected
                    </p>
                  ) : (
                    <>
                      {selectedTickets.map((ticket) => (
                        <div key={ticket.ticketTypeId} className="flex justify-between">
                          <div>
                            <p className="font-medium">{ticket.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatINR(ticket.price)} × {ticket.quantity}
                            </p>
                          </div>
                          <p className="font-medium">{formatINR(ticket.price * ticket.quantity)}</p>
                        </div>
                      ))}
                      
                      <div className="border-t border-primary/20 pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Total</p>
                            <p className="text-sm text-muted-foreground">
                              {getTotalQuantity()} ticket{getTotalQuantity() !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-primary">
                            {formatINR(getTotalAmount())}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}