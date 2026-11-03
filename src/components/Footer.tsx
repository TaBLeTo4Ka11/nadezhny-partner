import { useState } from "react";
import { ADDRESS, EMAIL, PHONES } from "../data/content";
import { catalog, catalogUrls } from "../data/companyContent";

const MENU = catalog.flatMap((group) => group.items.map((label) => ({ label, href: catalogUrls[label] ?? "#catalog" })));

export default function Footer() {
  const [mapOpen, setMapOpen] = useState(false);
  const mapSrc = "https://yandex.ru/map-widget/v1/?z=16&text=" + encodeURIComponent("г. Иваново, ул. Тимирязева, д. 1, стр. 2");

  return (
    <footer id="contacts" className="bg-graphite px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-20 text-white lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-white/50">Разделы каталога</p>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {MENU.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="block border-b border-white/15 py-3 text-sm font-semibold text-white/85 transition-colors hover:text-white">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-7">
            <div><p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-white/50">Контакты</p><p className="max-w-sm text-base leading-7 text-white/80">{ADDRESS}</p></div>
            <div className="space-y-2">
              {PHONES.map((phone) => <a key={phone.href} href={phone.href} className="block text-lg font-bold hover:underline">{phone.label}</a>)}
              <a href={"mailto:" + EMAIL} className="block text-sm text-white/70 hover:text-white">{EMAIL}</a>
            </div>
            <a href="#kp" className="btn inline-block">Запросить коммерческое предложение</a>
          </div>
        </div>

        <section className="mt-16 grid gap-8 border-t border-white/15 pt-12 lg:grid-cols-[.8fr_1.2fr]">
          <div className="flex flex-col items-start justify-center">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/50">Наш адрес на карте</p>
            <h2 className="mt-3 text-3xl font-extrabold">Иваново, ул. Тимирязева</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">{ADDRESS}</p>
            <a href="https://yandex.ru/maps/?text=Иваново%2C%20улица%20Тимирязева%2C%201%2C%20стр.%202" target="_blank" rel="noreferrer" className="mt-4 text-sm font-semibold text-white/70 underline underline-offset-4 hover:text-white">Открыть маршрут в Яндекс Картах ↗</a>
          </div>
          <div className="min-h-[300px] overflow-hidden border border-white/15 bg-white/5">
            {mapOpen ? (
              <iframe title="Яндекс.Карта: офис «Надёжный партнёр», Иваново" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[340px] w-full border-0" allowFullScreen />
            ) : (
              <div className="flex h-[340px] flex-col items-start justify-end p-8">
                <p className="max-w-md text-sm leading-6 text-white/60">Карта загружается с сервиса Яндекс только после нажатия. До этого внешний виджет не подключается.</p>
                <button type="button" onClick={() => setMapOpen(true)} className="btn mt-5">Загрузить карту</button>
              </div>
            )}
          </div>
        </section>

        <div className="mt-20 grid grid-cols-1 gap-12 border-t border-white/15 pt-12 text-sm leading-relaxed text-white/60 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2"><p className="font-semibold text-white">ООО «СПЕЦДВЕРИ»</p><p>ОГРН: 1243700006802</p><p>ИНН/КПП: 3700022069/370001001</p><p>Юридический адрес: 153025, г. Иваново, ул. Тимирязева, д. 1, стр. 2, офис 324</p></div>
          <div className="space-y-2 break-words"><p>АО «АЛЬФА-БАНК»</p><p>Р/С: 40702810001030003738</p><p>Кор. счёт: 30101810200000000593</p><p>БИК: 044525593</p></div>
          <div className="space-y-2 break-words"><p>Филиал «ЦЕНТРАЛЬНЫЙ» Банка ВТБ (ПАО)</p><p>Р/С: 40702810111450002064</p><p>Кор. счёт: 30101810145250000411</p><p>БИК: 044525411</p></div>
          <div className="space-y-2"><p>Генеральный директор: Кузнецов Игорь Валерьевич</p><p>Email: <a href={"mailto:" + EMAIL} className="hover:text-white">{EMAIL}</a></p></div>
        </div>

        <div className="mt-12 grid gap-3 border-t border-white/15 pt-8 text-xs text-white/50 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/o-kompanii/" className="hover:text-white">О компании</a><a href="/kontakty/" className="hover:text-white">Контакты</a>
          <a href="/sklad/" className="hover:text-white">Склад</a><a href="/dostavka-i-ustanovka/" className="hover:text-white">Доставка и установка</a>
          <a href="/vakansii/" className="hover:text-white">Вакансии</a><a href="/poleznoe/" className="hover:text-white">Полезное</a>
          <a href="/color-palette/ral-classic/" className="hover:text-white">Выбрать цвет · RAL Classic</a>
        </div>
        <div className="mt-5 flex flex-col gap-4 border-t border-white/15 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} «Надёжный партнёр»</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacy-policy/" className="hover:text-white">Политика конфиденциальности</a>
            <a href="/kuki/" className="hover:text-white">Согласие на cookie</a>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-white/40">Юридические и банковские реквизиты перенесены с исходного сайта. Перед использованием в договорах и платежах обязательно подтвердите их актуальность у компании.</p>
      </div>
    </footer>
  );
}
