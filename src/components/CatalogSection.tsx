import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const raw = (file: string) => "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/products/" + file;

const categories = [
  { title: "Противопожарные двери", text: "Одно- и двупольные конструкции EIS 60, глухие и остеклённые исполнения.", image: raw("dmp-2-eis60-dver-metallicheskaya-protivopozharnaya-dvupolnaya-01.png"), tag: "EIS 60" },
  { title: "Противопожарные ворота", text: "Металлические двупольные ворота для проёмов промышленных и общественных зданий.", image: raw("vorota-protivopozharnye-metallicheskie-dvupolnye-01.png"), tag: "Ворота" },
  { title: "Противопожарные люки", text: "Металлические люки с нормируемой огнестойкостью для инженерных и технических зон.", image: raw("ljuk-metallicheskij-protivopozharnyj-eis60-01.jpg"), tag: "EIS 60" },
  { title: "Противопожарные шторы", text: "Защитные шторы для разделения помещений и больших открытых проёмов.", image: raw("protivopozharnye-shtory-01.png"), tag: "Защита проёмов" },
  { title: "Светопрозрачные перегородки", text: "Противопожарные перегородки со встроенными дверными конструкциями.", image: raw("svetoprozrachnye-peregorodki-so-vstroennoj-dverju-01.jpg"), tag: "Перегородки" },
  { title: "Входные металлические двери", text: "Входные решения металл–металл и металл–МДФ для жилых и коммерческих объектов.", image: raw("garda-metall-metall-01.png"), tag: "Входные" },
  { title: "Бронированные двери", text: "Защитные дверные конструкции различных классов исполнения.", image: raw("dz-ii-3-01.png"), tag: "Защитные" },
  { title: "Деревянные дверные блоки", text: "Полнотелые дверные блоки с комплектом замков и петель.", image: raw("dvernye-bloki-polnotelye-s-zamkom-i-petlyami-v-komplekte-01.png"), tag: "Деревянные" },
  { title: "Фурнитура «Антипаника»", text: "Нажимные штанги, замки и комплектующие для эвакуационных выходов.", image: raw("apeks-pb-1300a-panic-bs-shtanga-nazhimnaya-01.webp"), tag: "Антипаника" },
];

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ru");
    return term ? categories.filter((item) => (item.title + " " + item.text + " " + item.tag).toLocaleLowerCase("ru").includes(term)) : categories;
  }, [query]);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-catalog-card]", {
        y: 34, opacity: 0, duration: 0.8, stagger: 0.075, ease: "power3.out",
        scrollTrigger: { trigger: "[data-catalog-grid]", start: "top 86%", once: true },
      });
      gsap.from("[data-catalog-image]", {
        scale: 1.08, duration: 1.1, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: "[data-catalog-grid]", start: "top 86%", once: true },
      });
    }, element);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} id="catalog" className="scroll-mt-20 bg-white px-5 py-24 text-ink sm:px-8 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-6 border-b-2 border-ink pb-8 md:flex-row md:items-end">
          <div><p className="mb-4 text-xs font-extrabold uppercase tracking-[.22em] text-[#c62828]">Продукция и решения</p><h2 className="text-[clamp(2.6rem,7vw,6rem)] font-black leading-[.9] tracking-[-.06em]">Каталог<span className="text-[#c62828]">.</span></h2></div>
          <p className="max-w-lg text-sm leading-7 text-ink/60 md:text-right sm:text-base">Противопожарные конструкции, входные и защитные двери, деревянные блоки и специальная фурнитура. Подберём решение под параметры вашего объекта.</p>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-muted">{filtered.length} направлений продукции</p>
          <label className="block w-full sm:max-w-sm"><span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[.18em] text-muted">Поиск по каталогу</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Например, ворота или люки" className="w-full border-0 border-b border-ink bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted/70 focus:border-b-2 focus:border-[#c62828]" /></label>
        </div>

        <div data-catalog-grid className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {filtered.map((item, index) => (
            <a data-catalog-card key={item.title} href="#kp" className="group relative flex min-h-[390px] flex-col overflow-hidden border border-line bg-[#f4f4f2] transition-colors hover:border-[#c62828] sm:min-h-[430px]">
              <div className="relative min-h-[245px] flex-1 overflow-hidden bg-[#e8e8e5]">
                <img data-catalog-image src={item.image} alt={item.title} loading={index < 3 ? "eager" : "lazy"} decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[9px] font-extrabold uppercase tracking-[.16em] text-[#c62828]">{item.tag}</span>
                <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#c62828] text-xl text-white transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </div>
              <div className="border-t border-line bg-white p-5 sm:p-6">
                <h3 className="text-lg font-black leading-tight tracking-tight sm:text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/60">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#c62828]">Запросить предложение <span>→</span></span>
              </div>
            </a>
          ))}
        </div>
        {filtered.length === 0 && <div className="mt-8 border border-line px-6 py-10 text-center"><p className="font-semibold">По запросу «{query}» ничего не найдено.</p><button type="button" onClick={() => setQuery("")} className="mt-3 text-sm font-bold text-[#c62828] underline underline-offset-4">Сбросить поиск</button></div>}
        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="max-w-2xl text-sm leading-7 text-ink/60">Нужна нестандартная конструкция или комплектация? Изготовим изделие по размерам и техническому заданию заказчика.</p>
          <a href="#kp" className="inline-flex min-h-12 shrink-0 items-center justify-center bg-[#c62828] px-7 text-xs font-extrabold uppercase tracking-[.14em] text-white transition-colors hover:bg-[#a91f1f]">Обсудить задачу ↗</a>
        </div>
      </div>
    </section>
  );
}
