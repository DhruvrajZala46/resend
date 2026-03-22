import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import { motion } from "framer-motion";
import { Rocket, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const {
    background,
    foreground,
    primary,
    primaryForeground,
    card,
    border,
    input,
    mutedForeground,
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
        "✅ Registration successful! Please check your email to verify your account (check inbox or spam).",
      );
      setTimeout(() => navigate("/login"), 3000);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex transition-colors duration-500"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      {/* Left Pane - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 lg:px-8 relative z-10 w-full pt-8 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Create an account
            </h1>
            <p
              className="text-base font-medium"
              style={{ color: mutedForeground.color }}
            >
              Get started with Resend. No credit card required.
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 p-4 rounded-xl text-sm font-medium leading-relaxed"
                style={{
                  backgroundColor: message.startsWith("✅")
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.1)",
                  color: message.startsWith("✅") ? "#22c55e" : "#ef4444",
                  border: message.startsWith("✅")
                    ? "1px solid rgba(34,197,94,0.2)"
                    : "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {message.startsWith("✅") ? (
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                )}
                <span>{message.replace("✅ ", "")}</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold ml-1"
                style={{ color: foreground.color }}
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="Ada Lovelace"
                required
                className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2"
                style={{
                  backgroundColor: card.color,
                  color: foreground.color,
                  border: `1px solid ${border.color}`,
                }}
                onFocus={(e) => (e.target.style.borderColor = primary.color)}
                onBlur={(e) => (e.target.style.borderColor = border.color)}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold ml-1"
                style={{ color: foreground.color }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="ada@example.com"
                required
                className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2"
                style={{
                  backgroundColor: card.color,
                  color: foreground.color,
                  border: `1px solid ${border.color}`,
                }}
                onFocus={(e) => (e.target.style.borderColor = primary.color)}
                onBlur={(e) => (e.target.style.borderColor = border.color)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-bold ml-1"
                style={{ color: foreground.color }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full p-3.5 rounded-xl outline-none transition-all duration-300 shadow-sm focus:ring-2"
                style={{
                  backgroundColor: card.color,
                  color: foreground.color,
                  border: `1px solid ${border.color}`,
                }}
                onFocus={(e) => (e.target.style.borderColor = primary.color)}
                onBlur={(e) => (e.target.style.borderColor = border.color)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 font-bold rounded-xl py-4 mt-2 transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: `0 8px 25px ${primary.color}40`,
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p
              className="text-center text-sm mt-6 font-medium"
              style={{ color: mutedForeground.color }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold hover:underline transition-all duration-300"
                style={{ color: primary.color }}
              >
                Sign in instead
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right Pane - Ambient Graphics (Hidden on Mobile) */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden bg-black/5"
        style={{
          borderLeft: `1px solid ${border.color}`,
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle at top right, ${primary.color} 0%, transparent 60%)`,
          }}
        />

        <div
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-screen blur-[120px]"
          style={{ backgroundColor: primary.color, opacity: 0.15 }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 px-12 text-left max-w-lg"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl backdrop-blur-md border border-white/10"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
            }}
          >
            <Rocket size={32} />
          </div>
          <h2
            className="text-4xl font-extrabold mb-6 tracking-tight leading-tight"
            style={{ color: foreground.color }}
          >
            "Since integrating Resend, our deliverability rates have
            skyrocketed."
          </h2>
          <div className="flex items-center gap-4 mt-8">
            <div className="w-12 h-12 rounded-full bg-black/20 overflow-hidden border">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div>
              <p
                className="font-bold text-base"
                style={{ color: foreground.color }}
              >
                Jane Doe
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: mutedForeground.color }}
              >
                Lead Engineer, TechStartup
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
