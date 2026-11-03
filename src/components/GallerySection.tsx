import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SITE = "https://iv-partner.ru/";
const PLACEHOLDER = "https://placehold.co/600x400/f8f9fa/1a1a1a?text=Photo";

const PROXIES = [
  (u: string) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
  (u: string) => "https://corsproxy.io/?" + encodeURIComponent(u),
];

// Запасной набор: ссылки, которые были присланы (5 шт.). Добавляйте сюда остальные.
const B = "https://iv-partner.ru/wp-content/uploads/2022/03/";
const FALLBACK: string[] = [
  B + "DMP-1-EIS60-e1647434608692.jpg",
  B + "DMP-2-EIS60-e1647434559868.jpg",
  B + "DMP-01-EIS60-e1647434479532.jpg",
  B + "vorota-protivopojarnie.jpg",
  B + "protivopojarniye-shtori.jpg",
];

// Разные пропорции — асимметричная «кирпичная» сетка
const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]", "aspect-[3/4]"];

async function fetchWithTimeout(url: string, ms: number) {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    window.clearTimeout(t);
  }
}

/** Достаёт ссылки на .jpg/.png из /wp-content/uploads/ */
function extractImages(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const found = new Set<string>();

  const add = (raw: string | null) => {
    if (!raw) return;
    raw.split(",").forEach((part) => {
      const u = part.trim().split(/\s+/)[0];
      if (!u) return;
      try {
        const abs = new URL(u, SITE).href;
        if (/^https:\/\/iv-partner\.ru\/wp-content\/uploads\/.+\.(jpe?g|png)(\?.*)?$/i.test(abs)) found.add(abs);
      } catch {
        /* битая ссылка — пропускаем */
      }
    });
  };

  doc.querySelectorAll("img, source, a").forEach((el) => {
    ["src", "data-src", "data-lazy-src", "srcset", "data-srcset", "href"].forEach((a) => add(el.getAttribute(a)));
  });

  return [...found].filter((u) => !/logo|dveri-300x301/i.test(u));
}

export default function GallerySection() {
  const root = useRef<HTMLElement>(null);
  const [images, setImages] = useState<string[]>(FALLBACK);

  // Пробуем получить фото с сайта; при любой ошибке остаётся FALLBACK
  useEffect(() => {
    let alive = true;
    (async () => {
      for (const proxy of PROXIES) {
        try {
          const res = await fetchWithTimeout(proxy(SITE), 8000);
          if (!res.ok) continue;
          const list = extractImages(await res.text());
          if (list.length >= 4) {
            if (alive) setImages(list.slice(0, 24));
            return;
          }
        } catch {
          /* следующий прокси */
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-g]", root.current ?? undefined);
      gsap.set(items, { opacity: 0, y: 40 });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, [images]);

  const onError = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fb) return; // без бесконечного цикла
    img.dataset.fb = "1";
    img.src = PLACEHOLDER;
  };

  return (
    <section ref={root} id="gallery" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Наши работы</h2>

        <div className="mt-14 columns-2 gap-4 md:columns-3 lg:columns-4">
          {images.map((src, i) => (
            <figure
              key={src}
              data-g
              className={"mb-4 break-inside-avoid overflow-hidden border border-line bg-soft " + ASPECTS[i % ASPECTS.length]}
            >
              <img
                src={src}
                alt={"Фото работы " + (i + 1)}
                loading="lazy"
                onError={onError}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}