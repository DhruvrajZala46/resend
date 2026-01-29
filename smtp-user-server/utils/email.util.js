import axios from "axios";
const timeoutMs = Number(180000);

const API_BASE = "http://localhost:5000";
const SEND_URL = /\/api\/email\/send$/.test(API_BASE)
  ? API_BASE
  : `${API_BASE}/api/email/send`;

const EVENTS_URL_BASE = `${API_BASE}/api/email/events`.replace(/\/+$/, "");

const API_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.RESEND_RELAY_USER || "no-reply@localhost";

export async function sendEmail(
  { to, subject, html, text = "", from = FROM },
  { waitForStatus = false } = {},
) {
  if (!to) throw new Error("Recipient 'to' is required");

  const payload = { to, subject, html, text, from };

  const resp = await axios.post(SEND_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY && { "x-api-key": API_KEY }),
      ...(process.env.INTERNAL_SERVER_SECRET && {
        "x-internal-secret": process.env.INTERNAL_SERVER_SECRET,
      }),
    },
    timeout: 30000,
  });

  const emailId = resp?.data?.id || null;

  if (!emailId) return { emailId: null, status: "queued" };
  if (!waitForStatus) return { emailId, status: "queued" };

  const status = await waitEmailStatus(emailId, timeoutMs);
  return { emailId, status };
}

async function waitEmailStatus(emailId, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${EVENTS_URL_BASE}/${emailId}`, {
      headers: API_KEY ? { "x-api-key": API_KEY } : {},
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      clearTimeout(timer);
      return "queued";
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split(/\n\n/);
      buffer = parts.pop();

      for (const part of parts) {
        const line = part.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;

        try {
          const evt = JSON.parse(line.slice(5).trim());
          if (evt?.status === "sent" || evt?.status === "failed") {
            try {
              await reader.cancel();
            } catch {}
            clearTimeout(timer);
            return evt.status;
          }
        } catch {}
      }
    }

    clearTimeout(timer);
    return "queued";
  } catch {
    clearTimeout(timer);
    return "queued";
  }
}
