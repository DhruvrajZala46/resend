import React, { useState, useRef, useEffect, useCallback } from "react";
import { Terminal, X, Play, Loader2, Trash2, Plus, Tag } from "lucide-react";
import TerminalInput from "./TerminalInput";
import { useEmailTemplate } from "../context/EmailTemplateContext";


const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isValidUUID = (str) => UUID_REGEX.test(str.trim());


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}


const TerminalEmailTester = ({ onClose, themeColors }) => {

  const {
    templateInfo,
    templateVarKeys = [],
    isFetchingTemplate,
    templateError = "",
    getTemplateVariables,
    clearTemplateVariables,
  } = useEmailTemplate();


  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTester, setShowTester] = useState(false);


  const [templateId, setTemplateId] = useState("");


  const [variables, setVariables] = useState({});
  const [customVarName, setCustomVarName] = useState("");
  const [customVarValue, setCustomVarValue] = useState("");
  const [customVarError, setCustomVarError] = useState("");

  const logsEndRef = useRef(null);
  const terminalRef = useRef(null);

  const API_URL = import.meta.env.VITE_SMTP_SERVER_API_BASE_URL;


  const debouncedTemplateId = useDebounce(templateId, 400);


  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);


  useEffect(() => {
    setTimeout(() => setShowTester(true), 10);
  }, []);

  useEffect(() => {
    if (!debouncedTemplateId.trim()) {
      clearTemplateVariables();
      setVariables({});
      return;
    }

    if (!isValidUUID(debouncedTemplateId)) {
      clearTemplateVariables();
      setVariables({});
      return;
    }

    const controller = new AbortController();

    getTemplateVariables(debouncedTemplateId.trim(), controller.signal).then(
      (res) => {
        if (res?.success) {
          const vars = Array.isArray(res.data?.variables) ? res.data.variables : [];
          const seedVars = {};
          vars.forEach((key) => {
            seedVars[key] = "";
          });
          setVariables(seedVars);
        }
      }
    );

    return () => controller.abort();
  }, [debouncedTemplateId]);


  const addLog = useCallback((message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, type, timestamp }]);
  }, []);

  const clearLogs = () => setLogs([]);


  const handleClose = () => {
    setShowTester(false);
    setTimeout(onClose, 300);
  };


  const handleAutoVarChange = (key, value) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCustomVar = () => {
    const trimmedName = customVarName.trim();
    const trimmedValue = customVarValue.trim();

    if (!trimmedName) {
      setCustomVarError("Variable name cannot be empty.");
      return;
    }
    if (Object.prototype.hasOwnProperty.call(variables, trimmedName)) {
      setCustomVarError(`"${trimmedName}" already exists.`);
      return;
    }

    setVariables((prev) => ({ ...prev, [trimmedName]: trimmedValue }));
    setCustomVarName("");
    setCustomVarValue("");
    setCustomVarError("");
  };

  const handleRemoveCustomVar = (key) => {
    setVariables((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };


  const customVarKeys = Object.keys(variables).filter(
    (k) => !templateVarKeys.includes(k)
  );


  const handleSend = async () => {
    const apiKey = document.getElementById("term-apikey")?.value || "";
    const toEmail = document.getElementById("term-email")?.value || "";
    const subject = document.getElementById("term-subject")?.value || "";
    const htmlBody = document.getElementById("term-html")?.value || "";

    if (!apiKey.trim()) { addLog("ERROR: API Key is required", "error"); return; }
    if (!toEmail.trim()) { addLog("ERROR: Recipient email is required", "error"); return; }
    if (!subject.trim()) { addLog("ERROR: Subject is required", "error"); return; }

    setIsLoading(true);
    clearLogs();

    addLog("Initializing SMTP-LITE connection...", "info");
    addLog(`Target: ${toEmail}`, "info");
    addLog(`Subject: ${subject}`, "info");

    const hasTemplate = !!templateId.trim() && !!templateInfo;

    if (hasTemplate) {
      addLog(`Using Template ID: ${templateId.trim()}`, "info");
      addLog(`Variables: ${JSON.stringify(variables)}`, "info");
    }

    addLog("", "info");

    try {
      addLog("Sending POST request to API endpoint...", "loading");

      const bodyPayload = hasTemplate
        ? {
            to: toEmail,
            subject,
            templateId: templateId.trim(),
            variables,
          }
        : {
            to: toEmail,
            subject,
            html:
              htmlBody.trim() ||
              `<div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
                  <h2 style="color: #2563eb;">🎉 Test Email from SMTP-LITE</h2>
                  <p>This is a test email to verify your API integration.</p>
                  <p style="color: #64748b; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
                </div>
              </div>`,
          };

      const response = await fetch(`${API_URL}/api/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(bodyPayload),
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
    addLog("Listening for delivery events...", "info");

    try {
      const response = await fetch(`${API_URL}/api/email/events/${emailId}`);

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
          const rawData = lines
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.replace(/^data:\s?/, ""))
            .join("\n");

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
      case "success": return "#10b981";
      case "error":   return "#ef4444";
      case "warning": return "#f59e0b";
      case "loading": return "#3b82f6";
      default:        return themeColors.mutedForeground.color;
    }
  };

  const getLogPrefix = (type) => {
    switch (type) {
      case "success": return "✓";
      case "error":   return "✗";
      case "warning": return "⚠";
      case "loading": return "⟳";
      default:        return "→";
    }
  };


  const terminalInputStyle = {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: themeColors.foreground.color,
    fontFamily: "monospace",
    fontSize: "13px",
    padding: "4px 0",
  };

  const terminalRowStyle = {
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
  };

  const labelStyle = {
    color: themeColors.primary.color,
    marginRight: "8px",
    minWidth: "140px",
    fontWeight: "600",
    fontFamily: "monospace",
    fontSize: "13px",
    flexShrink: 0,
  };

  const sectionDividerStyle = {
    fontSize: "11px",
    color: themeColors.mutedForeground.color,
    marginBottom: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
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
          maxWidth: "960px",
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
                style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#ef4444", cursor: "pointer" }}
                onClick={handleClose}
              />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10b981" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "monospace", fontSize: "13px", color: themeColors.foreground.color }}>
              <Terminal size={16} />
              <span>RESEND-tester</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{ background: "none", border: "none", color: themeColors.mutedForeground.color, cursor: "pointer", padding: "4px" }}
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
            maxHeight: "80vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >

          <div style={{ marginBottom: "4px" }}>

            <TerminalInput
              label="API_KEY"
              type="password"
              placeholder="enter your api key"
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

            {!templateInfo && (
              <TerminalInput
                label="SUBJECT"
                type="text"
                placeholder="Test Email from SMTP-LITE"
                disabled={isLoading}
                themeColors={themeColors}
                id="term-subject"
              />
            )}


            {!templateInfo && (
              <TerminalInput
                label="HTML_BODY"
                type="text"
                placeholder="<h1>Hello World</h1>"
                disabled={isLoading}
                themeColors={themeColors}
                id="term-html"
              />
            )}


            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={labelStyle}>$TEMPLATE_ID:</span>
                <input
                  id="term-template"
                  type="text"
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  disabled={isLoading || isFetchingTemplate}
                  style={{
                    ...terminalInputStyle,
                    opacity: isFetchingTemplate ? 0.6 : 1,
                    cursor: isFetchingTemplate ? "wait" : "text",
                  }}
                />
                {isFetchingTemplate && (
                  <Loader2
                    size={14}
                    style={{
                      marginLeft: "8px",
                      flexShrink: 0,
                      color: themeColors.primary.color,
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
              </div>


              {templateError && !isFetchingTemplate && (
                <div style={{ marginLeft: "148px", marginTop: "4px", color: "#ef4444", fontSize: "11px" }}>
                  ✗ {templateError}
                </div>
              )}


              {templateInfo && !isFetchingTemplate && (
                <div style={{ marginLeft: "148px", marginTop: "6px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor: themeColors.primary.color + "22",
                      color: themeColors.primary.color,
                      border: `1px solid ${themeColors.primary.color}44`,
                      borderRadius: "4px",
                      padding: "2px 8px",
                      fontSize: "11px",
                    }}
                  >
                    <Tag size={10} />
                    {templateInfo.type || "template"} &nbsp;·&nbsp;{" "}
                    {templateVarKeys.length} var{templateVarKeys.length !== 1 ? "s" : ""} detected
                  </span>
                  {templateInfo.owner?.name && (
                    <span style={{ color: themeColors.mutedForeground.color, fontSize: "11px" }}>
                      owner: {templateInfo.owner.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>


          {templateVarKeys.length > 0 && (
            <div style={{ borderTop: `1px solid ${themeColors.border.color}`, paddingTop: "12px", marginBottom: "4px" }}>
              <div style={sectionDividerStyle}>
                — Template Variables ({templateVarKeys.length}) —
              </div>

              {templateVarKeys.map((key) => (
                <div key={key} style={terminalRowStyle}>
                  <span style={labelStyle}>${key}:</span>
                  <input
                    type="text"
                    placeholder={`enter ${key}`}
                    value={variables[key] ?? ""}
                    onChange={(e) => handleAutoVarChange(key, e.target.value)}
                    disabled={isLoading}
                    style={terminalInputStyle}
                  />
                </div>
              ))}
            </div>
          )}


          {templateInfo && (
            <div style={{ borderTop: `1px solid ${themeColors.border.color}`, paddingTop: "12px", marginBottom: "8px" }}>
              <div style={sectionDividerStyle}>— Custom Variables —</div>


              {customVarKeys.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
                  {customVarKeys.map((key) => (
                    <div
                      key={key}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: themeColors.primary.color + "18",
                        border: `1px solid ${themeColors.primary.color}44`,
                        borderRadius: "4px",
                        padding: "3px 8px",
                        fontSize: "11px",
                        fontFamily: "monospace",
                        color: themeColors.foreground.color,
                      }}
                    >
                      <span style={{ color: themeColors.primary.color, fontWeight: 700 }}>{key}</span>
                      <span style={{ color: themeColors.mutedForeground.color }}>:</span>
                      <span>{variables[key] || <em style={{ opacity: 0.5 }}>empty</em>}</span>
                      <button
                        onClick={() => handleRemoveCustomVar(key)}
                        disabled={isLoading}
                        title={`Remove ${key}`}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          padding: "0 2px",
                          lineHeight: 1,
                          fontSize: "13px",
                          marginLeft: "2px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}


              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="variable name"
                  value={customVarName}
                  onChange={(e) => { setCustomVarName(e.target.value); setCustomVarError(""); }}
                  disabled={isLoading}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddCustomVar(); }}
                  style={{
                    ...terminalInputStyle,
                    flex: "0 0 180px",
                    border: `1px solid ${themeColors.border.color}`,
                    borderRadius: "4px",
                    padding: "4px 8px",
                    backgroundColor: themeColors.background.color,
                  }}
                />
                <span style={{ color: themeColors.mutedForeground.color }}>
                  =
                </span>
                <input
                  type="text"
                  placeholder="value"
                  value={customVarValue}
                  onChange={(e) => setCustomVarValue(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddCustomVar(); }}
                  style={{
                    ...terminalInputStyle,
                    flex: "1 1 120px",
                    border: `1px solid ${themeColors.border.color}`,
                    borderRadius: "4px",
                    padding: "4px 8px",
                    backgroundColor: themeColors.background.color,
                  }}
                />
                <button
                  onClick={handleAddCustomVar}
                  disabled={isLoading || !customVarName.trim()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 12px",
                    backgroundColor:
                      isLoading || !customVarName.trim()
                        ? themeColors.muted.color
                        : themeColors.primary.color,
                    color: themeColors.primaryForeground.color,
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: "600",
                    cursor: isLoading || !customVarName.trim() ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  <Plus size={12} />
                  ADD
                </button>
              </div>

              {customVarError && (
                <div style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>
                  ✗ {customVarError}
                </div>
              )}
            </div>
          )}


          <div style={{ marginTop: "12px", marginBottom: "16px", display: "flex", gap: "12px" }}>
            <button
              onClick={handleSend}
              disabled={isLoading}
              style={{
                padding: "8px 16px",
                backgroundColor: isLoading ? themeColors.muted.color : themeColors.primary.color,
                color: themeColors.primaryForeground.color,
                border: "none",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
                fontSize: "12px",
                fontFamily: "monospace",
                cursor: isLoading ? "not-allowed" : "pointer",
                letterSpacing: "0.05em",
              }}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
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
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                fontFamily: "monospace",
                cursor: logs.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <Trash2 size={14} />
              CLEAR
            </button>
          </div>


          <div
            style={{
              flex: 1,
              backgroundColor: themeColors.background.color,
              borderRadius: "6px",
              padding: "16px",
              overflowY: "auto",
              border: `1px solid ${themeColors.border.color}`,
              minHeight: "120px",
              maxHeight: "240px",
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: themeColors.mutedForeground.color, textAlign: "center", paddingTop: "40px" }}>
                Waiting for commands...
              </div>
            ) : (
              <>
                {logs.map((log, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: "6px", display: "flex", gap: "12px", color: getLogColor(log.type) }}
                  >
                    <span style={{ opacity: 0.5, minWidth: "70px" }}>[{log.timestamp}]</span>
                    <span style={{ minWidth: "15px" }}>{getLogPrefix(log.type)}</span>
                    <span style={{ flex: 1 }}>{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TerminalEmailTester;
