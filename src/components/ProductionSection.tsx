import { useLayoutEffect,useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productionImages } from "../data/companyContent";
gsap.registerPlugin(ScrollTrigger);
export default function ProductionSection(){
 const root=useRef<HTMLElement>(null);
 useLayoutEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const ctx=gsap.context(()=>gsap.from("[data-production-photo]",{y:24,opacity:0,stagger:.06,duration:.7,scrollTrigger:{trigger:root.current,start:"top 85%"}}),root);return()=>ctx.revert();},[]);
 return <section ref={root} id="production" className="scroll-mt-28 bg-soft px-6 py-24 lg:px-10 lg:py-32"><div className="mx-auto max-w-[1400px]"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Производственные процессы</p><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Производство</h2><p className="max-w-md text-base leading-7 text-muted">Фотографии производственных помещений из галереи исходного сайта компании.</p></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">{productionImages.map((src,i)=><figure data-production-photo key={src} className="overflow-hidden border border-line bg-white"><img src={src} alt={`Фотография производства ${i+1}`} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 hover:scale-105"/></figure>)}</div></div></section>;
}