import { useLayoutEffect,useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { workImages } from "../data/companyContent";
gsap.registerPlugin(ScrollTrigger);
export default function GallerySection(){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const ctx=gsap.context(()=>{const items=gsap.utils.toArray<HTMLElement>("[data-work]",root.current??undefined);gsap.set(items,{opacity:0,y:24});ScrollTrigger.batch(items,{start:"top 92%",once:true,onEnter:b=>gsap.to(b,{opacity:1,y:0,stagger:.06,duration:.8,ease:"power3.out"})});},root);return()=>ctx.revert();},[]);
 return <section ref={root} id="gallery" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36"><div className="mx-auto max-w-[1400px]"><p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">Объекты компании</p><h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Наши работы</h2><p className="mt-5 max-w-xl text-base leading-7 text-muted">Фотографии реализованных объектов из оригинальной галереи компании.</p><div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{workImages.map((src,i)=><figure data-work key={src} className="overflow-hidden border border-line bg-soft"><img src={src} alt={`Фотография реализованного объекта ${i+1}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"/><figcaption className="flex justify-between p-3 text-xs font-semibold text-muted"><span>Объект компании</span><span>{String(i+1).padStart(2,"0")}</span></figcaption></figure>)}</div></div></section>;
}