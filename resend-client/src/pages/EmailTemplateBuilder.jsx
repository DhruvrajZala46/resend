// EmailTemplateBuilder.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import { RotateCcw, CloudCheck, Loader2 } from "lucide-react";
import { useEmailTemplate } from "../context/EmailTemplateContext";

const TEMPLATE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

const TEMPLATE_VISIBILITY = {
  PUBLIC: "public",
  PRIVATE: "private",
};

const TEMPLATE_TYPE = {
  CUSTOM: "custom",
};

const DYNAMIC_VARIABLES = [
  { key: "{{name}}", value: "John Doe", description: "User's full name" },
  {
    key: "{{email}}",
    value: "john@example.com",
    description: "User's email address",
  },
  {
    key: "{{verifyUrl}}",
    value: "https://example.com/verify",
    description: "Verification link",
  },
  {
    key: "{{resetUrl}}",
    value: "https://example.com/reset",
    description: "Password reset link",
  },
  { key: "{{otp}}", value: "123456", description: "One-time password" },
  { key: "{{year}}", value: "2025", description: "Current year" },
  {
    key: "{{companyName}}",
    value: "Your Company",
    description: "Company name",
  },
];

const DEFAULT_PLACEHOLDER = `<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Hello {{name}},</h2>
  <p>Welcome to {{companyName}}! Click below to verify your account:</p>
  <a href="{{verifyUrl}}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Account</a>
  <p style="color: #666; margin-top: 20px;">© {{year}} {{companyName}}</p>
</div>`;

const EmailTemplateBuilder = () => {
  const [emailSubject, setEmailSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [templateStatus, setTemplateStatus] = useState(
    TEMPLATE_STATUS.INACTIVE
  );
  const [templateVisibility, setTemplateVisibility] = useState(
    TEMPLATE_VISIBILITY.PRIVATE
  );
  const [showVariableGuide, setShowVariableGuide] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const { createEmailTemplate, fetchTemplates } = useEmailTemplate();
  const themeStyles = useThemeStyles();

  const {
    card,
    border,
    foreground,
    primary,
    mutedForeground,
    input,
    primaryForeground,
    hover,
    background,
    muted,
    ring,
  } = themeStyles;

  const isTemplateActive = templateStatus === TEMPLATE_STATUS.ACTIVE;
  const isTemplatePublic = templateVisibility === TEMPLATE_VISIBILITY.PUBLIC;

  const replaceVariablesInTemplate = (template) => {
    let processedTemplate = template;
    DYNAMIC_VARIABLES.forEach((variable) => {
      const regex = new RegExp(variable.key.replace(/[{}]/g, "\\$&"), "g");
      processedTemplate = processedTemplate.replace(regex, variable.value);
    });
    return processedTemplate;
  };

  const resetTemplate = () => {
    setEmailSubject("");
    setHtmlContent("");
    setTemplateStatus(TEMPLATE_STATUS.INACTIVE);
    setTemplateVisibility(TEMPLATE_VISIBILITY.PRIVATE);
    setSaveSuccess(false);
    setSaveError("");
  };

  const saveTemplate = async () => {
    if (!emailSubject.trim() || !htmlContent.trim()) {
      setSaveError("Please provide both subject and HTML content");
      setTimeout(() => setSaveError(""), 3000);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    const templatePayload = {
      subject: emailSubject,
      html: htmlContent,
      status: templateStatus,
      visibility: templateVisibility,
      createdAt: new Date().toISOString(),
      type: TEMPLATE_TYPE.CUSTOM,
    };

    try {
      const result = await createEmailTemplate(templatePayload);

      if (result?.success) {
        setSaveSuccess(true);
        // Refresh templates list
        await fetchTemplates({ page: 1, limit: 10 });

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError(result?.message || "Failed to save template");
        setTimeout(() => setSaveError(""), 3000);
      }
    } catch (error) {
      setSaveError("An error occurred while saving");
      setTimeout(() => setSaveError(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTemplateStatus = () => {
    setTemplateStatus((prevStatus) =>
      prevStatus === TEMPLATE_STATUS.ACTIVE
        ? TEMPLATE_STATUS.INACTIVE
        : TEMPLATE_STATUS.ACTIVE
    );
  };

  const toggleTemplateVisibility = () => {
    setTemplateVisibility((prevVisibility) =>
      prevVisibility === TEMPLATE_VISIBILITY.PUBLIC
        ? TEMPLATE_VISIBILITY.PRIVATE
        : TEMPLATE_VISIBILITY.PUBLIC
    );
  };

  const renderToggleButton = (isEnabled, onToggle) => (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
      style={{
        backgroundColor: isEnabled ? primary.color : mutedForeground.color,
      }}
      aria-pressed={isEnabled}
    >
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={`inline-block h-4 w-4 transform rounded-full ${
          isEnabled ? "translate-x-6" : "translate-x-1"
        }`}
        style={{ backgroundColor: primaryForeground.color }}
      />
    </button>
  );

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      <div className="max-w-7xl mx-auto px-2 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Template Settings Card */}
            <div
              className="rounded-xl shadow-md p-6"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-lg font-semibold mb-5 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Template Configuration
              </h2>

              <div className="space-y-5">
                {/* Email Subject Input */}
                <div>
                  <label
                    htmlFor="emailSubject"
                    className="block text-sm font-medium mb-2"
                    style={{ color: foreground.color }}
                  >
                    Email Subject
                  </label>
                  <input
                    id="emailSubject"
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Welcome to {{companyName}}, {{name}}!"
                    className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition-all"
                    style={{
                      backgroundColor: card.color,
                      color: foreground.color,
                      border: `1px solid ${input.color}`,
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = ring.color)
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = input.color)
                    }
                  />
                </div>

                {/* Template Status Toggle */}
                <div
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{
                    backgroundColor: muted.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <div>
                    <label
                      className="block text-sm font-medium"
                      style={{ color: foreground.color }}
                    >
                      Template Status
                    </label>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: mutedForeground.color }}
                    >
                      {isTemplateActive
                        ? "Active – ready to use"
                        : "Inactive – not in use"}
                    </p>
                  </div>
                  {renderToggleButton(isTemplateActive, toggleTemplateStatus)}
                </div>

                {/* Template Visibility Toggle */}
                <div
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{
                    backgroundColor: muted.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <div>
                    <label
                      className="block text-sm font-medium"
                      style={{ color: foreground.color }}
                    >
                      Template Visibility
                    </label>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: mutedForeground.color }}
                    >
                      {isTemplatePublic
                        ? "Public – available to all users"
                        : "Private – only visible to you"}
                    </p>
                  </div>
                  {renderToggleButton(
                    isTemplatePublic,
                    toggleTemplateVisibility
                  )}
                </div>
              </div>
            </div>

            {/* HTML Editor Card */}
            <div
              className="rounded-xl shadow-md p-6"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-lg font-semibold flex items-center gap-2"
                  style={{ color: primary.color }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  HTML Template
                </h2>
                <button
                  onClick={() => setShowVariableGuide(!showVariableGuide)}
                  className="text-sm font-medium flex items-center gap-1 transition-colors"
                  style={{ color: primary.color }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = hover.primary)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = primary.color)
                  }
                  aria-expanded={showVariableGuide}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Dynamic Variables
                </button>
              </div>

              {/* Variable Guide */}
              <AnimatePresence>
                {showVariableGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div
                      className="rounded-lg p-4"
                      style={{
                        backgroundColor: muted.color,
                        border: `1px solid ${border.color}`,
                      }}
                    >
                      <p
                        className="text-sm font-medium mb-2"
                        style={{ color: foreground.color }}
                      >
                        💡 Use dynamic variables in your template
                      </p>
                      <p
                        className="text-xs mb-3"
                        style={{ color: mutedForeground.color }}
                      >
                        Add user-specific details by wrapping variable names in
                        double curly braces:
                      </p>
                      <div
                        className="rounded-md p-3 font-mono text-xs space-y-1"
                        style={{
                          backgroundColor: card.color,
                          border: `1px solid ${border.color}`,
                        }}
                      >
                        {DYNAMIC_VARIABLES.map((variable) => (
                          <div
                            key={variable.key}
                            style={{ color: mutedForeground.color }}
                          >
                            <span style={{ color: primary.color }}>
                              {variable.key}
                            </span>{" "}
                            - {variable.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HTML Textarea */}
              <textarea
                id="htmlContent"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder={DEFAULT_PLACEHOLDER}
                rows={16}
                className="w-full px-4 py-3 rounded-lg focus:outline-none font-mono text-sm transition-all resize-y"
                style={{
                  minHeight: "400px",
                  backgroundColor: card.color,
                  color: foreground.color,
                  border: `1px solid ${input.color}`,
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = ring.color)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = input.color)
                }
                aria-label="HTML template content"
              />
            </div>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="lg:sticky lg:top-24">
              <div
                className="rounded-xl shadow-md overflow-hidden"
                style={{
                  backgroundColor: card.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                {/* Preview Header */}
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{
                    backgroundColor: primary.color,
                    color: primaryForeground.color,
                  }}
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                      />
                    </svg>
                    Live Preview
                  </h2>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={resetTemplate}
                      className="p-1 rounded-md cursor-pointer transition-opacity hover:opacity-80"
                      aria-label="Reset template"
                      disabled={isSaving}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={saveTemplate}
                      className="p-1 rounded-md cursor-pointer transition-opacity hover:opacity-80 relative"
                      aria-label="Save template"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CloudCheck className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {(saveSuccess || saveError) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="px-6 py-3"
                      style={{
                        backgroundColor: saveSuccess ? "#10b981" : "#ef4444",
                        color: "white",
                      }}
                    >
                      <p className="text-sm font-medium text-center">
                        {saveSuccess
                          ? "✓ Template saved successfully!"
                          : `✗ ${saveError}`}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Preview Content */}
                <div className="p-6">
                  <div
                    className="rounded-lg p-6 min-h-[500px] overflow-auto relative"
                    style={{
                      backgroundColor: card.color,
                    }}
                  >
                    {/* Saving Overlay */}
                    <AnimatePresence>
                      {isSaving && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Loader2
                              className="w-12 h-12 animate-spin"
                              style={{ color: primary.color }}
                            />
                            <p
                              className="text-sm font-medium"
                              style={{ color: primaryForeground.color }}
                            >
                              Saving template...
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {htmlContent ? (
                        <motion.div
                          key="preview-content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          dangerouslySetInnerHTML={{
                            __html: replaceVariablesInTemplate(htmlContent),
                          }}
                          style={{
                            color: foreground.color,
                            fontSize: "14px",
                            lineHeight: "1.6",
                          }}
                        />
                      ) : (
                        <motion.div
                          key="preview-placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center min-h-[400px] text-center rounded-lg border-2 border-dashed"
                          style={{
                            backgroundColor: muted.color,
                            borderColor: border.color,
                          }}
                        >
                          <svg
                            className="w-16 h-16 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <p
                            className="font-medium"
                            style={{ color: mutedForeground.color }}
                          >
                            No preview available
                          </p>
                          <p
                            className="text-sm mt-1"
                            style={{ color: mutedForeground.color }}
                          >
                            Start typing HTML to see the preview
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateBuilder;
