import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const EventsSection = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'NEON NIGHTS',
      date: '2024-09-15',
      time: '10:00 PM',
      venue: 'Underground Club',
      location: 'Downtown District',
      attendees: 250,
  price: '₹35',
      status: 'tickets-available'
    },
    {
      id: 2,
      title: 'CYBER BEATS',
      date: '2024-09-28',
      time: '9:00 PM',
      venue: 'Warehouse 21',
      location: 'Industrial Zone',
      attendees: 400,
  price: '₹45',
      status: 'selling-fast'
    },
    {
      id: 3,
      title: 'LIQUID DREAMS',
      date: '2024-10-12',
      time: '11:00 PM',
      venue: 'Rooftop Lounge',
      location: 'City Center',
      attendees: 180,
  price: '₹50',
      status: 'vip-only'
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      'tickets-available': { text: 'TICKETS AVAILABLE', color: 'border-primary text-primary' },
      'selling-fast': { text: 'SELLING FAST', color: 'border-secondary text-secondary animate-pulse' },
      'vip-only': { text: 'VIP ONLY', color: 'border-muted-gray text-muted-gray' }
    };
    return badges[status as keyof typeof badges];
  };

  const navigate = useNavigate();

  const handleBuy = (id: number) => {
    navigate(`/book/${id}`);
  };

  return (
    <section id="events" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
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
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-6 group cursor-pointer"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bebas border ${getStatusBadge(event.status).color}`}>
                  {getStatusBadge(event.status).text}
                </span>
                <span className="text-2xl font-bebas neon-text">
                  {event.price}
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
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center text-muted-gray">
                  <Clock className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-inter">{event.time}</span>
                </div>
                
                <div className="flex items-center text-muted-gray">
                  <MapPin className="w-4 h-4 mr-3 text-primary" />
                  <div className="font-inter">
                    <div>{event.venue}</div>
                    <div className="text-sm">{event.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-gray">
                  <Users className="w-4 h-4 mr-3 text-primary" />
                  <span className="font-inter">{event.attendees} attending</span>
                </div>
              </div>

              {/* Buy Tickets Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full btn-neon group-hover:shadow-neon-lg transition-all duration-300"
                disabled={event.status === 'vip-only'}
                onClick={() => event.status !== 'vip-only' && handleBuy(event.id)}
              >
                {event.status === 'vip-only' ? 'VIP ACCESS ONLY' : 'BUY TICKETS'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* All Events Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-red"
            onClick={() => navigate('/events')}
          >
            VIEW ALL EVENTS
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;