import React from "react";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import { motion } from "framer-motion";
import { Link, User } from "lucide-react";

const Profile = () => {
  const { user, loading, handleLogout } = useAuth();
  const {
    background,
    card,
    border,
    foreground,
    primary,
    primaryForeground,
    mutedForeground,
    hover,
  } = useThemeStyles();

  if (loading)
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: background.color }}
      >
        <p style={{ color: mutedForeground.color }}>Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: background.color }}
      >
        <p style={{ color: mutedForeground.color }}>You are not logged in.</p>
      </div>
    );

  return (
    <div
      className="flex justify-center items-center mt-10 transition-colors duration-300"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      <motion.div
        className="w-full max-w-md p-6 rounded-xl shadow-lg border transition-all duration-300"
        style={{
          backgroundColor: card.color,
          border: `1px solid ${border.color}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <User size={28} style={{ color: primary.color }} />
          <h2 className="text-2xl font-bold" style={{ color: primary.color }}>
            Profile
          </h2>
        </div>

        <div className="space-y-3 text-sm">
          <div
            className="p-3 rounded-lg border transition-colors duration-300"
            style={{
              border: `1px solid ${border.color}`,
              backgroundColor: background.color,
            }}
          >
            <p className="font-medium" style={{ color: mutedForeground.color }}>
              Name
            </p>
            <p>{user.name}</p>
          </div>

          <div
            className="p-3 rounded-lg border transition-colors duration-300"
            style={{
              border: `1px solid ${border.color}`,
              backgroundColor: background.color,
            }}
          >
            <p className="font-medium" style={{ color: mutedForeground.color }}>
              Email
            </p>
            <p>{user.email}</p>
          </div>
        </div>

        <motion.button
          className="w-full mt-6 py-2 rounded-lg font-semibold transition-colors duration-300"
          style={{
            backgroundColor: primary.color,
            color: primaryForeground.color,
          }}
          whileHover={{
            backgroundColor: hover.primary,
          }}
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          Go to Dashboard
        </motion.button>
        <motion.button
          className="w-full mt-6 py-2 rounded-lg font-semibold hover:bg-[#702122] transition-colors duration-300"
          style={{
            backgroundColor: primary.color,
            color: primaryForeground.color,
          }}
          whileHover={{
            backgroundColor: "#702122",
            color: "white",
          }}
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Profile;
