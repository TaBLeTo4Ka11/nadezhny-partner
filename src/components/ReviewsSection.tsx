type Review = { author: string; text: string };

/* ВСТАВЬТЕ СЮДА 3 оригинальных отзыва с сайта, например:
   { author: "ООО «Название»", text: "Текст отзыва дословно" },
   Пока массив пуст — раздел на сайте не показывается. */
const REVIEWS: Review[] = [];

export default function ReviewsSection() {
  if (REVIEWS.length === 0) return null;

  return (
    <section id="reviews" className="scroll-mt-28 bg-soft px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Отзывы</h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <figure key={i} className="flex flex-col border border-line bg-white p-8">
              <blockquote className="flex-1 text-lg leading-relaxed text-ink/80">{r.text}</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4 text-sm font-bold">{r.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}