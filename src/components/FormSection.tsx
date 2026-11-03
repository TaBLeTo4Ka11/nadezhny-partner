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
      Email: String(f.get("email") || ""),
      "Техническое задание": String(f.get("task") || ""),
      "Согласие на обработку персональных данных": f.get("consent") ? "Да" : "Нет",
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
            <label htmlFor="kp-email" className="sr-only">Email</label>
            <input id="kp-email" name="email" type="email" autoComplete="email" placeholder="E-mail для ответа" className={field} />
          </div>
          <div>
            <label htmlFor="kp-task" className="sr-only">Техническое задание</label>
            <textarea id="kp-task" name="task" rows={4} placeholder="ТЗ" className={field + " resize-none"} />
          </div>

          <label className="flex cursor-pointer items-start gap-4 text-sm text-white/70">
            <input type="checkbox" name="consent" value="yes" required className="mt-0.5 h-5 w-5 shrink-0 accent-white" />
            <span>
              Я согласен(на) на обработку персональных данных и с{" "}
              <a href="https://iv-partner.ru/privacy-policy/" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">
                политикой конфиденциальности
              </a>
            </span>
          </label>

          <div>
            <button type="submit" className="btn px-10 py-4 text-base">
              Подготовить письмо с запросом
            </button>
            <p className="mt-4 max-w-xl text-xs leading-5 text-white/50">После отправки откроется почтовое приложение с заполненным письмом. При необходимости приложите к нему файл с техническим заданием вручную.</p>
          </div>
        </form>
      </div>
    </section>
  );
}