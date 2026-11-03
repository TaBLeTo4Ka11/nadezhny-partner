import { useRef, useState, type FormEvent } from "react";
import { sendMail } from "../data/content";

const field =
  "w-full border-0 border-b border-white/30 bg-transparent py-4 text-lg text-white outline-none transition-colors placeholder:text-white/50 focus:border-white";

async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

export default function FormSection() {
  const mountedAt = useRef(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || submitting) return;
    const fields = new FormData(form);
    if (String(fields.get("website") || "").trim()) return;

    const file = fields.get("attachment");
    let attachment: { name: string; type: string; content: string } | null = null;
    if (file instanceof File && file.size > 0) {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/jpeg", "image/png"];
      if (file.size > 5 * 1024 * 1024 || !allowed.includes(file.type)) {
        setStatus("Файл должен быть PDF, DOC, DOCX, XLS, XLSX, JPG или PNG размером до 5 МБ.");
        return;
      }
      attachment = { name: file.name, type: file.type, content: await fileToBase64(file) };
    }

    const payload = {
      name: String(fields.get("name") || ""),
      phone: String(fields.get("phone") || ""),
      email: String(fields.get("email") || ""),
      task: String(fields.get("task") || ""),
      consent: fields.get("consent") === "yes",
      website: String(fields.get("website") || ""),
      startedAt: mountedAt.current,
      attachment,
    };

    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.ok) {
        form.reset();
        setStatus("Заявка отправлена. Мы свяжемся с вами по указанным контактам.");
      } else if (response.status === 503 && result.code === "email_not_configured") {
        sendMail("Запрос КП", {
          Имя: payload.name,
          Телефон: payload.phone,
          Email: payload.email,
          "Техническое задание": payload.task,
          "Согласие на обработку персональных данных": "Да",
        });
        setStatus(attachment
          ? "Открылось почтовое приложение. Прикрепите выбранный файл к письму вручную и отправьте его."
          : "Открылось почтовое приложение с подготовленным письмом. Проверьте данные и отправьте его.");
      } else if (response.status === 429) {
        setStatus("Слишком много заявок с этого подключения. Попробуйте позже или позвоните нам.");
      } else {
        setStatus("Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.");
      }
    } catch {
      sendMail("Запрос КП", {
        Имя: payload.name,
        Телефон: payload.phone,
        Email: payload.email,
        "Техническое задание": payload.task,
        "Согласие на обработку персональных данных": "Да",
      });
      setStatus(attachment
        ? "Не удалось связаться с сервером. Открылось почтовое приложение — прикрепите файл вручную."
        : "Не удалось связаться с сервером. Открылось почтовое приложение с подготовленным письмом.");
    } finally {
      setSubmitting(false);
    }
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
          <div><label htmlFor="kp-name" className="sr-only">Имя</label><input id="kp-name" name="name" type="text" required minLength={2} maxLength={120} autoComplete="name" placeholder="Имя" className={field} /></div>
          <div><label htmlFor="kp-phone" className="sr-only">Телефон</label><input id="kp-phone" name="phone" type="tel" required maxLength={40} autoComplete="tel" placeholder="Телефон" className={field} /></div>
          <div><label htmlFor="kp-email" className="sr-only">Email</label><input id="kp-email" name="email" type="email" maxLength={254} autoComplete="email" placeholder="E-mail для ответа" className={field} /></div>
          <div><label htmlFor="kp-task" className="sr-only">Техническое задание</label><textarea id="kp-task" name="task" rows={4} maxLength={5000} placeholder="Техническое задание или комментарий" className={field + " resize-none"} /></div>

          <div>
            <label htmlFor="kp-attachment" className="mb-3 block text-sm font-semibold">Прикрепить техническое задание</label>
            <input id="kp-attachment" name="attachment" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" className="block w-full text-sm text-white/70 file:mr-4 file:border file:border-white/40 file:bg-transparent file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white hover:file:border-white" />
            <p className="mt-2 text-xs text-white/45">PDF, DOC, DOCX, XLS, XLSX, JPG или PNG · до 5 МБ</p>
          </div>

          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="kp-website">Не заполняйте это поле</label>
            <input id="kp-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <label className="flex cursor-pointer items-start gap-4 text-sm text-white/70">
            <input type="checkbox" name="consent" value="yes" required className="mt-0.5 h-5 w-5 shrink-0 accent-white" />
            <span>Я согласен(на) на обработку персональных данных и с <a href="/privacy/" className="underline underline-offset-4 hover:text-white">политикой конфиденциальности</a>.</span>
          </label>

          <div>
            <button type="submit" disabled={submitting} className="btn px-10 py-4 text-base disabled:cursor-wait disabled:opacity-60">
              {submitting ? "Отправка…" : "Выслать КП"}
            </button>
            <p className="mt-4 max-w-xl text-xs leading-5 text-white/60" aria-live="polite">{status || "Если серверная отправка ещё не настроена, откроется почтовое приложение с подготовленным письмом."}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
