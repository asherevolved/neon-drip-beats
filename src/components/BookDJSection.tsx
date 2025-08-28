import { motion } from 'framer-motion';
import { useState } from 'react';
import { Music, Users, Calendar, Star, Zap, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookDJSection = () => {
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const { toast } = useToast();

  const packages = [
    {
      id: 'basic',
      name: 'BASIC BEATS',
      price: '₹500',
      duration: '4 Hours',
      features: [
        'Professional DJ Setup',
        'Basic Light Show',
        'Music for 100 guests',
        'Wireless Microphone',
        'Basic Sound System'
      ],
      color: 'border-muted-gray text-muted-gray'
    },
    {
      id: 'premium',
      name: 'NEON EXPERIENCE',
      price: '₹1,200',
      duration: '6 Hours',
      features: [
        'Premium DJ & MC Services',
        'Full Neon Light Show',
        'Music for 300 guests',
        'Fog Machine & Effects',
        'Premium Sound System',
        'Custom Playlist Creation',
        'Live Mixing Performance'
      ],
      color: 'border-primary text-primary',
      popular: true
    },
    {
      id: 'ultimate',
      name: 'LIQUID DREAMS',
      price: '₹2,500',
      duration: '8 Hours',
      features: [
        'Elite DJ & Production Team',
        'Full Cyberpunk Experience',
        'Music for 500+ guests',
        'Complete Visual Setup',
        'Professional Grade Equipment',
        'Custom Track Production',
        'Live Performance Art',
        'VIP Guest Experience'
      ],
      color: 'border-secondary text-secondary'
    }
  ];

  const handleBooking = (packageType: string) => {
    toast({
      title: "Booking Request Sent!",
      description: `We'll contact you soon about the ${packages.find(p => p.id === packageType)?.name} package.`,
    });
  };

  return (
    <section id="book" className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, hsl(var(--neon-lime) / 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, hsl(var(--blood-red) / 0.3) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-bebas text-5xl md:text-7xl mb-6">
            <span className="text-text-white">BOOK THE </span>
            <span className="neon-text-lg">DJ</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-muted-gray max-w-3xl mx-auto">
            Transform your event into an unforgettable cyberpunk experience with our premium DJ services
          </p>
        </motion.div>

        {/* Service Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: Music, text: 'PROFESSIONAL MIXING', color: 'text-primary' },
            { icon: Zap, text: 'LIVE ENERGY', color: 'text-secondary' },
            { icon: Award, text: '5+ YEARS EXPERIENCE', color: 'text-primary' },
            { icon: Star, text: '500+ EVENTS', color: 'text-secondary' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-transform"
            >
              <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color} group-hover:animate-pulse`} />
              <p className="font-bebas text-sm text-text-white">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Packages */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`glass-card p-8 relative cursor-pointer border-2 transition-all duration-300 ${
                selectedPackage === pkg.id ? pkg.color : 'border-border'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-jet-black px-4 py-1 rounded-full text-xs font-bebas shadow-neon">
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className="text-center mb-8">
                <h3 className="font-bebas text-2xl md:text-3xl mb-2 text-text-white">
                  {pkg.name}
                </h3>
                <div className="text-4xl font-bebas mb-2">
                  <span className={selectedPackage === pkg.id ? pkg.color.split(' ')[1] : 'text-primary'}>
                    {pkg.price}
                  </span>
                </div>
                <p className="text-muted-gray font-inter">{pkg.duration}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      selectedPackage === pkg.id ? 'bg-primary' : 'bg-muted-gray'
                    }`}></div>
                    <span className="text-muted-gray font-inter">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Book Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBooking(pkg.id)}
                className={`w-full py-3 px-6 rounded-full font-bebas text-lg tracking-wider transition-all duration-300 ${
                  selectedPackage === pkg.id 
                    ? 'btn-neon shadow-neon-lg'
                    : 'border-2 border-muted-gray text-muted-gray hover:border-primary hover:text-primary'
                }`}
              >
                BOOK {pkg.name}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-muted-gray mb-6 font-inter max-w-2xl mx-auto">
            Need a custom package or have specific requirements? Let's create the perfect experience for your event.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-red"
          >
            CUSTOM CONSULTATION
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BookDJSection;