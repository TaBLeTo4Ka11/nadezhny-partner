import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projectPhotos = Array.from({ length: 11 }, (_, index) =>
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/projects/project-" +
  String(index + 1).padStart(3, "0") + ".jpg",
);

type GalleryPhoto = { src: string; label: string };

function PhotoSlider({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (index: number) => {
    const element = track.current;
    if (!element) return;
    const next = Math.max(0, Math.min(photos.length - 1, index));
    const slide = element.children.item(next) as HTMLElement | null;
    if (!slide) return;
    const left = slide.offsetLeft - (element.clientWidth - slide.clientWidth) / 2;
    element.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
    setActive(next);
  };

  const handleScroll = () => {
    const element = track.current;
    if (!element) return;
    const center = element.scrollLeft + element.clientWidth / 2;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    Array.from(element.children).forEach((child, index) => {
      const slide = child as HTMLElement;
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
      const nextDistance = Math.abs(center - slideCenter);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    setActive(nearest);
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between gap-4 text-[10px] font-extrabold uppercase tracking-[.16em] text-muted">
        <span>{title}</span>
        <span className="tabular-nums">{active + 1} / {photos.length}</span>
      </div>
      <div
        ref={track}
        onScroll={handleScroll}
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={title + ". Проведите пальцем для просмотра фотографий"}
      >
        {photos.map((photo, index) => (
          <figure
            key={photo.src}
            className="relative h-[min(68vw,620px)] w-full shrink-0 snap-center [scroll-snap-stop:always] overflow-hidden bg-[#e2e2df] sm:h-[min(55vw,680px)]"
          >
            <img
              src={photo.src}
              alt={photo.label + ", фотография " + (index + 1)}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
              className="absolute inset-0 h-full w-full object-contain sm:object-cover"
            />
            <span className="absolute left-3 top-3 bg-[#171717]/80 px-3 py-2 text-xs font-bold tabular-nums tracking-wide text-white sm:left-5 sm:top-5 sm:text-sm">
              {index + 1} / {photos.length}
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-14 text-xs font-bold uppercase tracking-[.14em] text-white sm:px-6 sm:pb-6">
              {photo.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-hidden" aria-label="Выбор фотографии">
          {photos.map((photo, index) => {
            const distance = Math.abs(active - index);
            const size = distance === 0 ? "h-3 w-3" : distance === 1 ? "h-2.5 w-2.5" : distance === 2 ? "h-2 w-2" : "h-1.5 w-1.5";
            const tone = distance === 0 ? "bg-white opacity-100" : distance === 1 ? "bg-[#777] opacity-90" : distance === 2 ? "bg-[#888] opacity-60" : "bg-[#999] opacity-30";
            return (
              <button
                key={photo.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={"Показать фотографию " + (index + 1)}
                aria-current={active === index ? "true" : undefined}
                className={"shrink-0 rounded-full transition-all duration-300 ease-out " + size + " " + tone}
              />
            );
          })}
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label={"Предыдущая фотография: " + title} className="flex h-10 w-10 items-center justify-center border border-ink/30 text-xl transition-colors hover:border-[#c62828] hover:text-[#c62828] disabled:cursor-not-allowed disabled:opacity-30">←</button>
          <button type="button" onClick={() => goTo(active + 1)} disabled={active === photos.length - 1} aria-label={"Следующая фотография: " + title} className="flex h-10 w-10 items-center justify-center border border-ink/30 text-xl transition-colors hover:border-[#c62828] hover:text-[#c62828] disabled:cursor-not-allowed disabled:opacity-30">→</button>
        </div>
      </div>
      <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[.14em] text-muted sm:hidden">Свайпните, чтобы листать фотографии</p>
    </div>
  );
}

export default function GallerySection() {
  const root = useRef<HTMLElement>(null);
  const projects: GalleryPhoto[] = projectPhotos.map((src) => ({ src, label: "Реализованный объект" }));

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-gallery-slider]", {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 82%", once: true },
      });
    }, element);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="gallery" className="scroll-mt-20 bg-[#f5f5f3] px-5 py-24 text-ink sm:px-8 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 border-b-2 border-ink pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[.22em] text-[#c62828]">Практика</p>
            <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-black leading-[.9] tracking-[-.06em]">Наши работы<span className="text-[#c62828]">.</span></h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink/60 md:text-right">Фотографии реализованных объектов компании.</p>
        </div>
        <div data-gallery-slider className="mt-8">
          <PhotoSlider photos={projects} title="Реализованные объекты" />
        </div>

      </div>
    </section>
  );
}
