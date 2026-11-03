import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { workImages } from "../data/companyContent";
gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => gsap.from(".work-image", {
      y: 35, opacity: 0, stagger: 0.07, duration: 0.75,
      scrollTrigger: { trigger: ref.current, start: "top 78%" }
    }), ref);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} id="gallery" className="section">
    <div className="container">
      <p className="eyebrow mb-8">05 — Реализованные работы</p>
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="section-title">Результат <span className="text-[#858d90]">в деталях.</span></h2>
        <p className="max-w-sm text-sm leading-7 text-[#92989a]">Фотографии объектов из галереи оригинального сайта компании.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {workImages.map((src, i) => <figure className="work-image group overflow-hidden border border-[#292d2f] bg-[#111516]" key={src}>
          <div className="aspect-[4/5] overflow-hidden">
            <img src={src} alt={`Реализованный объект компании — фото ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <figcaption className="flex justify-between p-3 text-[10px] uppercase tracking-[.15em] text-[#92989a]"><span>Объект компании</span><span>0{i + 1}</span></figcaption>
        </figure>)}
      </div>
    </div>
  </section>;
}
