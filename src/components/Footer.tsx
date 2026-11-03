const MENU = [
  "Входные двери",
  "Двери с терморазрывом",
  "Двери с зеркалом",
  "Двери МДФ-МДФ",
  "Двери Металл-МДФ",
  "Банковские лотки",
  "Двери 3 класса защиты",
  "Полнотелые деревянные двери",
  "Антипаника",
];

export default function Footer() {
  return (
    <footer className="bg-graphite px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-20 text-white lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        {/* Меню футера */}
        <ul className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.map((m) => (
            <li key={m}>
              <a
                href="#catalog"
                className="block border-b border-white/15 py-3 text-xl font-bold tracking-tight text-white/90 transition-colors hover:text-white md:text-2xl"
              >
                {m}
              </a>
            </li>
          ))}
        </ul>

        {/* Реквизиты */}
        <div className="mt-20 grid grid-cols-1 gap-12 border-t border-white/15 pt-12 text-sm leading-relaxed text-white/60 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <p className="font-semibold text-white">ООО «СПЕЦДВЕРИ»</p>
            <p>ОГРН: 1243700006802</p>
            <p>ИНН/КПП: 3700022069/370001001</p>
            <p>Юр. адрес: 153025, г. Иваново, ул. Тимирязева, д.1 стр.2, офис 324</p>
          </div>

          <div className="space-y-2 break-words">
            <p>Банк 1: АО «АЛЬФА-БАНК»</p>
            <p>Р/С: 40702810001030003738</p>
            <p>Кор счет: 30101810200000000593</p>
            <p>БИК: 044525593</p>
          </div>

          <div className="space-y-2 break-words">
            <p>Банк 2: Филиал «ЦЕНТРАЛЬНЫЙ» Банка ВТБ (ПАО)</p>
            <p>Р/счет: 40702810111450002064</p>
            <p>Кор счет: 30101810145250000411</p>
            <p>БИК: 044525411</p>
          </div>

          <div className="space-y-2">
            <p>Ген. директор: Кузнецов И.В.</p>
            <p>
              Email:{" "}
              <a href="mailto:bux_partner2017@bk.ru" className="transition-colors hover:text-white">
                bux_partner2017@bk.ru
              </a>
            </p>
          </div>
        </div>

        {/* Низ */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-8 text-sm text-white/60 sm:flex-row sm:gap-10">
          <a href="#privacy" className="transition-colors hover:text-white">Политика конфиденциальности</a>
          <a href="#cookies" className="transition-colors hover:text-white">Согласие на cookie</a>
        </div>
      </div>
    </footer>
  );
}