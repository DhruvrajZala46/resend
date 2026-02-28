import React from "react";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import { Link } from "react-router-dom";

const Footer = () => {
  const { border, mutedForeground, primary, card } = useThemeStyles();

  const links = [
    { to: "/privacy", text: "Privacy Policy" },
    { to: "/terms", text: "Terms of Service" },
    { to: "/status", text: "System Status" },
  ];

  return (
    <footer
      className="w-full mt-auto py-6 text-center text-sm transition-colors duration-300 border-t"
      style={{
        backgroundColor: card.color,
        color: mutedForeground.color,
        borderColor: border.color,
      }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <p className="mb-1">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold">RESEND</span> — Built with{" "}
          <span className="text-red-500 animate-pulse">❤️</span> for developers
        </p>

        <p className="text-xs">
          Need help? Contact{" "}
          <a
            href="mailto:smtplitee@gmail.com"
            className="font-medium hover:underline"
            style={{ color: primary.color }}
          >
            smtplitee@gmail.com
          </a>
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          {links.map(({ to, text }) => (
            <Link
              key={to}
              to={to}
              className="transition-colors duration-200 hover:underline"
              style={{
                color: mutedForeground.color,
              }}
              onMouseEnter={(e) => (e.target.style.color = primary.color)}
              onMouseLeave={(e) =>
                (e.target.style.color = mutedForeground.color)
              }
            >
              {text}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
