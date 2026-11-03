import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-h]", { opacity: 0, y: 28, duration: 0.9, ease: "power3.out", stagger: 0.12 });
      gsap.from("[data-hero-image]", { opacity: 0, x: 28, duration: 1.1, ease: "power3.out", delay: 0.2 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="industrial-hero overflow-hidden bg-white px-6 text-ink lg:px-10">
      <div className="mx-auto grid min-h-[min(760px,calc(100svh-80px))] max-w-[1400px] grid-cols-1 items-center gap-10 py-16 md:grid-cols-[1fr_.9fr] lg:gap-16 lg:py-20">
        <div className="relative z-10">
          <p data-h className="mb-6 text-xs font-bold uppercase tracking-[.22em] text-brand">Надёжный партнёр · Иваново</p>
          <h1 data-h className="max-w-[15ch] text-[clamp(2.4rem,5.8vw,5.4rem)] font-extrabold leading-[1.02] tracking-tight">
            Противопожарные преграды и специальные двери
          </h1>
          <p data-h className="mt-7 max-w-xl text-lg leading-8 text-muted md:text-xl">
            Производим противопожарные и входные металлические двери, поставляем и монтируем специальные конструкции.
          </p>
          <div data-h className="mt-9 flex flex-wrap items-center gap-5">
            <a href="#kp" className="btn px-8 py-4 text-base">Получить коммерческое предложение</a>
            <a href="#catalog" className="text-sm font-bold underline decoration-brand underline-offset-8">Смотреть каталог</a>
          </div>
          <div data-h className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            <div><span className="block text-3xl font-extrabold">15</span><span className="text-xs text-muted">лет опыта</span></div>
            <div><span className="block text-3xl font-extrabold">Своё</span><span className="text-xs text-muted">производство</span></div>
            <div><span className="block text-3xl font-extrabold">РФ</span><span className="text-xs text-muted">география работы</span></div>
          </div>
        </div>
        <div data-hero-image className="hero-media relative min-h-[380px] overflow-hidden bg-soft sm:min-h-[520px]">
          <img src={IMG.door1} alt="Пример противопожарной двери из каталога компании" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-6 pt-24 text-white">
            <p className="text-xs font-semibold uppercase tracking-[.18em]">Производство и поставка</p>
            <p className="mt-2 text-lg font-bold">Противопожарные дверные конструкции</p>
          </div>
        </div>
      </div>
    </section>
  );
}
