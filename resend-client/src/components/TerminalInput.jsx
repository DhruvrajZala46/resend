import React from "react";

const TerminalInput = ({
  label,
  type,
  placeholder,
  onSubmit,
  disabled,
  themeColors,
  id,
}) => {
  return (
    <div
      style={{ marginBottom: "12px", display: "flex", alignItems: "center" }}
    >
      <span
        style={{
          color: themeColors.primary.color,
          marginRight: "8px",
          minWidth: "100px",
          fontWeight: "600",
        }}
      >
        ${label}:
      </span>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        onKeyPress={(e) => {
          if (e.key === "Enter" && onSubmit) {
            onSubmit(e.target.value);
          }
        }}
        style={{
          flex: 1,
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          color: themeColors.foreground.color,
          fontFamily: "monospace",
          fontSize: "13px",
          padding: "4px 0",
        }}
      />
    </div>
  );
};

export default TerminalInput;
