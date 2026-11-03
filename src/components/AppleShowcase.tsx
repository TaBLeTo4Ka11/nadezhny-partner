import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const cards = [
  ["01", "Собственное производство", "Двери с завода без лишних наценок. Производственный цикл и комплектация под требования объекта."],
  ["02", "Конструкция любой сложности", "Изготовление специальных дверей и противопожарных конструкций по размерам и эскизам заказчика."],
  ["03", "Полный контроль качества", "Проверка изделия на каждом этапе: от подготовки металла и сборки до окраски и комплектации."],
];

export default function AppleShowcase() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => gsap.from(".solution", { y: 40, opacity: 0, stagger: 0.14, duration: 0.85, scrollTrigger: { trigger: ref.current, start: "top 78%" } }), ref);
    return () => ctx.revert();
  }, []);
  return <section ref={ref} id="solutions" className="section">
    <div className="container">
      <p className="eyebrow mb-8">01 — Принципы работы</p>
      <h2 className="section-title mb-16">Точность <span className="text-[#858d90]">в каждой</span><br/>конструкции.</h2>
      <div className="grid border-l border-t border-[#292d2f] md:grid-cols-3">
        {cards.map(([n, title, text]) => <article className="solution flex min-h-[310px] flex-col border-b border-r border-[#292d2f] p-8 md:p-10" key={n}>
          <div className="flex items-center justify-between"><span className="eyebrow">Направление</span><span className="text-sm text-[#858d90]">{n}</span></div>
          <div className="my-auto py-12"><div className="h-px w-16 bg-[#92989a] transition-all duration-500 hover:w-28"/><h3 className="mt-8 text-2xl leading-tight">{title}</h3></div>
          <p className="text-sm leading-7 text-[#92989a]">{text}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
