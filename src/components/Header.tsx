import { useEffect, useRef, useState, type FormEvent } from "react";
import { PHONES, sendMail } from "../data/content";
import { catalog, catalogUrls } from "../data/companyContent";

const LOGO = "https://iv-partner.ru/wp-content/uploads/2021/08/dveri-300x301.png";

const TOP = [
  { label: "Политика конфиденциальности", href: "https://iv-partner.ru/privacy-policy/" },
  { label: "Согласие на cookie", href: "https://iv-partner.ru/kuki/" },
  { label: "Наши заказы", href: "#gallery" },
  { label: "Наши отзывы", href: "#reviews" },
  { label: "Вакансии", href: "/vakansii/" },
  { label: "Полезное", href: "/poleznoe/" },
];

const CATALOG = catalog.flatMap((group) =>
  group.items.map((label) => ({ label, href: catalogUrls[label] ?? "#catalog" }))
);

// Информационные страницы пока содержат заглушки до переноса проверенных оригинальных текстов.
const NAV = [
  { label: "О компании", href: "#about", id: "about" },
  { label: "Производство", href: "#production", id: "production" },
  { label: "Склад", href: "/sklad/", id: "" },
  { label: "Доставка и установка", href: "/dostavka-i-ustanovka/", id: "" },
  { label: "Контакты", href: "#contacts", id: "contacts" },
];

const field =
  "w-full border-0 border-b border-[#c9ccd1] bg-transparent py-4 text-lg text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [call, setCall] = useState(false);
  const [active, setActive] = useState("");
  const callDialogRef = useRef<HTMLDivElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  // Подсветка активного раздела
  useEffect(() => {
    const ids = ["catalog", "about", "contacts"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu || call ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, call]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setCall(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!call) return;
    const dialog = callDialogRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])';
    const getFocusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(selector) ?? []);
    getFocusable()[0]?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      if (previous?.isConnected) previous.focus();
      else menuToggleRef.current?.focus();
    };
  }, [call]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    sendMail("Заказ звонка", { Имя: String(f.get("name")), Телефон: String(f.get("phone")), "Согласие на обработку персональных данных": f.get("consent") ? "Да" : "Нет" });
    setCall(false);
  };

  const cls = (id: string) =>
    "text-sm font-semibold transition-colors hover:underline underline-offset-8 " +
    (id && active === id ? "text-brand" : "text-ink");

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-white" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        {/* Тонкая верхняя полоса */}
        <div className="hidden border-b border-line bg-soft md:block">
          <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-end gap-8 px-6 lg:px-10">
            {TOP.map((t) => (
              <a key={t.label} href={t.href} className="text-xs text-muted transition-colors hover:text-ink">
                {t.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-6 lg:h-20 lg:px-10">
          <a href="#top" className="flex shrink-0 items-center gap-3">
            <img src={LOGO} alt="Надёжный партнёр" className="h-10 w-10 object-contain lg:h-12 lg:w-12" />
            <span className="hidden text-sm font-extrabold uppercase tracking-wider sm:block">Надёжный партнёр</span>
          </a>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Основная навигация">
            <div className="group relative">
              <a href="#catalog" className={cls("catalog")}>
                Каталог ▾
              </a>
              <div className="invisible absolute left-0 top-full z-10 pt-5 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="max-h-[calc(100svh-7rem)] min-w-[300px] overflow-y-auto border border-line bg-white py-2">
                  {CATALOG.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} target={item.href.startsWith("https://") ? "_blank" : undefined} rel={item.href.startsWith("https://") ? "noreferrer" : undefined} className="block px-5 py-3 text-sm transition-colors hover:bg-soft">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {NAV.map((n) => (
              <a key={n.label} href={n.href} className={cls(n.id)}>
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href={PHONES[0].href} className="hidden whitespace-nowrap text-sm font-bold lg:block">
              {PHONES[0].label}
            </a>
            <button type="button" onClick={() => setCall(true)} aria-haspopup="dialog" className="btn hidden md:block">
              Заказать звонок
            </button>
            <a
              href="#kp"
              className="hidden border border-ink px-6 py-3 text-sm font-semibold transition-colors hover:bg-ink hover:text-white md:block"
            >
              Выслать КП
            </a>
            <button
              type="button"
              className="text-sm font-semibold xl:hidden"
              aria-expanded={menu}
              aria-controls="mobile-navigation"
              ref={menuToggleRef}
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? "Закрыть" : "Меню"}
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <div id="mobile-navigation" hidden={!menu} className="fixed inset-0 z-40 overflow-y-auto bg-white px-6 pb-10 pt-28 xl:hidden">
          <nav className="flex flex-col gap-5" aria-label="Мобильная навигация">
            <a href="#catalog" onClick={() => setMenu(false)} className="text-3xl font-extrabold tracking-tight">
              Каталог
            </a>
            <ul className="-mt-2 mb-2 space-y-3 border-l border-line pl-4">
              {CATALOG.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target={item.href.startsWith("https://") ? "_blank" : undefined} rel={item.href.startsWith("https://") ? "noreferrer" : undefined} onClick={() => setMenu(false)} className="text-base text-muted">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={() => setMenu(false)}
                className="text-3xl font-extrabold tracking-tight"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-10 flex flex-col items-start gap-4">
            <a href={PHONES[0].href} className="text-lg font-bold">
              {PHONES[0].label}
            </a>
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                setCall(true);
              }}
              aria-haspopup="dialog"
              className="btn"
            >
              Заказать звонок
            </button>
            <a
              href="#kp"
              onClick={() => setMenu(false)}
              className="border border-ink px-6 py-3 text-sm font-semibold"
            >
              Выслать КП
            </a>
          </div>
          <ul className="mt-10 space-y-2 border-t border-line pt-6">
            {TOP.map((t) => (
              <li key={t.label}>
                <a href={t.href} onClick={() => setMenu(false)} className="text-sm text-muted">
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
      </div>

      {/* Окно «Заказать звонок» */}
      {call && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6" onClick={() => setCall(false)}>
          <div
            ref={callDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-dialog-title"
            className="w-full max-w-md border border-line bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-start justify-between gap-6">
              <h2 id="call-dialog-title" className="text-3xl font-extrabold tracking-tight">Заказать звонок</h2>
              <button type="button" onClick={() => setCall(false)} className="text-sm text-muted hover:text-ink">
                Закрыть
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <label htmlFor="cb-name" className="sr-only">Имя</label>
              <input id="cb-name" name="name" type="text" required autoComplete="name" placeholder="Имя" className={field} />
              <label htmlFor="cb-phone" className="sr-only">Телефон</label>
              <input id="cb-phone" name="phone" type="tel" required autoComplete="tel" placeholder="Телефон" className={field + " mt-4"} />
              <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted">
                <input type="checkbox" name="consent" value="yes" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#c62828]" />
                <span>
                  Согласен(на) на обработку персональных данных и с{" "}
                  <a href="https://iv-partner.ru/privacy-policy/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ink">
                    политикой конфиденциальности
                  </a>
                </span>
              </label>
              <button type="submit" className="btn mt-8">Подготовить письмо</button>
              <p className="mt-3 text-xs leading-5 text-muted">Откроется почтовое приложение с готовым письмом.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}