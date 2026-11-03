import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, company } from "../data/companyContent";
gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => gsap.from(".about-in", { y: 35, opacity: 0, stagger: 0.12, duration: 0.8, scrollTrigger: { trigger: ref.current, start: "top 78%" } }), ref);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} id="about" className="section bg-[#0a0c0d]">
    <div className="container">
      <p className="eyebrow about-in mb-8">05 — О компании</p>
      <div className="grid gap-14 md:grid-cols-[.9fr_1.1fr]">
        <div><h2 className="about-in section-title">Опыт, <span className="text-[#858d90]">которому</span> доверяют.</h2>
          <div className="about-in mt-12 border-t border-[#303638] pt-7"><strong className="text-6xl">{company.experience}</strong><span className="eyebrow ml-4">Лет опыта</span></div>
        </div>
        <div className="space-y-6">
          {about.map((paragraph, i) => <p className="about-in text-base leading-8 text-[#b8c0c2]" key={i}>{paragraph}</p>)}
          <div className="about-in border-l border-[#8b9497] pl-6 pt-1 text-sm leading-7 text-[#92989a]">Компания работает с крупными строительными организациями, застройщиками и частными заказчиками. Поставка и монтаж согласуются с представителями объекта.</div>
        </div>
      </div>
    </div>
  </section>;
}