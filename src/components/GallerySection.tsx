import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projectPhotos = [
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-001.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-002.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-003.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-004.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-005.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-006.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-007.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-008.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-009.jpg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-010.jpg"
];
const productionPhotos = [
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/production/production-01.jpeg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/production/production-02.jpeg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/production/production-03.jpeg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/production/production-04.jpeg",
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/production/production-05.jpeg"
];
const photos = [
  ...projectPhotos.map((src, index) => ({ src, label: "Реализованный объект", index: index + 1 })),
  ...productionPhotos.map((src, index) => ({ src, label: "Производство", index: index + 1 })),
];

export default function GallerySection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-gallery-item]", {
        y: 28, opacity: 0, duration: 0.75, stagger: 0.055, ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 82%", once: true },
      });
    }, element);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="gallery" className="scroll-mt-20 bg-[#f5f5f3] px-5 py-24 text-ink sm:px-8 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 border-b-2 border-ink pb-8 md:flex-row md:items-end">
          <div><p className="mb-4 text-xs font-extrabold uppercase tracking-[.22em] text-[#c62828]">Практика и производство</p><h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-black leading-[.9] tracking-[-.06em]">Наши работы<span className="text-[#c62828]">.</span></h2></div>
          <p className="max-w-md text-sm leading-7 text-ink/60 md:text-right">Фотографии реализованных объектов и производственных процессов компании.</p>
        </div>
        <div className="mt-8 flex items-center justify-between gap-4 text-[10px] font-extrabold uppercase tracking-[.18em] text-muted"><span>Объекты и производство</span><span>15 фотографий</span></div>
        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <figure data-gallery-item key={photo.src} className={"group relative overflow-hidden bg-[#e2e2df] " + (index === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-[4/3]")}>
              <img src={photo.src} alt={photo.label + ", фотография " + photo.index} loading={index < 4 ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 to-transparent px-3 pb-3 pt-10 text-[9px] font-bold uppercase tracking-[.14em] text-white sm:px-4 sm:pb-4">{photo.label}<span>{String(index + 1).padStart(2,"0")}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
