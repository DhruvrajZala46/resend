import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";

const Verify = () => {
  const { verifyAccount } = useAuth();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const {
    background,
    card,
    border,
    foreground,
    primary,
    primaryForeground,
    mutedForeground,
  } = useThemeStyles();

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      const result = await verifyAccount(token);
      setVerified(result?.success ?? true);
      setLoading(false);
    };
    if (token) verify();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 transition-colors duration-300"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      <motion.div
        className="w-full max-w-md p-8 rounded-xl shadow-lg text-center border"
        style={{
          backgroundColor: card.color,
          border: `1px solid ${border.color}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: primary.color }}
        >
          Account Verification
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2
              className="animate-spin"
              size={28}
              style={{ color: primary.color }}
            />
            <p style={{ color: mutedForeground.color }}>
              Verifying your account...
            </p>
          </div>
        ) : verified ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckCircle size={36} className="text-green-500" />
            <p className="font-medium">
              ✅ Your account has been verified successfully!
            </p>
            <motion.button
              className="mt-4 px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
              }}
              whileHover={{
                backgroundColor: primaryForeground.color,
                color: primary.color,
              }}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </motion.button>
          </div>
        ) : (
          <p className="text-red-500 font-medium">
            ❌ Verification failed. Please try again.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Verify;
