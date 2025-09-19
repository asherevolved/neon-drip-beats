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
  return;
};
export default GallerySection;