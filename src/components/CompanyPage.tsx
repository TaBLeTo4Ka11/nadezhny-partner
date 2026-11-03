import { useEffect } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";

type CompanyPageKind = "about" | "contacts";

export default function CompanyPage({ page }: { page: CompanyPageKind }) {
  const isAbout = page === "about";
  const title = isAbout ? "О компании" : "Контакты";
  const description = isAbout
    ? "Производство, поставка и монтаж металлических и противопожарных дверных конструкций."
    : "Адрес, телефоны, электронная почта и режим работы компании «Надёжный партнёр».";

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
                <p>Компания занимается производством, поставкой и монтажом металлических, противопожарных и бронированных дверей, а также противопожарных штор. На официальном сайте компании указан опыт работы более 15 лет.</p>
                <p>Компания указывает, что работает как с крупными строительными организациями, так и с частными заказчиками. Направления деятельности включают поставку и монтаж противопожарных преград, металлических дверей, бронированных конструкций и дверных блоков для строительных компаний.</p>
                <p>По описанию производственного процесса на исходном сайте, изготовление включает подготовку металла и деталей, сборку дверного полотна и коробки, установку фурнитуры, контроль качества, окраску и финальную комплектацию.</p>
              </div>
              <section className="mt-16 border-t border-line pt-10">
                <h2 className="text-2xl font-extrabold">Производство и монтаж</h2>
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div><p className="text-sm font-bold uppercase tracking-wider text-brand">Поставка</p><p className="mt-3 leading-7 text-muted">Противопожарные преграды, бронированные и металлические двери, противопожарные шторы и дверные блоки для объектов.</p></div>
                  <div><p className="text-sm font-bold uppercase tracking-wider text-brand">Монтаж</p><p className="mt-3 leading-7 text-muted">Монтажные работы на объектах с согласованием этапов работ с представителями заказчика.</p></div>
                </div>
              </section>
              <p className="mt-10 max-w-4xl border-l-2 border-brand bg-soft px-6 py-5 text-sm leading-6 text-muted">Сведения о сертификатах, лицензиях, толщине металла и иных технических параметрах на исходной странице требуют актуального подтверждения владельцем компании перед использованием в договорах и коммерческих предложениях.</p>
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
