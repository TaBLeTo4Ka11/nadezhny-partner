import { useEffect } from "react";
import { company } from "../data/companyContent";
import { legalPageBySlug } from "../data/legalPages";

type Props = { slug: string };

export default function LegalPage({ slug }: Props) {
  const page = legalPageBySlug[slug];
  useEffect(() => {
    document.title = page ? page.title + " — " + company.name : "Документ не найден — " + company.name;
    const description = document.querySelector('meta[name="description"]');
    if (page && description) description.setAttribute("content", page.description);
    if (page) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.origin + "/" + page.slug + "/";
    }
  }, [page]);

  if (!page) return <main className="min-h-screen p-12"><h1 className="text-3xl font-bold">Документ не найден</h1><a href="/" className="btn mt-6">На главную</a></main>;

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-5 px-6 py-5">
          <a href="/" className="text-sm font-extrabold uppercase tracking-wider">Надёжный партнёр</a>
          <a href="/" className="text-sm font-semibold hover:text-brand">На главную ↗</a>
        </div>
      </header>
      <main className="mx-auto max-w-[900px] px-6 py-16 lg:py-24">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-muted">Документы сайта</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight tracking-tight">{page.title}</h1>
        <p className="mt-6 text-lg leading-8 text-muted">{page.description}</p>
        <aside className="mt-8 border-l-4 border-brand bg-soft p-5 text-sm leading-6 text-ink/80">
          <strong className="block mb-1">Важно</strong>{page.draftNotice}
        </aside>
        <div className="mt-12 space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-extrabold">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-ink/75">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-16 border-t border-line pt-6 text-sm text-muted">Оператор: ООО «СПЕЦДВЕРИ» · {company.address} · {company.email}</p>
      </main>
      <footer className="bg-graphite px-6 py-8 text-sm text-white">
        <div className="mx-auto flex max-w-[1100px] justify-between gap-4"><span>© {new Date().getFullYear()} {company.name}</span><a href="/" className="underline">Главная</a></div>
      </footer>
    </div>
  );
}
