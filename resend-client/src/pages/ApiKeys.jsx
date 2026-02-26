import React, { useState } from "react";
import { useApiKeys } from "../context/ApiKeyContext";
import { motion } from "framer-motion";
import {
  Copy,
  Trash2,
  KeyRound,
  Loader2,
  Check,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
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
    input,
    hover,
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
          <KeyRound size={28} />
          Manage API Keys
        </h1>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-3 p-4 rounded-lg"
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              borderLeft: "4px solid #ef4444",
              color: "#b91c1c",
            }}
          >
            <AlertTriangle size={20} className="mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-start gap-3 p-4 rounded-lg"
            style={{
              backgroundColor: "rgba(34,197,94,0.1)",
              borderLeft: "4px solid #16a34a",
              color: "#166534",
            }}
          >
            <Check size={20} className="mt-0.5" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-sm">{success}</p>
            </div>
          </motion.div>
        )}

        {/* Create New Key */}
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Enter API Key Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg focus:outline-none transition-colors duration-200"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${input.color}`,
              color: foreground.color,
            }}
          />
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
          >
            {creating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Create"
            )}
          </button>
        </form>

        {/* API Keys List */}
        {loading ? (
          <div
            className="text-center font-medium"
            style={{ color: muted.color }}
          >
            Loading keys...
          </div>
        ) : apiKeys.length === 0 ? (
          <div
            className="text-center font-medium"
            style={{ color: muted.color }}
          >
            No API keys created yet.
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          >
            {apiKeys.map((keyObj) => {
              const isToggling = togglingIds.includes(keyObj._id);
              const isDeleting = deletingIds.includes(keyObj._id);

              return (
                <motion.div
                  key={keyObj._id}
                  layout
                  className="p-4 rounded-xl shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: card.color,
                    color: foreground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold">{keyObj.name}</h2>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: keyObj.active
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",
                        color: keyObj.active ? "#16a34a" : "#ef4444",
                      }}
                    >
                      {keyObj.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div
                    className="font-mono text-sm p-2 rounded break-all"
                    style={{
                      backgroundColor: muted.color,
                      border: `1px solid ${border.color}`,
                    }}
                  >
                    {keyObj.key.length > 20
                      ? `${keyObj.key.slice(0, 20)}...`
                      : keyObj.key}
                  </div>

                  <div className="flex justify-end gap-3 mt-3">
                    {/* Toggle */}
                    <motion.button
                      onClick={() => handleToggle(keyObj._id)}
                      disabled={isToggling}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition"
                      whileTap={{ scale: 0.9 }}
                      style={{
                        backgroundColor: keyObj.active
                          ? "rgba(34,197,94,1)"
                          : "rgba(156,163,175,0.5)",
                        color: keyObj.active ? "#fff" : "#111",
                      }}
                    >
                      {isToggling ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : keyObj.active ? (
                        <>
                          <ToggleRight size={16} /> Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={16} /> Activate
                        </>
                      )}
                    </motion.button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(keyObj._id, keyObj.key)}
                      className="transition"
                      style={{ color: primary.color }}
                    >
                      {copiedKeyId === keyObj._id ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(keyObj._id)}
                      disabled={isDeleting}
                      className="transition"
                      style={{ color: "#ef4444" }}
                    >
                      {isDeleting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Trash2 size={18} />
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
  );
};

export default ApiKeys;
