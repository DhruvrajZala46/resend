import React, { useState } from "react";
import { useApiKeys } from "../context/ApiKeyContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Trash2,
  KeyRound,
  Loader2,
  Check,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";

const ApiKeys = () => {
  const { apiKeys, loading, createApiKey, deleteApiKey, toggleApiKey } =
    useApiKeys();

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

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Please enter a name for your API key.");
      return;
    }

    setCreating(true);
    const res = await createApiKey(name);
    setCreating(false);

    if (!res.success) {
      setError(res.message);
      return;
    }

    setSuccess(res.message || "API Key created successfully!");
    setName("");
  };

  const handleCopy = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDelete = async (id) => {
    setError(null);
    setSuccess(null);
    setDeletingIds((prev) => [...prev, id]);
    const res = await deleteApiKey(id);
    if (res.success) setSuccess(res.message);
    else setError(res.message);
    setDeletingIds((prev) => prev.filter((keyId) => keyId !== id));
  };

  const handleToggle = async (id) => {
    setError(null);
    setSuccess(null);
    setTogglingIds((prev) => [...prev, id]);
    const res = await toggleApiKey(id);
    if (res.success) setSuccess(res.message);
    else setError(res.message);
    setTogglingIds((prev) => prev.filter((keyId) => keyId !== id));
  };

  return (
    <div
      className="min-h-screen pt-8 px-4 transition-colors duration-300"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      <div className="max-w-5xl mx-auto">
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
              <KeyRound size={20} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: foreground.color }}>
              API Keys
            </h1>
          </div>
          <p className="text-sm font-medium ml-1" style={{ color: mutedForeground.color }}>
            Create and manage keys to authenticate against the Resend API.
          </p>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 flex items-start gap-3 p-4 rounded-xl overflow-hidden"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                borderLeft: "3px solid #ef4444",
                color: "#b91c1c",
              }}
            >
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Error</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 flex items-start gap-3 p-4 rounded-xl overflow-hidden"
              style={{
                backgroundColor: "rgba(34,197,94,0.08)",
                borderLeft: "3px solid #16a34a",
                color: "#166534",
              }}
            >
              <Check size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Success</p>
                <p className="text-sm opacity-80">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create New Key Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 rounded-2xl mb-8 shadow-sm"
          style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}
        >
          <h2 className="text-base font-bold mb-4" style={{ color: foreground.color }}>
            Create a New Key
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. Production Key, Dev Key..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl outline-none transition-all duration-300 text-sm"
              style={{
                backgroundColor: background.color,
                border: `1px solid ${border.color}`,
                color: foreground.color,
              }}
              onFocus={(e) => (e.target.style.borderColor = primary.color)}
              onBlur={(e) => (e.target.style.borderColor = border.color)}
            />
            <button
              type="submit"
              disabled={creating}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] shrink-0"
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
                  Generate Key
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* API Keys List */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4 ml-1" style={{ color: mutedForeground.color }}>
            Your Keys ({loading ? "..." : apiKeys.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3" style={{ color: mutedForeground.color }}>
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">Loading keys...</span>
            </div>
          ) : apiKeys.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed gap-3"
              style={{ borderColor: border.color }}
            >
              <KeyRound size={36} style={{ color: mutedForeground.color, opacity: 0.4 }} />
              <p className="text-sm font-medium" style={{ color: mutedForeground.color }}>
                No API keys yet. Create your first key above.
              </p>
            </div>
          ) : (
            <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {apiKeys.map((keyObj, index) => {
                const isToggling = togglingIds.includes(keyObj._id);
                const isDeleting = deletingIds.includes(keyObj._id);

                return (
                  <motion.div
                    key={keyObj._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group"
                    style={{
                      backgroundColor: card.color,
                      border: `1px solid ${border.color}`,
                    }}
                  >
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-base truncate pr-2" style={{ color: foreground.color }}>
                        {keyObj.name}
                      </h3>
                      <span
                        className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shrink-0"
                        style={{
                          backgroundColor: keyObj.active
                            ? "rgba(34,197,94,0.12)"
                            : "rgba(239,68,68,0.12)",
                          color: keyObj.active ? "#16a34a" : "#ef4444",
                        }}
                      >
                        {keyObj.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Key Preview */}
                    <div
                      className="font-mono text-xs p-3 rounded-xl mb-4 break-all leading-relaxed"
                      style={{
                        backgroundColor: background.color,
                        border: `1px solid ${border.color}`,
                        color: mutedForeground.color,
                      }}
                    >
                      {keyObj.key.length > 24
                        ? `${keyObj.key.slice(0, 24)}...`
                        : keyObj.key}
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center gap-2">
                      {/* Toggle */}
                      <motion.button
                        onClick={() => handleToggle(keyObj._id)}
                        disabled={isToggling}
                        whileTap={{ scale: 0.93 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold flex-1 justify-center transition-all duration-300"
                        style={{
                          backgroundColor: keyObj.active
                            ? "rgba(34,197,94,0.12)"
                            : "rgba(156,163,175,0.15)",
                          color: keyObj.active ? "#16a34a" : mutedForeground.color,
                          border: `1px solid ${keyObj.active ? "rgba(34,197,94,0.25)" : border.color}`,
                        }}
                      >
                        {isToggling ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : keyObj.active ? (
                          <><ToggleRight size={14} /> Deactivate</>
                        ) : (
                          <><ToggleLeft size={14} /> Activate</>
                        )}
                      </motion.button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(keyObj._id, keyObj.key)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: `${primary.color}15`,
                          color: primary.color,
                        }}
                        title="Copy Key"
                      >
                        {copiedKeyId === keyObj._id ? (
                          <Check size={15} className="text-green-500" />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(keyObj._id)}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.1)",
                          color: "#ef4444",
                        }}
                        title="Delete Key"
                      >
                        {isDeleting ? (
                          <Loader2 className="animate-spin" size={15} />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;
