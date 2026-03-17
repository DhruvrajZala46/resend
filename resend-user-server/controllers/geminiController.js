// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // ─── Email Type Definitions ───────────────────────────────────────────────────
// const EMAIL_TYPES = {
//   welcome: {
//     label: "Welcome Email",
//     description: "Sent when a user registers or activates an account",
//     placeholders: ["{{name}}", "{{companyName}}", "{{dashboardUrl}}"],
//   },
//   reset_password: {
//     label: "Password Reset",
//     description: "Sent when a user requests a password reset",
//     placeholders: [
//       "{{name}}",
//       "{{companyName}}",
//       "{{resetUrl}}",
//       "{{expiryTime}}",
//     ],
//   },
//   invoice: {
//     label: "Invoice / Payment",
//     description: "Sent after a successful payment or to share an invoice",
//     placeholders: [
//       "{{name}}",
//       "{{companyName}}",
//       "{{amount}}",
//       "{{invoiceId}}",
//       "{{invoiceUrl}}",
//     ],
//   },
//   otp: {
//     label: "OTP / Verification Code",
//     description: "Sent to verify email or phone with a one-time code",
//     placeholders: [
//       "{{name}}",
//       "{{companyName}}",
//       "{{otpCode}}",
//       "{{expiryMinutes}}",
//     ],
//   },
//   notification: {
//     label: "General Notification",
//     description: "Generic transactional notification email",
//     placeholders: [
//       "{{name}}",
//       "{{companyName}}",
//       "{{message}}",
//       "{{ctaUrl}}",
//       "{{ctaLabel}}",
//     ],
//   },
// };

// // ─── Color Schemes ────────────────────────────────────────────────────────────
// const COLOR_SCHEMES = {
//   green: {
//     label: "Green (Default)",
//     primary: "#16a34a",
//     header: "#22c55e",
//     headerText: "#ffffff",
//     accent: "#dcfce7",
//     buttonBg: "#16a34a",
//     buttonText: "#ffffff",
//   },
//   blue: {
//     label: "Blue",
//     primary: "#1d4ed8",
//     header: "#2563eb",
//     headerText: "#ffffff",
//     accent: "#dbeafe",
//     buttonBg: "#1d4ed8",
//     buttonText: "#ffffff",
//   },
//   purple: {
//     label: "Purple",
//     primary: "#7c3aed",
//     header: "#8b5cf6",
//     headerText: "#ffffff",
//     accent: "#ede9fe",
//     buttonBg: "#7c3aed",
//     buttonText: "#ffffff",
//   },
//   dark: {
//     label: "Dark / Charcoal",
//     primary: "#111827",
//     header: "#1f2937",
//     headerText: "#f9fafb",
//     accent: "#f3f4f6",
//     buttonBg: "#111827",
//     buttonText: "#ffffff",
//   },
//   orange: {
//     label: "Orange",
//     primary: "#c2410c",
//     header: "#ea580c",
//     headerText: "#ffffff",
//     accent: "#ffedd5",
//     buttonBg: "#c2410c",
//     buttonText: "#ffffff",
//   },
// };

// // ─── Build Generation Prompt ──────────────────────────────────────────────────
// const buildGenerationPrompt = (emailType, colorScheme, context) => {
//   const type = EMAIL_TYPES[emailType] ?? EMAIL_TYPES.welcome;
//   const colors = COLOR_SCHEMES[colorScheme] ?? COLOR_SCHEMES.green;

//   return `
// You are a world-class HTML email designer with 15+ years of experience building production-grade transactional email templates for Fortune 500 companies. You have deep expertise in email client compatibility, inline CSS, and conversion-focused design.

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TASK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Generate a complete, production-ready HTML email template for:
// → Email Type: ${type.label}
// → Purpose: ${type.description}
// → Context provided by user: ${context || "None"}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COLOR SCHEME (STRICTLY USE THESE VALUES)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// - Header background: ${colors.header}
// - Header text: ${colors.headerText}
// - Primary/accent color: ${colors.primary}
// - Light accent background: ${colors.accent}
// - Button background: ${colors.buttonBg}
// - Button text: ${colors.buttonText}
// - Body background: #f9fafb
// - Card background: #ffffff
// - Body text: #374151
// - Muted text: #6b7280
// - Footer text: #9ca3af

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REQUIRED PLACEHOLDERS (include ALL of these)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ${type.placeholders.map((p) => `• ${p}`).join("\n")}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HTML STRUCTURE RULES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRITICAL — THE OUTER WRAPPER:
// - The outermost element MUST be a <div> with ZERO padding and ZERO margin
// - Use background: #f9fafb on the outer wrapper only
// - Example outer wrapper: <div style="margin:0; padding:0; background:#f9fafb; width:100%;">
// - The email sending system adds its own container — do NOT add top/bottom padding to the outer div
// - Inner card: max-width 580px, centered with margin:auto, white background, border-radius:12px

// LAYOUT STRUCTURE (follow this exactly):
// 1. Outer wrapper — background only, no padding
// 2. Inner card — max-width:580px, margin:auto, white bg, rounded corners, subtle shadow
// 3. Header band — colored top bar with company name/title, padding:20px 24px
// 4. Body section — padding:28px 32px, all text content here
// 5. CTA button — centered, large enough to tap on mobile (min padding: 12px 28px)
// 6. Divider line — subtle hr before footer: border:none; border-top:1px solid #f3f4f6
// 7. Footer — centered, small muted text, company name, unsubscribe note

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DESIGN QUALITY STANDARDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPOGRAPHY:
// - Font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif
// - Heading: 20–22px, font-weight:700, tight letter-spacing
// - Body text: 14–15px, line-height:1.7, color:#374151
// - Button text: 14px, font-weight:600, letter-spacing:0.3px

// SPACING & RHYTHM:
// - Consistent vertical rhythm — paragraph margin-bottom:14px
// - Generous whitespace around the CTA button (margin-top:28px, margin-bottom:8px)
// - Header padding: 20px 24px
// - Body padding: 28px 32px
// - Footer padding: 16px 24px 24px

// PROFESSIONAL DETAILS:
// - Add a thin colored left-border accent (3px solid ${colors.primary}) on key info blocks
// - Use a light tinted background (${colors.accent}) for highlighted info boxes
// - Button must have border-radius:8px — NOT pill-shaped (no border-radius:999px)
// - Subtle box-shadow on the card: box-shadow:0 4px 20px rgba(0,0,0,0.06)
// - NO gradients on the body background — flat #f9fafb only
// - NO decorative emojis in the HTML body
// - Footer must include: "© {{companyName}}" and "You're receiving this because you signed up at {{companyName}}."

// EMAIL CLIENT COMPATIBILITY:
// - All CSS must be inline — no <style> tags
// - Use only web-safe fonts with full fallback stack
// - Tables are NOT required — div-based layout is acceptable for modern clients
// - All images must have alt text (avoid images unless necessary)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OUTPUT FORMAT — ABSOLUTE RULES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// - Return ONLY a raw JSON object — nothing before or after
// - JSON must have EXACTLY two keys: "subject" and "html"
// - "subject" → a compelling, relevant email subject line using appropriate placeholders
// - "html" → the complete email HTML as a single string, all inline styles, no newlines that break JSON
// - NO markdown, NO code fences, NO explanation text whatsoever
// - Properly escape all double quotes inside the JSON string as \\"
// - Response must be directly parseable by JSON.parse() with zero modifications

// EXPECTED FORMAT:
// {"subject":"<subject line with placeholders>","html":"<complete single-line HTML string>"}
// `;
// };

// // ─── Build Improvement Prompt ─────────────────────────────────────────────────
// const buildImprovementPrompt = (subject, html, tone) => {
//   const toneInstructions = {
//     professional:
//       "Rewrite all text to be formal, authoritative, and corporate. Use precise language.",
//     friendly:
//       "Rewrite all text to be warm, human, and approachable. Use 'you' and 'we' naturally.",
//     persuasive:
//       "Rewrite all text to maximize action. Lead with value, create urgency, make the CTA irresistible.",
//   };

//   return `
// You are an expert email copywriter. Your job is to improve the TEXT CONTENT of the provided email HTML without changing any layout, structure, colors, or styles.

// TONE INSTRUCTION:
// ${toneInstructions[tone] ?? toneInstructions.professional}

// STRICT RULES:
// - Improve ONLY the visible text content — headings, paragraphs, button labels
// - Do NOT touch any inline styles, colors, padding, margin, border, or layout
// - Do NOT modify any {{placeholder}} variables — leave them exactly as-is
// - Do NOT add new HTML elements or remove existing ones
// - Do NOT change href values, image src, or any attribute values other than text
// - Keep all placeholder tokens like {{name}}, {{companyName}}, {{dashboardUrl}} intact
// - Subject line should be improved to match the tone

// OUTPUT FORMAT — ABSOLUTE RULES:
// - Return ONLY a raw JSON object
// - JSON must have EXACTLY two keys: "subject" and "html"
// - NO markdown, NO code fences, NO explanation
// - Must be directly parseable by JSON.parse()

// Input Subject: ${subject}
// Input HTML: ${html}

// EXPECTED FORMAT:
// {"subject":"<improved subject>","html":"<improved html with same structure>"}
// `;
// };

// // ─── Utilities ────────────────────────────────────────────────────────────────
// const sanitizeInput = (str, maxLength = 60000) => {
//   if (typeof str !== "string") return "";
//   return str
//     .replace(/[\u0000-\u001F\u007F]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim()
//     .substring(0, maxLength);
// };

// const extractJSON = (text) => {
//   try {
//     return JSON.parse(text);
//   } catch (_) {}

//   const stripped = text
//     .replace(/```json\s*/gi, "")
//     .replace(/```\s*/gi, "")
//     .trim();

//   try {
//     return JSON.parse(stripped);
//   } catch (_) {}

//   const start = stripped.indexOf("{");
//   const end = stripped.lastIndexOf("}");
//   if (start !== -1 && end !== -1 && end > start) {
//     try {
//       return JSON.parse(stripped.substring(start, end + 1));
//     } catch (_) {}
//   }

//   return null;
// };

// const callAI = async (prompt) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//     generationConfig: {
//       temperature: 0.4,
//       topP: 0.9,
//       maxOutputTokens: 8192,
//     },
//   });

//   const result = await model.generateContent(prompt);
//   return result.response.text();
// };

// // ─── Controller: Generate New Email Template ──────────────────────────────────
// export const generateEmailTemplate = async (req, res) => {
//   const startTime = Date.now();

//   try {
//     const {
//       emailType = "welcome",
//       colorScheme = "green",
//       context = "",
//     } = req.body;

//     if (!EMAIL_TYPES[emailType]) {
//       return res.status(400).json({
//         success: false,
//         code: "INVALID_EMAIL_TYPE",
//         message: `Invalid emailType. Valid options: ${Object.keys(EMAIL_TYPES).join(", ")}`,
//       });
//     }

//     if (!COLOR_SCHEMES[colorScheme]) {
//       return res.status(400).json({
//         success: false,
//         code: "INVALID_COLOR_SCHEME",
//         message: `Invalid colorScheme. Valid options: ${Object.keys(COLOR_SCHEMES).join(", ")}`,
//       });
//     }

//     const prompt = buildGenerationPrompt(
//       emailType,
//       colorScheme,
//       sanitizeInput(context, 500),
//     );

//     let raw;
//     try {
//       raw = await callAI(prompt);
//     } catch (aiError) {
//       console.error("[AI] Generation failed:", aiError.message);
//       return res.status(502).json({
//         success: false,
//         code: "AI_GENERATION_FAILED",
//         message: "AI model failed to respond. Please retry.",
//       });
//     }

//     const parsed = extractJSON(raw);

//     if (
//       !parsed ||
//       typeof parsed.subject !== "string" ||
//       typeof parsed.html !== "string"
//     ) {
//       console.error("[AI] Bad response:", raw?.slice(0, 300));
//       return res.status(500).json({
//         success: false,
//         code: "INVALID_AI_RESPONSE",
//         message: "AI returned an unparseable or incomplete response.",
//         ...(process.env.NODE_ENV === "development" && { raw }),
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       emailType: EMAIL_TYPES[emailType].label,
//       colorScheme: COLOR_SCHEMES[colorScheme].label,
//       placeholders: EMAIL_TYPES[emailType].placeholders,
//       subject: parsed.subject.trim(),
//       html: parsed.html.trim(),
//       meta: {
//         processingTimeMs: Date.now() - startTime,
//         model: "gemini-2.5-flash",
//       },
//     });
//   } catch (error) {
//     console.error("[generateEmailTemplate] Unhandled error:", error);
//     return res.status(500).json({
//       success: false,
//       code: "INTERNAL_SERVER_ERROR",
//       message: "An unexpected error occurred.",
//       ...(process.env.NODE_ENV === "development" && { error: error.message }),
//     });
//   }
// };

// // ─── Controller: Improve Existing Email Template ──────────────────────────────
// export const modifyEmailTemplateByAI = async (req, res) => {
//   const startTime = Date.now();

//   try {
//     let { subject, html, tone = "professional" } = req.body;

//     if (!subject?.trim() || !html?.trim()) {
//       return res.status(400).json({
//         success: false,
//         code: "MISSING_FIELDS",
//         message: "Both 'subject' and 'html' are required.",
//       });
//     }

//     subject = sanitizeInput(subject);
//     html = sanitizeInput(html);

//     const prompt = buildImprovementPrompt(subject, html, tone);

//     let raw;
//     try {
//       raw = await callAI(prompt);
//     } catch (aiError) {
//       console.error("[AI] Improvement failed:", aiError.message);
//       return res.status(502).json({
//         success: false,
//         code: "AI_GENERATION_FAILED",
//         message: "AI model failed to respond. Please retry.",
//       });
//     }

//     const parsed = extractJSON(raw);

//     if (
//       !parsed ||
//       typeof parsed.subject !== "string" ||
//       typeof parsed.html !== "string"
//     ) {
//       return res.status(500).json({
//         success: false,
//         code: "INVALID_AI_RESPONSE",
//         message: "AI returned an unparseable or incomplete response.",
//         ...(process.env.NODE_ENV === "development" && { raw }),
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       tone,
//       subject: parsed.subject.trim(),
//       html: parsed.html.trim(),
//       meta: {
//         processingTimeMs: Date.now() - startTime,
//         model: "gemini-2.5-flash",
//       },
//     });
//   } catch (error) {
//     console.error("[modifyEmailTemplateByAI] Unhandled error:", error);
//     return res.status(500).json({
//       success: false,
//       code: "INTERNAL_SERVER_ERROR",
//       message: "An unexpected error occurred.",
//       ...(process.env.NODE_ENV === "development" && { error: error.message }),
//     });
//   }
// };

// // ─── Helper: List available options ──────────────────────────────────────────
// export const getEmailTemplateOptions = (_req, res) => {
//   return res.status(200).json({
//     success: true,
//     emailTypes: Object.entries(EMAIL_TYPES).map(([key, val]) => ({
//       key,
//       label: val.label,
//       description: val.description,
//       placeholders: val.placeholders,
//     })),
//     colorSchemes: Object.entries(COLOR_SCHEMES).map(([key, val]) => ({
//       key,
//       label: val.label,
//       preview: val.header,
//     })),
//     tones: ["professional", "friendly", "persuasive"],
//   });
// };
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sanitizeInput = (str, max = 60000) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, max);
};

const extractJSON = (text) => {
  try {
    return JSON.parse(text);
  } catch {}

  const stripped = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(stripped);
  } catch {}

  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    try {
      return JSON.parse(stripped.substring(start, end + 1));
    } catch {}
  }

  return null;
};

const buildPrompt = (subject, html) => `
You are a world-class SaaS email designer and copywriter.

Your job is to **analyze the provided subject and HTML email template and generate a significantly improved version** with better copywriting and modern email design.

━━━━━━━━━━━━━━━━━━━━
GOALS
━━━━━━━━━━━━━━━━━━━━
1. Improve the subject line
2. Rewrite all text content to sound clear and professional
3. Improve layout and visual hierarchy
4. Improve spacing and readability
5. Improve button design and CTA clarity
6. Make the email look like a modern SaaS product email

━━━━━━━━━━━━━━━━━━━━
DESIGN GUIDELINES
━━━━━━━━━━━━━━━━━━━━
Use modern transactional email design:

Font stack:
-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif

Body text:
font-size:14px;
line-height:1.7;
color:#374151

Card container:
max-width:580px
margin:auto
background:#ffffff
border-radius:12px
box-shadow:0 4px 20px rgba(0,0,0,0.06)

Button:
border-radius:8px
padding:12px 28px
font-weight:600
font-size:14px

Paragraph spacing:
margin-bottom:14px

━━━━━━━━━━━━━━━━━━━━
CRITICAL RULES
━━━━━━━━━━━━━━━━━━━━
- The outermost element must be:
<div style="margin:0;padding:0;background:#f9fafb;width:100%;">

- NEVER modify placeholders:
{{name}}
{{companyName}}
{{dashboardUrl}}

- Keep all placeholder variables exactly the same
- Do not include emojis in the HTML
- All CSS must be inline
- HTML must be email-safe

━━━━━━━━━━━━━━━━━━━━
INPUT
━━━━━━━━━━━━━━━━━━━━
Subject:
${subject}

HTML:
${html}

━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━
Return ONLY valid JSON.

No markdown
No explanation
No extra text

Exactly this format:

{"subject":"Improved subject","html":"Single line HTML"}
`;

export const modifyEmailTemplateByAI = async (req, res) => {
  const startTime = Date.now();

  try {
    let { subject, html } = req.body;

    if (!subject || !html) {
      return res.status(400).json({
        success: false,
        message: "subject and html are required",
      });
    }

    subject = sanitizeInput(subject);
    html = sanitizeInput(html);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        maxOutputTokens: 8192,
      },
    });

    const prompt = buildPrompt(subject, html);

    let raw;

    try {
      const result = await model.generateContent(prompt);
      raw = result.response.text();
    } catch (err) {
      console.error("AI Error:", err);
      return res.status(502).json({
        success: false,
        message: "AI generation failed",
      });
    }

    const parsed = extractJSON(raw);

    if (!parsed || !parsed.subject || !parsed.html) {
      console.error("Bad AI response:", raw);
      return res.status(500).json({
        success: false,
        message: "AI returned invalid response",
      });
    }

    return res.json({
      success: true,
      subject: parsed.subject.trim(),
      html: parsed.html.trim(),
      meta: {
        model: "gemini-1.5-flash",
        processingTime: Date.now() - startTime,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
