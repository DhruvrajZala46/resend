import React, { useRef, useEffect } from "react";

const HtmlPreview = ({ html, scale = 1, className = "", style = {}, pointerEvents = "none" }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <iframe
        ref={iframeRef}
        title="HTML Preview"
        style={{
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          border: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: pointerEvents,
        }}
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default HtmlPreview;
