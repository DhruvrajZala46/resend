import {
  HelpCircle,
  Send,
  Zap,
  Radio,
  Lock,
  Key,
  Code,
  AlertCircle,
} from "lucide-react";

export const examples = {
  // CURL: send email + show how to tail SSE with curl -N
  curl: `# 1) Send email
curl -X POST "https://smtp-service-server.vercel.app/api/email/send" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY_HERE" \\
  -d '{
    "to":"recipient@example.com",
    "subject":"Hello from SMTP-LITE (curl)",
    "html":"<strong>This is a test email sent via SMTP-LITE.</strong>"
  }'

# Response includes an \"id\" value. Use that id in the next command.

# 2) Connect to SSE and stream events (replace <EMAIL_ID> and API key)
curl -N "https://smtp-service-server.vercel.app/api/email/events/<EMAIL_ID>?apiKey=YOUR_API_KEY_HERE"
# -N disables buffering so curl prints events as they arrive.
`,

  // Node.js (same pattern as your provided example; uses native fetch streaming)
  node: `const API_URL = "https://smtp-service-server.vercel.app";
const API_KEY = "YOUR_API_KEY_HERE";

// 1) Send email
async function sendEmail() {
  const res = await fetch(\`\${API_URL}/api/email/send\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      to: "recipient@example.com",
      subject: "Hello from SMTP-LITE – Node",
      html: "<strong>Node example</strong>",
    }),
  });
  const data = await res.json();
  console.log("📬 Email queued with ID:", data.id);
  return data.id;
}

// 2) Listen for SSE using Fetch streaming
async function listenForUpdates(emailId) {
  console.log("🔗 Connecting to SSE...");
  const response = await fetch(\`\${API_URL}/api/email/events/\${emailId}\`, {
    headers: { "x-api-key": API_KEY },
  });

  if (!response.ok) {
    console.error("❌ Failed to connect to SSE");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\\n\\n");
    buffer = parts.pop();

    for (const chunk of parts) {
      const line = chunk.split("\\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const json = line.replace("data:", "").trim();

      try {
        const event = JSON.parse(json);
        console.log("📡 Status:", event.status);
        if (event.status === "sent" || event.status === "failed") {
          console.log("✅ Final:", event.status);
          reader.cancel();
          return;
        }
      } catch {
        console.warn("⚠️ Malformed SSE data:", json);
      }
    }
  }
}

// 3) Run
(async () => {
  const id = await sendEmail();
  if (id) await listenForUpdates(id);
})();`,

  // Browser: use EventSource for automatic SSE handling (recommended)
  browser: `// 1) Send email (fetch)
async function sendEmail() {
  const res = await fetch('https://smtp-service-server.vercel.app/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY_HERE'
    },
    body: JSON.stringify({
      to: 'recipient@example.com',
      subject: 'Hello from SMTP-LITE – Browser',
      html: '<strong>Browser Example</strong>'
    })
  });
  return res.json(); // contains .id
}

// 2) Use EventSource to listen for events (replace id and include apiKey as query param if required)
async function sendAndTrackEmail() {
  const data = await sendEmail();
  console.log('📬 Email queued:', data.id);

  // if your server accepts API key via query string for EventSource
  const url = \`https://smtp-service-server.vercel.app/api/email/events/\${data.id}?apiKey=YOUR_API_KEY_HERE\`;
  const es = new EventSource(url);

  es.onmessage = (e) => {
    const statusData = JSON.parse(e.data);
    console.log('📨 Status update:', statusData.status);
    document.getElementById('status').textContent = statusData.status;
    if (statusData.status === 'sent' || statusData.status === 'failed') {
      console.log('✅ Email delivery complete');
      es.close();
    }
  };

  es.onerror = (err) => {
    console.error('SSE error', err);
    es.close();
  };
}

// call sendAndTrackEmail() from the browser context`,

  // Python: requests for send + requests streaming for SSE
  python: `import requests
import json

API_URL = 'https://smtp-service-server.vercel.app'
API_KEY = 'YOUR_API_KEY_HERE'

# 1) Send email
resp = requests.post(
    f'{API_URL}/api/email/send',
    json={
        'to': 'recipient@example.com',
        'subject': 'Hello from SMTP-LITE – Python',
        'html': '<strong>Python example</strong>'
    },
    headers={'Content-Type': 'application/json', 'x-api-key': API_KEY}
)
resp.raise_for_status()
email = resp.json()
email_id = email.get('id') or email.get('_id')
print('📬 Email queued:', email_id)

# 2) Listen to SSE (stream=True)
with requests.get(
    f'{API_URL}/api/email/events/{email_id}',
    headers={'x-api-key': API_KEY},
    stream=True
) as r:
    if r.status_code != 200:
        print('❌ Failed to connect to SSE', r.status_code)
    else:
        for raw_line in r.iter_lines():
            if not raw_line:
                continue
            line = raw_line.decode('utf-8')
            if line.startswith('data: '):
                payload = line[len('data: '):]
                try:
                    event = json.loads(payload)
                    print('📨 Status update:', event.get('status'))
                    if event.get('status') in ['sent', 'failed']:
                        print('✅ Final:', event.get('status'))
                        break
                except json.JSONDecodeError:
                    print('⚠️ Malformed SSE payload:', payload)`,

  // PHP: send via file_get_contents or curl, then use cli cURL to tail SSE (or use PHP stream for SSE)
  php: `<?php
// 1) Send email using curl
$apiUrl = 'https://smtp-service-server.vercel.app/api/email/send';
$apiKey = 'YOUR_API_KEY_HERE';

$payload = json_encode([
  'to' => 'recipient@example.com',
  'subject' => 'Hello from SMTP-LITE – PHP',
  'html' => '<strong>PHP example</strong>'
]);

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'x-api-key: ' . $apiKey
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

$response = json_decode($result, true);
$emailId = $response['id'] ?? $response['_id'] ?? null;
echo \"Email queued: \" . $emailId . PHP_EOL;

// 2) Simple approach: use CLI curl to stream SSE (run from shell)
// curl -N \"https://smtp-service-server.vercel.app/api/email/events/{$emailId}\"

// 3) PHP streaming client (example for CLI PHP)
if ($emailId) {
  $sseUrl = \"https://smtp-service-server.vercel.app/api/email/events/{$emailId}";
  $ch = curl_init($sseUrl);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
  curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($ch, $data) {
    echo $data;
    // parse 'data: ' lines as they come if needed
    return strlen($data);
  });
  curl_exec($ch);
  curl_close($ch);
}`,

  // ASP.NET (C#) - send email with HttpClient then read SSE via stream/StreamReader
  aspnet: `using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    private static readonly HttpClient client = new HttpClient();
    private const string API_URL = "https://smtp-service-server.vercel.app";
    private const string API_KEY = "YOUR_API_KEY_HERE";

    static async Task Main()
    {
        var emailId = await SendEmail();
        if (!string.IsNullOrEmpty(emailId))
        {
            await ListenSse(emailId);
        }
    }

    static async Task<string> SendEmail()
    {
        var url = $"{API_URL}/api/email/send";
        client.DefaultRequestHeaders.Remove("x-api-key");
        client.DefaultRequestHeaders.Add("x-api-key", API_KEY);

        var payload = new { to = "recipient@example.com", subject = "Hello from SMTP-LITE – C#", html = "<strong>C# example</strong>" };
        var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var resp = await client.PostAsync(url, content);
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        if (doc.RootElement.TryGetProperty(\"id\", out var id)) return id.GetString();
        if (doc.RootElement.TryGetProperty(\"_id\", out var _id)) return _id.GetString();
        return null;
    }

    static async Task ListenSse(string emailId)
    {
        var sseUrl = $"{API_URL}/api/email/events/{emailId}";
        client.DefaultRequestHeaders.Remove(\"x-api-key\");
        client.DefaultRequestHeaders.Add(\"x-api-key\", API_KEY);

        using var resp = await client.GetAsync(sseUrl, HttpCompletionOption.ResponseHeadersRead);
        resp.EnsureSuccessStatusCode();

        using var stream = await resp.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line)) continue;
            if (line.StartsWith(\"data: \"))
            {
                var payload = line.Substring(6);
                try
                {
                    var doc = JsonDocument.Parse(payload);
                    if (doc.RootElement.TryGetProperty(\"status\", out var status))
                    {
                        Console.WriteLine(\"📨 Status update: \" + status.GetString());
                        var s = status.GetString();
                        if (s == \"sent\" || s == \"failed\") { Console.WriteLine(\"✅ Final: \" + s); break; }
                    }
                }
                catch { Console.WriteLine(\"⚠️ Malformed SSE payload: \" + payload); }
            }
        }
    }
}`,
};

export const documentationSections = [
  {
    id: "overview",
    title: "Overview",
    icon: HelpCircle,
    description:
      "SMTP-LITE is an email API service that provides delivery tracking via simple API polling or real-time SSE events. You can send emails through the API and check their status using a unique email ID.",
    content: [
      "Track email delivery status using polling or SSE",
      "Simple REST API with JSON payloads",
      "Secure authentication with API keys",
      "Supports Node.js, PHP, ASP.NET, Python, and browsers",
      "Lightweight and reliable delivery tracking system",
    ],
  },
  {
    id: "send",
    title: "Send Email API",
    icon: Send,
    description: "POST https://smtp-service-server.vercel.app/api/email/send",
    content: [
      "Required headers: Content-Type (application/json) and x-api-key",
      "Request body fields: to (recipient email), subject (email subject), html (email body)",
      "Returns success response with email ID when queued successfully",
    ],
  },
  {
    id: "tracking",
    title: "Email Status Tracking (Polling)",
    icon: Zap,
    description:
      "SMTP-LITE provides a simple endpoint to check email delivery status by polling at intervals (e.g., every 2 seconds).",
    content: [
      "Send an email via /api/email/send and receive a unique email ID",
      "Call /api/email/status/:id to check the current delivery status",
      "Recommended polling interval: every 2–3 seconds",
      "Status progression: pending → sending → sent/failed",
      "Stop polling when final status (sent/failed) is received",
      "Lightweight and compatible with all environments including Vercel",
    ],
  },
  {
    id: "sse-events",
    title: "Real-Time Email Events (SSE)",
    icon: Radio,
    description:
      "Server-Sent Events (SSE) provide real-time email delivery status updates without polling.",
    content: [
      "Connect to /api/email/events/:id to receive live status updates",
      "No polling required - updates pushed automatically",
      "Efficient for real-time tracking in web applications",
      "Automatically closes connection when email is sent/failed",
      "Use EventSource API in browsers or streaming requests in Node/Python",
    ],
  },
  {
    id: "app-credentials",
    title: "App Credentials (SMTP Access)",
    icon: Lock,
    description:
      "To send emails securely using your own Google account, you need to set up App Credentials consisting of your App Name, Google Account Email, and Google App Password.",
    content: [
      "Enable 2-Step Verification in your Google account",
      "Create Google App Password from myaccount.google.com/apppasswords",
      "Your app password is securely encrypted using AES-256 encryption",
      "Credentials are only decrypted temporarily when sending emails",
    ],
  },
  {
    id: "auth",
    title: "Authentication",
    icon: Key,
    description:
      "All API requests require an API key. Include it in the x-api-key header of every request.",
    content: [
      "Get your API key from API Keys Management page",
      "App Credentials must be added before creating API keys",
      "Never expose your API key in client-side code",
      "Use environment variables and make API calls from backend",
    ],
  },
  {
    id: "examples",
    title: "Code Examples",
    icon: Code,
    description:
      "Complete code examples for various programming languages and platforms",
    subsections: [
      {
        title: "Basic Sending - PHP",
        content: "Use file_get_contents or cURL to send emails.",
      },
      {
        title: "Basic Sending - ASP.NET",
        content: "Use HttpClient to send emails.",
      },
      {
        title: "Polling - Node.js",
        content: "Send emails and poll /status/:id in intervals.",
      },
      {
        title: "Polling - Browser",
        content: "Use fetch() to poll /status/:id every 2 seconds.",
      },
      {
        title: "Polling - Python",
        content: "Use requests to poll status endpoint.",
      },
      {
        title: "SSE - Node.js",
        content: "Listen to real-time events using fetch streaming.",
      },
      {
        title: "SSE - Browser",
        content: "Use EventSource to receive live updates.",
      },
      { title: "SSE - Python", content: "Stream SSE events using requests." },
    ],
  },
  {
    id: "responses",
    title: "API Responses",
    icon: AlertCircle,
    description: "Understanding API response codes and formats",
    content: [
      "Success Response (200): Email queued successfully with ID",
      "GET /status/:id returns the latest delivery status",
      "SSE /events/:id streams real-time status updates",
      "Error Response (400): Invalid request body or missing fields",
      "Error Response (401): Invalid or missing API key",
      "Error Response (404): Email ID not found",
      "Error Response (500): Server error",
    ],
  },
];
