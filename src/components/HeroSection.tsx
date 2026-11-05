import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PHONES } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const DoorScene = lazy(() => import("./DoorScene"));

const HERO_IMAGE = "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/hero/hero-01.jpg";
const HERO_DETAIL = "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/hero/hero-02.png";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // 1. Загрузка: «шторка» заголовка + каскад остального
      const lines = element.querySelectorAll<HTMLElement>("[data-line]");
      const copy = element.querySelectorAll<HTMLElement>("[data-hero-copy]");
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(lines, { yPercent: 110, clipPath: "inset(100% 0% 0% 0%)", duration: 1.1, stagger: 0.14 })
        .from(copy, { y: 28, opacity: 0, clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, stagger: 0.1, clearProps: "clipPath" }, "-=0.75")
        .from("[data-hero-scene]", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "power4.inOut", clearProps: "clipPath" }, 0.1);

      // 2. Скролл-параллакс: один ScrollTrigger на всю секцию
      gsap.timeline({ scrollTrigger: { trigger: element, start: "top top", end: "bottom top", scrub: true } })
        .to("[data-parallax-grid]", { yPercent: 25, ease: "none" }, 0)
        .to("[data-parallax-copy]", { yPercent: -10, ease: "none" }, 0)
        .to("[data-parallax-scene]", { yPercent: 8, ease: "none" }, 0)
        .to("[data-parallax-image]", { yPercent: 14, ease: "none" }, 0);

      // 3. Параллакс от мыши (слои двигаются с разной скоростью)
      const fine = window.matchMedia("(pointer: fine)").matches;
      const cleanups: Array<() => void> = [];
      if (fine) {
        const grid = element.querySelector<HTMLElement>("[data-mouse-grid]");
        const img = element.querySelector<HTMLElement>("[data-mouse-image]");
        const txt = element.querySelector<HTMLElement>("[data-mouse-copy]");
        const q = (target: HTMLElement | null) =>
          target ? { x: gsap.quickTo(target, "x", { duration: 0.9, ease: "power3.out" }), y: gsap.quickTo(target, "y", { duration: 0.9, ease: "power3.out" }) } : null;
        const g = q(grid), i = q(img), c = q(txt);
        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const b = element.getBoundingClientRect();
          const x = ((e.clientX - b.left) / b.width - 0.5) * 2;
          const y = ((e.clientY - b.top) / b.height - 0.5) * 2;
          g?.x(x * -22); g?.y(y * -16);
          i?.x(x * 14); i?.y(y * 10);
          c?.x(x * -6); c?.y(y * -4);
        };
        element.addEventListener("pointermove", onMove);
        cleanups.push(() => element.removeEventListener("pointermove", onMove));

        // 4. Магнитные кнопки: один слушатель на все
        const magnets = Array.from(element.querySelectorAll<HTMLElement>("[data-magnetic]")).map((btn) => ({
          btn,
          x: gsap.quickTo(btn, "x", { duration: 0.7, ease: "elastic.out(1, 0.5)" }),
          y: gsap.quickTo(btn, "y", { duration: 0.7, ease: "elastic.out(1, 0.5)" }),
        }));
        const onMagnet = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          for (const m of magnets) {
            const r = m.btn.getBoundingClientRect();
            const cx = r.left + r.width / 2 - Number(gsap.getProperty(m.btn, "x"));
            const cy = r.top + r.height / 2 - Number(gsap.getProperty(m.btn, "y"));
            const dx = e.clientX - cx, dy = e.clientY - cy;
            const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9;
            m.x(near ? dx * 0.3 : 0);
            m.y(near ? dy * 0.3 : 0);
          }
        };
        window.addEventListener("pointermove", onMagnet, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMagnet));
      }
      return () => cleanups.forEach((fn) => fn());
    }, element);

    return () => context.revert();
  }, []);

  const phone = PHONES[0];

  return (
    <section ref={root} id="top" className="relative isolate overflow-hidden bg-white px-5 pb-20 pt-28 text-ink sm:px-8 lg:min-h-[min(850px,100svh)] lg:px-10 lg:pb-24 lg:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[72%] bg-[linear-gradient(115deg,#fff_0%,#fff_55%,#f5f5f3_100%)]" />
      <div data-mouse-grid className="pointer-events-none absolute -inset-10 -z-10 will-change-transform">
        <div data-parallax-grid className="h-full w-full opacity-60 will-change-transform [background-image:linear-gradient(rgba(30,30,30,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,.05)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
        <div data-mouse-copy className="relative z-10 will-change-transform">
          <div data-parallax-copy className="will-change-transform">
            <p data-hero-copy className="mb-7 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.24em] text-muted sm:text-xs">
              <span className="h-[2px] w-8 bg-[#c62828]" /> Иваново · Производство · с 2010 года
            </p>
            <h1 aria-label="Надёжный партнёр" className="max-w-[850px] text-[clamp(3rem,7.3vw,7.2rem)] font-black leading-[.88] tracking-[-.065em]">
              <span aria-hidden="true" className="-mb-[.1em] block overflow-hidden pb-[.1em]"><span data-line className="block will-change-transform">Надёжный</span></span>
              <span aria-hidden="true" className="-mb-[.1em] block overflow-hidden pb-[.1em]"><span data-line className="block text-[#c62828] will-change-transform">партнёр</span></span>
            </h1>
            <p data-hero-copy className="mt-8 max-w-xl text-base leading-7 text-ink/65 sm:text-lg sm:leading-8">
              Производство, поставка и монтаж противопожарных преград и специальных дверей для коммерческих, промышленных и общественных объектов.
            </p>
            <div data-hero-copy className="mt-9 flex flex-wrap items-center gap-4">
              <a data-magnetic href="#kp" className="group inline-flex min-h-14 items-center justify-center bg-[#c62828] px-7 text-xs font-extrabold uppercase tracking-[.12em] text-white transition-colors duration-300 will-change-transform hover:bg-[#a91f1f] sm:px-9">
                Обсудить проект <span className="ml-5 text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
              </a>
              <a data-magnetic href="#catalog" className="inline-flex min-h-14 items-center border-b-2 border-ink px-1 text-xs font-extrabold uppercase tracking-[.12em] transition-colors duration-300 will-change-transform hover:border-[#c62828] hover:text-[#c62828]">
                Каталог продукции
              </a>
            </div>
            <div data-hero-copy className="relative isolate mt-14 grid max-w-xl grid-cols-3 overflow-hidden border-t border-line pt-5">
              <div><strong className="block text-3xl font-black tracking-tight sm:text-4xl">15<span className="text-[#c62828]">+</span></strong><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">лет опыта</span></div>
              <div><strong className="block text-3xl font-black tracking-tight sm:text-4xl">100%</strong><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">контроль качества</span></div>
              <div><strong className="block text-3xl font-black tracking-tight sm:text-4xl">B2B</strong><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-muted sm:text-xs">комплексные объекты</span></div>
            </div>
            <a data-hero-copy data-magnetic href={phone.href} className="mt-7 inline-flex items-center gap-3 text-sm font-extrabold transition-colors duration-300 will-change-transform hover:text-[#c62828]"><span className="flex h-9 w-9 items-center justify-center bg-[#c62828] text-white">↗</span>{phone.label}</a>
          </div>
        </div>

        <div data-parallax-scene className="relative mx-auto w-full max-w-[720px] will-change-transform">
          <div data-hero-scene>
            <div className="absolute -right-3 -top-3 h-full w-full border-2 border-[#c62828] sm:-right-5 sm:-top-5" />
            <div className="relative aspect-[4/4.7] overflow-hidden bg-[#ececea]">
              <div data-mouse-image className="absolute -inset-6 will-change-transform">
                <img data-parallax-image src={HERO_IMAGE} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-25 grayscale will-change-transform" />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(255,255,255,.92),rgba(255,255,255,0)_72%)]" />
              <Suspense fallback={null}><DoorScene /></Suspense>
              <div className="absolute left-5 top-5 border border-ink/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-ink sm:left-8 sm:top-8">Надёжность в деталях</div>
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-ink sm:bottom-8 sm:left-8 sm:right-8">
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-ink/60">Производство и монтаж</p><p className="mt-2 max-w-[14ch] text-2xl font-black leading-none sm:text-4xl">Защита, которой доверяют</p></div>
                <span className="border border-ink/40 p-3 text-xl">↗</span>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-5 hidden w-[34%] border-[6px] border-white shadow-xl sm:block">
              <img src={HERO_DETAIL} alt="Деталь металлической дверной конструкции" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
            </div>
            <span className="absolute -bottom-10 right-0 text-[9px] font-bold uppercase tracking-[.2em] text-muted">01 / Иваново · Россия</span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[9px] font-bold uppercase tracking-[.25em] text-muted lg:block">Листайте, чтобы узнать больше ↓</div>
    </section>
  );
}
