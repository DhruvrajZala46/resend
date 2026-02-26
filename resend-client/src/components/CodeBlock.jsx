import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import gsap from "gsap";

const CodeBlock = ({ code = "", language = "", id }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { copiedCode, setCopiedCode } = useTheme();
  const codeRef = useRef(null);
  const containerRef = useRef(null);

  const copyToClipboard = async (text, id) => {
    try {
      if (!navigator?.clipboard) throw new Error("Clipboard API not supported");
      await navigator.clipboard.writeText(text ?? "");
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      alert("Failed to copy: " + (err?.message || err));
    }
  };

  const COLLAPSED_HEIGHT = 200; // Height in pixels when collapsed

  // safe check: treat undefined/null as empty string
  const safeCode = typeof code === "string" ? code : String(code ?? "");
  const shouldShowToggle = safeCode.split("\n").length > 8;

  useEffect(() => {
    if (!codeRef.current || !containerRef.current) return;

    const fullHeight = codeRef.current.scrollHeight;
    gsap.to(containerRef.current, {
      height: isExpanded ? fullHeight : Math.min(COLLAPSED_HEIGHT, fullHeight),
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, [isExpanded, safeCode]);

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 flex gap-2 items-center z-10">
        <span className="text-xs text-gray-400 uppercase">{language}</span>
        <button
          onClick={() => copyToClipboard(safeCode, id)}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
          title="Copy code"
        >
          {copiedCode === id ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-gray-300" />
          )}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: shouldShowToggle ? COLLAPSED_HEIGHT : "auto" }}
      >
        <pre
          ref={codeRef}
          className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"
        >
          <code>{safeCode}</code>
        </pre>

        {shouldShowToggle && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
        )}
      </div>

      {shouldShowToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              View Less
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              View Full
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CodeBlock;
