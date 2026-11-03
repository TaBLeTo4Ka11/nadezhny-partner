import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER = "https://placehold.co/800x600/f8f9fa/1a1a1a?text=Photo";

const ITEMS: { title: string; text: string; image?: string }[] = [
  { title: "Противопожарные двери", text: "Производство, поставка и монтаж. Изготовление под размеры и эскиз заказчика.", image: IMG.door1 },
  { title: "Ворота", text: "Противопожарные ворота: производство, поставка и монтаж.", image: IMG.gates },
  { title: "Шторы", text: "Противопожарные шторы: производство, поставка и монтаж.", image: IMG.curtains },
  { title: "Люки", text: "Противопожарные люки под размеры вашего объекта." },
  { title: "Перегородки", text: "Противопожарные перегородки для административных и муниципальных объектов." },
  { title: "Бронированные двери", text: "Сталь полотна 2 — 3 мм, по желанию заказчика 5 мм." },
];

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current ?? undefined);
      gsap.set(cards, { opacity: 0, y: 40 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="catalog" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="max-w-[14ch] text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Каталог</h2>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((c) => (
            <article key={c.title} data-card className="flex flex-col border border-line bg-white">
              <div className="aspect-[4/3] overflow-hidden bg-soft">
                <img
                  src={c.image ?? PLACEHOLDER}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-extrabold tracking-tight">{c.title}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-muted">{c.text}</p>
                <a href="#kp" className="btn mt-6 self-start">
                  Подробнее
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}