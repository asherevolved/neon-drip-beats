import { motion } from 'framer-motion';
import { Play, Eye, Heart } from 'lucide-react';
import event1 from '@/assets/event-1.jpg';
import event2 from '@/assets/event-2.jpg';
import event3 from '@/assets/event-3.jpg';
const GallerySection = () => {
  const pastEvents = [{
    id: 1,
    title: 'DIGITAL UNDERGROUND',
    date: '2024-08-15',
    venue: 'Metro Nightclub',
    attendees: 500,
    image: event1,
    views: '2.1K',
    likes: '450'
  }, {
    id: 2,
    title: 'BASS DROP FESTIVAL',
    date: '2024-07-28',
    venue: 'Central Park Arena',
    attendees: 1200,
    image: event2,
    views: '5.8K',
    likes: '890'
  }, {
    id: 3,
    title: 'NEON SUNRISE',
    date: '2024-07-12',
    venue: 'Skyline Rooftop',
    attendees: 300,
    image: event3,
    views: '1.9K',
    likes: '320'
  }];
  return (
    <section id="gallery" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-bebas text-5xl md:text-7xl mb-6">
            <span className="text-text-white">PAST </span>
            <span className="neon-text-lg">EVENTS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg bg-surface-dark/30 backdrop-blur-sm border border-surface-light/10"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-transparent to-transparent opacity-60"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bebas text-xl text-text-white mb-2">{event.title}</h3>
                <p className="text-muted-gray text-sm mb-2">{event.venue}</p>
                <p className="text-muted-gray text-sm mb-4">{new Date(event.date).toLocaleDateString()}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-gray">
                  <span>{event.attendees} attendees</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{event.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{event.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default GallerySection;