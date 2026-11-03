import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Загрузка: заголовок увеличивается и проявляется
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(label.current, { opacity: 0, y: 12, duration: 0.9 })
        .from(
          title.current,
          { opacity: 0, scale: 0.88, duration: 1.8, ease: "expo.out" },
          0.1
        )
        .from(caption.current, { opacity: 0, y: 12, duration: 1 }, 0.9);

      // Скролл: фон уходит назад (глубина), контент уходит быстрее
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };

      gsap.to(bg.current, { yPercent: 18, scale: 1.18, opacity: 0.15, ease: "none", scrollTrigger: st });
      gsap.to(content.current, { yPercent: -12, opacity: 0, ease: "none", scrollTrigger: st });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-[#050505] text-[#F5F5F7]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Фон: инженерная сетка с маской-виньеткой */}
      <div
        ref={bg}
        aria-hidden
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 75%)",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 20%, transparent 75%)",
        }}
      />

      <div
        ref={content}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center will-change-transform"
      >
        <p
          ref={label}
          className="mb-8 border border-[#222] bg-[#101010]/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-[#86868B] backdrop-blur-md"
        >
          Надёжный партнёр
        </p>

        <h1
          ref={title}
          className="max-w-[16ch] text-[clamp(2.75rem,10vw,9rem)] font-semibold uppercase leading-[0.95] tracking-tight text-[#F5F5F7] will-change-transform"
        >
          Противопожарные системы
        </h1>

        <p
          ref={caption}
          className="absolute bottom-12 left-0 right-0 text-base text-[#86868B] md:text-lg"
        >
          Собственное производство. 15 лет опыта.
        </p>
      </div>
    </section>
  );
}
