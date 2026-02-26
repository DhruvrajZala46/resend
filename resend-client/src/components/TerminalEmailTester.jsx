import React, { useState, useRef, useEffect } from "react";
import { Terminal, X, Play, Loader2, Trash2 } from "lucide-react";
import TerminalInput from "./TerminalInput";

const TerminalEmailTester = ({ onClose, themeColors }) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const logsEndRef = useRef(null);
  const terminalRef = useRef(null);

  const API_URL = import.meta.env.VITE_SMTP_SERVER_API_BASE_URL;

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    setTimeout(() => setShowTester(true), 10);
  }, []);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, type, timestamp }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handleClose = () => {
    setShowTester(false);
    setTimeout(onClose, 300);
  };

  const sendTestEmail = async (apiKey, toEmail, subject, htmlBody) => {
    if (!apiKey.trim()) {
      addLog("ERROR: API Key is required", "error");
      return;
    }
    if (!toEmail.trim()) {
      addLog("ERROR: Recipient email is required", "error");
      return;
    }

    setIsLoading(true);
    clearLogs();
    addLog("Initializing SMTP-LITE connection...", "info");
    addLog(`Target: ${toEmail}`, "info");
    addLog(`Subject: ${subject}`, "info");
    addLog("", "info");

    try {
      addLog("Sending POST request to API endpoint...", "loading");

      const response = await fetch(`${API_URL}/api/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          to: toEmail,
          subject,
          html:
            htmlBody ||
            `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
                <h2 style="color: #2563eb;">🎉 Test Email from SMTP-LITE</h2>
                <p>This is a test email to verify your API integration.</p>
                <p style="color: #64748b; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        addLog(`HTTP ${response.status}: ${response.statusText}`, "error");
        addLog(`Error: ${data.error || "Failed to send email"}`, "error");
        setIsLoading(false);
        return;
      }

      if (!data?.id) {
        addLog("ERROR: No email ID in response", "error");
        setIsLoading(false);
        return;
      }

      addLog("SUCCESS: Email queued", "success");
      addLog(`Email ID: ${data.id}`, "info");
      addLog("", "info");
      addLog("Establishing SSE connection for status updates...", "loading");

      await listenForUpdates(data.id);
    } catch (error) {
      addLog(`FATAL ERROR: ${error.message}`, "error");
      setIsLoading(false);
    }
  };

  const listenForUpdates = async (emailId) => {
    const url = `${API_URL}/api/email/events/${emailId}`;
    addLog("Listening for delivery events...", "info");

    try {
      const response = await fetch(url);

      if (!response.ok) {
        addLog(`SSE connection failed: HTTP ${response.status}`, "error");
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        addLog("ERROR: Response stream not available", "error");
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      addLog("Connected to event stream", "success");
      addLog("", "info");

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          addLog("Stream closed by server", "info");
          break;
        }

        const decoded = decoder.decode(value, { stream: true });
        buffer += decoded;

        const parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop();

        for (const part of parts) {
          if (!part.trim()) continue;

          const lines = part.split(/\r?\n/);
          const dataLines = lines
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s?/, ""));

          const rawData = dataLines.join("\n");

          try {
            const event = JSON.parse(rawData);

            if (event.status === "pending") {
              addLog("Status: PENDING - Email queued for delivery", "warning");
            } else if (event.status === "processing") {
              addLog("Status: PROCESSING - Sending email...", "loading");
            } else if (event.status === "sent") {
              addLog("", "info");
              addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "success");
              addLog("✓ EMAIL DELIVERED SUCCESSFULLY", "success");
              addLog(`Message ID: ${event.messageId || "N/A"}`, "success");
              addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "success");
              setIsLoading(false);
              reader.cancel();
              return;
            } else if (event.status === "failed") {
              addLog("", "info");
              addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "error");
              addLog("✗ EMAIL DELIVERY FAILED", "error");
              addLog(`Reason: ${event.error || "Unknown error"}`, "error");
              addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "error");
              setIsLoading(false);
              reader.cancel();
              return;
            } else {
              addLog(`Status: ${event.status.toUpperCase()}`, "info");
            }
          } catch {}
        }
      }

      setIsLoading(false);
    } catch (error) {
      addLog(`Stream error: ${error.message}`, "error");
      setIsLoading(false);
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case "success":
        return "#10b981";
      case "error":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "loading":
        return "#3b82f6";
      default:
        return themeColors.mutedForeground.color;
    }
  };

  const getLogPrefix = (type) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "warning":
        return "⚠";
      case "loading":
        return "⟳";
      default:
        return "→";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px",
        zIndex: 9999,
        opacity: showTester ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={terminalRef}
        style={{
          width: "100%",
          maxWidth: "900px",
          backgroundColor: themeColors.card.color,
          borderRadius: "12px",
          border: `1px solid ${themeColors.border.color}`,
          overflow: "hidden",
          transform: showTester ? "scale(1)" : "scale(0.9)",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          style={{
            backgroundColor: themeColors.background.color,
            borderBottom: `1px solid ${themeColors.border.color}`,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                  cursor: "pointer",
                }}
                onClick={handleClose}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#f59e0b",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "monospace",
                fontSize: "13px",
                color: themeColors.foreground.color,
              }}
            >
              <Terminal size={16} />
              <span>smtp-lite-tester</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              color: themeColors.mutedForeground.color,
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            padding: "20px",
            fontFamily: "monospace",
            fontSize: "13px",
            color: themeColors.foreground.color,
            maxHeight: "70vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <TerminalInput
              label="API_KEY"
              type="password"
              placeholder="enter your api key"
              onSubmit={(value) => {
                const apiKey = value;
                const toEmail = document.getElementById("term-email").value;
                const subject = document.getElementById("term-subject").value;
                const htmlBody = document.getElementById("term-html").value;
                sendTestEmail(apiKey, toEmail, subject, htmlBody);
              }}
              disabled={isLoading}
              themeColors={themeColors}
              id="term-apikey"
            />

            <TerminalInput
              label="TO_EMAIL"
              type="text"
              placeholder="recipient@example.com"
              disabled={isLoading}
              themeColors={themeColors}
              id="term-email"
            />

            <TerminalInput
              label="SUBJECT"
              type="text"
              placeholder="Test Email from SMTP-LITE"
              disabled={isLoading}
              themeColors={themeColors}
              id="term-subject"
            />

            <TerminalInput
              label="HTML_BODY"
              type="text"
              placeholder="<h1>Hello World</h1>"
              disabled={isLoading}
              themeColors={themeColors}
              id="term-html"
            />

            <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  const apiKey = document.getElementById("term-apikey").value;
                  const toEmail = document.getElementById("term-email").value;
                  const subject = document.getElementById("term-subject").value;
                  const htmlBody = document.getElementById("term-html").value;
                  sendTestEmail(apiKey, toEmail, subject, htmlBody);
                }}
                disabled={isLoading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: isLoading
                    ? themeColors.muted.color
                    : themeColors.primary.color,
                  color: themeColors.primaryForeground.color,
                  borderRadius: "6px",
                  display: "flex",
                  gap: "8px",
                  fontWeight: "600",
                  fontSize: "12px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                {isLoading ? "SENDING..." : "RUN TEST"}
              </button>

              <button
                onClick={clearLogs}
                disabled={logs.length === 0}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: themeColors.mutedForeground.color,
                  border: `1px solid ${themeColors.border.color}`,
                  borderRadius: "6px",
                  display: "flex",
                  gap: "8px",
                  fontSize: "12px",
                  cursor: logs.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <Trash2 size={14} />
                CLEAR
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              backgroundColor: themeColors.background.color,
              borderRadius: "6px",
              padding: "16px",
              overflowY: "auto",
              border: `1px solid ${themeColors.border.color}`,
            }}
          >
            {logs.length === 0 ? (
              <div
                style={{
                  color: themeColors.mutedForeground.color,
                  textAlign: "center",
                  paddingTop: "60px",
                }}
              >
                Waiting for commands...
              </div>
            ) : (
              <>
                {logs.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "6px",
                      display: "flex",
                      gap: "12px",
                      color: getLogColor(log.type),
                    }}
                  >
                    <span style={{ opacity: 0.5, minWidth: "70px" }}>
                      [{log.timestamp}]
                    </span>
                    <span style={{ minWidth: "15px" }}>
                      {getLogPrefix(log.type)}
                    </span>
                    <span style={{ flex: 1 }}>{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalEmailTester;
