import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ABOUT_INTRO, ABOUT_STAGES } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const body = "mb-5 max-w-[66ch] text-lg leading-relaxed text-ink/80";

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-p]", root.current ?? undefined);
      gsap.set(items, { opacity: 0, y: 30 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" lang="ru" className="scroll-mt-28 bg-soft px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Техническое описание</p>
            <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">О компании</h2>
            <p className="mt-6 max-w-[26ch] text-lg text-muted">Собственное производство. 15 лет опыта</p>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <div className="border-t-2 border-ink pt-8">
            <h3 data-p className="mb-6 text-2xl font-extrabold tracking-tight">Общие сведения</h3>
            {ABOUT_INTRO.map((t, i) => (
              <p key={i} data-p className={body}>
                {t}
              </p>
            ))}
          </div>

          {ABOUT_STAGES.map((s, i) => (
            <div key={s.title} className="mt-14 border-t-2 border-ink pt-8">
              <h3 data-p className="mb-6 flex items-baseline gap-5 text-2xl font-extrabold tracking-tight">
                <span className="text-sm font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h3>
              {s.paragraphs.map((t, j) => (
                <p key={j} data-p className={body}>
                  {t}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}