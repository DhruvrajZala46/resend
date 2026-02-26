import React, { useState } from "react";
import { useAppCredentials } from "../context/AppCredentialsContext";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  Shield,
  AlertCircle,
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
    input,
    hover,
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
      className="flex flex-col items-center justify-start pt-5 px-2 transition-colors duration-300"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      <div className="w-full max-w-5xl">
        <h1
          className="text-3xl font-bold mb-6 flex items-center gap-2"
          style={{ color: primary.color }}
        >
          <Shield size={28} />
          Manage App Credentials
        </h1>

        {/* CREATE NEW APP CREDENTIALS */}
        {!appCredentials && (
          <form
            onSubmit={handleCreate}
            className="flex flex-col gap-4 mb-10 p-6 rounded-xl shadow-md"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <input
              name="appName"
              placeholder="App Name"
              value={formData.appName}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg focus:outline-none"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${input.color}`,
                color: foreground.color,
              }}
            />
            <input
              name="appUserEmail"
              type="email"
              placeholder="App User Email"
              value={formData.appUserEmail}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg focus:outline-none"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${input.color}`,
                color: foreground.color,
              }}
            />
            <input
              name="appPassword"
              placeholder="App Password"
              value={formData.appPassword}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg focus:outline-none font-mono"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${input.color}`,
                color: foreground.color,
              }}
            />

            {errorMessage && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  border: `1px solid #ef4444`,
                  color: "#ef4444",
                }}
              >
                <AlertCircle size={18} />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg font-medium px-6 py-2 flex items-center justify-center gap-2 transition-colors duration-300"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
                opacity: creating ? 0.8 : 1,
                cursor: creating ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = hover.primary)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = primary.color)
              }
            >
              {creating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Create Credentials"
              )}
            </button>
          </form>
        )}

        {/* VIEW EXISTING APP CREDENTIALS */}
        {loading ? (
          <div
            className="text-center font-medium"
            style={{ color: muted.color }}
          >
            Loading app credentials...
          </div>
        ) : appCredentials ? (
          <motion.div
            layout
            className="p-6 rounded-xl shadow-md flex flex-col gap-4"
            style={{
              backgroundColor: card.color,
              color: foreground.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <div>
              <h2 className="text-xl font-semibold mb-1">
                {appCredentials.appName}
              </h2>
              <p className="text-sm" style={{ color: muted.color }}>
                {appCredentials.appUserEmail}
              </p>
            </div>

            <div
              className="p-3 rounded-lg font-mono flex items-center justify-between"
              style={{
                backgroundColor: muted.color,
                border: `1px solid ${border.color}`,
              }}
            >
              {revealing ? (
                <Loader2 className="animate-spin" size={18} />
              ) : revealedPassword ? (
                revealedPassword
              ) : (
                "•••• •••• •••• ••••"
              )}
              <button
                onClick={() => handleViewPassword(appCredentials._id)}
                className="ml-2"
                style={{ color: primary.color }}
              >
                {revealedPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={deleting}
              className="self-end flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                opacity: deleting ? 0.8 : 1,
              }}
            >
              {deleting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Trash2 size={18} /> Delete Credentials
                </>
              )}
            </button>

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
              className="text-center font-medium"
              style={{ color: muted.color }}
            >
              No app credentials set up yet.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AppCredentials;
