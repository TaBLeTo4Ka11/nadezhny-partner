import { useEffect } from "react";
import { catalogCategories, productImages } from "../data/companyContent";
import type { Product } from "../data/catalogPages";

const imageFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f1f1ef'/%3E%3Cpath d='M310 470V130h180v340M280 470h240' fill='none' stroke='%23999' stroke-width='12'/%3E%3Ctext x='400' y='535' text-anchor='middle' font-family='Arial' font-size='24' fill='%23666'%3E%D0%A4%D0%BE%D1%82%D0%BE%20%D1%83%D1%82%D0%BE%D1%87%D0%BD%D1%8F%D0%B5%D1%82%D1%81%D1%8F%3C/text%3E%3C/svg%3E";

export default function CategoryPage({ slug }: { slug: string }) {
  const item = catalogCategories.find((category) => category.slug === slug);
  const products = item?.products ?? [];
  const images = item?.name === "Противопожарные двери"
    ? productImages.filter(product => /^ДМП-/.test(product.title))
    : item?.name === "Противопожарные ворота"
      ? productImages.filter(product => product.title === "Противопожарные ворота")
      : item?.name === "Противопожарные шторы"
        ? productImages.filter(product => product.title === "Противопожарные шторы")
        : [];

  const productCards: Product[] = products.map((product) => ({
    id: String(product.id),
    name: product.title,
    description: "Описание и комплектация уточняются у компании.",
    specs: [],
    images: product.images.length > 0 ? product.images : product.image ? [product.image] : [],
    colors: [],
    price: null,
  }));

  useEffect(() => {
    document.title = item ? `${item.name} — Надёжный партнёр` : "Раздел не найден — Надёжный партнёр";
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", item
      ? `${item.name}. Сведения и ассортимент уточняйте на исходном сайте компании.`
      : "Раздел не найден.");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.setAttribute("name", "robots"); document.head.appendChild(robots); }
    robots.setAttribute("content", item ? "noindex, follow" : "noindex, nofollow");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (item) canonical?.setAttribute("href", `https://iv-partner.ru/catalog/${slug}/`);
    else canonical?.remove();
  }, [item?.name, slug]);

  if (!item) return <main className="min-h-screen bg-white p-10"><h1 className="text-4xl font-extrabold">Раздел не найден</h1><a href="/#catalog" className="btn mt-8">Вернуться в каталог</a></main>;

  return <>
    <header className="border-b border-line bg-white px-6 py-5">
      <div className="mx-auto flex max-w-[1400px] justify-between"><a href="/" className="font-extrabold uppercase">Надёжный партнёр</a><a href="/#catalog">← Весь каталог</a></div>
    </header>
    <main className="min-h-[70vh] bg-white px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-brand">{item.parentName || item.name}</p>
        <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none">{item.name}</h1>
        {images.length > 0 && <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map(image => <figure key={image.src} className="overflow-hidden border border-line">
            <img src={image.src} alt={image.title} loading="lazy" className="aspect-[4/3] w-full object-cover" onError={(event) => { event.currentTarget.src = imageFallback; }} />
            <figcaption className="p-4 text-sm font-semibold">{image.title}</figcaption>
          </figure>)}
        </section>}
        {productCards.length > 0 ? <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-extrabold">Модели и изделия</h2>
            <p className="text-sm text-muted">Стоимость и комплектация — по запросу</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productCards.map((product) => <article key={product.id} className="flex h-full flex-col overflow-hidden border border-line bg-white transition-shadow hover:shadow-lg">
              <div className="bg-[#f3f3f1]">
                <img
                  src={product.images[0] || imageFallback}
                  alt={product.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-contain"
                  onError={(event) => { event.currentTarget.src = imageFallback; }}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{product.description}</p>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Характеристики</p>
                  {product.specs.length > 0
                    ? <ul className="mt-2 space-y-1 text-sm">{product.specs.map((spec) => <li key={spec}>{spec}</li>)}</ul>
                    : <p className="mt-2 text-sm text-muted">Уточняются при запросе</p>}
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Цвета</p>
                  {product.colors.length > 0
                    ? <div className="mt-2 flex flex-wrap gap-2" aria-label="Доступные цвета">
                        {product.colors.map((color) => <span key={color} title={color} aria-label={color} className="h-6 w-6 rounded-full border border-black/20" style={{ backgroundColor: color }} />)}
                      </div>
                    : <p className="mt-2 text-sm text-muted">Подбор цвета — по запросу</p>}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <span className="text-sm font-bold">{product.price || "Цена по запросу"}</span>
                  <a href="/#kp" className="border border-ink px-4 py-2.5 text-center text-sm font-semibold transition-colors hover:bg-ink hover:text-white">Запросить цену</a>
                </div>
              </div>
            </article>)}
          </div>
          <details className="mt-8 border-y border-line py-4">
            <summary className="cursor-pointer text-sm font-semibold">Список исходных позиций и ссылки</summary>
            <ul className="mt-4 divide-y divide-line">
              {products.map(product => <li key={product.sourceUrl} className="py-4 font-semibold">{product.localPath ? <a href={product.localPath} className="underline decoration-transparent underline-offset-4 hover:text-brand hover:decoration-brand">{product.title}</a> : product.title}</li>)}
            </ul>
          </details>
        </section> : <section className="mt-12">
          <h2 className="mb-6 text-2xl font-extrabold">Ассортимент раздела</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="flex h-full flex-col overflow-hidden border border-line bg-white">
              <div className="bg-[#f3f3f1]">
                <img src={imageFallback} alt="Изображение уточняется" className="aspect-[4/3] w-full object-contain" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold leading-snug">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">Уточняйте у менеджера</p>
                <p className="mt-4 text-sm text-muted">Характеристики и доступные варианты — по запросу</p>
                <a href="/#kp" className="mt-auto inline-flex min-h-11 items-center justify-center border border-ink px-4 py-3 text-sm font-semibold transition-colors hover:bg-ink hover:text-white">Запросить цену</a>
              </div>
            </article>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">Карточка показывает структуру раздела. Реальные модели, изображения и характеристики будут добавлены после проверки исходных данных компании.</p>
        </section>}
        <div className="mt-10 flex flex-wrap gap-5">
          <a href="/#kp" className="border border-ink px-6 py-3 text-sm font-semibold">Связаться с компанией</a>
        </div>
      </div>
    </main>
    <footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
  </>;
}
