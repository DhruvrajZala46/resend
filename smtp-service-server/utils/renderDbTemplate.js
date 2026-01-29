export function renderDbTemplate(template, variables = {}) {
  let html = template.html;
  let subject = template.subject;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(regex, value);
    subject = subject.replace(regex, value);
  }

  return { html, subject };
}
