import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { useThemeStyles } from "../utils/useThemeStyles.js";

const Login = () => {
  const { user, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

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
  } = useThemeStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to={redirectPath} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await handleLogin(email, password);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message);
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
          Login to Your Account
        </h2>

        {error && (
          <div
            className="p-3 mb-4 rounded text-sm font-medium"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p
          className="text-center text-sm mt-4"
          style={{ color: mutedForeground.color }}
        >
          Don’t have an account?{" "}
          <span
            className="cursor-pointer font-semibold"
            style={{ color: primary.color }}
            onMouseEnter={(e) => (e.target.style.color = hover.primary)}
            onMouseLeave={(e) => (e.target.style.color = primary.color)}
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
