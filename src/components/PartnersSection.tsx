const PARTNERS = [
  { name: "Сигма СК", src: "/images/partners/sigmaskru-logo.png" },
  { name: "Магнит", src: "/images/partners/magnit-150x150-1.png" },
  { name: "Текстиль Профи", src: "/images/partners/tp-150x150-1.jpg" },
  { name: "Пятёрочка", src: "/images/partners/pyaterochka-150x150-1.jpg" },
  { name: "Лента", src: "/images/partners/lenta-150x150-1.jpg" },
  { name: "Газпром", src: "/images/partners/gazprom-150x150-1.png" },
];

export default function PartnersSection() {
  return (
    <section id="partners" className="bg-soft px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-muted">Нам доверяют</p>
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Наши партнёры</h2>
        <ul className="mt-14 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p) => (
            <li key={p.name} className="group flex h-32 items-center justify-center bg-white p-5 transition-colors hover:bg-[#fafafa]">
              <img src={p.src} alt={"Логотип " + p.name} loading="lazy" decoding="async" className="max-h-20 max-w-full object-contain grayscale opacity-75 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
