type RequestLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
};

type ResponseLike = {
  setHeader(name: string, value: string): void;
  status(code: number): ResponseLike;
  json(payload: Record<string, unknown>): void;
};

type ContactPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
};

const rateBuckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_CHARS = 12_000;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max) : "";
}

function getHeader(req: RequestLike, name: string): string {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  for (const [key, value] of rateBuckets) {
    if (value.resetAt <= now) rateBuckets.delete(key);
  }
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Vary", "Origin");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const contentType = getHeader(req, "content-type").toLowerCase();
  if (!contentType.startsWith("application/json")) return res.status(415).json({ ok: false, error: "Expected JSON" });
  const declaredLength = Number(getHeader(req, "content-length") || 0);
  if (declaredLength > MAX_BODY_CHARS) return res.status(413).json({ ok: false, error: "Payload too large" });

  const host = getHeader(req, "x-forwarded-host") || getHeader(req, "host");
  const origin = getHeader(req, "origin");
  if (!host || !origin) return res.status(403).json({ ok: false, error: "Forbidden" });
  try {
    if (new URL(origin).host !== host) return res.status(403).json({ ok: false, error: "Forbidden" });
  } catch {
    return res.status(403).json({ ok: false, error: "Forbidden" });
  }

  const env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const webhookUrl = env.CONTACT_WEBHOOK_URL ?? "";
  const webhookSecret = env.CONTACT_WEBHOOK_SECRET ?? "";
  const policyVersion = env.CONTACT_PRIVACY_POLICY_VERSION ?? "";
  if (!webhookUrl || !webhookSecret || !policyVersion) {
    return res.status(503).json({ ok: false, error: "Форма временно не подключена." });
  }

  let parsed: ContactPayload;
  try {
    if (typeof req.body === "string") {
      if (req.body.length > MAX_BODY_CHARS) return res.status(413).json({ ok: false, error: "Payload too large" });
      parsed = JSON.parse(req.body) as ContactPayload;
    } else {
      parsed = (req.body ?? {}) as ContactPayload;
      if (JSON.stringify(parsed).length > MAX_BODY_CHARS) return res.status(413).json({ ok: false, error: "Payload too large" });
    }
  } catch {
    return res.status(400).json({ ok: false, error: "Некорректный запрос." });
  }

  // Honeypot: silently accept automated submissions without forwarding them.
  if (clean(parsed.website, 200)) return res.status(200).json({ ok: true });

  const ip = getHeader(req, "x-forwarded-for").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: "Слишком много запросов. Попробуйте позже." });

  const name = clean(parsed.name, 100);
  const phone = clean(parsed.phone, 40);
  const email = clean(parsed.email, 254);
  const message = clean(parsed.message, 3000);

  if (name.length < 2 || (!phone && !email) || (phone && phone.replace(/\D/g, "").length < 7) || (email && !isValidEmail(email)) || message.length < 5 || parsed.consent !== true) {
    return res.status(400).json({ ok: false, error: "Проверьте имя, телефон или email, сообщение и согласие." });
  }

  let target: URL;
  try {
    target = new URL(webhookUrl);
    if (target.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    return res.status(503).json({ ok: false, error: "Сервер формы не настроен." });
  }

  try {
    const upstream = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${webhookSecret}`,
      },
      body: JSON.stringify({
        type: "commercial-proposal",
        name,
        phone,
        email,
        message,
        consent: true,
        consentVersion: policyVersion,
        source: "iv-partner.ru",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) return res.status(502).json({ ok: false, error: "Не удалось передать заявку. Свяжитесь с компанией по телефону." });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: "Не удалось передать заявку. Свяжитесь с компанией по телефону." });
  }
}
