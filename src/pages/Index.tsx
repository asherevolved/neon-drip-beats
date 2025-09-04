import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import EventsSection from '@/components/EventsSection';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen liquid-bg">
      <Navigation />
      <main>
        <HeroSection />
        <EventsSection />
        <GallerySection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
