import { ADDRESS, EMAIL, PHONES } from "../data/content";

const MAP_SRC =
  "https://yandex.ru/map-widget/v1/?z=16&text=" + encodeURIComponent("г. Иваново, ул. Тимирязева, 1");

export default function MapSection() {
  return (
    <section id="contacts" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Контакты</h2>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 text-lg lg:col-span-4">
            <div>
              <p className="mb-2 text-sm text-muted">Телефоны</p>
              {PHONES.map((p) => (
                <p key={p.href}>
                  <a href={p.href} className="font-semibold hover:underline">{p.label}</a>
                </p>
              ))}
            </div>
            <div>
              <p className="mb-2 text-sm text-muted">Email</p>
              <a href={"mailto:" + EMAIL} className="font-semibold hover:underline">{EMAIL}</a>
            </div>
            <div>
              <p className="mb-2 text-sm text-muted">Адрес</p>
              <p className="max-w-[28ch]">{ADDRESS}</p>
            </div>
          </div>

          <div className="h-[420px] border border-line bg-soft lg:col-span-8">
            <iframe
              title="Карта: г. Иваново, ул. Тимирязева, 1"
              src={MAP_SRC}
              loading="lazy"
              className="h-full w-full border-0"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}