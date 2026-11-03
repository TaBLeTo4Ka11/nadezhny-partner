import { useEffect } from "react";
import { company } from "../data/companyContent";
import { verifiedCategoryProducts } from "../data/companyContent";
import { catalogPageBySlug, catalogPages } from "../data/catalogPages";

type Props = { slug: string };

export default function CategoryPage({ slug }: Props) {
  const page = catalogPageBySlug[slug];
  const products = page ? verifiedCategoryProducts.filter((product) => product.category === page.title || (page.slug === "bankovskie-lotki" && product.category === "Банковские лотки")) : [];

  useEffect(() => {
    if (!page) {
      document.title = "Раздел не найден — " + company.name;
      return;
    }
    document.title = page.title + " — " + company.name + " | Иваново";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", page.description);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + "/catalog/" + page.slug + "/";
  }, [page]);

  if (!page) {
    return (
      <main className="min-h-screen bg-white px-6 py-24 text-ink">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-muted">404</p>
          <h1 className="mt-4 text-4xl font-extrabold">Раздел не найден</h1>
          <a className="btn mt-8" href="/">Вернуться на главную</a>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-5 px-6 py-5 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <img src="https://iv-partner.ru/wp-content/uploads/2021/08/dveri-300x301.png" alt="" className="h-10 w-10 object-contain" />
            <span className="text-sm font-extrabold uppercase tracking-wider">Надёжный партнёр</span>
          </a>
          <a href="/#catalog" className="text-sm font-semibold hover:text-brand">Весь каталог ↗</a>
        </div>
      </header>
      <main>
        <section className="border-b border-line bg-soft px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-[1400px] text-sm text-muted">
            <a href="/" className="hover:text-brand">Главная</a><span className="px-2">/</span><a href="/#catalog" className="hover:text-brand">Каталог</a><span className="px-2">/</span><span className="text-ink">{page.title}</span>
          </div>
        </section>
        <section className="px-6 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">{page.group}</p>
              <h1 className="max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[.98] tracking-tight">{page.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">{page.description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="/#kp" className="btn px-8 py-4">Запросить коммерческое предложение</a>
                <a href={page.sourceUrl} target="_blank" rel="noreferrer" className="border border-ink px-7 py-4 text-sm font-semibold transition hover:bg-ink hover:text-white">Открыть исходный каталог ↗</a>
              </div>
            </div>
            <div className="overflow-hidden border border-line bg-soft lg:col-span-5">
              <img src={page.image} alt={page.title} className="aspect-[4/3] h-full w-full object-cover" />
            </div>
          </div>
        </section>
        <section className="bg-soft px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-muted">Ассортимент</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Позиции и комплектация</h2>
            {products.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <a key={product.href} href={product.href} target="_blank" rel="noreferrer" className="border border-line bg-white p-6 transition-colors hover:border-brand">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">{product.category}</span>
                    <h3 className="mt-3 text-lg font-bold">{product.title}</h3>
                    <span className="mt-6 inline-block text-sm font-semibold text-brand">Подробнее ↗</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted">
                Подробные характеристики, размеры и комплектация согласуются с менеджером по техническому заданию. Мы не публикуем неподтверждённые модели и параметры: отправьте запрос, чтобы получить информацию по вашему объекту.
              </p>
            )}
          </div>
        </section>
        <section className="px-6 py-16 lg:px-10">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6 border-t-2 border-ink pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-muted">Надёжный партнёр · Иваново</p><h2 className="mt-3 text-3xl font-extrabold">Нужна консультация по объекту?</h2></div>
            <a href="/#kp" className="btn">Связаться с компанией</a>
          </div>
        </section>
      </main>
      <footer className="bg-graphite px-6 py-8 text-sm text-white lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {company.name}</span>
          <div className="flex gap-5"><a href="/" className="hover:text-white/70">Главная</a><a href="/#contacts" className="hover:text-white/70">Контакты</a></div>
        </div>
      </footer>
    </div>
  );
}
