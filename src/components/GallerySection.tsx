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
              className="group relative overflow-hidden rounded-lg bg-dark-gray/20 border border-primary/20 hover:border-primary/40 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bebas text-xl text-text-white mb-2">{event.title}</h3>
                <p className="text-muted-gray text-sm mb-2">{event.venue}</p>
                <p className="text-muted-gray text-sm mb-4">{new Date(event.date).toLocaleDateString()}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-gray">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{event.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{event.likes}</span>
                    </span>
                  </div>
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 flex items-center justify-center hover:bg-primary/30 transition-colors">
                  <Play className="w-6 h-6 text-primary fill-current" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default GallerySection;