import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalog, productImages } from "../data/companyContent";
gsap.registerPlugin(ScrollTrigger);

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".catalog-group", { y: 32, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: root.current, start: "top 78%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} id="catalog" className="section bg-[#0a0c0d]">
    <div className="container">
      <p className="eyebrow mb-8">02 — Каталог продукции</p>
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="section-title max-w-4xl">Решения для <span className="text-[#858d90]">разных</span> задач.</h2>
        <p className="max-w-sm text-sm leading-7 text-[#92989a]">Основные направления продукции компании. Конкретная комплектация и исполнение согласуются под проект.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {catalog.map((group, i) => <article className="catalog-group panel p-7 md:p-9" key={group.group}>
          <div className="mb-7 flex items-center justify-between border-b border-[#303638] pb-5">
            <h3 className="text-xl font-medium md:text-2xl">{group.group}</h3><span className="eyebrow">0{i + 1}</span>
          </div>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {group.items.map(item => <li key={item} className="flex gap-3 text-sm leading-6 text-[#c0c5c6]"><span className="text-[#858d90]">↗</span>{item}</li>)}
          </ul>
        </article>)}
      </div>
      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {productImages.map((item, i) => <figure className="overflow-hidden border border-[#292d2f] bg-[#111516]" key={item.src}>
          <div className="aspect-[4/5] overflow-hidden"><img src={item.src} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" /></div>
          <figcaption className="p-4 text-xs leading-5 text-[#aeb5b7]"><span className="eyebrow mr-2">0{i + 1}</span>{item.title}</figcaption>
        </figure>)}
      </div>
      <p className="mt-5 text-xs leading-6 text-[#747c7f]">Фотографии загружены с оригинального сайта компании. Полный поштучный каталог с характеристиками и ценами требует отдельной выгрузки карточек товаров.</p>
    </div>
  </section>;
}
