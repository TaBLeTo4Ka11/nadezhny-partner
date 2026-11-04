import { useEffect } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";

type PageKey = "warehouse" | "delivery" | "vacancies" | "useful" | "privacy" | "cookies" | "colors";
const pages: Record<PageKey, { title: string; path: string }> = {
  warehouse: { title: "Склад", path: "/sklad/" },
  delivery: { title: "Доставка и установка", path: "/dostavka-i-ustanovka/" },
  vacancies: { title: "Вакансии", path: "/vakansii/" },
  useful: { title: "Полезное", path: "/poleznoe/" },
  privacy: { title: "Политика конфиденциальности", path: "/privacy-policy/" },
  cookies: { title: "Согласие на использование cookie", path: "/kuki/" },
  colors: { title: "Выбрать цвет · RAL Classic", path: "/color-palette/ral-classic/" },
};

const legalText: Record<"privacy" | "cookies", { intro: string; sections: { title: string; text: string }[] }> = {
  privacy: {
    intro: "Настоящая политика определяет порядок обработки и защиты персональных данных посетителей сайта iv-partner.ru. Оператор — ООО «СПЕЦДВЕРИ», ОГРН 1243700006802, ИНН 3700022069, адрес: 153025, г. Иваново, ул. Тимирязева, д. 1, стр. 2, офис 324. Контакт по вопросам обработки данных: bux_partner2017@bk.ru.",
    sections: [
      { title: "1. Какие данные обрабатываются", text: "Оператор может обрабатывать имя, номер телефона, адрес электронной почты, содержание обращения, сведения о запрашиваемой продукции и технические данные, которые автоматически передаются браузером при посещении сайта (IP-адрес, тип и версия браузера, операционная система, дата и время запроса, адрес запрошенной страницы). Не направляйте через форму специальные категории персональных данных и сведения, не относящиеся к запросу." },
      { title: "2. Цели обработки", text: "Данные из формы используются для ответа на обращение, подготовки коммерческого предложения, связи по вопросам продукции, исполнения договорённостей и ведения деловой переписки. Технические данные используются для обеспечения работоспособности, безопасности и корректного отображения сайта." },
      { title: "3. Правовые основания", text: "Обработка осуществляется на основании согласия субъекта персональных данных, необходимости совершить действия по его запросу до заключения договора, исполнения договора, а также в случаях, предусмотренных законодательством Российской Федерации, включая Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных»." },
      { title: "4. Передача и поручение обработки", text: "Для доставки заявок на электронную почту сайт использует внешний сервис FormSubmit. При отправке формы введённые сведения передаются этому сервису для обработки и направления уведомления на адрес оператора. Обработка также может поручаться поставщикам инфраструктуры и хостинга в объёме, необходимом для работы сайта. Оператор не продаёт персональные данные и не раскрывает их третьим лицам, кроме случаев, предусмотренных законом или необходимых для обработки обращения." },
      { title: "5. Сроки хранения и защита", text: "Данные хранятся не дольше, чем этого требуют цели обработки, договорные отношения и законодательство. Срок хранения отдельных заявок у внешнего сервиса определяется условиями этого сервиса. Оператор принимает необходимые организационные и технические меры для защиты данных от неправомерного доступа, изменения, раскрытия и уничтожения." },
      { title: "6. Права субъекта персональных данных", text: "Вы вправе запросить сведения об обработке ваших персональных данных, потребовать уточнения, блокирования или уничтожения данных при наличии законных оснований, отозвать согласие и обратиться с вопросом к оператору по адресу bux_partner2017@bk.ru. Отзыв согласия не влияет на законность обработки, выполненной до его получения, и не исключает обработку на иных законных основаниях." },
      { title: "7. Обращения и актуализация", text: "По вопросам обработки персональных данных направляйте обращение на bux_partner2017@bk.ru или по адресу оператора: 153025, г. Иваново, ул. Тимирязева, д. 1, стр. 2, офис 324. Оператор вправе обновлять политику; актуальная редакция публикуется на этой странице." },
    ],
  },
  cookies: {
    intro: "Сайт iv-partner.ru использует cookie и аналогичные технологии, необходимые для корректной работы страниц и сохранения выбранных настроек. Продолжая пользоваться сайтом и подтверждая уведомление, посетитель выражает согласие с описанным ниже использованием cookie.",
    sections: [
      { title: "1. Что такое cookie", text: "Cookie — небольшие текстовые файлы, которые сайт сохраняет в браузере. Они помогают запомнить настройки, поддерживать работу отдельных функций и обеспечивать безопасность." },
      { title: "2. Какие технологии используются", text: "Сайт может использовать технические cookie и локальное хранилище браузера для сохранения пользовательского выбора и корректной работы интерфейса. Встроенная карта Яндекса загружается после действия пользователя и может применять собственные технологии хранения со стороны Яндекса. На сайте не заявлено использование рекламных cookie. Если в дальнейшем будут подключены аналитические или рекламные системы, сведения об этом и настройках согласия будут обновлены." },
      { title: "3. Управление cookie", text: "Посетитель может удалить или заблокировать cookie в настройках своего браузера. Ограничение технических cookie или локального хранилища может повлиять на работу отдельных функций сайта и сохранение пользовательских настроек." },
      { title: "4. Сторонние сервисы", text: "При использовании внешних сервисов, в том числе картографических и сервисов отправки форм, их поставщики могут обрабатывать технические данные в соответствии со своими документами и настройками. Перед использованием таких сервисов ознакомьтесь с правилами соответствующего поставщика." },
      { title: "5. Оператор и связь", text: "Оператор сайта — ООО «СПЕЦДВЕРИ», ОГРН 1243700006802, ИНН 3700022069. По вопросам обработки персональных данных и использования cookie: bux_partner2017@bk.ru, 153025, г. Иваново, ул. Тимирязева, д. 1, стр. 2, офис 324." },
    ],
  },
};

export default function InfoPage({ page }: { page: PageKey }) {
  const data = pages[page];
  const legal = page === "privacy" || page === "cookies" ? legalText[page] : null;

  useEffect(() => {
    document.title = `${data.title} — Надёжный партнёр`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", legal ? data.title + ". Сведения об обработке данных и использовании cookie." : data.title + " — Надёжный партнёр, Иваново.");
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", legal ? "index, follow" : "noindex, follow");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://iv-partner.ru${data.path}`);
  }, [data.title, data.path, legal]);

  return (
    <>
      <header className="border-b border-line bg-white px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-wider">
            <img src="https://iv-partner.ru/wp-content/uploads/2021/08/dveri-300x301.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            Надёжный партнёр
          </a>
          <a href="/" className="text-sm font-semibold text-muted hover:text-brand">← На главную</a>
        </div>
      </header>
      <main className="min-h-[70vh] bg-white px-6 py-16 lg:px-10 lg:py-24">
        <article className="mx-auto max-w-[1000px]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-brand">Официальная информация</p>
          <h1 className="max-w-4xl text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold leading-[.96] tracking-tight">{data.title}</h1>
          {legal ? (
            <div className="mt-10">
              <p className="max-w-4xl text-lg leading-8 text-muted">{legal.intro}</p>
              <div className="mt-10 max-w-4xl space-y-9 border-t border-line pt-9">
                {legal.sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="text-lg font-extrabold tracking-tight">{section.title}</h2>
                    <p className="mt-3 text-base leading-8 text-muted">{section.text}</p>
                  </section>
                ))}
              </div>
              <p className="mt-12 border-t border-line pt-6 text-xs leading-6 text-muted">Редакция от 4 ноября 2026 года.</p>
            </div>
          ) : (
            <>
              <div className="mt-10 max-w-3xl border-y border-line py-8">
                <p className="text-lg leading-8 text-muted">{page === "colors" ? "На сайте представлены решения с различными вариантами отделки. Доступные декоры, цвета и покрытия уточняются при согласовании заказа." : "По вопросам этого раздела свяжитесь с компанией — менеджер предоставит актуальную информацию."}</p>
              </div>
              <section className="mt-12">
                <h2 className="text-xl font-bold">Контактная информация</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{ADDRESS}</p>
                <p className="mt-2 text-sm text-muted">{WORKING_HOURS}</p>
                <a href={`mailto:${EMAIL}`} className="mt-3 inline-block underline">{EMAIL}</a>
                <div className="mt-4 flex flex-wrap gap-5">{PHONES.map((phone) => <a key={phone.href} href={phone.href} className="font-bold">{phone.label}</a>)}</div>
              </section>
            </>
          )}
        </article>
      </main>
      <footer className="bg-graphite px-6 py-8 text-xs text-white/60"><div className="mx-auto max-w-[1400px]">© {new Date().getFullYear()} «Надёжный партнёр»</div></footer>
    </>
  );
}
