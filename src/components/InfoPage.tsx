import { useEffect } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";

type PageKey = "warehouse" | "delivery" | "vacancies" | "useful";
const pages: Record<PageKey, { title: string; sourcePath: string }> = {
  warehouse: { title: "Склад", sourcePath: "/sklad/" },
  delivery: { title: "Доставка и установка", sourcePath: "/dostavka-i-ustanovka/" },
  vacancies: { title: "Вакансии", sourcePath: "/vakansii/" },
  useful: { title: "Полезное", sourcePath: "/poleznoe/" },
};

export default function InfoPage({ page }: { page: PageKey }) {
  const data = pages[page];
  useEffect(() => {
    document.title = `${data.title} — Надёжный партнёр`;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute("content", `${data.title}. Перенос исходной информации ещё не завершён.`);
  }, [data.title]);

  return <>
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
          <p className="text-lg leading-8 text-muted">Содержание этой страницы ещё не перенесено и не проверено по первоисточнику. Чтобы не публиковать предположения или текст, созданный автоматически, пока оставляем только ссылку на исходный сайт.</p>
          <a href={`https://iv-partner.ru${data.sourcePath}`} target="_blank" rel="noreferrer" className="btn mt-7 inline-block">Открыть исходную страницу</a>
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
  </>;
}
