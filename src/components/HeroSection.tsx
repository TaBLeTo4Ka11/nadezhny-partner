import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-h]", { opacity: 0, y: 32, duration: 1, ease: "power3.out", stagger: 0.15 });
      gsap.to("[data-bg]", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative flex min-h-[80svh] items-end overflow-hidden bg-graphite text-white">
      <img
        data-bg
        src={IMG.door1}
        alt=""
        aria-hidden
        className="absolute -top-[10%] left-0 h-[120%] w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/60 to-graphite/20" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 lg:px-10 lg:pb-24">
        <h1
          data-h
          className="max-w-[18ch] text-[clamp(2.1rem,6.5vw,5.5rem)] font-extrabold leading-[1.02] tracking-tight"
        >
          Производство и поставка противопожарных преград
        </h1>
        <p data-h className="mt-6 text-lg text-white/80 md:text-2xl">
          Собственное производство. 15 лет опыта
        </p>
        <a data-h href="#kp" className="btn mt-10 px-10 py-4 text-base">
          Оставить заявку
        </a>
      </div>
    </section>
  );
}