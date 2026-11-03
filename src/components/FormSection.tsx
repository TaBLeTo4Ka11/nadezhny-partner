import { EMAIL, PHONES } from "../data/content";

export default function FormSection() {
  const subject = encodeURIComponent("Запрос коммерческого предложения");

  return (
    <section id="kp" className="scroll-mt-28 bg-graphite px-6 py-24 text-white lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-white/50">Коммерческое предложение</p>
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Обсудить задачу</h2>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-white/70">
            Мы сохранили контакты компании, но временно отключили сбор заявок через сайт до проверки юридических документов и способа безопасной передачи файлов.
          </p>
        </div>

        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/50">Связаться напрямую</p>
          <div className="mt-5 space-y-3">
            {PHONES.map((phone) => (
              <a key={phone.href} href={phone.href} className="block text-xl font-bold hover:underline">
                {phone.label}
              </a>
            ))}
            <a href={`mailto:${EMAIL}?subject=${subject}`} className="inline-block pt-2 text-lg font-semibold underline underline-offset-4 hover:text-white/75">
              {EMAIL}
            </a>
          </div>
          <a href={`mailto:${EMAIL}?subject=${subject}`} className="btn mt-9 inline-block px-10 py-4 text-base">
            Написать на email
          </a>
          <p className="mt-6 max-w-xl text-xs leading-6 text-white/50">
            Сайт не отправляет и не хранит заявки, не загружает вложения и не передаёт данные на сервер. Не отправляйте конфиденциальные документы обычной почтой; сначала уточните у компании подходящий способ передачи.
          </p>
        </div>
      </div>
    </section>
  );
}
