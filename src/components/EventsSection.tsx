import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
interface Event {
  id: string;
  title: string;
  date: string;
  starts_at: string;
  venue: string;
  city: string;
  category: 'upcoming' | 'past';
  banner_image_url?: string;
}
interface TicketType {
  id: string;
  price: number;
}
const EventsSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUpcomingEvents();
  }, []);
  const fetchUpcomingEvents = async () => {
    try {
      const {
        data: events,
        error
      } = await supabase.from('events').select(`
          *,
          ticket_types (
            id,
            price
          )
        `).eq('category', 'upcoming').order('date', {
        ascending: true
      }).limit(6);
      if (error) throw error;
      console.log('Fetched upcoming events:', events);
      
      // Debug: Log each event's banner_image_url specifically
      events?.forEach((event, index) => {
        console.log(`Event ${index + 1} (${event.title}):`, {
          id: event.id,
          banner_image_url: event.banner_image_url,
          has_banner: !!event.banner_image_url,
          gallery_images: event.gallery_images
        });
      });
      
      setUpcomingEvents(events as any[] || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription to refresh events when they change
  useEffect(() => {
    const subscription = supabase.channel('events-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'events'
    }, () => {
      console.log('Event data changed, refetching...');
      fetchUpcomingEvents();
    }).subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const getStatusBadge = (status: string) => {
    const badges = {
      'tickets-available': {
        text: 'TICKETS AVAILABLE',
        color: 'border-primary text-primary'
      },
      'selling-fast': {
        text: 'SELLING FAST',
        color: 'border-secondary text-secondary animate-pulse'
      },
      'vip-only': {
        text: 'VIP ONLY',
        color: 'border-muted-gray text-muted-gray'
      }
    };
    return badges[status as keyof typeof badges];
  };
  const navigate = useNavigate();
  const handleBuy = (id: string) => {
    navigate(`/book/${id}`);
  };
  const getLowestPrice = (ticketTypes: TicketType[]) => {
    if (!ticketTypes || ticketTypes.length === 0) return '₹0';
    const lowest = Math.min(...ticketTypes.map(t => t.price));
    return `₹${lowest}`;
  };
  if (loading) {
    return <section id="events" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>;
  }
  return <section id="events" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <h2 className="font-bebas text-5xl md:text-7xl mb-6">
            <span className="text-text-white">UPCOMING </span>
            <span className="neon-text-lg">EVENTS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-muted-gray max-w-2xl mx-auto">
            Experience the future of electronic music at our exclusive events
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => <motion.div key={event.id} initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: index * 0.2
        }} whileHover={{
          y: -10,
          scale: 1.02
        }} className="glass-card p-6 group cursor-pointer">
              {/* Event Banner Image */}
              {event.banner_image_url ? (
                <div className="w-full mb-6 overflow-hidden rounded-lg bg-gray-800" style={{ aspectRatio: '23/10' }}>
                  <img
                    src={event.banner_image_url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Failed to load image:', event.banner_image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', event.banner_image_url);
                    }}
                  />
                </div>
              ) : (
                <div className="w-full mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center" style={{ aspectRatio: '23/10' }}>
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bebas border border-primary text-primary">
                  TICKETS AVAILABLE
                </span>
                <span className="text-2xl font-bebas neon-text">
                  {getLowestPrice((event as any).ticket_types)}
                </span>
              </div>

              {/* Event Title */}
              <h3 className="font-bebas text-2xl md:text-3xl mb-4 text-text-white group-hover:neon-text transition-all duration-300">
                {event.title}
              </h3>

              {/* Event Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-muted-gray">
                  <Calendar className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-inter">
                    {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center text-muted-gray">
                  <Clock className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-inter">{format(new Date(event.starts_at), 'p')}</span>
                </div>
                
                <div className="flex items-center text-muted-gray">
                  <MapPin className="w-4 h-4 mr-3 text-primary" />
                  <div className="font-inter">
                    <div>{event.venue}</div>
                    <div className="text-sm">{event.city}</div>
                  </div>
                </div>
              </div>

              {/* Buy Tickets Button */}
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="w-full btn-neon group-hover:shadow-neon-lg transition-all duration-300" onClick={() => handleBuy(event.id)}>
                BUY TICKETS
              </motion.button>
            </motion.div>)}
        </div>

        {upcomingEvents.length === 0 && <div className="text-center text-muted-gray">
            <p>No upcoming events at the moment.</p>
          </div>}

        {/* All Events Link */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.8
      }} className="text-center mt-12">
          
        </motion.div>
      </div>
    </section>;
};
export default EventsSection;