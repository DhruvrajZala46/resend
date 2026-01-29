// services/mailer.js
import nodemailer from "nodemailer";
import { getMxHosts } from "./mxLookup.js";
import { error, info } from "../utils/logger.js";

/**
 * createRelayTransport - create nodemailer transport for relay mode
 */
export function createRelayTransport(config) {
  const opts = {
    host: config.SMTP_RELAY_HOST,
    port: Number(config.SMTP_RELAY_PORT || 587),
    secure:
      config.SMTP_RELAY_SECURE === "true" || config.SMTP_RELAY_SECURE === true,
    auth: {
      user: config.SMTP_RELAY_USER,
      pass: config.SMTP_RELAY_PASS,
    },
  };
  return nodemailer.createTransport(opts);
}

/**
 * sendViaRelay - send message using preconfigured relay transport
 */
export async function sendViaRelay(transport, mail) {
  const envelope = {
    from: mail.from,
    to: mail.to,
  };
  const msg = {
    from: mail.from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    // headers or other options can be added
  };
  return transport.sendMail(msg);
}

/**
 * sendDirectlyToMx - attempt to send by discovering recipient domain MX records.
 * We'll try MX hosts in priority order until one works.
 */
export async function sendDirectlyToMx(mail) {
  // Determine recipient domains (split multiple recipients)
  // We'll attempt each recipient in a single message by using the first MX host of the first recipient's domain.
  // For better reliability you may group recipients by domain and send separately.
  const recipients = String(mail.to)
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  if (recipients.length === 0) {
    throw new Error("No recipients");
  }

  // For simplicity, pick first recipient's domain
  const firstDomain = recipients[0].split("@")[1];
  if (!firstDomain) throw new Error("Invalid recipient address");

  const mxHosts = await getMxHosts(firstDomain); // [{ exchange, priority }, ...]

  let lastError = null;
  for (const mx of mxHosts) {
    const host = mx.exchange;
    try {
      const transport = nodemailer.createTransport({
        host,
        port: 25,
        secure: false, // many MX servers support STARTTLS; nodemailer will attempt STARTTLS unless ignoreTLS is true
        requireTLS: false, // allow non-TLS but nodemailer will STARTTLS if server supports it
        tls: {
          // do not reject self-signed certs from some mail servers
          rejectUnauthorized: false,
        },
        // no auth for direct MX delivery
      });

      const info = await transport.sendMail({
        from: mail.from,
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      });

      return info;
    } catch (err) {
      // try next MX
      lastError = err;
      info(`Direct send failed to ${host}: ${err.message}`);
      continue;
    }
  }
  throw new Error(
    `All MX attempts failed. Last error: ${
      lastError ? lastError.message : "unknown"
    }`
  );
}
