import { useEffect } from "react";
import { ADDRESS, EMAIL, PHONES, WORKING_HOURS } from "../data/content";

type PageKey = "warehouse" | "delivery" | "vacancies" | "useful";

const pages: Record<PageKey, {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
}> = {
  warehouse: {
    eyebrow: "Информация для заказчиков",
    title: "Склад",
    intro: "Перед поездкой или оформлением заказа уточните наличие конкретной позиции у менеджера компании.",
    sections: [
      { title: "Проверка наличия", text: "Ассортимент включает металлические, противопожарные и специальные дверные конструкции, а также комплектующие. Актуальные остатки, комплектацию и возможность отгрузки необходимо подтвердить по телефону или электронной почте." },
      { title: "Адрес офиса", text: ADDRESS },
      { title: "Важно", text: "Адрес офиса на сайте не следует автоматически считать адресом склада. Место самовывоза и условия получения заказа согласуйте с менеджером до выезда." },
    ],
  },
  delivery: {
    eyebrow: "От заказа до монтажа",
    title: "Доставка и установка",
    intro: "Компания заявляет поставку и монтаж металлических, противопожарных и бронированных дверей, противопожарных штор и других специальных конструкций.",
    sections: [
      { title: "Согласование заказа", text: "Состав, размеры и исполнение изделия согласуются с заказчиком до изготовления или поставки. Для подготовки предложения можно направить техническое задание, размеры, эскиз и фотографии проёма." },
      { title: "Монтаж", text: "На исходном сайте указано, что монтаж выполняют квалифицированные бригады, а этапы работ планируются и согласовываются с представителями заказчика." },
      { title: "Документы при сдаче", text: "В описании компании указана передача паспорта на каждое изделие, сертификата на поставленную партию и лицензии МЧС, относящейся к монтажу и обслуживанию противопожарных преград. Перечень документов для конкретного заказа подтвердите с менеджером." },
      { title: "Сроки и стоимость", text: "Сроки доставки, стоимость подъёма и монтажа, география выезда и условия оплаты зависят от конкретного заказа. Эти параметры необходимо запросить отдельно — на этой странице они не фиксируются как универсальные условия." },
    ],
  },
  vacancies: {
    eyebrow: "Команда компании",
    title: "Вакансии",
    intro: "Информация об открытых вакансиях на сайте сейчас не опубликована.",
    sections: [
      { title: "Как узнать о наборе", text: "Если вы хотите предложить свою кандидатуру, отправьте краткую информацию о себе и интересующей должности на электронную почту компании или свяжитесь по телефону." },
      { title: "Что указать", text: "В письме укажите имя, город, опыт работы, желаемую должность и удобный способ связи. Не отправляйте документы, содержащие избыточные персональные данные, до согласования с представителем компании." },
    ],
  },
  useful: {
    eyebrow: "Материалы и консультации",
    title: "Полезное",
    intro: "Раздел с публикациями и справочными материалами находится в подготовке.",
    sections: [
      { title: "Нужна консультация?", text: "Опишите задачу и тип конструкции: входная металлическая дверь, противопожарная преграда, бронированная дверь, банковский лоток или фурнитура. Менеджер поможет определить, какие исходные данные нужны для расчёта." },
      { title: "Подготовьте информацию", text: "Для первичного обращения полезно приложить размеры проёма, эскиз или проектную документацию, указать адрес объекта и предполагаемые сроки. Не отправляйте конфиденциальные документы без необходимости." },
    ],
  },
};

export default function InfoPage({ page }: { page: PageKey }) {
  const data = pages[page];
  useEffect(() => {
    document.title = `${data.title} — Надёжный партнёр | Иваново`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
    meta.setAttribute("content", data.intro);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.setAttribute("rel", "canonical"); document.head.appendChild(canonical); }
    canonical.setAttribute("href", `https://iv-partner.ru/${page === "warehouse" ? "sklad" : page === "delivery" ? "dostavka-i-ustanovka" : page === "vacancies" ? "vakansii" : "poleznoe"}/`);
  }, [data.title, data.intro, page]);
  return (
    <>
      <header className="border-b border-line bg-white px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <a href="/" className="text-sm font-extrabold uppercase tracking-wider">Надёжный партнёр</a>
          <a href="/" className="text-sm font-semibold text-muted transition-colors hover:text-brand">← На главную</a>
        </div>
      </header>
      <main className="min-h-[70vh] bg-white px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-brand">{data.eyebrow}</p>
          <h1 className="max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold leading-[.95] tracking-tight">{data.title}</h1>
          <p className="mt-8 max-w-3xl text-xl leading-8 text-muted">{data.intro}</p>
          <div className="mt-16 grid gap-0 border-y border-line md:grid-cols-2 md:gap-x-12">
            {data.sections.map((section, index) => (
              <section key={section.title} className="border-b border-line py-8 md:py-10">
                <p className="mb-4 text-xs font-semibold text-brand">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="text-2xl font-extrabold tracking-tight">{section.title}</h2>
                <p className="mt-4 text-base leading-7 text-ink/75">{section.text}</p>
              </section>
            ))}
          </div>
          <div className="mt-16 grid gap-8 bg-soft p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted">Связаться с компанией</p>
              <h2 className="mt-3 text-2xl font-extrabold">Уточните детали вашего заказа</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{ADDRESS}</p>
              <p className="mt-2 text-sm text-muted">{WORKING_HOURS}</p>
              <a href={"mailto:" + EMAIL} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">{EMAIL}</a>
            </div>
            <div className="flex flex-col gap-3">
              {PHONES.map((phone) => <a key={phone.href} href={phone.href} className="whitespace-nowrap text-lg font-bold hover:text-brand">{phone.label}</a>)}
              <a href="/#kp" className="btn mt-2 text-center">Запросить КП</a>
            </div>
          </div>
          <p className="mt-8 text-xs leading-6 text-muted">Сведения о наличии, сроках, стоимости и условиях обслуживания не подменяются предположениями. Подтвердите их у менеджера перед оформлением заказа.</p>
        </div>
      </main>
      <footer className="bg-graphite px-6 py-8 text-xs text-white/60 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 sm:flex-row">
          <span>© {new Date().getFullYear()} «Надёжный партнёр»</span>
          <a href="/" className="hover:text-white">Вернуться на главную</a>
        </div>
      </footer>
    </>
  );
}
