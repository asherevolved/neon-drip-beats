import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours about your event.",
    });
    setFormData({ name: '', email: '', phone: '', eventType: '', eventDate: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'CALL US',
      info: '+1 (555) NEON-BEAT',
      subInfo: 'Available 24/7',
      color: 'text-primary'
    },
    {
      icon: Mail,
      title: 'EMAIL US',
      info: 'book@continental-ent.com',
      subInfo: 'Response within 2 hours',
      color: 'text-secondary'
    },
    {
      icon: MapPin,
      title: 'LOCATION',
      info: 'Downtown District',
      subInfo: 'Cyberpunk City, CC 12345',
      color: 'text-primary'
    },
    {
      icon: Clock,
      title: 'AVAILABILITY',
      info: '24/7 Booking',
      subInfo: 'Events worldwide',
      color: 'text-secondary'
    }
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full opacity-10"
          style={{
            backgroundImage: 'conic-gradient(from 0deg at 50% 50%, hsl(var(--neon-lime) / 0.3) 0deg, transparent 120deg, hsl(var(--blood-red) / 0.3) 240deg, transparent 360deg)',
            backgroundSize: '200% 200%',
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
            <span className="text-text-white">GET IN </span>
            <span className="neon-text-lg">TOUCH</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-muted-gray max-w-2xl mx-auto">
            Ready to electrify your event? Let's create something legendary together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8"
          >
            <h3 className="font-bebas text-2xl md:text-3xl mb-8 text-text-white flex items-center">
              <MessageSquare className="w-8 h-8 mr-3 text-primary" />
              SEND MESSAGE
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bebas text-sm text-muted-gray mb-2">YOUR NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-charcoal border border-border rounded-lg text-text-white font-inter focus:border-primary focus:shadow-neon transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block font-bebas text-sm text-muted-gray mb-2">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-charcoal border border-border rounded-lg text-text-white font-inter focus:border-primary focus:shadow-neon transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bebas text-sm text-muted-gray mb-2">PHONE</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 bg-charcoal border border-border rounded-lg text-text-white font-inter focus:border-primary focus:shadow-neon transition-all duration-300"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block font-bebas text-sm text-muted-gray mb-2">EVENT TYPE</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-charcoal border border-border rounded-lg text-text-white font-inter focus:border-primary focus:shadow-neon transition-all duration-300"
                  >
                    <option value="">Select event type</option>
                    <option value="club">Club Night</option>
                    <option value="private">Private Party</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="festival">Festival</option>
                    <option value="wedding">Wedding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bebas text-sm text-muted-gray mb-2">EVENT DATE</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full p-4 bg-charcoal border border-border rounded-lg text-text-white font-inter focus:border-primary focus:shadow-neon transition-all duration-300"
                />
              </div>

              <div>
                <label className="block font-bebas text-sm text-muted-gray mb-2">MESSAGE</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full p-4 bg-charcoal border border-border rounded-lg text-text-white font-inter focus:border-primary focus:shadow-neon transition-all duration-300 resize-none"
                  placeholder="Tell us about your event vision..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full btn-neon flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                SEND MESSAGE
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-card p-8">
              <h3 className="font-bebas text-2xl md:text-3xl mb-8 text-text-white flex items-center">
                <User className="w-8 h-8 mr-3 text-secondary" />
                CONTACT INFO
              </h3>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-4 group cursor-pointer hover:scale-105 transition-transform p-4 rounded-lg hover:bg-charcoal/50"
                  >
                    <item.icon className={`w-6 h-6 mt-1 ${item.color} group-hover:animate-pulse`} />
                    <div>
                      <h4 className="font-bebas text-lg text-text-white mb-1">{item.title}</h4>
                      <p className="text-muted-gray font-inter">{item.info}</p>
                      <p className="text-sm text-muted-gray font-inter">{item.subInfo}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Response Promise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="glass-card p-6 text-center"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 20px hsl(var(--neon-lime) / 0.3)',
                    '0 0 40px hsl(var(--neon-lime) / 0.6)',
                    '0 0 20px hsl(var(--neon-lime) / 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-primary/20 border border-primary flex items-center justify-center mx-auto mb-4"
              >
                <Clock className="w-8 h-8 text-primary" />
              </motion.div>
              <h4 className="font-bebas text-xl text-text-white mb-2">FAST RESPONSE</h4>
              <p className="text-muted-gray font-inter text-sm">
                We respond to all booking inquiries within 2 hours during business hours
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;