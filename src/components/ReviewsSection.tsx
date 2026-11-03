import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reviews } from "../data/companyContent";
gsap.registerPlugin(ScrollTrigger);

export default function ReviewsSection() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".review-card", { y: 28, opacity: 0, stagger: 0.12, duration: 0.75, scrollTrigger: { trigger: root.current, start: "top 80%" } });
    }, root);
    return () => ctx.revert();
  }, []);
  return <section ref={root} id="reviews" className="section bg-[#0a0c0d]">
    <div className="container">
      <p className="eyebrow mb-8">04 — Отзывы</p>
      <h2 className="section-title mb-14">Слова <span className="text-[#858d90]">клиентов.</span></h2>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review, i) => <figure className="review-card panel flex min-h-[270px] flex-col p-7 md:p-8" key={review.author}>
          <div className="flex items-center justify-between"><span className="eyebrow">Отзыв 0{i + 1}</span><span className="text-sm text-[#c0c5c6]">★ {review.rating}</span></div>
          <blockquote className="my-10 flex-1 text-lg leading-8 text-[#d2d6d6]">«{review.text}»</blockquote>
          <figcaption className="border-t border-[#303638] pt-5 text-sm text-[#92989a]">{review.author}</figcaption>
        </figure>)}
      </div>
      <p className="mt-5 text-xs text-[#747c7f]">Тексты перенесены с оригинального сайта; автор первого отзыва там не указан.</p>
    </div>
  </section>;
}
