import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalog, catalogUrls, catalogProductLinks, productImages } from "../data/companyContent";

gsap.registerPlugin(ScrollTrigger);

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    if (!normalized) return catalog;
    return catalog
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          (group.group + " " + item).toLocaleLowerCase("ru").includes(normalized)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-catalog-card]", {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-catalog-grid]", start: "top 88%", once: true },
      });
      gsap.from("[data-product-image]", {
        scale: 1.08,
        duration: 1.1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-product-grid]", start: "top 88%", once: true },
      });
    }, element);
    return () => context.revert();
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [query]);

  return (
    <section ref={root} id="catalog" className="scroll-mt-20 bg-white px-6 py-24 text-ink lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 border-b-2 border-ink pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">Производство и поставка</p>
            <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-[.92] tracking-tight">Каталог</h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-muted md:text-right">
            Противопожарные конструкции, входные и бронированные двери, деревянные дверные блоки и специальная фурнитура.
          </p>
        </div>

        <div data-product-grid className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {productImages.map((product, index) => (
            <a
              key={product.title}
              href={product.href}
              className={"group relative isolate block overflow-hidden border border-line bg-soft " + (index === 0 ? "col-span-2 aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:aspect-auto" : "aspect-[4/5]")}
            >
              <img
                data-product-image
                src={product.src}
                alt={product.title}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-white/95 px-4 py-4 text-sm font-bold backdrop-blur-sm">
                <span>{product.title}</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-24 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-muted">Все направления</p>
            <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">Разделы продукции</h3>
          </div>
          <label className="block w-full md:max-w-sm">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Поиск по каталогу</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название двери или категории"
              aria-label="Поиск по категориям каталога"
              className="w-full rounded-none border-0 border-b border-ink bg-transparent px-0 py-3 text-base text-ink outline-none placeholder:text-muted/70 focus:border-b-2"
            />
          </label>
        </div>

        <div data-catalog-grid className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {filtered.map((group) => {
            const index = catalog.findIndex((item) => item.group === group.group);
            return (
              <article data-catalog-card key={group.group} className="group flex min-h-[270px] flex-col border border-line bg-white p-6 transition-colors duration-300 hover:border-ink sm:p-8">
                <div className="mb-6 flex items-start justify-between gap-4 border-b border-line pb-5">
                  <h4 className="max-w-[18ch] text-xl font-extrabold leading-tight tracking-tight">{group.group}</h4>
                  <span className="text-xs font-semibold tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul className="flex-1 space-y-3">
                  {group.items.map((item) => (
                    <li key={item}>
                      <a
                        href={catalogUrls[item] ?? "#kp"}
                        className="inline-flex items-start gap-3 text-sm leading-6 text-ink/75 underline decoration-transparent underline-offset-4 transition hover:text-ink hover:decoration-ink"
                      >
                        <span aria-hidden="true" className="text-brand">↗</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                <a href="#kp" className="mt-8 inline-flex items-center gap-3 self-start text-xs font-bold uppercase tracking-wider">
                  Запросить предложение <span aria-hidden="true">→</span>
                </a>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 border border-line bg-soft px-6 py-10 text-center">
            <p className="font-semibold">По запросу «{query}» ничего не найдено.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-3 text-sm font-bold underline underline-offset-4">Сбросить поиск</button>
          </div>
        )}

        <div className="mt-24 border-t border-line pt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-muted">Специальные решения</p>
              <h3 className="text-2xl font-extrabold tracking-tight md:text-3xl">Банковские передаточные устройства</h3>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted">Оборудование для передачи ценностей и документов через защищённые зоны.</p>
          </div>
          <ol className="mt-8 divide-y divide-line border-y border-line">
            {catalogProductLinks.map((product, index) => (
              <li key={product.sourceUrl} className="flex items-start gap-4 py-5">
                <span className="pt-0.5 text-xs tabular-nums text-muted">{String(index + 1).padStart(2, "0")}</span>
                <a href={product.localPath} className="font-semibold underline decoration-transparent underline-offset-4 hover:decoration-ink">{product.title}</a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
