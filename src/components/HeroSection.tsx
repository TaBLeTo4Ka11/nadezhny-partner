import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHONES } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/hero/hero-01.jpg";
const HERO_DETAIL = "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/hero/hero-02.png";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const image = element.querySelector<HTMLElement>("[data-hero-image]");
      const copy = element.querySelectorAll<HTMLElement>("[data-hero-copy]");
      const scene = element.querySelector<HTMLElement>("[data-hero-scene]");
      if (!image || !scene) return;

      gsap.from(copy, { y: 24, opacity: 0, duration: 0.85, stagger: 0.12, ease: "power3.out" });
      gsap.from(scene, { clipPath: "inset(0 0 100% 0)", duration: 1.2, ease: "power4.inOut", delay: 0.15 });
      gsap.to(image, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: element, start: "top top", end: "bottom top", scrub: true },
      });

      const quickX = gsap.quickTo(image, "x", { duration: 0.8, ease: "power3.out" });
      const quickY = gsap.quickTo(image, "y", { duration: 0.8, ease: "power3.out" });
      const quickRotate = gsap.quickTo(scene, "rotationY", { duration: 0.8, ease: "power3.out" });
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const bounds = element.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        quickX(x * 13);
        quickY(y * 10);
        quickRotate(x * 2.2);
      };
      const reset = () => { quickX(0); quickY(0); quickRotate(0); };
      element.addEventListener("pointermove", onPointerMove);
      element.addEventListener("pointerleave", reset);

      return () => {
        element.removeEventListener("pointermove", onPointerMove);
        element.removeEventListener("pointerleave", reset);
      };
    }, element);

    return () => context.revert();
  }, []);

  const phone = PHONES[0];

  return (
    <section ref={root} id="top" className="relative isolate overflow-hidden bg-white px-5 pb-20 pt-28 text-ink sm:px-8 lg:min-h-[min(850px,100svh)] lg:px-10 lg:pb-24 lg:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[72%] bg-[linear-gradient(115deg,#fff_0%,#fff_55%,#f5f5f3_100%)]" />
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
        <div className="relative z-10">
          <p data-hero-copy className="mb-7 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.24em] text-muted sm:text-xs">
            <span className="h-[2px] w-8 bg-[#c62828]" /> Иваново · Производство · с 2010 года
          </p>
          <h1 data-hero-copy className="max-w-[850px] text-[clamp(3rem,7.3vw,7.2rem)] font-black leading-[.88] tracking-[-.065em]">
            Надёжный<br /><span className="text-[#c62828]">партнёр</span>
          </h1>
          <p data-hero-copy className="mt-8 max-w-xl text-base leading-7 text-ink/65 sm:text-lg sm:leading-8">
            Производство, поставка и монтаж противопожарных преград и специальных дверей для коммерческих, промышленных и общественных объектов.
          </p>
          <div data-hero-copy className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#kp" className="inline-flex min-h-14 items-center justify-center bg-[#c62828] px-7 text-xs font-extrabold uppercase tracking-[.12em] text-white transition-colors hover:bg-[#a91f1f] sm:px-9">Обсудить проект <span className="ml-5 text-lg">↗</span></a>
            <a href="#catalog" className="inline-flex min-h-14 items-center border-b-2 border-ink px-1 text-xs font-extrabold uppercase tracking-[.12em] transition-colors hover:border-[#c62828] hover:text-[#c62828]">Каталог продукции</a>
          </div>
          <div data-hero-copy className="relative isolate mt-14 grid max-w-xl grid-cols-3 overflow-hidden border-t border-line pt-5 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:opacity-50 before:bg-[linear-gradient(rgba(30,30,30,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,.05)_1px,transparent_1px)] before:bg-[size:18px_18px]">
            <div><strong className="block text-3xl font-black tracking-tight sm:text-4xl">15<span className="text-[#c62828]">+</span></strong><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">лет опыта</span></div>
            <div><strong className="block text-3xl font-black tracking-tight sm:text-4xl">100%</strong><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">контроль качества</span></div>
            <div><strong className="block text-3xl font-black tracking-tight sm:text-4xl">B2B</strong><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">комплексные объекты</span></div>
          </div>
          <a href={phone.href} className="mt-7 inline-flex items-center gap-3 text-sm font-extrabold hover:text-[#c62828]"><span className="flex h-9 w-9 items-center justify-center bg-[#c62828] text-white">↗</span>{phone.label}</a>
        </div>

        <div data-hero-scene className="relative mx-auto w-full max-w-[720px] [transform-style:preserve-3d]">
          <div className="absolute -right-3 -top-3 h-full w-full border-2 border-[#c62828] sm:-right-5 sm:-top-5" />
          <div className="relative aspect-[4/4.7] overflow-hidden bg-[#e9e9e7]">
            <img data-hero-image src={HERO_IMAGE} alt="Производство противопожарных дверей и металлических конструкций" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/5" />
            <div className="absolute left-5 top-5 border border-white/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-white sm:left-8 sm:top-8">Надёжность в деталях</div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/70">Производство и монтаж</p><p className="mt-2 max-w-[14ch] text-2xl font-black leading-none sm:text-4xl">Защита, которой доверяют</p></div>
              <span className="border border-white/70 p-3 text-xl">↗</span>
            </div>
          </div>
          <div className="absolute -bottom-7 -left-5 hidden w-[34%] border-[6px] border-white shadow-xl sm:block">
            <img src={HERO_DETAIL} alt="Деталь металлической дверной конструкции" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
          </div>
          <span className="absolute -bottom-10 right-0 text-[9px] font-bold uppercase tracking-[.2em] text-muted">01 / Иваново · Россия</span>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[9px] font-bold uppercase tracking-[.25em] text-muted lg:block">Листайте, чтобы узнать больше ↓</div>
    </section>
  );
}
