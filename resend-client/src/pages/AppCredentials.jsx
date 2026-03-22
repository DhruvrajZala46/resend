import React, { useState } from "react";
import { useAppCredentials } from "../context/AppCredentialsContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  Shield,
  AlertCircle,
  Plus,
  Mail,
  AppWindow,
  Lock,
} from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const AppCredentials = () => {
  const {
    appCredentials,
    loading,
    createAppCredentials,
    deleteAppCredentials,
    viewDecryptedPassword,
    decryptedPassword,
  } = useAppCredentials();

  const {
    background,
    card,
    border,
    primary,
    primaryForeground,
    foreground,
    muted,
    mutedForeground,
    input,
  } = useThemeStyles();

  const [formData, setFormData] = useState({
    appName: "",
    appUserEmail: "",
    appPassword: "",
  });

  const [creating, setCreating] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.appName || !formData.appUserEmail || !formData.appPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    setCreating(true);
    const res = await createAppCredentials(formData);
    setCreating(false);

    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    setFormData({ appName: "", appUserEmail: "", appPassword: "" });
  };

  const handleViewPassword = async (id) => {
    if (revealedPassword) {
      setRevealedPassword(null);
      return;
    }
    setRevealing(true);
    const decrypted = await viewDecryptedPassword(id);
    setRevealedPassword(decrypted);
    setRevealing(false);
  };

  const handleDeleteConfirm = async (id) => {
    setDeleting(true);
    await deleteAppCredentials(id);
    setDeleting(false);
    setShowConfirmModal(false);
  };

  return (
    <div
      className="min-h-screen pt-8 px-4 transition-colors duration-300"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${primary.color}18`, color: primary.color }}
            >
              <Shield size={20} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: foreground.color }}>
              App Credentials
            </h1>
          </div>
          <p className="text-sm font-medium ml-1" style={{ color: mutedForeground.color }}>
            Securely store and manage your SMTP application credentials.
          </p>
        </motion.div>

        {/* CREATE FORM — only when no credentials exist */}
        <AnimatePresence>
          {!appCredentials && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl mb-8 shadow-sm"
              style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}
            >
              <h2 className="text-base font-bold mb-5" style={{ color: foreground.color }}>
                Set Up New Credentials
              </h2>

              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                {/* App Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest ml-1" style={{ color: mutedForeground.color }}>
                    App Name
                  </label>
                  <div className="relative">
                    <AppWindow size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" style={{ color: foreground.color }} />
                    <input
                      name="appName"
                      placeholder="e.g. My Gmail App"
                      value={formData.appName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
                      style={{
                        backgroundColor: background.color,
                        border: `1px solid ${border.color}`,
                        color: foreground.color,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primary.color)}
                      onBlur={(e) => (e.target.style.borderColor = border.color)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest ml-1" style={{ color: mutedForeground.color }}>
                    App Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" style={{ color: foreground.color }} />
                    <input
                      name="appUserEmail"
                      type="email"
                      placeholder="you@gmail.com"
                      value={formData.appUserEmail}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
                      style={{
                        backgroundColor: background.color,
                        border: `1px solid ${border.color}`,
                        color: foreground.color,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primary.color)}
                      onBlur={(e) => (e.target.style.borderColor = border.color)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest ml-1" style={{ color: mutedForeground.color }}>
                    App Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" style={{ color: foreground.color }} />
                    <input
                      name="appPassword"
                      type="password"
                      placeholder="••••••••••••"
                      value={formData.appPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm font-mono"
                      style={{
                        backgroundColor: background.color,
                        border: `1px solid ${border.color}`,
                        color: foreground.color,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = primary.color)}
                      onBlur={(e) => (e.target.style.borderColor = border.color)}
                    />
                  </div>
                </div>

                {/* Error */}
                {errorMessage && (
                  <div
                    className="flex items-center gap-2 p-3.5 rounded-xl text-sm"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      color: "#ef4444",
                    }}
                  >
                    <AlertCircle size={16} />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] mt-1"
                  style={{
                    backgroundColor: primary.color,
                    color: primaryForeground.color,
                    opacity: creating ? 0.7 : 1,
                    cursor: creating ? "not-allowed" : "pointer",
                    boxShadow: `0 4px 14px ${primary.color}30`,
                  }}
                >
                  {creating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Plus size={16} />
                      Save Credentials
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VIEW EXISTING CREDENTIALS */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3" style={{ color: mutedForeground.color }}>
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Loading credentials...</span>
          </div>
        ) : appCredentials ? (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl shadow-sm"
            style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}
          >
            {/* App Details */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primary.color}15`, color: primary.color }}
              >
                <AppWindow size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold" style={{ color: foreground.color }}>
                  {appCredentials.appName}
                </h2>
                <p className="text-sm font-medium mt-0.5" style={{ color: mutedForeground.color }}>
                  {appCredentials.appUserEmail}
                </p>
              </div>
            </div>

            {/* Password Row */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-widest ml-1 mb-2 block" style={{ color: mutedForeground.color }}>
                App Password
              </label>
              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: background.color, border: `1px solid ${border.color}` }}
              >
                <span className="font-mono text-sm tracking-widest" style={{ color: foreground.color }}>
                  {revealing ? (
                    <Loader2 className="animate-spin inline" size={16} />
                  ) : revealedPassword ? (
                    revealedPassword
                  ) : (
                    "•••• •••• •••• ••••"
                  )}
                </span>
                <button
                  onClick={() => handleViewPassword(appCredentials._id)}
                  className="p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ml-4"
                  style={{ color: primary.color, backgroundColor: `${primary.color}15` }}
                >
                  {revealedPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Delete Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Trash2 size={16} /> Delete Credentials
                  </>
                )}
              </button>
            </div>

            <ConfirmDeleteModal
              appName={appCredentials.appName}
              isOpen={showConfirmModal}
              onCancel={() => setShowConfirmModal(false)}
              onConfirm={() => handleDeleteConfirm(appCredentials._id)}
              deleting={deleting}
            />
          </motion.div>
        ) : (
          !loading && (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed gap-3"
              style={{ borderColor: border.color }}
            >
              <Shield size={36} style={{ color: mutedForeground.color, opacity: 0.4 }} />
              <p className="text-sm font-medium" style={{ color: mutedForeground.color }}>
                No credentials configured yet.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AppCredentials;
