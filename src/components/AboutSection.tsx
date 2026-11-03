import { ABOUT_INTRO } from "../data/content";

const body = "mb-4 max-w-[66ch] text-base leading-relaxed text-ink/75";

export default function AboutSection() {
  return (
    <section id="about" lang="ru" className="scroll-mt-28 bg-soft px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Информация с официального сайта</p>
            <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">О компании</h2>
            <p className="mt-6 max-w-[26ch] text-lg text-muted">Производство и поставка противопожарных преград и специальных дверей.</p>
          </div>
        </aside>
        <div className="lg:col-span-8">
          <div className="border-t-2 border-ink pt-8">
            <h3 className="mb-6 text-2xl font-extrabold tracking-tight">О компании</h3>
            {ABOUT_INTRO.map((t, i) => <p key={i} className={body}>{t}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
