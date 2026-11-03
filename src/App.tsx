import HeroSection from "./components/HeroSection";
import SiteHeader from "./components/SiteHeader";
import AppleShowcase from "./components/AppleShowcase";
import CatalogSection from "./components/CatalogSection";
import AboutSection from "./components/AboutSection";
import ProductionSection from "./components/ProductionSection";
import GallerySection from "./components/GallerySection";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function App() {
  return <main id="top" className="min-h-screen overflow-hidden bg-[#050505] text-[#f0f1ef]">
    <SiteHeader />
    <HeroSection />
    <AppleShowcase />
    <CatalogSection />
    <AboutSection />
    <ProductionSection />
    <GallerySection />
    <ReviewsSection />
    <ContactSection />
    <Footer />
  </main>;
}