import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG } from "../data/content";
import { proxied } from "../lib/img";

gsap.registerPlugin(ScrollTrigger);

const TITLE = ["Противопожарные", "преграды и", "специальные двери"];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type DOEWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    // Все эффекты только если пользователь не отключил анимации в системе
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const q = gsap.utils.selector(el);
        const tilt = el.querySelector<HTMLElement>("[data-tilt]")!;
        const back = el.querySelector<HTMLElement>("[data-back]")!;
        const img = el.querySelector<HTMLElement>("[data-img]")!;
        const cap = el.querySelector<HTMLElement>("[data-cap]")!;

        // 1. Появление: заголовок «шторкой» (clip-path), затем остальное
        gsap.set(img, { scale: 1.12 });
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(q("[data-label]"), { opacity: 0, y: 14, duration: 0.8 })
          .fromTo(
            q("[data-line]"),
            { clipPath: "inset(0% 0% 100% 0%)", yPercent: 40 },
            { clipPath: "inset(0% 0% -20% 0%)", yPercent: 0, duration: 1.1, stagger: 0.12 },
            0.1
          )
          .fromTo(
            q("[data-imgwrap]"),
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut" },
            0.2
          )
          .from(q("[data-fade]"), { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, 0.7)
          .from(cap, { opacity: 0, y: 24, duration: 0.9 }, 1.1);

        // 2. Параллакс при прокрутке (фото смещается медленнее страницы)
        gsap.to(img, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });

        // 3. 3D-параллакс: мышь на компьютере, наклон телефона на мобильных
        gsap.set(tilt, { transformPerspective: 1100, transformOrigin: "50% 50%" });
        const opt = { duration: 0.9, ease: "power3.out" };
        const s = {
          ry: gsap.quickTo(tilt, "rotationY", opt),
          rx: gsap.quickTo(tilt, "rotationX", opt),
          bx: gsap.quickTo(back, "x", opt),
          by: gsap.quickTo(back, "y", opt),
          ix: gsap.quickTo(img, "x", opt),
          iy: gsap.quickTo(img, "y", opt),
          cx: gsap.quickTo(cap, "x", opt),
          cy: gsap.quickTo(cap, "y", opt),
        };
        const apply = (nx: number, ny: number) => {
          s.ry(nx * 9);
          s.rx(-ny * 9);
          s.bx(-nx * 18);
          s.by(-ny * 18);
          s.ix(nx * 12);
          s.iy(ny * 12);
          s.cx(nx * 26);
          s.cy(ny * 26);
        };

        const onMove = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const r = el.getBoundingClientRect();
          apply(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2);
        };
        const onLeave = () => apply(0, 0);
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        const onOrient = (e: DeviceOrientationEvent) => {
          if (e.gamma == null || e.beta == null) return;
          apply(clamp(e.gamma / 25, -1, 1), clamp((e.beta - 45) / 25, -1, 1));
        };
        let listening = false;
        const listen = () => {
          if (listening) return;
          listening = true;
          window.addEventListener("deviceorientation", onOrient);
        };

        const DOE = window.DeviceOrientationEvent as DOEWithPermission | undefined;
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        // iOS требует разрешения по касанию: системный запрос появится при первом касании экрана
        const onTouch = () => {
          el.removeEventListener("touchend", onTouch);
          DOE?.requestPermission?.()
            .then((state) => state === "granted" && listen())
            .catch(() => undefined);
        };
        if (coarse && DOE) {
          if (typeof DOE.requestPermission === "function") el.addEventListener("touchend", onTouch, { passive: true });
          else listen();
        }

        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          el.removeEventListener("touchend", onTouch);
          window.removeEventListener("deviceorientation", onOrient);
        };
      },
      el
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="top" className="overflow-hidden bg-white px-6 pt-24 text-ink lg:px-10 lg:pt-28">
      <div className="mx-auto grid min-h-[min(780px,calc(100svh-6rem))] max-w-[1400px] grid-cols-1 items-center gap-14 pb-16 md:grid-cols-[1fr_.9fr] lg:gap-16">
        <div>
          <p data-label className="mb-6 text-xs font-bold uppercase tracking-[.22em] text-muted">
            Надёжный партнёр · Иваново
          </p>

          <h1
            aria-label="Противопожарные преграды и специальные двери"
            className="text-[clamp(1.85rem,4.8vw,4.5rem)] font-extrabold leading-[1.04] tracking-tight"
          >
            {TITLE.map((line) => (
              <span key={line} aria-hidden="true" className="block pb-[.08em]">
                <span data-line className="block will-change-transform">{line}</span>
              </span>
            ))}
          </h1>

          <p data-fade className="mt-7 max-w-xl text-lg leading-8 text-muted md:text-xl">
            Производим противопожарные и входные металлические двери, поставляем и монтируем специальные конструкции.
          </p>

          <div data-fade className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#kp" className="btn px-8 py-4 text-base">Получить коммерческое предложение</a>
            <a href="#catalog" className="text-sm font-bold underline decoration-ink decoration-2 underline-offset-8">
              Смотреть каталог
            </a>
          </div>

          <dl data-fade className="mt-14 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-6">
            <div className="flex flex-col-reverse">
              <dt className="text-xs text-muted">лет опыта</dt>
              <dd className="text-3xl font-extrabold">15</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-xs text-muted">производство</dt>
              <dd className="text-3xl font-extrabold">Своё</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-xs text-muted">монтаж и обслуживание</dt>
              <dd className="text-3xl font-extrabold">Лицензия МЧС</dd>
            </div>
          </dl>
        </div>

        {/* 3D-сцена */}
        <div className="relative mx-auto w-full max-w-[560px] pb-8">
          <div data-tilt className="relative will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <div data-back aria-hidden="true" className="absolute left-4 top-4 h-full w-full border border-ink" />
            <div data-imgwrap className="relative aspect-[4/5] overflow-hidden border border-line bg-soft">
              <img
                data-img
                src={proxied(IMG.door1, 1100)}
                alt="Противопожарная дверь из каталога компании"
                width={1100}
                height={1375}
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
              />
            </div>
            <div data-cap className="absolute -bottom-6 left-0 w-[78%] border border-line bg-white p-5 sm:-left-6">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Производство и поставка</p>
              <p className="mt-2 text-base font-bold">Противопожарные дверные конструкции</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
