import { useState } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";

const MAP_SRC =
  "https://yandex.ru/map-widget/v1/?z=16&text=" + encodeURIComponent("г. Иваново, ул. Тимирязева, д. 1, стр. 2");

export default function MapSection() {
  const [mapOpen, setMapOpen] = useState(false);
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
            <div>
              <p className="mb-2 text-sm text-muted">Режим работы</p>
              <p>{WORKING_HOURS}</p>
            </div>
          </div>

          <div className="border border-line bg-soft lg:col-span-8">
            {mapOpen ? (
              <iframe
                title="Яндекс.Карта: офис «Надёжный партнёр», Иваново"
                src={MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full border-0"
                allowFullScreen
              />
            ) : (
              <div className="flex h-[420px] flex-col items-start justify-end bg-[#f1f2f3] p-8">
                <p className="max-w-md text-sm leading-6 text-muted">Карта загружается с сервиса Яндекс. Нажимая кнопку, вы открываете внешний картографический виджет.</p>
                <button type="button" onClick={() => setMapOpen(true)} className="btn mt-5">Показать Яндекс.Карту</button>
                <a href="https://yandex.ru/maps/?text=Иваново%2C%20улица%20Тимирязева%2C%201%2C%20стр.%202" target="_blank" rel="noreferrer" className="mt-4 text-sm font-semibold underline underline-offset-4">Открыть маршрут в Яндекс Картах ↗</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}