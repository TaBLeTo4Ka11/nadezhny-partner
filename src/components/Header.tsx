import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
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

const CATALOG_GROUPS = [
  {
    title: "Противопожарные преграды",
    items: [
      { label: "Противопожарные ворота", slug: "protivopozharnye-vorota" },
      { label: "Противопожарные двери", slug: "protivopozharnye-dveri" },
      { label: "Противопожарные люки", slug: "protivopozharnye-lyuki" },
      { label: "Противопожарные шторы", slug: "protivopozharnye-shtory" },
      { label: "Светопрозрачные перегородки", slug: "svetoprozrachnye-peregorodki" },
    ],
  },
  {
    title: "Входные двери",
    items: [
      { label: "Двери с терморазрывом", slug: "dveri-s-termorazryvom" },
      { label: "Двери с зеркалом", slug: "dveri-s-zerkalom" },
      { label: "Двери МДФ–МДФ", slug: "dveri-mdf-mdf" },
      { label: "Двери металл–металл", slug: "dveri-metall-metall" },
      { label: "Двери металл–МДФ", slug: "dveri-metall-mdf" },
      { label: "Коттеджные двери", slug: "kottedzhnye-dveri-so-steklopaketom" },
    ],
  },
  {
    title: "Бронированные двери",
    items: [
      { label: "Банковские лотки", slug: "bankovskie-lotki" },
      { label: "Двери 3 класса защиты", slug: "dveri-3-klassa-zashchity" },
      { label: "Двери защитные", slug: "dveri-zashchitnye" },
    ],
  },
  {
    title: "Деревянные двери",
    items: [
      { label: "Полнотелые двери", slug: "polnotelye-derevyannye-dveri" },
      { label: "Блоки для строителей", slug: "dvernye-bloki-dlya-stroiteley" },
    ],
  },
  {
    title: "Антипаника",
    items: [{ label: "Фурнитура Антипаника", slug: "furnitura-dlya-protivopozharnyh-dverey" }],
  },
];

const navLinkCls = "text-[11px] font-bold uppercase tracking-[.12em] text-ink/70 transition-colors duration-300 hover:text-brand";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const catBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const pinned = useRef(false);
  const phone = PHONES[0];

  const clearTimer = () => window.clearTimeout(closeTimer.current);
  const closeCat = () => {
    clearTimer();
    pinned.current = false;
    setCatOpen(false);
  };
  const hoverOpen = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearTimer();
    setCatOpen(true);
  };
  const hoverClose = (event: React.PointerEvent) => {
    if (event.pointerType !== "mouse" || pinned.current) return;
    clearTimer();
    closeTimer.current = window.setTimeout(() => setCatOpen(false), 180);
  };
  const onCatClick = () => {
    if (catOpen && !pinned.current) {
      pinned.current = true;
      return;
    }
    if (catOpen) {
      closeCat();
    } else {
      pinned.current = true;
      setCatOpen(true);
    }
  };

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

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Закрытие выпадающего каталога: клик вне шапки, Escape
  useEffect(() => {
    if (!catOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeCat();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCat();
        catBtnRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  // Анимация выпадающего каталога
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const items = panel.querySelectorAll<HTMLElement>("[data-dd-item]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf([panel, items]);

    if (catOpen) {
      gsap.set(panel, { visibility: "visible" });
      if (reduce) {
        gsap.set(panel, { opacity: 1, y: 0, clearProps: "clipPath" });
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        panel,
        { opacity: 0, y: -16, clipPath: "inset(0% 0% 100% 0%)" },
        { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.out", clearProps: "clipPath" },
      );
      gsap.fromTo(
        items,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.035, ease: "power3.out", delay: 0.1 },
      );
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: -8,
        duration: reduce ? 0 : 0.22,
        ease: "power2.in",
        onComplete: () => { gsap.set(panel, { visibility: "hidden" }); },
      });
    }
  }, [catOpen]);

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
      <header
        ref={headerRef}
        onPointerLeave={hoverClose}
        className={"safe-area-top fixed inset-x-0 top-0 z-50 border-b bg-white transition-all duration-300 " + (scrolled || menuOpen || catOpen ? "border-line shadow-[0_8px_30px_rgba(0,0,0,.04)]" : "border-transparent")}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
          <a href="/" aria-label="Надёжный партнёр — главная" className="flex min-w-0 items-center gap-3">
            <img src={LOGO} alt="Логотип «Надёжный партнёр»" width={58} height={58} loading="eager" decoding="async" className="h-11 w-11 shrink-0 object-contain lg:h-14 lg:w-14" />
            <span className="max-w-[170px] text-xs font-black uppercase leading-tight tracking-[.12em] sm:max-w-none sm:text-sm">Надёжный партнёр</span>
          </a>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Главная навигация">
            {LINKS.slice(0, 5).map((link) =>
              link.label === "Каталог" ? (
                <button
                  key={link.href}
                  ref={catBtnRef}
                  type="button"
                  aria-expanded={catOpen}
                  aria-controls="catalog-dropdown"
                  aria-haspopup="true"
                  onPointerEnter={hoverOpen}
                  onClick={onCatClick}
                  className={navLinkCls + " group inline-flex h-20 items-center gap-1.5 " + (catOpen ? "text-brand" : "")}
                >
                  {link.label}
                  <svg aria-hidden="true" viewBox="0 0 10 6" className={"h-1.5 w-2.5 transition-transform duration-300 " + (catOpen ? "rotate-180" : "")}>
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              ) : (
                <a key={link.href} href={link.href} onPointerEnter={hoverClose} className={navLinkCls}>{link.label}</a>
              ),
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a href={phone.href} aria-label={"Позвонить: " + phone.label} className="inline-flex min-h-11 items-center justify-center bg-[#c62828] px-4 text-xs font-extrabold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#a91f1f] sm:px-6 sm:text-sm">
              <span className="sm:hidden">Звонок</span>
              <span className="hidden sm:inline">{phone.label}</span>
            </a>
            <button ref={toggleRef} type="button" aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} onClick={() => { closeCat(); setMenuOpen((open) => !open); }} className="relative flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors duration-300 hover:border-[#c62828] hover:text-[#c62828]">
              <span className={"absolute h-[2px] w-5 bg-current transition-transform duration-300 " + (menuOpen ? "rotate-45" : "-translate-y-[4px]")} />
              <span className={"absolute h-[2px] w-5 bg-current transition-transform duration-300 " + (menuOpen ? "-rotate-45" : "translate-y-[4px]")} />
            </button>
          </div>
        </div>

        {/* Выпадающий каталог (только десктоп) */}
        <div
          ref={panelRef}
          id="catalog-dropdown"
          style={{ visibility: "hidden", opacity: 0 }}
          className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_60px_rgba(0,0,0,.08)] will-change-transform xl:block"
        >
          <div className="mx-auto max-w-[1400px] px-10 pb-8 pt-10">
            <div className="grid grid-cols-5 gap-8">
              {CATALOG_GROUPS.map((group, index) => (
                <div key={group.title} data-dd-item>
                  <p className="flex items-baseline justify-between border-b-2 border-ink pb-3 text-[11px] font-extrabold uppercase tracking-[.1em]">
                    <span>{group.title}</span>
                    <span className="text-[#c62828]">0{index + 1}</span>
                  </p>
                  <ul className="mt-4 space-y-1">
                    {group.items.map((item) => (
                      <li key={item.slug}>
                        <a
                          href={"/catalog/" + item.slug + "/"}
                          onClick={closeCat}
                          className="group/link flex items-center justify-between gap-2 py-1.5 text-sm text-ink/70 transition-all duration-300 hover:translate-x-1 hover:text-[#c62828]"
                        >
                          <span>{item.label}</span>
                          <span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100">→</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div data-dd-item className="mt-8 flex items-center justify-between border-t border-line pt-5">
              <a href="/#catalog" onClick={closeCat} className="text-xs font-extrabold uppercase tracking-[.14em] transition-colors duration-300 hover:text-[#c62828]">Весь каталог →</a>
              <a href="/#kp" onClick={closeCat} className="inline-flex min-h-11 items-center bg-[#c62828] px-6 text-xs font-extrabold uppercase tracking-[.12em] text-white transition-colors duration-300 hover:bg-[#a91f1f]">Запросить предложение ↗</a>
            </div>
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
                    <a href={link.href} onClick={closeMenu} className="group flex items-center justify-between py-4 text-[clamp(1.8rem,5vw,3.8rem)] font-black leading-none tracking-tight transition-colors duration-300 hover:text-[#c62828]">
                      <span>{link.label}</span><span className="text-sm font-semibold text-[#c62828]">0{index + 1}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href="/#kp" onClick={closeMenu} className="mt-8 inline-flex min-h-14 items-center bg-[#c62828] px-8 text-sm font-extrabold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-[#a91f1f]">Получить коммерческое предложение ↗</a>
            </nav>
            <div className="flex flex-col justify-between gap-10">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-muted">Дополнительно</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {EXTRA_LINKS.map((link) => <a key={link.href} href={link.href} onClick={closeMenu} className="text-sm font-semibold text-ink/70 transition-colors duration-300 hover:text-[#c62828]">{link.label} ↗</a>)}
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
