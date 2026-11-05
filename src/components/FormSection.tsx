import { FormEvent, useState } from "react";
import { EMAIL, PHONES } from "../data/content";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/bux_partner2017@bk.ru";

export default function FormSection() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("_honey") ?? "").trim()) return;

    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          message: data.get("message"),
          consent: "Согласие на обработку персональных данных предоставлено",
          consent_version: "2026-11-04",
          _subject: "Заявка на коммерческое предложение — iv-partner.ru",
          _replyto: data.get("email") || EMAIL,
          _template: "table",
          _honey: "",
        }),
      });
      const result = await response.json() as { success?: boolean | string; message?: string; errors?: unknown };
      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error(result.message || "Не удалось отправить заявку. Позвоните нам или напишите на email.");
      }
      form.reset();
      setStatus("Спасибо! Заявка принята. Если это первая отправка через форму, сервис может запросить подтверждение адреса получателя.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось отправить заявку. Позвоните нам.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="kp" className="scroll-mt-28 bg-graphite px-6 py-24 text-white lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-white/50">Коммерческое предложение</p>
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-extrabold leading-none tracking-tight">Обсудить задачу</h2>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-white/70">
            Расскажите, какая конструкция или комплектация вам нужна. Менеджер уточнит детали и подготовит предложение.
          </p>
          <div className="mt-10 space-y-3">
            {PHONES.map((phone) => <a key={phone.href} href={phone.href} className="block text-lg font-bold hover:underline">{phone.label}</a>)}
            <a href={"mailto:" + EMAIL} className="inline-block text-sm text-white/70 underline underline-offset-4">{EMAIL}</a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm text-white/70">Имя *
                <input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none focus:border-white" />
              </label>
              <label className="block text-sm text-white/70">Телефон *
                <input name="phone" type="tel" required minLength={7} maxLength={40} autoComplete="tel" placeholder="+7" className="mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none focus:border-white" />
              </label>
            </div>
            <label className="block text-sm text-white/70">Email
              <input name="email" type="email" maxLength={254} autoComplete="email" className="mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none focus:border-white" />
            </label>
            <label className="block text-sm text-white/70">Кратко опишите задачу *
              <textarea name="message" required minLength={5} maxLength={3000} rows={4} className="mt-2 w-full resize-y border border-white/30 bg-transparent p-3 text-base text-white outline-none focus:border-white" />
            </label>
            <label className="hidden" aria-hidden="true">Не заполняйте это поле
              <input name="_honey" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="flex items-start gap-3 text-xs leading-5 text-white/70">
              <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[#c62828]" />
              <span>Согласен на обработку персональных данных в соответствии с <a href="/privacy-policy/" className="underline underline-offset-4">политикой конфиденциальности</a>.</span>
            </label>
            <button type="submit" disabled={busy} className="btn px-8 py-4 text-base disabled:cursor-wait disabled:opacity-60">
              {busy ? "Отправляем…" : "Отправить заявку"}
            </button>
            <p role="status" aria-live="polite" className="min-h-6 text-sm text-white/75">{status}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
