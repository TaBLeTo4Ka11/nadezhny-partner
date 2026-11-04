import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalog, catalogUrls, catalogProductLinks, productImages } from "../data/companyContent";
import { proxied } from "../lib/img";

gsap.registerPlugin(ScrollTrigger);

const SHUTTER_HIDDEN = "inset(100% 0% 0% 0%)";
const SHUTTER_SHOWN = "inset(0% 0% 0% 0%)";

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const n = query.trim().toLocaleLowerCase("ru");
    if (!n) return catalog;
    return catalog
      .map((g) => ({
        ...g,
        items: g.group.toLocaleLowerCase("ru").includes(n)
          ? g.items
          : g.items.filter((i) => i.toLocaleLowerCase("ru").includes(n)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);

      // Заголовки: «шторка» (clip-path) при входе в экран
      q("[data-title]").forEach((t) => {
        gsap.fromTo(
          t,
          { clipPath: "inset(0% 0% 100% 0%)", yPercent: 35 },
          {
            clipPath: "inset(0% 0% -20% 0%)",
            yPercent: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: t, start: "top 90%", once: true },
          }
        );
      });

      // Карточки: шторка снизу вверх со сдвигом по очереди
      const cards = q("[data-card]");
      gsap.set(cards, { clipPath: SHUTTER_HIDDEN });
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            clipPath: SHUTTER_SHOWN,
            duration: 1,
            ease: "power4.out",
            stagger: 0.1,
            clearProps: "clipPath",
          }),
      });

      // Фото внутри карточек слегка «оседают» при появлении
      q("[data-zoom]").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.18 },
          { scale: 1, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: img, start: "top 92%", once: true } }
        );
      });
    }, el);

    return () => mm.revert();
  }, []);

  // После фильтрации высота страницы меняется — пересчитать триггеры
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [query]);

  return (
    <section ref={root} id="catalog" className="scroll-mt-20 bg-white px-6 py-24 text-ink lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">Ассортимент продукции</p>
        <h2 data-title className="text-[clamp(2.25rem,6vw,5rem)] font-extrabold leading-none tracking-tight">
          Каталог
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
          Основные направления производства и поставки. Подробности по исполнению и комплектации можно уточнить при запросе коммерческого предложения.
        </p>

        {/* Примеры продукции: крупная сетка с zoom при наведении */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {productImages.map((p, i) => (
            <a
              key={p.src}
              data-card
              href={p.href}
              className={
                "group relative block overflow-hidden border border-line bg-soft " +
                (i === 0 ? "col-span-2 aspect-[4/3] lg:aspect-auto lg:row-span-2" : "aspect-[4/5]")
              }
            >
              <img
                data-zoom
                src={proxied(p.src, i === 0 ? 1100 : 700)}
                alt={p.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-white px-4 py-3 text-sm font-bold sm:px-5 sm:py-4">
                <span>{p.title}</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>

        {/* Разделы каталога + поиск */}
        <div className="mt-24 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h3 data-title className="text-3xl font-extrabold tracking-tight md:text-4xl">Разделы</h3>
          <label className="block w-full md:max-w-sm">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Поиск по каталогу</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например, противопожарные двери"
              aria-label="Поиск по категориям каталога"
              className="w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-3 text-base text-ink outline-none placeholder:text-muted/70 focus:border-b-2"
            />
          </label>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {filtered.map((g) => {
            const index = catalog.findIndex((x) => x.group === g.group);
            return (
              <article data-card key={g.group} className="flex flex-col border border-line bg-white p-7">
                <div className="mb-6 flex items-center justify-between border-b-2 border-ink pb-4">
                  <h4 className="text-xl font-extrabold tracking-tight">{g.group}</h4>
                  <span className="text-xs font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul className="flex-1 space-y-3">
                  {g.items.map((item) => (
                    <li key={item} className="text-sm leading-6">
                      {catalogUrls[item] ? (
                        <a
                          href={catalogUrls[item]}
                          className="inline-flex gap-3 text-ink/80 underline decoration-transparent underline-offset-4 transition hover:text-ink hover:decoration-ink"
                        >
                          <span aria-hidden="true">→</span>
                          {item}
                        </a>
                      ) : (
                        <span className="inline-flex gap-3 text-ink/80">
                          <span aria-hidden="true">→</span>
                          {item}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <a href="#kp" className="btn mt-7 self-start">Запросить КП</a>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 border border-line bg-soft px-6 py-10 text-center">
            <p className="font-semibold">По запросу «{query}» ничего не найдено.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-3 text-sm font-bold underline underline-offset-4">
              Сбросить поиск
            </button>
          </div>
        )}

        {/* Банковские передаточные устройства: названия из исходного каталога */}
        <div className="mt-20 border-t border-line pt-10">
          <h3 data-title className="text-2xl font-extrabold tracking-tight md:text-3xl">Банковские передаточные устройства</h3>
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {catalogProductLinks.map((p, i) => (
              <li key={p.sourceUrl} className="flex items-start gap-4 py-5">
                <span className="pt-0.5 text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold">{p.title}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-6 text-muted">
            Список не является полным каталогом: полные карточки и характеристики будут добавлены после проверки.
          </p>
        </div>
      </div>
    </section>
  );
}
