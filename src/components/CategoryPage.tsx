import { useEffect } from "react";
import { catalog, productImages, catalogProductLinks } from "../data/companyContent";

const slugs: Record<string, string> = {
  "Двери с зеркалом": "dveri-s-zerkalom",
  "Двери с терморазрывом": "dveri-s-termorazryvom",
  "Двери МДФ-МДФ": "dveri-mdf-mdf",
  "Двери Металл-МДФ": "dveri-metall-mdf",
  "Двери металл-металл": "dveri-metall-metall",
  "Коттеджные двери со стеклопакетом": "kottedzhnye-dveri-so-steklopaketom",
  "Противопожарные двери": "protivopozharnye-dveri",
  "Противопожарные ворота": "protivopozharnye-vorota",
  "Противопожарные шторы": "protivopozharnye-shtory",
  "Противопожарные люки": "protivopozharnye-ljuki",
  "Светопрозрачные перегородки противопожарные": "svetoprozrachnye-peregorodki",
  "Банковские лотки": "bankovskie-lotki",
  "Двери 3 класса защиты": "dveri-3-klassa-zashchity",
  "Двери защитные": "dveri-zashchitnye",
  "Дверные блоки для строителей": "dvernye-bloki-dlya-stroitelej",
  "Полнотелые деревянные двери": "polnotelye-derevyannye-dveri",
  "Фурнитура для противопожарных дверей": "furnitura-dlya-protivopozharnyh-dverej",
};

export default function CategoryPage({ slug }: { slug: string }) {
  const item = catalog.flatMap(group => group.items.map(name => ({ name, group: group.group })))
    .find(entry => slugs[entry.name] === slug);
  const products = item ? catalogProductLinks.filter(product => product.category === item.name) : [];
  const images = item?.name === "Противопожарные двери"
    ? productImages.filter(product => /^ДМП-/.test(product.title))
    : item?.name === "Противопожарные ворота"
      ? productImages.filter(product => product.title === "Противопожарные ворота")
      : item?.name === "Противопожарные шторы"
        ? productImages.filter(product => product.title === "Противопожарные шторы")
        : [];

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
        <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-brand">{item.group}</p>
        <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-extrabold leading-none">{item.name}</h1>
        {images.length > 0 && <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map(image => <figure key={image.src} className="overflow-hidden border border-line">
            <img src={image.src} alt={image.title} loading="lazy" className="aspect-[4/3] w-full object-cover"/>
            <figcaption className="p-4 text-sm font-semibold">{image.title}</figcaption>
          </figure>)}
        </section>}
        {products.length > 0 ? <section className="mt-12">
          <h2 className="text-2xl font-extrabold">Названия из предыдущего извлечения</h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {products.map(product => <li key={product.sourceUrl} className="py-5 font-semibold">{product.title}</li>)}
          </ul>
        </section> : <section className="mt-12 border-y border-line py-8">
          <p className="max-w-2xl text-base leading-7 text-muted">Карточки и характеристики этого раздела пока не перенесены: мы не будем подменять их автоматически сгенерированными описаниями. Уточните актуальную информацию напрямую у компании. Полные карточки и характеристики будут добавлены после повторной проверки первоисточника.</p>
        </section>}
        <div className="mt-10 flex flex-wrap gap-5">
          <a href="/#kp" className="border border-ink px-6 py-3 text-sm font-semibold">Связаться с компанией</a>
        </div>
      </div>
    </main>
    <footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
  </>;
}
