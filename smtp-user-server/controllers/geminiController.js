import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPTS = [
  {
    id: 0,
    prompt:
      "Improve the email to sound more professional, clear, and formal. Keep colors minimal. Do not change the meaning.",
  },
];

export const modifyEmailTemplateByAI = async (req, res) => {
  try {
    const { subject, html } = req.body;

    if (!subject || !html) {
      return res.status(400).json({
        message: "Subject and HTML are required",
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[0].prompt;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
${systemPrompt}

STRICT RULES (DO NOT BREAK):
- Return ONLY valid JSON
- JSON must have EXACTLY two fields: "subject" and "html"
- Do NOT add explanations, markdown, or extra text
- "html" must be valid email-safe HTML wrapped in ONE <div>
- Do NOT escape HTML
- Do NOT include code fences

Input:
Subject: ${subject}

HTML:
${html}

Expected JSON format:
{
  "subject": "new subject here",
  "html": "<div>updated html here</div>"
}
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw,
      });
    }

    if (!parsed.subject || !parsed.html) {
      return res.status(500).json({
        message: "AI JSON missing required fields",
        raw,
      });
    }

    return res.json({
      subject: parsed.subject,
      html: parsed.html,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error: " + error.message,
    });
  }
};
