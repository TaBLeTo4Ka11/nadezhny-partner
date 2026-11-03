type LeadRequest = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  task?: unknown;
  consent?: unknown;
  website?: unknown;
  startedAt?: unknown;
  attachment?: { name?: unknown; type?: unknown; content?: unknown } | null;
};

const recentSubmissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function reply(res: any, status: number, body: Record<string, unknown>) {
  res.status(status).setHeader("Cache-Control", "no-store").json(body);
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, { ok: false, code: "method_not_allowed" });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return reply(res, 403, { ok: false, code: "origin_rejected" });
    } catch {
      return reply(res, 403, { ok: false, code: "origin_rejected" });
    }
  }

  const body = (req.body || {}) as LeadRequest;
  if (text(body.website, 200)) return reply(res, 200, { ok: true });

  const now = Date.now();
  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || now - startedAt < 2500 || now - startedAt > 60 * 60 * 1000) {
    return reply(res, 400, { ok: false, code: "invalid_submission_time" });
  }

  const name = text(body.name, 120);
  const phone = text(body.phone, 40);
  const email = text(body.email, 254);
  const task = text(body.task, 5000);
  const consent = body.consent === true;
  const digits = phone.replace(/\D/g, "");

  if (name.length < 2 || digits.length < 7 || digits.length > 15 || !consent) {
    return reply(res, 400, { ok: false, code: "invalid_fields" });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply(res, 400, { ok: false, code: "invalid_email" });
  }

  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwarded || String(req.socket?.remoteAddress || "unknown");
  const timestamps = (recentSubmissions.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    return reply(res, 429, { ok: false, code: "rate_limited" });
  }
  timestamps.push(now);
  recentSubmissions.set(ip, timestamps);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEADS_FROM_EMAIL;
  const to = process.env.LEADS_TO_EMAIL || "bux_partner2017@bk.ru";
  if (!apiKey || !from) {
    return reply(res, 503, { ok: false, code: "email_not_configured" });
  }

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    subject: "Новая заявка с сайта «Надёжный партнёр»",
    text: [
      "Имя: " + name,
      "Телефон: " + phone,
      "Email: " + (email || "не указан"),
      "Техническое задание: " + (task || "не указано"),
      "Согласие на обработку персональных данных: да",
    ].join("\n"),
  };

  if (body.attachment) {
    const filename = text(body.attachment.name, 180);
    const contentType = text(body.attachment.type, 120);
    const content = text(body.attachment.content, 7 * 1024 * 1024);
    const extension = filename.toLowerCase().split(".").pop() || "";
    const allowedExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"]);
    if (!filename || !allowedExtensions.has(extension) || !ALLOWED_TYPES.has(contentType) || !/^[A-Za-z0-9+/]+=*$/.test(content)) {
      return reply(res, 400, { ok: false, code: "invalid_attachment" });
    }
    const bytes = Math.floor(content.length * 3 / 4);
    if (bytes > MAX_ATTACHMENT_BYTES) return reply(res, 413, { ok: false, code: "attachment_too_large" });
    payload.attachments = [{ filename, content }];
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return reply(res, 502, { ok: false, code: "email_provider_error" });
    }
    return reply(res, 200, { ok: true });
  } catch {
    return reply(res, 502, { ok: false, code: "delivery_failed" });
  }
}
