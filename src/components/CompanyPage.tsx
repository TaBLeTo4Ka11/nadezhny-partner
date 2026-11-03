import { useEffect } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS, ABOUT_INTRO, ABOUT_STAGES } from "../data/content";
import { productionImages } from "../data/companyContent";

type CompanyPageKind = "about" | "contacts";

export default function CompanyPage({ page }: { page: CompanyPageKind }) {
  const isAbout = page === "about";
  const title = isAbout ? "О компании" : "Контакты";
  const description = isAbout
    ? "О компании «Надёжный партнёр»: производство, поставка и монтаж металлических, противопожарных и бронированных дверей."
    : "Адрес, телефоны, электронная почта и режим работы компании «Надёжный партнёр» в Иваново.";

  useEffect(() => {
    document.title = `${title} — Надёжный партнёр`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "index, follow");
    document.querySelector('link[rel="canonical"]')?.setAttribute(
      "href",
      `https://iv-partner.ru/${isAbout ? "o-kompanii" : "kontakty"}/`
    );
  }, [title, description, isAbout]);

  return (
    <>
      <header className="border-b border-line bg-white px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <a href="/" className="text-sm font-extrabold uppercase tracking-wider">Надёжный партнёр</a>
          <a href="/" className="text-sm font-semibold text-muted hover:text-brand">← На главную</a>
        </div>
      </header>
      <main className="min-h-[70vh] bg-white px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-brand">Надёжный партнёр · Иваново</p>
          <h1 className="max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold leading-[.95] tracking-tight">{title}</h1>
          {isAbout ? (
            <>
              <div className="mt-10 max-w-4xl space-y-6 text-lg leading-8 text-muted">
                {ABOUT_INTRO.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>

              <section className="mt-16 border-t border-line pt-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Производственный процесс</p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Как создаётся дверь</h2>
                  </div>
                  <span className="text-sm text-muted">4 этапа производства</span>
                </div>
                <div className="mt-8 divide-y divide-line border-y border-line">
                  {ABOUT_STAGES.map((stage, index) => (
                    <details key={stage.title} className="group py-6" open={index === 0}>
                      <summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
                        <span className="text-sm font-bold tabular-nums text-brand">{String(index + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-lg font-bold">{stage.title}</span>
                        <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-xl transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <div className="max-w-4xl space-y-4 pb-2 pl-10 pt-5 text-base leading-7 text-muted">
                        {stage.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="mt-16 border-t border-line pt-10">
                <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Фото из архива компании</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Производство</h2>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {productionImages.map((src, index) => (
                    <figure key={src} className="overflow-hidden border border-line bg-soft">
                      <img src={src} alt={`Производство дверных конструкций — фото ${index + 1}`} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
                    </figure>
                  ))}
                </div>
              </section>

              <p className="mt-12 max-w-4xl border-l-2 border-brand bg-soft px-6 py-5 text-sm leading-6 text-muted">
                Технические сведения, сертификаты, лицензии и коммерческие условия приведены по доступному тексту исходного сайта. Перед использованием в договорах и коммерческих предложениях владелец компании должен подтвердить их актуальность.
              </p>
            </>
          ) : (
            <div className="mt-10 grid gap-12 border-y border-line py-10 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-extrabold">Связаться с компанией</h2>
                <div className="mt-6 space-y-4">
                  {PHONES.map(phone => <a key={phone.href} href={phone.href} className="block text-2xl font-bold hover:text-brand">{phone.label}</a>)}
                  <a href={`mailto:${EMAIL}`} className="block text-lg font-semibold underline underline-offset-4">{EMAIL}</a>
                </div>
              </div>
              <div className="space-y-5">
                <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Адрес</p><p className="mt-2 text-lg leading-7">{ADDRESS}</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Режим работы</p><p className="mt-2 text-lg">{WORKING_HOURS}</p></div>
                <a href="https://yandex.ru/maps/?text=Иваново%20Тимирязева%201%20стр%202" target="_blank" rel="noreferrer" className="inline-block text-sm font-semibold text-brand underline underline-offset-4">Открыть адрес на карте</a>
              </div>
            </div>
          )}
          <a href="/#kp" className="btn mt-10">Запросить коммерческое предложение</a>
        </div>
      </main>
      <footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
    </>
  );
}
