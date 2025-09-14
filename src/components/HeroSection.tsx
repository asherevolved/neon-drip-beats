import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-dj.jpg';
const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({
    rx: 0,
    ry: 0
  });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top; // y position within element
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    // Max tilt angles
    const max = 6; // degrees
    const ry = (x - cx) / cx * max; // rotateY
    const rx = -(y - cy) / cy * max; // rotateX
    setTilt({
      rx,
      ry
    });
  };
  const handleMouseLeave = () => setTilt({
    rx: 0,
    ry: 0
  });
  return <section id="hero" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
    perspective: 1200
  }}>
      {/* Background Video with Overlay (public/Abstract_Neon_Liquid_Loop_Ready.mp4) */}
      <div className="absolute inset-0 z-0">
        <video className="w-full h-full object-cover" src="/Abstract_Neon_Liquid_Loop_Ready.mp4" poster="/placeholder.svg" autoPlay muted loop playsInline preload="auto" aria-hidden="true"
      // inline style to ensure brightness/saturation increase across environments
      style={{
        filter: 'brightness(1.25) contrast(1.08) saturate(1.25)'
      }} />

        {/* Fallback background image for environments where video is not available */}
        <img src={heroImage} alt="Continental Entertainments - Premier DJ and Event Services" className="hidden" />

  {/* Lessen overlay darkness so the video reads brighter */}
  <div className="absolute inset-0 bg-jet-black/30 pointer-events-none"></div>
  <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-transparent to-jet-black/20 pointer-events-none"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div animate={{
        backgroundPosition: ['0% 0%', '100% 100%']
      }} transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse'
      }} className="w-full h-full opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--neon-lime) / 0.12) 0%, transparent 50%)',
        backgroundSize: '100% 100%',
        transformStyle: 'preserve-3d',
        // slightly push this layer back to create depth
        transform: 'translateZ(-120px) scale(1.08)'
      }} />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center max-w-6xl mx-auto px-6" style={{
      transformStyle: 'preserve-3d',
      // apply the tilt transform from mouse movement
      transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
      transition: 'transform 0.12s linear',
      willChange: 'transform'
    }}>
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.2
      }}>
          {/* Replaced text with image - made smaller */}
          <motion.div className="mb-6 flex justify-center" style={{
          transform: 'translateZ(60px)'
        }} animate={{
          filter: ['drop-shadow(0 0 20px hsl(var(--neon-lime)))', 'drop-shadow(0 0 40px hsl(var(--neon-lime))) drop-shadow(0 0 60px hsl(var(--neon-lime)))', 'drop-shadow(0 0 20px hsl(var(--neon-lime)))']
        }} transition={{
          duration: 2,
          repeat: Infinity
        }}>
            <img src="/continental_no_bg.png" alt="Continental Entertainments" className="max-w-full h-auto" style={{
            maxHeight: '150px',
            // Reduced from 200px to 150px
            width: 'auto'
          }} />
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }} className="mb-8 -mt-4">
            
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto animate-pulse"></div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 1
        }} className="flex flex-col sm:flex-row gap-6 justify-center items-center -mt-2">
            <motion.button whileHover={{
            scale: 1.05,
            y: -2
          }} whileTap={{
            scale: 0.95
          }} className="btn-neon" onClick={() => document.getElementById('events')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              VIEW EVENTS
            </motion.button>
            
            
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 2
      }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;