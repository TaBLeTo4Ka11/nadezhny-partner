import { FormEvent, useState } from "react";
import { EMAIL, PHONES } from "../data/content";

const formEnabled =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_CONTACT_FORM_ENABLED === "true";

export default function FormSection() {
  const subject = encodeURIComponent("Запрос коммерческого предложения");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formEnabled || busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Не удалось отправить заявку.");
      form.reset();
      setStatus("Заявка отправлена. Мы передали её компании.");
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
            Расскажите, какая конструкция или комплектация вам нужна. Менеджер сможет уточнить детали и подготовить коммерческое предложение.
          </p>
        </div>

        <div className="lg:col-span-7">
          {formEnabled ? (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block text-sm text-white/70">Имя *
                  <input name="name" required minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none focus:border-white" />
                </label>
                <label className="block text-sm text-white/70">Телефон
                  <input name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="+7" className="mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none focus:border-white" />
                </label>
              </div>
              <label className="block text-sm text-white/70">Email
                <input name="email" type="email" maxLength={254} autoComplete="email" className="mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-base text-white outline-none focus:border-white" />
              </label>
              <label className="block text-sm text-white/70">Кратко опишите задачу *
                <textarea name="message" required minLength={5} maxLength={3000} rows={4} className="mt-2 w-full resize-y border border-white/30 bg-transparent p-3 text-base text-white outline-none focus:border-white" />
              </label>
              <label className="hidden" aria-hidden="true">Не заполняйте это поле
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <label className="flex items-start gap-3 text-xs leading-5 text-white/70">
                <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-[#c62828]" />
                <span>Я даю согласие на обработку персональных данных в соответствии с <a href="/privacy-policy/" className="underline underline-offset-4">политикой конфиденциальности</a>.</span>
              </label>
              <button type="submit" disabled={busy} className="btn px-8 py-4 text-base disabled:cursor-wait disabled:opacity-60">
                {busy ? "Отправляем…" : "Отправить заявку"}
              </button>
              <p role="status" aria-live="polite" className="text-sm text-white/75">{status}</p>
            </form>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/50">Связаться напрямую</p>
              <div className="mt-5 space-y-3">
                {PHONES.map((phone) => (
                  <a key={phone.href} href={phone.href} className="block text-xl font-bold hover:underline">{phone.label}</a>
                ))}
                <a href={`mailto:${EMAIL}?subject=${subject}`} className="inline-block pt-2 text-lg font-semibold underline underline-offset-4 hover:text-white/75">{EMAIL}</a>
              </div>
              <a href={`mailto:${EMAIL}?subject=${subject}`} className="btn mt-9 inline-block px-10 py-4 text-base">Написать на email</a>
              <p className="mt-6 max-w-xl text-xs leading-6 text-white/50">Онлайн-форма подготовлена, но не активирована: сначала владелец должен утвердить актуальную политику обработки персональных данных и подключить защищённый сервер приёма заявок. Не отправляйте конфиденциальные документы обычной почтой; уточните у компании безопасный способ передачи.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
