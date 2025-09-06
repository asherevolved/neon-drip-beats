import { motion } from 'framer-motion';
import { Music, Mail, Phone, MapPin, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';
const Footer = () => {
  const socialLinks = [{
    icon: Instagram,
    href: '#',
    label: 'Instagram'
  }, {
    icon: Twitter,
    href: '#',
    label: 'Twitter'
  }, {
    icon: Youtube,
    href: '#',
    label: 'YouTube'
  }, {
    icon: Facebook,
    href: '#',
    label: 'Facebook'
  }];
  const quickLinks = [{
    label: 'EVENTS',
    href: '#events'
  }, {
    label: 'GALLERY',
    href: '#gallery'
  }, {
    label: 'BOOKING',
    href: '#book'
  }, {
    label: 'ABOUT',
    href: '#about'
  }, {
    label: 'CONTACT',
    href: '#contact'
  }];
  const services = ['Club Events', 'Private Parties', 'Corporate Functions', 'Festivals', 'Wedding Receptions', 'Custom Productions'];
  return <footer className="relative py-16 mt-20 border-t border-border">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{
        backgroundPosition: ['0% 0%', '100% 100%']
      }} transition={{
        duration: 50,
        repeat: Infinity,
        repeatType: 'reverse'
      }} className="w-full h-full opacity-5" style={{
        backgroundImage: 'linear-gradient(45deg, hsl(var(--neon-lime) / 0.1) 0%, transparent 25%, hsl(var(--blood-red) / 0.1) 50%, transparent 75%, hsl(var(--neon-lime) / 0.1) 100%)',
        backgroundSize: '400% 400%'
      }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Music className="w-8 h-8 text-primary mr-3" />
              <div className="font-bebas text-2xl">
                <span className="text-text-white">CONTINENTAL </span>
                <span className="neon-text animate-flicker">ENTERTAINMENTS</span>
              </div>
            </div>
            
            <p className="text-muted-gray font-inter text-lg leading-relaxed mb-6 max-w-md">
              Transforming events into unforgettable cyberpunk experiences through cutting-edge 
              electronic music and immersive audiovisual productions.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-muted-gray">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-primary" />
                <span className="font-inter">+1 (555) NEON-BEAT</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary" />
                <span className="font-inter">book@continental-ent.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-primary" />
                <span className="font-inter">Downtown District, Cyberpunk City</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }}>
            <h3 className="font-bebas text-xl text-text-white mb-6">QUICK LINKS</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => <li key={index}>
                  <motion.a href={link.href} whileHover={{
                x: 5,
                color: 'hsl(var(--primary))'
              }} className="text-muted-gray font-inter hover:text-primary transition-colors cursor-pointer block" onClick={e => {
                e.preventDefault();
                document.querySelector(link.href)?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}>
                    {link.label}
                  </motion.a>
                </li>)}
            </ul>
          </motion.div>

          {/* Services */}
          
        </div>

        {/* Social Links */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }} className="border-t border-border pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-6 md:mb-0">
              {socialLinks.map((social, index) => <motion.a key={index} href={social.href} whileHover={{
              scale: 1.2,
              y: -2
            }} whileTap={{
              scale: 0.9
            }} className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-muted-gray hover:text-primary hover:shadow-neon transition-all duration-300" aria-label={social.label}>
                  
                </motion.a>)}
            </div>

            <div className="text-center md:text-right">
              <p className="text-muted-gray font-inter text-sm mb-2">
                Follow us for the latest events and mixes
              </p>
              
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-gray">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span className="font-inter">© 2024 Continental Entertainments. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-primary transition-colors font-inter">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors font-inter">Terms of Service</a>
            <a href="/admin" className="hover:text-primary transition-colors font-inter text-xs opacity-50 hover:opacity-100">Admin</a>
            
          </div>
        </motion.div>
      </div>
    </footer>;
};
export default Footer;