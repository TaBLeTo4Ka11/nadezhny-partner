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
import CategoryPage from "./components/CategoryPage";
import CompanyPage from "./components/CompanyPage";
import ProductPage from "./components/ProductPage";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const infoRoutes: Record<string, "warehouse" | "delivery" | "vacancies" | "useful" | "privacy" | "cookies"> = {
  "/sklad": "warehouse",
  "/dostavka-i-ustanovka": "delivery",
  "/vakansii": "vacancies",
  "/poleznoe": "useful",
  "/privacy-policy": "privacy",
  "/kuki": "cookies",
};

function NotFoundPage() {
  useEffect(() => {
    document.title = "Страница не найдена — Надёжный партнёр";
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", "Запрошенная страница не найдена.");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow");
    document.querySelector('link[rel="canonical"]')?.remove();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-start justify-center bg-white px-6 py-20 lg:px-10">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-brand">Ошибка 404</p>
      <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-7xl">Страница не найдена</h1>
      <p className="mt-6 max-w-xl text-base leading-7 text-muted">Возможно, адрес изменился или страница ещё не создана.</p>
      <a href="/" className="btn mt-8">Вернуться на главную</a>
    </main>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const frame = window.requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
    };
  }, []);

  if (path.startsWith("/product/")) return <ProductPage slug={path.slice("/product/".length)} />;
  if (path === "/o-kompanii") return <CompanyPage page="about" />;
  if (path === "/kontakty") return <CompanyPage page="contacts" />;
  if (infoRoutes[path]) return <InfoPage page={infoRoutes[path]} />;
  if (path.startsWith("/catalog/")) {
    const slug = path.slice("/catalog/".length);
    return <CategoryPage slug={slug} />;
  }
  if (path !== "/") return <NotFoundPage />;

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
