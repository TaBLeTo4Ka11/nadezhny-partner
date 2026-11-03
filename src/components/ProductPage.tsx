import { useEffect } from "react";

export default function ProductPage() {
  const title = "Устройство передаточное подвижное ЛТ-21";
  useEffect(() => {
    document.title = `${title} — Надёжный партнёр`;
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      "Одноуровневое передаточное устройство ЛТ-21 на две банковские упаковки. Описание перенесено из индексированной карточки исходного сайта."
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
      "https://iv-partner.ru/product/ustrojstvo-peredatochnoe-podvizhnoe-lt-21/"
    );
  }, []);

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
          <h1 className="mt-5 max-w-5xl text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[.98] tracking-tight">{title}</h1>
          <div className="mt-12 grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <figure className="border border-line bg-soft">
              <img
                src="https://iv-partner.ru/wp-content/uploads/2022/03/ustrojstvo-peredatochnoe-podvizhnoe-lt-21_l.jpg"
                alt="Устройство передаточное подвижное ЛТ-21"
                className="aspect-[4/3] w-full object-contain"
                loading="lazy"
              />
              <figcaption className="border-t border-line px-4 py-3 text-xs text-muted">Изображение из медиатеки исходного сайта</figcaption>
            </figure>
            <div>
              <h2 className="text-2xl font-extrabold">Описание</h2>
              <p className="mt-5 text-lg leading-8 text-muted">Устройство передаточное, подвижное, одноуровневое ЛТ-21, на две банковских упаковки, выполнено из нержавеющей стали с пулестойким крашеным поддоном.</p>
              <p className="mt-5 text-sm font-semibold">Класс пулестойкости: Бр3</p>
              <div className="mt-10 border-y border-line py-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Параметры, указанные в архивной карточке</h3>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div><dt className="text-sm text-muted">Предел огнестойкости</dt><dd className="mt-1 text-xl font-bold">60 минут</dd></div>
                  <div><dt className="text-sm text-muted">Высота</dt><dd className="mt-1 text-xl font-bold">1800–2950 мм</dd></div>
                  <div><dt className="text-sm text-muted">Ширина</dt><dd className="mt-1 text-xl font-bold">800–1200 мм</dd></div>
                </dl>
              </div>
              <p className="mt-5 text-xs leading-6 text-muted">Эти параметры и описание перенесены из индексированной карточки исходного сайта, которая была доступна в архивном поисковом снимке примерно 1,1 года назад. Актуальность характеристик и их применимость к данной модели необходимо подтвердить у компании. Цена на проверенном источнике не указана.</p>
              <a href="/#kp" className="btn mt-8">Уточнить комплектацию и стоимость</a>
            </div>
          </div>
        </article>
      </main>
      <footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
    </>
  );
}
