import { motion } from 'framer-motion';
import { Play, Volume2, Zap, Users, Award, TrendingUp } from 'lucide-react';

const AboutSection = () => {
  const stats = [
    { icon: Play, number: '500+', label: 'EVENTS PLAYED', color: 'text-primary' },
    { icon: Users, number: '50K+', label: 'PEOPLE ENTERTAINED', color: 'text-secondary' },
    { icon: Award, number: '5+', label: 'YEARS EXPERIENCE', color: 'text-primary' },
    { icon: TrendingUp, number: '98%', label: 'CLIENT SATISFACTION', color: 'text-secondary' }
  ];

  const skills = [
    { name: 'ELECTRONIC/EDM', level: 95 },
    { name: 'CYBERPUNK/SYNTHWAVE', level: 98 },
    { name: 'UNDERGROUND HOUSE', level: 90 },
    { name: 'BASS/DUBSTEP', level: 92 },
    { name: 'LIVE MIXING', level: 96 },
    { name: 'CROWD READING', level: 99 }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="w-full h-full opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 70%, hsl(var(--neon-lime) / 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsl(var(--blood-red) / 0.4) 0%, transparent 50%)',
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
            <span className="text-text-white">ABOUT </span>
            <span className="neon-text-lg">CONTINENTAL</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto mb-4"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-bebas text-3xl md:text-4xl mb-6 text-text-white">
              THE FUTURE OF <span className="neon-text">ELECTRONIC MUSIC</span>
            </h3>
            
            <div className="space-y-6 text-muted-gray font-inter text-lg leading-relaxed">
              <p>
                Continental Entertainments represents the cutting edge of electronic music experiences. 
                Born from the underground scene and forged in the neon-lit clubs of the cyber era, 
                we bring a unique fusion of technology, artistry, and pure energy to every event.
              </p>
              
              <p>
                Our signature sound blends pulsing basslines with ethereal synths, creating immersive 
                soundscapes that transport audiences into a digital dreamworld. From intimate underground 
                gatherings to massive cyberpunk festivals, we craft experiences that linger long after 
                the last beat drops.
              </p>
              
              <p>
                With state-of-the-art equipment, custom light shows, and an intuitive understanding of 
                crowd dynamics, Continental Entertainments doesn't just play music – we orchestrate 
                unforgettable journeys through sound and light.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 flex space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-neon"
              >
                VIEW PORTFOLIO
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-red"
              >
                DOWNLOAD DEMO
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Skills & Expertise */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8"
          >
            <h4 className="font-bebas text-2xl md:text-3xl mb-8 text-text-white text-center">
              <Volume2 className="w-8 h-8 inline mr-3 text-primary" />
              EXPERTISE
            </h4>
            
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bebas text-sm text-text-white">{skill.name}</span>
                    <span className="font-bebas text-sm text-primary">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-charcoal rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-neon-lime-glow shadow-neon"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card p-6 text-center group hover:scale-105 transition-transform"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-4 ${stat.color} group-hover:animate-pulse`} />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                className="font-bebas text-3xl md:text-4xl mb-2 text-text-white"
              >
                {stat.number}
              </motion.div>
              <p className="font-bebas text-xs text-muted-gray">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;