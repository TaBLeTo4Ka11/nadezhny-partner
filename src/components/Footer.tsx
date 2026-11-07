import { ADDRESS, EMAIL, PHONES } from "../data/content";
import { catalog, catalogUrls } from "../data/companyContent";

const LINKS = [
  { label: "О компании", href: "/o-kompanii/" },
  { label: "Контакты", href: "/kontakty/" },
  { label: "Склад", href: "/sklad/" },
  { label: "Доставка и установка", href: "/dostavka-i-ustanovka/" },
  { label: "Вакансии", href: "/vakansii/" },
  { label: "Полезное", href: "/poleznoe/" },
  { label: "Выбрать цвет · RAL Classic", href: "/color-palette/ral-classic/" },
];

const headingCls = "mb-5 text-xs font-semibold uppercase tracking-[.2em] text-muted";

export default function Footer() {
  return (
    <footer id="contacts" className="border-t-2 border-ink bg-white px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-16 text-ink lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
          {/* Каталог */}
          <div>
            <p className={headingCls}>Разделы каталога</p>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {catalog.map((g) => (
                <div key={g.group}>
                  <p className="border-b border-ink pb-2 text-sm font-extrabold">{g.group}</p>
                  <ul className="mt-3 space-y-2">
                    {g.items.map((item) => (
                      <li key={item}>
                        <a href={catalogUrls[item] ?? "#catalog"} className="text-sm text-ink/75 underline-offset-4 hover:text-ink hover:underline">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div className="space-y-8">
            <div>
              <p className={headingCls}>Контакты</p>
              <p className="max-w-sm text-base leading-7">{ADDRESS}</p>
            </div>
            <div className="space-y-1">
              {PHONES.map((p) => (
                <a key={p.href} href={p.href} className="block text-xl font-extrabold hover:underline">
                  {p.label}
                </a>
              ))}
              <a href={"mailto:" + EMAIL} className="block pt-1 text-sm text-muted hover:text-ink">
                {EMAIL}
              </a>
            </div>
            <a href="#kp" className="btn inline-block px-8 py-4 text-base">Запросить коммерческое предложение</a>
          </div>
        </div>

        {/* Реквизиты */}
        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-10 text-sm leading-relaxed text-muted sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <p className="font-extrabold text-ink">ООО «СПЕЦДВЕРИ»</p>
            <p>ОГРН: 1243700006802</p>
            <p>ИНН/КПП: 3700022069/370001001</p>
            <p>Юридический адрес: 153025, г. Иваново, ул. Тимирязева, д. 1, стр. 2, офис 324</p>
          </div>
          <div className="space-y-1.5 break-words">
            <p className="font-semibold text-ink">АО «АЛЬФА-БАНК»</p>
            <p>Р/С: 40702810001030003738</p>
            <p>Кор. счёт: 30101810200000000593</p>
            <p>БИК: 044525593</p>
          </div>
          <div className="space-y-1.5 break-words">
            <p className="font-semibold text-ink">Филиал «ЦЕНТРАЛЬНЫЙ» Банка ВТБ (ПАО)</p>
            <p>Р/С: 40702810111450002064</p>
            <p>Кор. счёт: 30101810145250000411</p>
            <p>БИК: 044525411</p>
          </div>
          <div className="space-y-1.5">
            <p>Генеральный директор: Кузнецов Игорь Валерьевич</p>
            <p>
              Email:{" "}
              <a href={"mailto:" + EMAIL} className="underline-offset-4 hover:text-ink hover:underline">
                {EMAIL}
              </a>
            </p>
          </div>
        </div>

        {/* Страницы и юридические ссылки */}
        <ul className="mt-12 grid gap-3 border-t border-line pt-8 text-xs text-muted sm:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-ink hover:underline">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} «Надёжный партнёр»</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacy-policy/" className="hover:text-ink hover:underline">Политика конфиденциальности</a>
            <a href="/kuki/" className="hover:text-ink hover:underline">Согласие на cookie</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
