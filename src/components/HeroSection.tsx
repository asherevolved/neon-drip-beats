import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-dj.jpg';

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Continental Entertainments - Premier DJ and Event Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-jet-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-transparent to-jet-black/50"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--neon-lime) / 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1
            className="font-bebas text-6xl md:text-8xl lg:text-9xl mb-6 leading-none"
            animate={{ textShadow: [
              '0 0 20px hsl(var(--neon-lime))',
              '0 0 40px hsl(var(--neon-lime)), 0 0 60px hsl(var(--neon-lime))',
              '0 0 20px hsl(var(--neon-lime))'
            ]}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-text-white">CONTINENTAL</span>
            <br />
            <span className="neon-text-lg animate-shimmer bg-gradient-to-r from-neon-lime via-neon-lime-glow to-neon-lime bg-[length:200%_100%] bg-clip-text text-transparent">
              ENTERTAINMENTS
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-muted-gray mb-2 font-inter">
              PREMIUM DJ SERVICES & EVENT EXPERIENCES
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto animate-pulse"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon"
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
            >
              VIEW EVENTS
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-red"
              onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
            >
              BOOK NOW
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;