import HeroSection from './components/HeroSection';
import AppleShowcase from './components/AppleShowcase';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-[#E8E8ED] selection:text-black">
      <HeroSection />
      <AppleShowcase />
      <AboutSection />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
