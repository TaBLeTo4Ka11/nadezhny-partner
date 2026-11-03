import { useEffect } from "react";
import { catalogProductLinks } from "../data/companyContent";

export default function ProductPage({ slug }: { slug: string }) {
  const product = catalogProductLinks.find(
    item => item.localPath?.split("/").filter(Boolean).pop() === slug
  );
  const isLT21 = product?.title === "Устройство передаточное подвижное ЛТ-21";

  useEffect(() => {
    if (!product) {
      document.title = "Товар не найден — Надёжный партнёр";
      document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex, nofollow");
      document.querySelector('link[rel="canonical"]')?.remove();
      return;
    }
    document.title = `${product.title} — Надёжный партнёр`;
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      isLT21
        ? "Устройство передаточное подвижное ЛТ-21. Описание и параметры перенесены из архивной карточки официального сайта."
        : `${product.title}. Карточка товара компании «Надёжный партнёр»; подробные характеристики уточняются.`
    );
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
    document.querySelector('link[rel="canonical"]')?.setAttribute(
      "href",
      `https://iv-partner.ru/product/${slug}/`
    );
  }, [product, isLT21, slug]);

  if (!product) {
    return <main className="min-h-screen bg-white px-6 py-20"><h1 className="text-4xl font-extrabold">Товар не найден</h1><a href="/catalog/bankovskie-lotki/" className="btn mt-8">Вернуться в каталог</a></main>;
  }

  return (
    <>
      <header className="border-b border-line bg-white px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <a href="/" className="font-extrabold uppercase tracking-wider">Надёжный партнёр</a>
          <a href="/catalog/bankovskie-lotki/" className="text-sm font-semibold text-muted hover:text-brand">← Банковские лотки</a>
        </div>
      </header>
      <main className="bg-white px-6 py-16 lg:px-10 lg:py-24">
        <article className="mx-auto max-w-[1200px]">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-brand">Банковские лотки · Бронированные двери</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[.98] tracking-tight">{product.title}</h1>
          <div className="mt-12 grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            {isLT21 ? (
              <figure className="border border-line bg-soft">
                <img
                  src="https://iv-partner.ru/wp-content/uploads/2022/03/ustrojstvo-peredatochnoe-podvizhnoe-lt-21_l.jpg"
                  alt="Устройство передаточное подвижное ЛТ-21"
                  className="aspect-[4/3] w-full object-contain"
                  loading="lazy"
                />
                <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">Изображение из медиатеки исходного сайта</figcaption>
              </figure>
            ) : (
              <div className="flex min-h-64 items-center justify-center border border-line bg-soft p-8 text-center text-sm text-muted">
                Фотография этой модели пока не восстановлена
              </div>
            )}
            <div>
              <h2 className="text-2xl font-extrabold">Описание</h2>
              {isLT21 ? (
                <>
                  <p className="mt-5 text-lg leading-8 text-muted">Устройство передаточное, подвижное, одноуровневое ЛТ-21, на две банковских упаковки, выполнено из нержавеющей стали с пулестойким крашеным поддоном.</p>
                  <p className="mt-5 text-sm font-semibold">Класс пулестойкости: Бр3</p>
                  <div className="mt-10 border-y border-line py-7">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Параметры из архивной карточки</h3>
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div><dt className="text-sm text-muted">Предел огнестойкости</dt><dd className="mt-1 text-xl font-bold">60 минут</dd></div>
                      <div><dt className="text-sm text-muted">Высота</dt><dd className="mt-1 text-xl font-bold">1800–2950 мм</dd></div>
                      <div><dt className="text-sm text-muted">Ширина</dt><dd className="mt-1 text-xl font-bold">800–1200 мм</dd></div>
                    </dl>
                  </div>
                  <p className="mt-5 text-xs leading-6 text-muted">Описание и значения перенесены из индексированной карточки официального сайта, сохранённой примерно 1,1 года назад. Актуальность характеристик необходимо подтвердить у компании. Поле «предел огнестойкости» выглядит нетипично для передаточного устройства и требует отдельной проверки.</p>
                </>
              ) : (
                <div className="mt-5 border-y border-line py-8">
                  <p className="text-base leading-7 text-muted">Название товара и его принадлежность к категории «Банковские лотки» подтверждаются каталогом официального сайта. Подробное описание, фотографии, размеры и технические характеристики этой карточки пока не удалось восстановить. Мы не будем подменять их предположениями.</p>
                </div>
              )}
              <a href="/#kp" className="btn mt-8">Уточнить комплектацию и стоимость</a>
            </div>
          </div>
        </article>
      </main>
      <footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
    </>
  );
}
