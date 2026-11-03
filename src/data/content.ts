export const EMAIL = "bux_partner2017@bk.ru";
export const ADDRESS = "153025, г. Иваново, ул. Тимирязева, д. 1, стр. 2, офисы 324–325";
export const WORKING_HOURS = "Пн–Пт: 9:00–18:00 · Сб–Вс: выходные";

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

/* Краткое описание деятельности по официальной главной странице. */
export const ABOUT_INTRO: string[] = [
  "Мы производим противопожарные и входные металлические двери. Также поставляем и монтируем противопожарные преграды, металлические решётки и ворота специального назначения.",
  "Производство, поставка и монтаж противопожарных преград и специальных дверей — основное направление нашей деятельности. Мы сотрудничаем со строительными компаниями по всей России. Для постоянных клиентов на сайте компании указаны специальные условия сотрудничества, скидки и приоритет выполнения крупных заказов.",
];

