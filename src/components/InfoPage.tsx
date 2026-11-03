import { useEffect } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";

type PageKey = "warehouse" | "delivery" | "vacancies" | "useful" | "privacy" | "cookies";
const pages: Record<PageKey, { title: string; path: string }> = {
  warehouse: { title: "Склад", path: "/sklad/" },
  delivery: { title: "Доставка и установка", path: "/dostavka-i-ustanovka/" },
  vacancies: { title: "Вакансии", path: "/vakansii/" },
  useful: { title: "Полезное", path: "/poleznoe/" },
  privacy: { title: "Политика конфиденциальности", path: "/privacy-policy/" },
  cookies: { title: "Согласие на cookie", path: "/kuki/" },
};

export default function InfoPage({ page }: { page: PageKey }) {
  const data = pages[page];
  useEffect(() => {
    document.title = `${data.title} — Надёжный партнёр`;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", `${data.title}. Перенос исходной информации ещё не завершён.`);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
    const canonical = document.querySelector('link[rel="canonical"]');
    canonical?.setAttribute("href", `https://iv-partner.ru${data.path}`);
  }, [data.title, data.path]);

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
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-brand">Информация компании</p>
          <h1 className="max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold leading-[.95] tracking-tight">{data.title}</h1>
          <div className="mt-10 max-w-3xl border-y border-line py-8">
            <p className="text-lg leading-8 text-muted">{page === "privacy" ? "Актуальный текст политики конфиденциальности пока не перенесён и не проверен. Эта страница не является действующей политикой и не заменяет юридический документ. До публикации владелец компании должен предоставить и подтвердить актуальную редакцию." : page === "cookies" ? "Сведения об используемых cookie-файлах, аналитике и условиях согласия пока не восстановлены и не проверены. Эта страница не является действующим согласием на cookie." : "Содержание этой страницы ещё не перенесено и не проверено по первоисточнику. Мы не публикуем предположения или автоматически сгенерированные сведения. Для уточнения информации свяжитесь с компанией по указанным ниже контактам."}</p>
            
          </div>
          <section className="mt-12">
            <h2 className="text-xl font-bold">Контакты с главной страницы компании</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{ADDRESS}</p>
            <p className="mt-2 text-sm text-muted">{WORKING_HOURS}</p>
            <a href={`mailto:${EMAIL}`} className="mt-3 inline-block underline">{EMAIL}</a>
            <div className="mt-4 flex flex-wrap gap-5">{PHONES.map(phone => <a key={phone.href} href={phone.href} className="font-bold">{phone.label}</a>)}</div>
          </section>
        </div>
      </main>
      <footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
    </>
  );
}
