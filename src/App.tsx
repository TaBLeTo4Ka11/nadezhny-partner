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
import InfoPage from "./components/InfoPage";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  const path = window.location.pathname.replace(/\\/+$/, "") || "/";
  const infoRoutes: Record<string, "warehouse" | "delivery" | "vacancies" | "useful"> = {
    "/sklad": "warehouse",
    "/dostavka-i-ustanovka": "delivery",
    "/vakansii": "vacancies",
    "/poleznoe": "useful",
  };

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  if (infoRoutes[path]) return <InfoPage page={infoRoutes[path]} />;

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-ink focus:shadow-lg">Перейти к содержимому</a>
      <Header />
      <main id="main-content">
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