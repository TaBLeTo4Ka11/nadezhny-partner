import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalog, catalogUrls, productImages, catalogProductLinks } from "../data/companyContent";

gsap.registerPlugin(ScrollTrigger);

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    if (!normalized) return catalog;
    return catalog
      .map((group) => {
        const groupMatches = group.group.toLocaleLowerCase("ru").includes(normalized);
        return {
          ...group,
          items: groupMatches
            ? group.items
            : group.items.filter((item) => item.toLocaleLowerCase("ru").includes(normalized)),
        };
      })
      .filter((group) => group.items.length > 0);
  }, [query]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-category]", root.current ?? undefined);
      gsap.set(cards, { opacity: 0, y: 28 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="catalog" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">Ассортимент продукции</p>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Каталог</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
              Основные направления производства и поставки. Подробности по исполнению и комплектации можно уточнить при запросе коммерческого предложения.
            </p>
          </div>
          <label className="block w-full md:max-w-sm">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Поиск по каталогу</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например, противопожарные двери"
              className="w-full border-b border-ink bg-transparent px-0 py-3 text-base text-ink outline-none placeholder:text-muted/70 focus:border-brand"
              aria-label="Поиск по категориям каталога"
            />
          </label>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {filteredCatalog.map((group) => {
            const originalIndex = catalog.findIndex((item) => item.group === group.group);
            return (
              <article data-category key={group.group} className="border border-line bg-white p-7 transition-colors hover:border-brand">
                <div className="mb-6 flex items-center justify-between border-b-2 border-ink pb-4">
                  <h3 className="text-xl font-extrabold tracking-tight">{group.group}</h3>
                  <span className="text-xs font-semibold text-muted">{String(originalIndex + 1).padStart(2, "0")}</span>
                </div>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-ink/80">
                      <span className="font-bold text-brand" aria-hidden="true">↗</span>
                      {catalogUrls[item] ? (
                        <a href={catalogUrls[item]} className="underline decoration-transparent underline-offset-4 transition hover:text-brand hover:decoration-brand">{item}</a>
                      ) : <span>{item}</span>}
                    </li>
                  ))}
                </ul>
                <a href="#kp" className="btn mt-7">Запросить КП</a>
              </article>
            );
          })}
        </div>
        {filteredCatalog.length === 0 && (
          <div className="mt-8 border border-line bg-soft px-6 py-10 text-center">
            <p className="font-semibold">По запросу «{query}» ничего не найдено.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-3 text-sm font-semibold text-brand underline underline-offset-4">Сбросить поиск</button>
          </div>
        )}

        <div className="mt-16">
          <h3 className="text-2xl font-extrabold tracking-tight">Примеры продукции</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {productImages.map((product) => (
              <a key={product.src} href={product.href} target="_blank" rel="noreferrer" className="group overflow-hidden border border-line bg-soft transition-colors hover:border-brand">
                <figure>
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={product.src} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <figcaption className="flex items-center justify-between gap-3 p-4 text-sm font-semibold">
                    <span>{product.title}</span><span className="text-brand" aria-hidden="true">↗</span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Сохранённые названия</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Товары из исходного каталога</h3>
            </div>
            <p className="max-w-lg text-sm leading-6 text-muted">Названия сохранены из предыдущего извлечения. Полные описания и характеристики пока не восстановлены и требуют повторной сверки.</p>
          </div>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {catalogProductLinks.map((product, index) => (
              <div key={product.sourceUrl} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-start gap-4">
                  <span className="pt-0.5 text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{product.title}</span>
                </span>
                <span className="flex items-center gap-3 pl-8 text-xs text-muted sm:pl-0">
                  <span>{product.category}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 text-xs leading-6 text-muted">
          Это не полный каталог. Исходные адреса карточек не публикуются как активные ссылки, поскольку после замены сайта на домене iv-partner.ru они могут вести обратно на новый сайт или на несуществующие страницы. Ссылки и характеристики будут возвращены после повторной проверки и переноса карточек.
        </p>
      </div>
    </section>
  );
}
