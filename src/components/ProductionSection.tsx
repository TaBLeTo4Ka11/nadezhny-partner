import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productionStages, productionImages } from "../data/companyContent";
gsap.registerPlugin(ScrollTrigger);

export default function ProductionSection() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".production-step", { x: 30, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 78%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} id="production" className="section">
    <div className="container">
      <p className="eyebrow mb-8">03 — Производство</p>
      <h2 className="section-title mb-16 max-w-5xl">Контроль <span className="text-[#858d90]">на каждом</span> этапе.</h2>
      <div className="border-t border-[#34393b]">
        {productionStages.map((stage, i) => <article className="production-step grid gap-5 border-b border-[#34393b] py-9 md:grid-cols-[100px_1fr_1.2fr] md:gap-10" key={stage.title}>
          <span className="eyebrow pt-2">0{i + 1} / 04</span>
          <h3 className="text-xl leading-snug md:text-2xl">{stage.title}</h3>
          <p className="text-sm leading-7 text-[#a3aaac]">{stage.text}</p>
        </article>)}
      </div>
      <div className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4"><h3 className="text-2xl">Производство в кадре</h3><span className="eyebrow">13 оригинальных фото</span></div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {productionImages.map((src, i) => <figure className="overflow-hidden border border-[#292d2f] bg-[#111516]" key={src}>
            <img src={src} alt={`Этап производства — фото ${i + 1}`} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105" />
          </figure>)}
        </div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {["Собственное производство", "Контроль качества", "Конструкции под задачу"].map((x, i) => <div className="panel p-7" key={x}><span className="eyebrow">Преимущество 0{i + 1}</span><h3 className="mt-8 text-xl">{x}</h3></div>)}
      </div>
    </div>
  </section>;
}
