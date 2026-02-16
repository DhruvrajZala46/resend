import nodemailer from "nodemailer";
import dns from "dns/promises";
import crypto from "crypto";
import Email from "../models/Email.js";
import ApiKey from "../models/ApiKey.js";
import AppCredential from "../models/AppCredential.js";
import { decrypt } from "../utils/encryption.util.js";
import { info, error } from "../utils/logger.js";
import { emitEmailEvent } from "../routes/emailEventsRoutes.js";

const transporterCache = new Map();

function createWorker(env) {
  const WORKER_ID = env.WORKER_ID || `wkr_${crypto.randomUUID()}`;
  const BATCH_SIZE = Number(env.WORKER_BATCH_SIZE || 10);
  const MAX_PARALLEL = Number(env.MAX_PARALLEL_EMAILS || 5);
  const domainCache = new Map();

  async function validateEmailDomain(to) {
    try {
      const d = to.split("@")[1];
      if (!d) return false;
      if (domainCache.has(d)) return domainCache.get(d);
      const mx = await dns.resolveMx(d);
      const ok = mx && mx.length > 0;
      domainCache.set(d, ok);
      setTimeout(() => domainCache.delete(d), 3600000);
      return ok;
    } catch {
      return false;
    }
  }

  function getTransporter(config, key) {
    if (transporterCache.has(key)) return transporterCache.get(key);
    const t = nodemailer.createTransport(config);
    transporterCache.set(key, t);
    setTimeout(() => transporterCache.delete(key), 600000);
    return t;
  }

  async function claimNext() {
    const now = new Date();
    const claimed = await Email.findOneAndUpdate(
      { status: "pending", nextAttemptAt: { $lte: now } },
      { $set: { status: "sending", claimedAt: now, processingBy: WORKER_ID } },
      { sort: { createdAt: 1 }, new: true },
    );

    if (claimed) info(`Worker ${WORKER_ID}: claimed ${claimed._id}`);
    return claimed;
  }

  async function processClaimed(claimed) {
    emitEmailEvent(claimed._id.toString(), "sending");

    try {
      const valid = await validateEmailDomain(claimed.to);

      if (!valid) {
        const msg = "Domain not found or has no MX records";

        const r = await Email.updateOne(
          { _id: claimed._id, status: "sending", processingBy: WORKER_ID },
          {
            $set: { status: "failed", lastError: msg, nextAttemptAt: null },
            $inc: { attempts: 1 },
            $unset: { processingBy: 1, claimedAt: 1 },
          },
        );

        if (r.modifiedCount === 0) {
          await Email.updateOne(
            { _id: claimed._id, status: "sending" },
            {
              $set: { status: "failed", lastError: msg, nextAttemptAt: null },
              $inc: { attempts: 1 },
              $unset: { processingBy: 1, claimedAt: 1 },
            },
          );
        }

        emitEmailEvent(claimed._id.toString(), {
          status: "failed",
          error: msg,
        });

        error(`Worker ${WORKER_ID}: invalid domain for ${claimed.to} → ${msg}`);
        return;
      }

      const isSystemEmail = claimed.isSystem === true;
      let cfg, sender, cacheKey;

      if (isSystemEmail) {
        cfg = {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: { user: env.SMTP_RELAY_USER, pass: env.SMTP_RELAY_PASS },
          tls: { rejectUnauthorized: false },
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
        };

        sender = env.SMTP_RELAY_USER;
        cacheKey = `system_${env.SMTP_RELAY_USER}`;
        info(`Worker ${WORKER_ID}: SYSTEM SMTP → ${claimed.to}`);
      } else {
        const apiKey = await ApiKey.findOne({ user: claimed.user });
        if (!apiKey || !apiKey.user)
          throw new Error("API key not found or invalid");

        const cred = await AppCredential.findOne({
          createdBy: apiKey.user,
        }).select("+appPassword");

        if (!cred) throw new Error("User has no app credentials configured");

        const pass = decrypt(cred.appPassword);

        cfg = {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: { user: cred.appUserEmail, pass },
          tls: { rejectUnauthorized: false },
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
        };

        sender = cred.appUserEmail;
        cacheKey = `user_${cred.appUserEmail}`;
        info(`Worker ${WORKER_ID}: USER SMTP → ${claimed.to}`);
      }

      const transporter = getTransporter(cfg, cacheKey);

      await transporter.sendMail({
        from: claimed.from || sender,
        to: claimed.to,
        subject: claimed.subject,
        text: claimed.text,
        html: claimed.html,
      });

      const r = await Email.updateOne(
        { _id: claimed._id, status: "sending", processingBy: WORKER_ID },
        {
          $set: { status: "sent", lastError: "", nextAttemptAt: null },
          $inc: { attempts: 1 },
          $unset: { processingBy: 1, claimedAt: 1 },
        },
      );

      if (r.modifiedCount === 0) {
        await Email.updateOne(
          { _id: claimed._id, status: "sending" },
          {
            $set: { status: "sent", lastError: "", nextAttemptAt: null },
            $inc: { attempts: 1 },
            $unset: { processingBy: 1, claimedAt: 1 },
          },
        );
      }

      emitEmailEvent(claimed._id.toString(), "sent");
      info(`Worker ${WORKER_ID}: sent ${claimed._id}`);
    } catch (e) {
      const msg = e?.message || "Unknown email send error";
      const delay = Math.min(
        30000 * Math.pow(2, claimed.attempts || 0),
        300000,
      );

      const r = await Email.updateOne(
        { _id: claimed._id, status: "sending", processingBy: WORKER_ID },
        {
          $set: {
            status: "failed",
            lastError: msg,
            nextAttemptAt: new Date(Date.now() + delay),
          },
          $inc: { attempts: 1 },
          $unset: { processingBy: 1, claimedAt: 1 },
        },
      );

      if (r.modifiedCount === 0) {
        await Email.updateOne(
          { _id: claimed._id, status: "sending" },
          {
            $set: {
              status: "failed",
              lastError: msg,
              nextAttemptAt: new Date(Date.now() + delay),
            },
            $inc: { attempts: 1 },
            $unset: { processingBy: 1, claimedAt: 1 },
          },
        );
      }

      emitEmailEvent(claimed._id.toString(), {
        status: "failed",
        error: msg,
      });

      error(`Worker ${WORKER_ID}: fail ${claimed._id} → ${msg}`);
    }
  }

  async function tick({ limit } = {}) {
    const take = Number(limit || BATCH_SIZE);
    const claimedBatch = [];

    for (let i = 0; i < take; i++) {
      const c = await claimNext();
      if (!c) break;
      claimedBatch.push(c);
    }

    if (!claimedBatch.length) {
      info(`Worker ${WORKER_ID}: found 0 pending emails.`);
      return { processed: 0 };
    }

    info(`Worker ${WORKER_ID}: processing ${claimedBatch.length} emails.`);

    const chunks = [];
    for (let i = 0; i < claimedBatch.length; i += MAX_PARALLEL)
      chunks.push(claimedBatch.slice(i, i + MAX_PARALLEL));

    for (const chunk of chunks)
      await Promise.allSettled(chunk.map((e) => processClaimed(e)));

    return { processed: claimedBatch.length };
  }

  function logCacheSize() {
    info(
      `Worker ${WORKER_ID}: transporter cache size ${transporterCache.size}`,
    );
  }

  return { tick, logCacheSize, id: WORKER_ID };
}

export function getWorker() {
  if (!globalThis.__emailWorker)
    globalThis.__emailWorker = createWorker(process.env);
  return globalThis.__emailWorker;
}
