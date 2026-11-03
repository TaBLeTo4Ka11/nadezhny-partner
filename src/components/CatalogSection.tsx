import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalog, productImages, verifiedCategoryProducts } from "../data/companyContent";
import { catalogPageByTitle } from "../data/catalogPages";

gsap.registerPlugin(ScrollTrigger);

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase("ru");
  const filteredCatalog = useMemo(() => {
    if (!normalizedQuery) return catalog;
    return catalog
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLocaleLowerCase("ru").includes(normalizedQuery)),
      }))
      .filter((group) => group.items.length > 0);
  }, [normalizedQuery]);

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return verifiedCategoryProducts;
    return verifiedCategoryProducts.filter((product) =>
      `${product.title} ${product.category}`.toLocaleLowerCase("ru").includes(normalizedQuery)
    );
  }, [normalizedQuery]);

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
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Каталог</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          Основные направления производства и поставки. Подробности по исполнению и комплектации можно уточнить при запросе коммерческого предложения.
        </p>

        <div className="mt-8 max-w-xl">
          <label htmlFor="catalog-search" className="mb-2 block text-sm font-semibold">Поиск по каталогу</label>
          <div className="flex border-b-2 border-ink">
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например, противопожарные двери"
              autoComplete="off"
              className="min-w-0 flex-1 border-0 bg-transparent px-0 py-4 text-base text-ink outline-none placeholder:text-muted"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="px-3 text-sm font-semibold text-brand" aria-label="Очистить поиск">
                Очистить
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted" aria-live="polite">
            {query
              ? `Найдено категорий: ${filteredCatalog.reduce((sum, group) => sum + group.items.length, 0)} · товаров: ${filteredProducts.length}`
              : "Поиск по названиям категорий, направлений и подтверждённых товаров."}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCatalog.map((group, index) => (
            <article data-category key={group.group} className="border border-line bg-white p-7 transition-colors hover:border-brand">
              <div className="mb-6 flex items-center justify-between border-b-2 border-ink pb-4">
                <h3 className="text-xl font-extrabold tracking-tight">{group.group}</h3>
                <span className="text-xs font-semibold text-muted">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-ink/80">
                    <span className="font-bold text-brand" aria-hidden="true">↗</span>
                    {catalogPageByTitle[item] ? (
                      <a href={"/catalog/" + catalogPageByTitle[item].slug + "/"} className="underline decoration-transparent underline-offset-4 transition hover:text-brand hover:decoration-brand">{item}</a>
                    ) : <span>{item}</span>}
                  </li>
                ))}
              </ul>
              <a href="#kp" className="btn mt-7">Запросить КП</a>
            </article>
          ))}
          {query && filteredCatalog.length === 0 && filteredProducts.length === 0 && (
            <p className="border border-line p-7 text-sm text-muted sm:col-span-2 lg:col-span-3">
              По запросу «{query}» ничего не найдено. Попробуйте изменить формулировку.
            </p>
          )}
          {query && filteredProducts.length > 0 && (
            <div className="border border-line p-6 sm:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-extrabold">Найденные товары</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {filteredProducts.map((product) => (
                  <li key={product.href} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <a href={product.localPath} className="font-semibold underline decoration-transparent underline-offset-4 hover:text-brand hover:decoration-brand">{product.title}</a>
                    <span className="text-xs text-muted">{product.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {!query && (
          <>
            <div className="mt-16">
              <h3 className="text-2xl font-extrabold tracking-tight">Примеры продукции</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {productImages.map((product) => (
                  <a key={product.src} href={product.href} className="group overflow-hidden border border-line bg-soft transition-colors hover:border-brand">
                    <figure>
                      <div className="aspect-[4/5] overflow-hidden">
                        <img src={product.src} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <figcaption className="flex items-center justify-between gap-3 p-4 text-sm font-semibold">
                        <span>{product.title}</span><span className="text-brand" aria-hidden="true">↗</span>
                      </figcaption>
                    </figure>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-14 border-t border-line pt-10">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Проверенные позиции</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight">Товары из исходного каталога</h3>
                </div>
                <p className="max-w-lg text-sm leading-6 text-muted">Позиции, названия и адреса страниц которых удалось подтвердить на сайте компании.</p>
              </div>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {filteredProducts.map((product, index) => (
                  <li key={product.href} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <a href={product.localPath} className="flex items-start gap-4 font-semibold underline decoration-transparent underline-offset-4 hover:text-brand hover:decoration-brand">
                      <span className="pt-0.5 text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                      <span>{product.title}</span>
                    </a>
                    <span className="pl-8 text-xs text-muted sm:pl-0">{product.category}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-5 text-xs leading-6 text-muted">
              Это не полный каталог: остальные карточки и характеристики будут добавляться только после проверки исходных страниц. Для полного ассортимента пока доступны ссылки на соответствующие разделы сайта компании.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
