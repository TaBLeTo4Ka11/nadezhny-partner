import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { workImages } from "../data/companyContent";

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-work]");
      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.75,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 82%", once: true },
      });
    }, element);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="gallery" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">Реализованные проекты</p>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Наши работы</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted md:text-right">Фотографии объектов из галереи компании.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {workImages.map((src, index) => (
            <figure data-work key={src} className="group overflow-hidden border border-line bg-soft">
              <div className="aspect-[4/5] overflow-hidden bg-[#e9e9e7]">
                <img
                  src={src}
                  alt={`Фотография реализованного объекта компании, кадр ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-3 py-3 text-xs font-semibold text-muted sm:px-4">
                <span>Объект компании</span>
                <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
