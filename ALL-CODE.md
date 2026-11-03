# Надёжный партнёр — весь код проекта (Vite + React + TS + Tailwind + GSAP)
Как загружать на GitHub: Add file → Create new file, имя файла = заголовок ниже (для папок пишите путь, например src/components/Header.tsx), вставьте код, Commit. Затем Vercel → Add New Project.
Удалите старые файлы src/pages/* и src/components/Requisites.tsx, если они были загружены раньше.

---

## `package.json`

```json
{
  "name": "nadezhny-partner",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "gsap": "^3.12.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
}
```

---

## `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

---

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

---

## `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## `vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## `.gitignore`

```
node_modules
dist
.DS_Store
```

---

## `index.html`

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#ffffff" />
    <title>Надёжный партнёр — производство и поставка противопожарных преград</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  </head>
  <body style="background:#ffffff">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    borderRadius: { none: "0", DEFAULT: "0", sm: "0", md: "0", lg: "0", xl: "0", "2xl": "0", "3xl": "0", full: "0" },
    boxShadow: { none: "none" },
    extend: {
      colors: {
        soft: "#f8f9fa",
        graphite: "#1a1a1a",
        ink: "#1a1a1a",
        muted: "#5f6368",
        line: "#e5e7eb",
        brand: "#c62828",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

---

## `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background: #ffffff;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }
  body {
    @apply bg-white font-sans text-ink antialiased;
  }
  *,
  *::before,
  *::after {
    border-radius: 0;
  }
  input:not([type="checkbox"]):not([type="radio"]),
  textarea,
  button,
  select {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 0;
  }
  ::selection {
    background: #1a1a1a;
    color: #fff;
  }
  :focus-visible {
    outline: 2px solid #1a1a1a;
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
}

@layer components {
  .btn {
    @apply inline-block bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#a52020];
  }
}
```

---

## `src/App.tsx`

```tsx
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CatalogSection from "./components/CatalogSection";
import PartnersSection from "./components/PartnersSection";
import AboutSection from "./components/AboutSection";
import GallerySection from "./components/GallerySection";
import ReviewsSection from "./components/ReviewsSection";
import FormSection from "./components/FormSection";
import MapSection from "./components/MapSection";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CatalogSection />
        <PartnersSection />
        <AboutSection />
        <GallerySection />
        <ReviewsSection />
        <FormSection />
        <MapSection />
      </main>
      <Footer />
    </>
  );
}
```

---

## `src/data/content.ts`

```ts
export const EMAIL = "bux_partner2017@bk.ru";
export const ADDRESS = "153025, г. Иваново, ул. Тимирязева, д.1 стр.2, офис 324";

export const PHONES = [
  { label: "8 (800) 222 88 37", href: "tel:88002228837" },
  { label: "8 (4932) 345-017", href: "tel:84932345017" },
];

/** У сайта нет сервера: открываем почтовое приложение с готовым письмом */
export function sendMail(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .map(([k, v]) => k + ": " + v)
    .join("\n");
  window.location.href =
    "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

const BASE = "https://iv-partner.ru/wp-content/uploads/2022/03/";

export const IMG = {
  door1: BASE + "DMP-1-EIS60-e1647434608692.jpg",
  door2: BASE + "DMP-2-EIS60-e1647434559868.jpg",
  door3: BASE + "DMP-01-EIS60-e1647434479532.jpg",
  gates: BASE + "vorota-protivopojarnie.jpg",
  curtains: BASE + "protivopojarniye-shtori.jpg",
};

/* Текст «О компании» — дословно */
export const ABOUT_INTRO: string[] = [
  "Мы уже более 15 лет занимается производством, поставкой и монтажом металлических и противопожарных бронированных дверей а так же противопожарных штор. Мы работаем как с крупными компаниями застройщиками так и с частными лицами. Наши бригады высоко квалифицированных монтажников выполняет работу быстро и качественно.",
  "Благодаря тому что мы планируем и согласовываем этапы проведения работ по монтажу на объекте с представителями заказчика, знаем, что надо делать, работаем чётко и слаженно, работу всегда сдаём в срок. При сдаче объекта с монтажом противопожарных преград, мы предоставляем Заказчику паспорт на каждое изделие, сертификат на всю поставленную партию продукции, а так же лицензию МЧС ( которая даёт возможность осуществлять монтаж и обслуживание противопожарных преград).",
  "Поставка противопожарных преград бронированных дверей противопожарных штор металлических дверей на административные объекты дверей и на муниципальные объекты дверных блоков строительным компаниям. Монтаж противопожарных преград бронированных дверей противопожарных штор металлических дверей на административные объекты дверей и на муниципальные объекты дверных блоков строительным компаниям.",
  "Производство противопожарных и металлических дверей. Готовое изделие упаковывают в гофрокартон (прокладывают пенопластом) и перемещается на склад. Точно так же изготавливают двери и под заказ, то есть используют размеры и эскиз заказчика.",
];

export const ABOUT_STAGES: { title: string; paragraphs: string[] }[] = [
  {
    title: "Первый этап. Подготовка",
    paragraphs: [
      "Производство металлической двери начинается с тщательных замеров и выбора самого металла. После попадания на завод листы стали тщательно проверяются на наличие деформаций и коррозии и хранятся отдельно в специально оборудованных помещениях. Оптимальная толщина стального полотна 2 — 3 мм. По желанию заказчика, изготовление двери также выполняется из 5 — ти мм стали.",
      "Изготовление коробки и полотна двери. Коробка — это внешняя часть изделия, которую впоследствии вставят в дверной проем, и на которую повесят само полотно. Коробку делают цельногнутой, что обеспечивает высокую точность размеров и посадочных допусков.",
      "Полотно – та часть двери, в которой устанавливается замок, и которая выполняет защитные функции. Изготавливают его таким образом: создают каркас из профилированной трубы (могут использоваться ребра жесткости), затем к каркасу приваривается лист стали с двух сторон, между листами стали устанавливается утеплитель базальтовая плита.",
    ],
  },
  {
    title: "Второй этап. Установка фурнитуры",
    paragraphs: [
      "На коробку и полотно устанавливают петли, тщательно выверяя места монтажа. Электродуговой сваркой приваривают петли к стойкам двери и дверной коробки. Соблюдение точных размеров при монтаже обеспечивают струбцины, которые держат петли на нужном расстоянии. Это приспособление называют кондуктор сборки дверной коробки. В местах соприкосновения сварочного аппарата со стальным полотном появляются заклепки из расплавленного металла, свидетельствующие о том, что конструкция надежно скреплена.",
      "В полотне и стойках коробки делают отверстия под фурнитуру и замок. Перед тем как пройти технический контроль, где будут проверены все зазоры, сварочные швы и общее качество сборки, происходит шлифовка и зачистка всех соединений, убираются все заусенцы и так называемая «окалина». После чего будущую дверь моют раствором фосфата, который не просто отмывает от грязи и масла, но и покрывает её специальной пленкой, защищающей от ржавчины.",
    ],
  },
  {
    title: "Третий этап. Окраска",
    paragraphs: [
      "Изделие идет в покрасочную камеру, где наноситься полимерное покрытие. Полимерная покраска металла может производиться только на тщательно подготовленной поверхности – не должно быть ни ржавчины, ни окислов. Для этого с помощью дробеструйной или пескоструйной обработки удаляется старое покрытие. Затем оно хорошо обезжиривается специальными моющими средствами или спиртосодержащими жидкостями – только так можно будет добиться высокой адгезии используемого порошкового покрытия.",
    ],
  },
  {
    title: "Четвертый этап. Завершение",
    paragraphs: [
      "Установка фурнитуры, установка уплотнителей, установка ригелей и торцевых шпингалетов. На противопожарные двери дополнительно устанавливается термоактивный уплотнитель.",
      "Собственное производство двери с завода без лишних наценок. Полный контроль качества проверка качества на каждом этапе работ. Конструкция любой сложности производство дверей любой сложности.",
    ],
  },
];
```

---

## `src/components/Header.tsx`

```tsx
import { useEffect, useState, type FormEvent } from "react";
import { PHONES, sendMail } from "../data/content";

const LOGO = "https://iv-partner.ru/wp-content/uploads/2021/08/dveri-300x301.png";

const TOP = [
  { label: "Политика конфиденциальности", href: "#privacy" },
  { label: "Согласие на cookie", href: "#cookies" },
  { label: "Наши заказы", href: "#gallery" },
  { label: "Наши отзывы", href: "#reviews" },
];

const CATALOG = [
  "Противопожарные преграды",
  "Входные двери",
  "Бронированные двери",
  "Деревянные двери",
  "Антипаника",
  "Цвета и покраска",
];

// «Склад» и «Доставка и установка»: отдельных разделов пока нет, ведём на контакты
const NAV = [
  { label: "О компании", href: "#about", id: "about" },
  { label: "Склад", href: "#contacts", id: "" },
  { label: "Доставка и установка", href: "#contacts", id: "" },
  { label: "Контакты", href: "#contacts", id: "contacts" },
];

const field =
  "w-full border-0 border-b border-[#c9ccd1] bg-transparent py-4 text-lg text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [call, setCall] = useState(false);
  const [active, setActive] = useState("");

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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    sendMail("Заказ звонка", { Имя: String(f.get("name")), Телефон: String(f.get("phone")) });
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
                <ul className="min-w-[260px] border border-line bg-white py-2">
                  {CATALOG.map((c) => (
                    <li key={c}>
                      <a href="#catalog" className="block px-5 py-3 text-sm transition-colors hover:bg-soft">
                        {c}
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
            <button type="button" onClick={() => setCall(true)} className="btn hidden md:block">
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
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? "Закрыть" : "Меню"}
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      {menu && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-white px-6 pb-10 pt-28 xl:hidden">
          <nav className="flex flex-col gap-5" aria-label="Мобильная навигация">
            <a href="#catalog" onClick={() => setMenu(false)} className="text-3xl font-extrabold tracking-tight">
              Каталог
            </a>
            <ul className="-mt-2 mb-2 space-y-3 border-l border-line pl-4">
              {CATALOG.map((c) => (
                <li key={c}>
                  <a href="#catalog" onClick={() => setMenu(false)} className="text-base text-muted">
                    {c}
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
      )}

      {/* Окно «Заказать звонок» */}
      {call && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6" onClick={() => setCall(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Заказать звонок"
            className="w-full max-w-md border border-line bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-start justify-between gap-6">
              <h2 className="text-3xl font-extrabold tracking-tight">Заказать звонок</h2>
              <button type="button" onClick={() => setCall(false)} className="text-sm text-muted hover:text-ink">
                Закрыть
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <label htmlFor="cb-name" className="sr-only">Имя</label>
              <input id="cb-name" name="name" type="text" required autoComplete="name" placeholder="Имя" className={field} />
              <label htmlFor="cb-phone" className="sr-only">Телефон</label>
              <input id="cb-phone" name="phone" type="tel" required autoComplete="tel" placeholder="Телефон" className={field + " mt-4"} />
              <button type="submit" className="btn mt-8">Отправить</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## `src/components/HeroSection.tsx`

```tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-h]", { opacity: 0, y: 32, duration: 1, ease: "power3.out", stagger: 0.15 });
      gsap.to("[data-bg]", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="top" className="relative flex min-h-[80svh] items-end overflow-hidden bg-graphite text-white">
      <img
        data-bg
        src={IMG.door1}
        alt=""
        aria-hidden
        className="absolute -top-[10%] left-0 h-[120%] w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/60 to-graphite/20" />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-40 lg:px-10 lg:pb-24">
        <h1
          data-h
          className="max-w-[18ch] text-[clamp(2.1rem,6.5vw,5.5rem)] font-extrabold leading-[1.02] tracking-tight"
        >
          Производство и поставка противопожарных преград
        </h1>
        <p data-h className="mt-6 text-lg text-white/80 md:text-2xl">
          Собственное производство. 15 лет опыта
        </p>
        <a data-h href="#kp" className="btn mt-10 px-10 py-4 text-base">
          Оставить заявку
        </a>
      </div>
    </section>
  );
}
```

---

## `src/components/CatalogSection.tsx`

```tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IMG } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER = "https://placehold.co/800x600/f8f9fa/1a1a1a?text=Photo";

const ITEMS: { title: string; text: string; image?: string }[] = [
  { title: "Противопожарные двери", text: "Производство, поставка и монтаж. Изготовление под размеры и эскиз заказчика.", image: IMG.door1 },
  { title: "Ворота", text: "Противопожарные ворота: производство, поставка и монтаж.", image: IMG.gates },
  { title: "Шторы", text: "Противопожарные шторы: производство, поставка и монтаж.", image: IMG.curtains },
  { title: "Люки", text: "Противопожарные люки под размеры вашего объекта." },
  { title: "Перегородки", text: "Противопожарные перегородки для административных и муниципальных объектов." },
  { title: "Бронированные двери", text: "Сталь полотна 2 — 3 мм, по желанию заказчика 5 мм." },
];

export default function CatalogSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current ?? undefined);
      gsap.set(cards, { opacity: 0, y: 40 });
      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="catalog" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="max-w-[14ch] text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Каталог</h2>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((c) => (
            <article key={c.title} data-card className="flex flex-col border border-line bg-white">
              <div className="aspect-[4/3] overflow-hidden bg-soft">
                <img
                  src={c.image ?? PLACEHOLDER}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-extrabold tracking-tight">{c.title}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-muted">{c.text}</p>
                <a href="#kp" className="btn mt-6 self-start">
                  Подробнее
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## `src/components/PartnersSection.tsx`

```tsx
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
```

---

## `src/components/AboutSection.tsx`

```tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ABOUT_INTRO, ABOUT_STAGES } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

const body = "mb-5 max-w-[66ch] text-lg leading-relaxed text-ink/80";

export default function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-p]", root.current ?? undefined);
      gsap.set(items, { opacity: 0, y: 30 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" lang="ru" className="scroll-mt-28 bg-soft px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-40">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Техническое описание</p>
            <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">О компании</h2>
            <p className="mt-6 max-w-[26ch] text-lg text-muted">Собственное производство. 15 лет опыта</p>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <div className="border-t-2 border-ink pt-8">
            <h3 data-p className="mb-6 text-2xl font-extrabold tracking-tight">Общие сведения</h3>
            {ABOUT_INTRO.map((t, i) => (
              <p key={i} data-p className={body}>
                {t}
              </p>
            ))}
          </div>

          {ABOUT_STAGES.map((s, i) => (
            <div key={s.title} className="mt-14 border-t-2 border-ink pt-8">
              <h3 data-p className="mb-6 flex items-baseline gap-5 text-2xl font-extrabold tracking-tight">
                <span className="text-sm font-semibold tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h3>
              {s.paragraphs.map((t, j) => (
                <p key={j} data-p className={body}>
                  {t}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## `src/components/GallerySection.tsx`

```tsx
import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SITE = "https://iv-partner.ru/";
const PLACEHOLDER = "https://placehold.co/600x400/f8f9fa/1a1a1a?text=Photo";

const PROXIES = [
  (u: string) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
  (u: string) => "https://corsproxy.io/?" + encodeURIComponent(u),
];

// Запасной набор: ссылки, которые были присланы (5 шт.). Добавляйте сюда остальные.
const B = "https://iv-partner.ru/wp-content/uploads/2022/03/";
const FALLBACK: string[] = [
  B + "DMP-1-EIS60-e1647434608692.jpg",
  B + "DMP-2-EIS60-e1647434559868.jpg",
  B + "DMP-01-EIS60-e1647434479532.jpg",
  B + "vorota-protivopojarnie.jpg",
  B + "protivopojarniye-shtori.jpg",
];

// Разные пропорции — асимметричная «кирпичная» сетка
const ASPECTS = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]", "aspect-[3/4]"];

async function fetchWithTimeout(url: string, ms: number) {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    window.clearTimeout(t);
  }
}

/** Достаёт ссылки на .jpg/.png из /wp-content/uploads/ */
function extractImages(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const found = new Set<string>();

  const add = (raw: string | null) => {
    if (!raw) return;
    raw.split(",").forEach((part) => {
      const u = part.trim().split(/\s+/)[0];
      if (!u) return;
      try {
        const abs = new URL(u, SITE).href;
        if (/^https:\/\/iv-partner\.ru\/wp-content\/uploads\/.+\.(jpe?g|png)(\?.*)?$/i.test(abs)) found.add(abs);
      } catch {
        /* битая ссылка — пропускаем */
      }
    });
  };

  doc.querySelectorAll("img, source, a").forEach((el) => {
    ["src", "data-src", "data-lazy-src", "srcset", "data-srcset", "href"].forEach((a) => add(el.getAttribute(a)));
  });

  return [...found].filter((u) => !/logo|dveri-300x301/i.test(u));
}

export default function GallerySection() {
  const root = useRef<HTMLElement>(null);
  const [images, setImages] = useState<string[]>(FALLBACK);

  // Пробуем получить фото с сайта; при любой ошибке остаётся FALLBACK
  useEffect(() => {
    let alive = true;
    (async () => {
      for (const proxy of PROXIES) {
        try {
          const res = await fetchWithTimeout(proxy(SITE), 8000);
          if (!res.ok) continue;
          const list = extractImages(await res.text());
          if (list.length >= 4) {
            if (alive) setImages(list.slice(0, 24));
            return;
          }
        } catch {
          /* следующий прокси */
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-g]", root.current ?? undefined);
      gsap.set(items, { opacity: 0, y: 40 });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    }, root);
    return () => ctx.revert();
  }, [images]);

  const onError = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fb) return; // без бесконечного цикла
    img.dataset.fb = "1";
    img.src = PLACEHOLDER;
  };

  return (
    <section ref={root} id="gallery" className="scroll-mt-28 bg-white px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Наши работы</h2>

        <div className="mt-14 columns-2 gap-4 md:columns-3 lg:columns-4">
          {images.map((src, i) => (
            <figure
              key={src}
              data-g
              className={"mb-4 break-inside-avoid overflow-hidden border border-line bg-soft " + ASPECTS[i % ASPECTS.length]}
            >
              <img
                src={src}
                alt={"Фото работы " + (i + 1)}
                loading="lazy"
                onError={onError}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## `src/components/ReviewsSection.tsx`

```tsx
type Review = { author: string; text: string };

/* ВСТАВЬТЕ СЮДА 3 оригинальных отзыва с сайта, например:
   { author: "ООО «Название»", text: "Текст отзыва дословно" },
   Пока массив пуст — раздел на сайте не показывается. */
const REVIEWS: Review[] = [];

export default function ReviewsSection() {
  if (REVIEWS.length === 0) return null;

  return (
    <section id="reviews" className="scroll-mt-28 bg-soft px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Отзывы</h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <figure key={i} className="flex flex-col border border-line bg-white p-8">
              <blockquote className="flex-1 text-lg leading-relaxed text-ink/80">{r.text}</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4 text-sm font-bold">{r.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## `src/components/FormSection.tsx`

```tsx
import type { FormEvent } from "react";
import { sendMail } from "../data/content";

const field =
  "w-full border-0 border-b border-white/30 bg-transparent py-4 text-lg text-white outline-none transition-colors placeholder:text-white/50 focus:border-white";

export default function FormSection() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    sendMail("Запрос КП", {
      Имя: String(f.get("name")),
      Телефон: String(f.get("phone")),
      "Техническое задание": String(f.get("task") || ""),
    });
  };

  return (
    <section id="kp" className="scroll-mt-28 bg-graphite px-6 py-24 text-white lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Выслать КП</h2>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-white/70">
            Опишите задачу или приложите размеры и эскиз — подготовим коммерческое предложение.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8 lg:col-span-7">
          <div>
            <label htmlFor="kp-name" className="sr-only">Имя</label>
            <input id="kp-name" name="name" type="text" required autoComplete="name" placeholder="Имя" className={field} />
          </div>
          <div>
            <label htmlFor="kp-phone" className="sr-only">Телефон</label>
            <input id="kp-phone" name="phone" type="tel" required autoComplete="tel" placeholder="Телефон" className={field} />
          </div>
          <div>
            <label htmlFor="kp-task" className="sr-only">Техническое задание</label>
            <textarea id="kp-task" name="task" rows={4} placeholder="ТЗ" className={field + " resize-none"} />
          </div>

          <label className="flex cursor-pointer items-start gap-4 text-sm text-white/70">
            <input type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-white" />
            <span>
              Я согласен(на) на обработку персональных данных и с{" "}
              <a href="#privacy" className="underline underline-offset-4 hover:text-white">
                политикой конфиденциальности
              </a>
            </span>
          </label>

          <button type="submit" className="btn px-10 py-4 text-base">
            Выслать КП
          </button>
        </form>
      </div>
    </section>
  );
}
```

---

## `src/components/MapSection.tsx`

```tsx
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
```

---

## `src/components/Footer.tsx`

```tsx
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
```
