import { motion } from 'framer-motion';
import { Play, Eye, Heart } from 'lucide-react';
import event1 from '@/assets/event-1.jpg';
import event2 from '@/assets/event-2.jpg';
import event3 from '@/assets/event-3.jpg';

const GallerySection = () => {
  const pastEvents = [
    {
      id: 1,
      title: 'DIGITAL UNDERGROUND',
      date: '2024-08-15',
      venue: 'Metro Nightclub',
      attendees: 500,
      image: event1,
      views: '2.1K',
      likes: '450'
    },
    {
      id: 2,
      title: 'BASS DROP FESTIVAL',
      date: '2024-07-28',
      venue: 'Central Park Arena',
      attendees: 1200,
      image: event2,
      views: '5.8K',
      likes: '890'
    },
    {
      id: 3,
      title: 'NEON SUNRISE',
      date: '2024-07-12',
      venue: 'Skyline Rooftop',
      attendees: 300,
      image: event3,
      views: '1.9K',
      likes: '320'
    }
  ];

  return (
    <section id="gallery" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-bebas text-5xl md:text-7xl mb-6">
            <span className="text-text-white">PREVIOUS </span>
            <span className="neon-text-lg">EVENTS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-muted-gray max-w-2xl mx-auto">
            Relive the energy and atmosphere from our legendary events
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl">
                {/* Event Image */}
                <motion.img
                  src={event.image}
                  alt={`${event.title} - Continental Entertainments Event`}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-jet-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Play Button */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border border-primary flex items-center justify-center shadow-neon">
                    <Play className="w-6 h-6 text-primary ml-1" fill="currentColor" />
                  </div>
                </motion.div>
                
                {/* Event Stats */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="glass-card px-2 py-1 text-xs">
                    <Eye className="w-3 h-3 inline mr-1" />
                    {event.views}
                  </div>
                  <div className="glass-card px-2 py-1 text-xs">
                    <Heart className="w-3 h-3 inline mr-1 text-secondary" />
                    {event.likes}
                  </div>
                </div>
                
                {/* Date Badge */}
                <div className="absolute top-4 left-4">
                  <div className="glass-card px-3 py-1">
                    <span className="text-xs font-bebas text-primary">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                className="mt-6"
              >
                <h3 className="font-bebas text-2xl md:text-3xl mb-2 text-text-white group-hover:neon-text transition-all duration-300">
                  {event.title}
                </h3>
                
                <div className="flex justify-between items-center text-muted-gray">
                  <div>
                    <p className="font-inter text-sm">{event.venue}</p>
                    <p className="font-inter text-xs">{event.attendees} attendees</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bebas text-primary text-lg">SOLD OUT</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon"
          >
            VIEW FULL GALLERY
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;