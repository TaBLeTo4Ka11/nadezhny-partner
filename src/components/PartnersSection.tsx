const PARTNERS = [
  { name: "Сигма СК", src: "https://iv-partner.ru/wp-content/uploads/2022/03/sigmaskru-logo.png" },
  { name: "Магнит", src: "https://iv-partner.ru/wp-content/uploads/2022/03/magnit-150x150-1.png" },
  { name: "Текстиль Профи", src: "https://iv-partner.ru/wp-content/uploads/2022/03/tp-150x150-1.jpg" },
  { name: "Пятёрочка", src: "https://iv-partner.ru/wp-content/uploads/2022/03/pyaterochka-150x150-1.jpg" },
  { name: "Лента", src: "https://iv-partner.ru/wp-content/uploads/2022/03/lenta-150x150-1.jpg" },
  { name: "Газпром", src: "https://iv-partner.ru/wp-content/uploads/2022/03/gazprom-150x150-1.png" },
];

export default function PartnersSection() {
  return (
    <section id="partners" className="bg-soft px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">Нам доверяют</p>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Наши партнёры</h2>
        <ul className="mt-14 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p) => (
            <li key={p.name} className="flex h-32 items-center justify-center bg-white p-5">
              <img src={p.src} alt={p.name} loading="lazy" className="max-h-20 max-w-full object-contain grayscale transition duration-300 hover:grayscale-0" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
