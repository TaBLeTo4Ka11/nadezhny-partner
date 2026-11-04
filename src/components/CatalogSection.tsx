import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const raw = (file: string) =>
  "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/products/" + file;

// Категории и адреса сверены с локальными страницами каталога из seo/catalog-pages.json.
const categories = [
  { title: "Противопожарные ворота", group: "Противопожарные преграды", slug: "protivopozharnye-vorota", image: "vorota-protivopozharnye-metallicheskie-dvupolnye-01.png" },
  { title: "Противопожарные двери", group: "Противопожарные преграды", slug: "protivopozharnye-dveri", image: "dmp-2-eis60-dver-metallicheskaya-protivopozharnaya-dvupolnaya-01.png" },
  { title: "Противопожарные люки", group: "Противопожарные преграды", slug: "protivopozharnye-lyuki", image: "ljuk-metallicheskij-protivopozharnyj-eis60-01.jpg" },
  { title: "Противопожарные шторы", group: "Противопожарные преграды", slug: "protivopozharnye-shtory", image: "protivopozharnye-shtory-01.png" },
  { title: "Светопрозрачные противопожарные перегородки", group: "Противопожарные преграды", slug: "svetoprozrachnye-peregorodki", image: "svetoprozrachnye-peregorodki-so-vstroennoj-dverju-01.jpg" },
  { title: "Двери с терморазрывом", group: "Входные двери", slug: "dveri-s-termorazryvom", image: "11-sm-isoterma-mednyj-antik-01.png" },
  { title: "Двери с зеркалом", group: "Входные двери", slug: "dveri-s-zerkalom", image: "10-sm-tolstyak-serebro-zerkalo-maxi-01.png" },
  { title: "Двери МДФ–МДФ", group: "Входные двери", slug: "dveri-mdf-mdf", image: "10-5-sm-chikago-carga-dub-shale-belyj-01.png" },
  { title: "Двери металл–металл", group: "Входные двери", slug: "dveri-metall-metall", image: "garda-metall-metall-01.png" },
  { title: "Двери металл–МДФ", group: "Входные двери", slug: "dveri-metall-mdf", image: "dominanta-muar-yasen-seryj-emal-01.png" },
  { title: "Коттеджные двери со стеклопакетом", group: "Входные двери", slug: "kottedzhnye-dveri-so-steklopaketom", image: "veneciya-belyj-yasen-01.png" },
  { title: "Банковские лотки", group: "Бронированные двери", slug: "bankovskie-lotki", image: "ustrojstvo-peredatochnoe-podvizhnoe-lt-21-01.jpg" },
  { title: "Двери 3 класса защиты", group: "Бронированные двери", slug: "dveri-3-klassa-zashchity", image: "dr-i-01.png" },
  { title: "Двери защитные", group: "Бронированные двери", slug: "dveri-zashchitnye", image: "dz-ii-3-2-01.png" },
  { title: "Полнотелые деревянные двери", group: "Деревянные двери", slug: "polnotelye-derevyannye-dveri", image: "dvernye-bloki-polnotelye-s-zamkom-i-petlyami-v-komplekte-01.png" },
  { title: "Дверные блоки для строителей", group: "Деревянные двери", slug: "dvernye-bloki-dlya-stroiteley", image: null },
  { title: "Фурнитура для противопожарных дверей", group: "Антипаника", slug: "furnitura-dlya-protivopozharnyh-dverej", image: "apeks-pb-1300a-panic-bs-shtanga-nazhimnaya-01.webp" },
];

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ru");
    return term
      ? categories.filter((item) => (item.title + " " + item.group).toLocaleLowerCase("ru").includes(term))
      : categories;
  }, [query]);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-catalog-card]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.045,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-catalog-grid]", start: "top 86%", once: true },
      });
    }, element);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="catalog" className="scroll-mt-20 bg-white px-5 py-24 text-ink sm:px-8 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 border-b-2 border-ink pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[.22em] text-[#c62828]">Продукция и решения</p>
            <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-black leading-[.9] tracking-[-.06em]">Каталог<span className="text-[#c62828]">.</span></h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-ink/60 md:text-right sm:text-base">
            Основные направления продукции компании. Откройте нужный раздел или отправьте запрос на коммерческое предложение.
          </p>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted">{filtered.length} из {categories.length} категорий</p>
          <label className="block w-full sm:max-w-sm">
            <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.18em] text-muted">Поиск по каталогу</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Например, ворота или двери"
              className="w-full border-0 border-b border-ink bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted/70 focus:border-b-2 focus:border-[#c62828]"
            />
          </label>
        </div>

        <div data-catalog-grid className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3" aria-live="polite">
          {filtered.map((item, index) => (
            <article data-catalog-card key={item.slug} className="group relative flex min-h-[285px] flex-col overflow-hidden border border-line bg-white transition-colors hover:border-[#c62828] sm:min-h-[430px]">
              <a href={"/catalog/" + item.slug + "/"} aria-label={"Открыть категорию: " + item.title} className="flex flex-1 flex-col">
                <div className="relative h-[clamp(140px,31vw,280px)] shrink-0 overflow-hidden bg-[#eeeeec] sm:h-[280px]">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#eeeeec] text-4xl font-black tracking-[-.08em] text-[#c62828]/35" aria-hidden="true">
                    НП
                  </div>
                  {item.image && (
                    <img
                      data-catalog-image
                      src={raw(item.image)}
                      alt={item.title}
                      loading={index < 4 ? "eager" : "lazy"}
                      decoding="async"
                      onError={(event) => { event.currentTarget.style.display = "none"; }}
                      className="absolute inset-0 h-full w-full object-contain p-2.5 transition-transform duration-700 group-hover:scale-[1.025] sm:p-5"
                    />
                  )}
                  <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] bg-white px-2 py-1.5 text-[8px] font-extrabold uppercase tracking-[.1em] text-[#c62828] sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-[9px]">
                    {item.group}
                  </span>
                  <span aria-hidden="true" className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center bg-[#c62828] text-lg text-white transition-transform duration-300 group-hover:translate-x-1 sm:bottom-4 sm:right-4 sm:h-10 sm:w-10">↗</span>
                </div>
                <div className="flex flex-1 flex-col border-t border-line p-3 sm:p-6">
                  <h3 className="text-sm font-black leading-tight tracking-tight sm:text-xl">{item.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[.1em] text-muted sm:mt-5 sm:text-[10px] sm:tracking-[.16em]">
                    Открыть раздел <span>→</span>
                  </span>
                </div>
              </a>
              <a href="#kp" className="flex min-h-10 items-center border-t border-line bg-[#fafafa] px-3 text-[8px] font-extrabold uppercase tracking-[.1em] text-[#c62828] transition-colors hover:bg-[#c62828] hover:text-white sm:min-h-12 sm:px-6 sm:text-[10px] sm:tracking-[.14em]">
                Запросить предложение <span className="ml-2">↗</span>
              </a>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 border border-line px-6 py-10 text-center">
            <p className="font-semibold">По запросу «{query}» ничего не найдено.</p>
            <button type="button" onClick={() => setQuery("")} className="mt-3 text-sm font-bold text-[#c62828] underline underline-offset-4">Сбросить поиск</button>
          </div>
        )}

        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="max-w-2xl text-sm leading-7 text-ink/60">Нужна нестандартная конструкция или комплектация? Обсудим параметры изделия и подготовим предложение.</p>
          <a href="#kp" className="inline-flex min-h-12 shrink-0 items-center justify-center bg-[#c62828] px-7 text-xs font-extrabold uppercase tracking-[.14em] text-white transition-colors hover:bg-[#a91f1f]">Обсудить задачу ↗</a>
        </div>
      </div>
    </section>
  );
}
