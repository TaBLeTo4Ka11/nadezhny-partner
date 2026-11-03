import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CatalogSection from "./components/CatalogSection";
import PartnersSection from "./components/PartnersSection";
import AboutSection from "./components/AboutSection";
import ProductionSection from "./components/ProductionSection";
import GallerySection from "./components/GallerySection";
import ReviewsSection from "./components/ReviewsSection";
import FormSection from "./components/FormSection";
import MapSection from "./components/MapSection";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CatalogSection />
        <PartnersSection />
        <AboutSection />
        <ProductionSection />
        <GallerySection />
        <ReviewsSection />
        <FormSection />
        <MapSection />
      </main>
      <Footer />
    </>
  );
}