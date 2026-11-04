import { useEffect, useRef, useState } from "react";
import { EMAIL, PHONES } from "../data/content";

const LOGO = "https://raw.githubusercontent.com/TaBLeTo4Ka11/Nadiozhnyi-partnior-korporativnyi-sait/main/artifacts/nadyozhny-partner/public/images/brand/company-logo.png";

const LINKS = [
  { label: "Каталог", href: "/#catalog" },
  { label: "О компании", href: "/#about" },
  { label: "Производство", href: "/#production" },
  { label: "Наши работы", href: "/#gallery" },
  { label: "Отзывы", href: "/#reviews" },
  { label: "Контакты", href: "/#contacts" },
];

const EXTRA_LINKS = [
  { label: "Склад", href: "/sklad/" },
  { label: "Доставка и установка", href: "/dostavka-i-ustanovka/" },
  { label: "Вакансии", href: "/vakansii/" },
  { label: "Полезное", href: "/poleznoe/" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const phone = PHONES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = menuRef.current;
    const focusable = () => Array.from(
      panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []
    );
    focusable()[0]?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
      }
      if (event.key === "Tab") {
        const items = focusable();
        if (!items.length) return;
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={"safe-area-top fixed inset-x-0 top-0 z-50 border-b bg-white transition-all duration-300 " + (scrolled || menuOpen ? "border-line shadow-[0_8px_30px_rgba(0,0,0,.04)]" : "border-transparent")}>
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
          <a href="/" aria-label="Надёжный партнёр — главная" className="flex min-w-0 items-center gap-3">
            <img src={LOGO} alt="Логотип «Надёжный партнёр»" width={58} height={58} loading="eager" decoding="async" className="h-11 w-11 shrink-0 object-contain lg:h-14 lg:w-14" />
            <span className="max-w-[170px] text-xs font-black uppercase leading-tight tracking-[.12em] sm:max-w-none sm:text-sm">Надёжный партнёр</span>
          </a>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Главная навигация">
            {LINKS.slice(0, 5).map((link) => (
              <a key={link.href} href={link.href} className="text-[11px] font-bold uppercase tracking-[.12em] text-ink/70 transition-colors hover:text-brand">{link.label}</a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a href={phone.href} aria-label={"Позвонить: " + phone.label} className="inline-flex min-h-11 items-center justify-center bg-[#c62828] px-4 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#a91f1f] sm:px-6 sm:text-sm">
              <span className="sm:hidden">Звонок</span>
              <span className="hidden sm:inline">{phone.label}</span>
            </a>
            <button ref={toggleRef} type="button" aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => setMenuOpen((open) => !open)} className="relative flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-[#c62828] hover:text-[#c62828]">
              <span className={"absolute h-[2px] w-5 bg-current transition-transform duration-300 " + (menuOpen ? "rotate-45" : "-translate-y-[4px]")} />
              <span className={"absolute h-[2px] w-5 bg-current transition-transform duration-300 " + (menuOpen ? "-rotate-45" : "translate-y-[4px]")} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div ref={menuRef} id="site-menu" role="dialog" aria-modal="true" aria-label="Меню сайта" className="fixed inset-0 z-40 overflow-y-auto bg-white px-6 pb-12 pt-24 lg:px-10 lg:pt-32">
          <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
            <nav aria-label="Основные разделы">
              <ul className="divide-y divide-line border-y border-line">
                {LINKS.map((link, index) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={closeMenu} className="group flex items-center justify-between py-4 text-[clamp(1.8rem,5vw,3.8rem)] font-black leading-none tracking-tight transition-colors hover:text-[#c62828]">
                      <span>{link.label}</span><span className="text-sm font-semibold text-[#c62828]">0{index + 1}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/#kp" onClick={closeMenu} className="mt-8 inline-flex min-h-14 items-center bg-[#c62828] px-8 text-sm font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#a91f1f]">Получить коммерческое предложение ↗</a>
            </nav>
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-muted">Дополнительно</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {EXTRA_LINKS.map((link) => <a key={link.href} href={link.href} onClick={closeMenu} className="text-sm font-semibold text-ink/70 transition-colors hover:text-[#c62828]">{link.label} ↗</a>)}
                </div>
              </div>
              <div className="border-t border-line pt-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-muted">Связаться с нами</p>
                {PHONES.map((item) => <a key={item.href} href={item.href} className="mb-2 block text-xl font-black tracking-tight hover:text-[#c62828]">{item.label}</a>)}
                <a href={"mailto:" + EMAIL} className="mt-3 inline-block text-sm text-muted underline underline-offset-4 hover:text-ink">{EMAIL}</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
