import express from "express";
import Email from "../models/Email.js";
import { info } from "../utils/logger.js";
import { apiKeyAuth } from "../middleware/apiKeyAuth.js";
import { internalSecretAuth } from "../middleware/internalSecretAuth.js";
import { getWorker } from "../workers/worker.js";

import EmailTemplate from "../models/EmailTemplate.js";
import { renderDbTemplate } from "../utils/renderDbTemplate.js";

const router = express.Router();

function wakeWorker() {
  try {
    setImmediate(() => {
      getWorker()
        .tick()
        .catch((e) => {});
      setTimeout(() => getWorker().logCacheSize(), 0);
    });
  } catch {}
}

router.post("/send", async (req, res) => {
  try {
    const isInternal = internalSecretAuth(req);

    // INTERNAL REQUEST FROM YOUR BACKEND
    if (isInternal) {
      req.fromEmail = process.env.SMTP_RELAY_USER;
      req.fromUserId = null;
      req.isSystem = true;
    } else {
      // EXTERNAL USER → must pass API key auth
      await new Promise((resolve, reject) => {
        apiKeyAuth(req, res, (err) => (err ? reject(err) : resolve()));
      });

      req.isSystem = false;
    }

    let { to, subject, text, html, meta, templateId, variables } = req.body;

    const from = req.fromEmail;
    const user = req.fromUserId;

    if (!from || !to)
      return res.status(400).json({ error: "from and to required" });

    if (templateId) {
      const tpl = await EmailTemplate.findOne({
        templateId,
        status: "active",
      }).lean();

      if (!tpl) {
        return res.status(400).json({ error: "Template not found" });
      }

      const rendered = renderDbTemplate(tpl, variables);
      subject = rendered.subject;
      html = rendered.html;
    }

    const email = await Email.create({
      from,
      to,
      subject,
      text,
      html,
      meta,
      user,
      isSystem: req.isSystem, // IMPORTANT
    });

    info("Queued email id:", email._id);

    wakeWorker();

    res.status(201).json({ success: true, id: email._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to queue email" });
  }
});

router.get("/status/:id", async (req, res) => {
  try {
    const e = await Email.findById(req.params.id).lean();
    if (!e) return res.status(404).json({ error: "not found" });
    res.json(e);
  } catch {
    res.status(500).json({ error: "server error" });
  }
});

router.get("/status", async (req, res) => {
  try {
    const emails = await Email.find({ from: req.body.email }).lean();
    if (!emails || emails.length === 0)
      return res
        .status(404)
        .json({ error: "No emails found for this address" });
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/emails", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const emails = await Email.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .select(
        "_id from to subject status attempts lastError createdAt updatedAt",
      );
    res.json({ success: true, emails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
