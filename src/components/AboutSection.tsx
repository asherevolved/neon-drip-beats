import { motion } from 'framer-motion';
import { Play, Volume2, Zap, Users, Award, TrendingUp } from 'lucide-react';
const AboutSection = () => {
  const stats = [{
    icon: Play,
    number: '500+',
    label: 'EVENTS PLAYED',
    color: 'text-primary'
  }, {
    icon: Users,
    number: '50K+',
    label: 'PEOPLE ENTERTAINED',
    color: 'text-secondary'
  }, {
    icon: Award,
    number: '5+',
    label: 'YEARS EXPERIENCE',
    color: 'text-primary'
  }, {
    icon: TrendingUp,
    number: '98%',
    label: 'CLIENT SATISFACTION',
    color: 'text-secondary'
  }];
  const skills = [{
    name: 'ELECTRONIC/EDM',
    level: 95
  }, {
    name: 'CYBERPUNK/SYNTHWAVE',
    level: 98
  }, {
    name: 'UNDERGROUND HOUSE',
    level: 90
  }, {
    name: 'BASS/DUBSTEP',
    level: 92
  }, {
    name: 'LIVE MIXING',
    level: 96
  }, {
    name: 'CROWD READING',
    level: 99
  }];
  return <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div animate={{
        backgroundPosition: ['0% 0%', '100% 100%']
      }} transition={{
        duration: 30,
        repeat: Infinity,
        repeatType: 'reverse'
      }} className="w-full h-full opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 30% 70%, hsl(var(--neon-lime) / 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, hsl(var(--blood-red) / 0.4) 0%, transparent 50%)',
        backgroundSize: '200% 200%'
      }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <h2 className="font-bebas text-5xl md:text-7xl mb-6">
            <span className="text-text-white">ABOUT </span>
            <span className="neon-text-lg">CONTINENTAL</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto mb-4"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* About Content */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h3 className="font-bebas text-3xl md:text-4xl mb-6 text-text-white">
              ABOUT <span className="neon-text">CONTINENTAL</span>
            </h3>
            
            <div className="space-y-6 text-muted-gray font-inter text-lg leading-relaxed">
              <p>
                Continental Entertainments is a party entertainment company, bringing unforgettable experiences to life across India. With a passion for creativity and a commitment to excellence, we specialize in curating parties in clubbing and concerts.
              </p>
              
              <p>
                Founded on the belief that great entertainment connects people and creates lasting memories, our team blends innovation with precision to deliver seamless events tailored to every client's vision. Whether you're planning a high-profile concert, Continental Entertainments provides the expertise, talent, and production support to make it extraordinary.
              </p>
              
              <p>
                We work with an extensive network of performers, artists, technical experts, and creative professionals to ensure every event not only meets—but exceeds—expectations.
              </p>
              
              <p>
                Continental Entertainments – Where every event is an experience.
              </p>
            </div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.4,
            delay: 0.3
          }} className="mt-8 flex space-x-4">
              
              
            </motion.div>
          </motion.div>

          {/* Skills & Expertise */}
          
        </div>

        {/* Stats Section */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {})}
        </motion.div>
      </div>
    </section>;
};
export default AboutSection;