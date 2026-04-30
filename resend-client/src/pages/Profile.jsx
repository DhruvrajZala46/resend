import React from "react";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import { motion } from "framer-motion";
import { User, Mail, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

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
    muted,
  } = useThemeStyles();

  if (loading)
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ backgroundColor: background.color }}
      >
        <p
          className="animate-pulse text-sm font-medium"
          style={{ color: mutedForeground.color }}
        >
          Loading profile...
        </p>
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

  // const initials = user.name
  //   ? user.name
  //       .split(" ")
  //       .map((n) => n[0])
  //       .join("")
  //       .toUpperCase()
  //       .slice(0, 2)
  //   : "U";

  return (
    <div
      className="min-h-screen pt-8 px-4 transition-colors duration-300"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: foreground.color }}
          >
            Your Profile
          </h1>
          <p
            className="text-sm font-medium mt-1"
            style={{ color: mutedForeground.color }}
          >
            Manage your account information and preferences.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl overflow-hidden mb-5 shadow-sm"
          style={{
            backgroundColor: card.color,
            border: `1px solid ${border.color}`,
          }}
        >
          {/* Avatar Banner */}
          <div
            className="relative h-28 flex items-end px-6 pb-0 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${primary.color}40, ${primary.color}10)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 70% 30%, ${primary.color} 0%, transparent 60%)`,
              }}
            />
          </div>

          {/* Avatar + Name Row */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-5 -mt-10 mb-5">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold shadow-lg border-4 shrink-0"
                style={{
                  backgroundColor: primary.color,
                  color: primaryForeground.color,
                  borderColor: card.color,
                }}
              >
                <img
                  src={user.profilePic}
                  alt="User Profile Image"
                  className="rounded-full"
                />
              </div>
              <div className="pb-1">
                <h2
                  className="text-xl font-extrabold tracking-tight"
                  style={{ color: foreground.color }}
                >
                  {user.name}
                </h2>
                <p
                  className="text-sm font-medium"
                  style={{ color: mutedForeground.color }}
                >
                  {user.email}
                </p>
              </div>
            </div>

            {/* Info Rows */}
            <div className="flex flex-col gap-3">
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <User size={18} style={{ color: primary.color }} />
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-0.5"
                    style={{ color: mutedForeground.color }}
                  >
                    Full Name
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: foreground.color }}
                  >
                    {user.name}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <Mail size={18} style={{ color: primary.color }} />
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-0.5"
                    style={{ color: mutedForeground.color }}
                  >
                    Email Address
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: foreground.color }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <ShieldCheck size={18} style={{ color: "#22c55e" }} />
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-0.5"
                    style={{ color: mutedForeground.color }}
                  >
                    Account Status
                  </p>
                  <span
                    className="text-sm font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(34,197,94,0.12)",
                      color: "#16a34a",
                    }}
                  >
                    Verified & Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
              boxShadow: `0 4px 15px ${primary.color}30`,
            }}
          >
            <LayoutDashboard size={16} />
            Go to Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm border-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/10 active:scale-[0.98]"
            style={{
              borderColor: "#ef4444",
              color: "#ef4444",
            }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
