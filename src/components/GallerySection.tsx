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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;