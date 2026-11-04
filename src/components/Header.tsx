import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { EMAIL, PHONES } from "../data/content";
import { catalog, catalogUrls } from "../data/companyContent";

gsap.registerPlugin(ScrollToPlugin);

const LOGO = "https://iv-partner.ru/wp-content/uploads/2021/08/dveri-300x301.png";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// На главной ссылки-якоря работают напрямую, на внутренних страницах ведут на «/#раздел»
const HOME = window.location.pathname.replace(/\/+$/, "") === "";
const hashHref = (id: string) => (HOME ? "#" : "/#") + id;

type NavItem = { label: string; hash?: string; href?: string };

const NAV: NavItem[] = [
  { label: "Каталог", hash: "catalog" },
  { label: "О компании", hash: "about" },
  { label: "Производство", hash: "production" },
  { label: "Склад", href: "/sklad/" },
  { label: "Доставка и установка", href: "/dostavka-i-ustanovka/" },
  { label: "Контакты", hash: "contacts" },
];

const EXTRA: NavItem[] = [
  { label: "Наши работы", hash: "gallery" },
  { label: "Отзывы", hash: "reviews" },
  { label: "Вакансии", href: "/vakansii/" },
  { label: "Полезное", href: "/poleznoe/" },
  { label: "Выбрать цвет", href: "/color-palette/ral-classic/" },
  { label: "Политика конфиденциальности", href: "/privacy-policy/" },
  { label: "Согласие на cookie", href: "/kuki/" },
];

const resolve = (n: NavItem) => (n.hash ? hashHref(n.hash) : n.href ?? "#");

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // Фиксированная шапка: появляется граница после начала прокрутки
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Подсветка активного раздела (красным)
  useEffect(() => {
    const ids = ["catalog", "about", "production", "contacts"];
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

  // Блокировка прокрутки страницы при открытом меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Анимация-шторка при открытии меню
  useLayoutEffect(() => {
    if (!menuOpen || !panel.current) return;
    const p = panel.current;
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        p,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut", clearProps: "clipPath" }
      );
      gsap.from("[data-menu-item]", { y: 36, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.045, delay: 0.25 });
    }, p);
    return () => ctx.revert();
  }, [menuOpen]);

  const closeMenu = (after?: () => void) => {
    const p = panel.current;
    const done = () => {
      setMenuOpen(false);
      toggle.current?.focus({ preventScroll: true });
      after?.();
    };
    if (!p || reduced()) return done();
    gsap.to(p, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.5, ease: "power4.inOut", onComplete: done });
  };

  // Фокус внутри меню и закрытие по Esc
  useEffect(() => {
    if (!menuOpen) return;
    const p = panel.current;
    const sel = 'a[href], button:not([disabled])';
    const items = (): HTMLElement[] => Array.from(p?.querySelectorAll<HTMLElement>(sel) ?? []);
    items()[0]?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return closeMenu();
      if (e.key !== "Tab") return;
      const list: HTMLElement[] = [toggle.current, ...items()].filter((x): x is HTMLElement => !!x);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  // Плавный скролл к якорям через GSAP ScrollToPlugin
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto"; // CSS smooth конфликтует с GSAP
    window.history.pushState(null, "", "#" + id);
    const restore = () => {
      root.style.scrollBehavior = prev;
    };
    gsap.to(window, {
      duration: reduced() ? 0 : 1.1,
      ease: "power3.inOut",
      scrollTo: { y: el, offsetY: 76, autoKill: true },
      onComplete: restore,
      onInterrupt: restore,
    });
  };

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const m = href.match(/^#(.+)$/); // только якоря текущей страницы
    if (!m || !document.getElementById(m[1])) return;
    e.preventDefault();
    if (menuOpen) closeMenu(() => scrollToId(m[1]));
    else scrollToId(m[1]);
  };

  const phone = PHONES[0];
  const line = "absolute left-3 h-0.5 w-6 bg-ink transition-all duration-300";

  return (
    <>
      <header
        className={
          "safe-area-top fixed inset-x-0 top-0 z-50 border-b bg-white transition-colors duration-300 " +
          (scrolled || menuOpen ? "border-line" : "border-transparent")
        }
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
          <a
            href={HOME ? "#top" : "/"}
            onClick={(e) => (HOME ? go(e, "#top") : undefined)}
            className="flex min-w-0 items-center gap-3"
          >
            <img
              src={LOGO}
              alt="Логотип компании «Надёжный партнёр»"
              width={48}
              height={48}
              loading="eager"
              decoding="async"
              onError={(event) => { event.currentTarget.style.display = "none"; }}
              className="h-10 w-10 shrink-0 object-contain lg:h-12 lg:w-12"
            />
            <span className="truncate text-sm font-extrabold uppercase tracking-wider">Надёжный партнёр</span>
          </a>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={phone.href}
              aria-label={"Позвонить: " + phone.label}
              className="btn whitespace-nowrap px-4 py-3 text-sm sm:px-6"
            >
              <span className="md:hidden">Позвонить</span>
              <span className="hidden md:inline">{phone.label}</span>
            </a>

            <button
              ref={toggle}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              className="relative h-12 w-12 shrink-0"
            >
              <span className={line + (menuOpen ? " top-[23px] rotate-45" : " top-[18px]")} />
              <span className={line + (menuOpen ? " top-[23px] -rotate-45" : " top-[28px]")} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          id="site-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Меню сайта"
          className="fixed inset-0 z-40 overflow-y-auto bg-white px-6 pb-12 pt-24 lg:px-10 lg:pt-32"
        >
          <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <nav aria-label="Основная навигация">
              <ul>
                {NAV.map((n) => {
                  const id = n.hash ?? "";
                  return (
                    <li key={n.label} data-menu-item>
                      <a
                        href={resolve(n)}
                        onClick={(e) => go(e, resolve(n))}
                        className={
                          "block py-2 text-[clamp(2rem,6vw,3.75rem)] font-extrabold leading-tight tracking-tight decoration-2 underline-offset-8 hover:underline " +
                          (id && active === id ? "text-brand" : "text-ink")
                        }
                      >
                        {n.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <a
                data-menu-item
                href={hashHref("kp")}
                onClick={(e) => go(e, hashHref("kp"))}
                className="btn mt-8 inline-block px-8 py-4 text-base"
              >
                Выслать КП
              </a>
            </nav>

            <div>
              <p data-menu-item className="mb-6 text-xs font-semibold uppercase tracking-[.2em] text-muted">
                Каталог
              </p>
              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {catalog.map((g) => (
                  <div key={g.group} data-menu-item>
                    <p className="border-b-2 border-ink pb-2 text-sm font-extrabold">{g.group}</p>
                    <ul className="mt-3 space-y-2">
                      {g.items.map((item) => (
                        <li key={item}>
                          <a href={catalogUrls[item] ?? hashHref("catalog")} className="text-sm text-ink/80 hover:text-ink hover:underline underline-offset-4">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div data-menu-item className="mt-12 border-t border-line pt-6">
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {EXTRA.map((n) => (
                    <li key={n.label}>
                      <a href={resolve(n)} onClick={(e) => go(e, resolve(n))} className="text-xs text-muted hover:text-ink">
                        {n.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-1 text-sm">
                  {PHONES.map((p) => (
                    <a key={p.href} href={p.href} className="block font-bold hover:underline">
                      {p.label}
                    </a>
                  ))}
                  <a href={"mailto:" + EMAIL} className="block text-muted hover:text-ink">
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
