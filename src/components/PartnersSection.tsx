const PARTNERS = ["Сигма СК", "Магнит", "Текстиль Профи", "Пятерочка", "Лента", "Газпром"];

export default function PartnersSection() {
  return (
    <section className="bg-soft px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Наши партнеры</h2>

        <ul className="mt-14 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p) => (
            <li
              key={p}
              className="flex h-28 items-center justify-center bg-white px-4 text-center text-lg font-extrabold uppercase tracking-wide text-ink/60 grayscale transition-colors hover:text-ink"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}