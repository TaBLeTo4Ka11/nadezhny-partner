import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ABOUT_INTRO, ABOUT_STAGES } from "../data/content";

gsap.registerPlugin(ScrollTrigger);
const body = "mb-4 max-w-[66ch] text-base leading-relaxed text-ink/75";

const stageSummaries = [
  "Замеры, выбор стали и сборка основы двери.",
  "Подготовка отверстий, установка петель и проверка конструкции.",
  "Очистка поверхности и нанесение защитного покрытия.",
  "Установка фурнитуры, уплотнителей и финальная комплектация.",
];

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-p]", root.current ?? undefined);
      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.batch(items, {
        start: "top 92%", once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: .8, ease: "power3.out", stagger: .07, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" lang="ru" className="scroll-mt-28 bg-soft px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Компания и производство</p>
            <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">О компании</h2>
            <p className="mt-6 max-w-[26ch] text-lg text-muted">Собственное производство. 15 лет опыта.</p>
          </div>
        </aside>
        <div className="lg:col-span-8">
          <div className="border-t-2 border-ink pt-8">
            <h3 data-p className="mb-6 text-2xl font-extrabold tracking-tight">Общие сведения</h3>
            {ABOUT_INTRO.map((t, i) => <p key={i} data-p className={body}>{t}</p>)}
          </div>
          <div className="mt-14 border-t-2 border-ink pt-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Если интересно подробнее</p><h3 className="text-2xl font-extrabold tracking-tight">Как создаётся дверь</h3></div>
              <span className="text-xs text-muted">4 этапа · можно раскрыть каждый</span>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {ABOUT_STAGES.map((s, i) => (
                <details key={s.title} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
                    <span className="text-sm font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1"><span className="block text-lg font-bold tracking-tight">{s.title}</span><span className="mt-1 block text-sm leading-6 text-muted">{stageSummaries[i] ?? "Подробности производственного этапа."}</span></span>
                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="pb-2 pl-10 pt-5">
                    {s.paragraphs.map((t, j) => <p key={j} className={body}>{t}</p>)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
