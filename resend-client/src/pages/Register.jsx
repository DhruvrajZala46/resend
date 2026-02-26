import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useThemeStyles } from "../utils/useThemeStyles.js";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const {
    card,
    border,
    foreground,
    primary,
    muted,
    mutedForeground,
    input,
    primaryForeground,
    hover,
    background,
    secondary,
    secondaryForeground,
    cardForeground,
    legacy,
  } = useThemeStyles();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await handleRegister(name, email, password);

    if (result.success) {
      setMessage(
        "✅ Registration successful! Please check your email to verify your account (check inbox or spam)."
      );
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center transition-colors mt-20 duration-300"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg shadow-lg p-6 transition-all duration-300"
        style={{
          backgroundColor: card.color,
          color: foreground.color,
          border: `1px solid ${border.color}`,
        }}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: primary.color }}
        >
          Create Your Account
        </h2>

        {message && (
          <div
            className="p-3 mb-4 rounded text-sm font-medium"
            style={{
              backgroundColor: message.startsWith("✅")
                ? "rgba(34,197,94,0.1)"
                : "rgba(239,68,68,0.1)",
              color: message.startsWith("✅") ? "#22c55e" : "#ef4444",
              border: message.startsWith("✅")
                ? "1px solid rgba(34,197,94,0.3)"
                : "1px solid rgba(239,68,68,0.3)",
            }}
          >
            {message}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 rounded focus:outline-none transition-colors duration-200"
            style={{
              backgroundColor: card.color,
              color: foreground.color,
              border: `1px solid ${input.color}`,
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded focus:outline-none transition-colors duration-200"
            style={{
              backgroundColor: card.color,
              color: foreground.color,
              border: `1px solid ${input.color}`,
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded focus:outline-none transition-colors duration-200"
            style={{
              backgroundColor: card.color,
              color: foreground.color,
              border: `1px solid ${input.color}`,
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold rounded py-2 transition-colors duration-300"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = hover.primary)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = primary.color)
            }
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <p
          className="text-center text-sm mt-4"
          style={{ color: mutedForeground.color }}
        >
          Already have an account?{" "}
          <span
            className="cursor-pointer font-semibold"
            style={{ color: primary.color }}
            onMouseEnter={(e) => (e.target.style.color = hover.primary)}
            onMouseLeave={(e) => (e.target.style.color = primary.color)}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
