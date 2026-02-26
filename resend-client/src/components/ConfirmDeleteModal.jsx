import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";

const ConfirmDeleteModal = ({
  appName,
  onConfirm,
  onCancel,
  isOpen,
  deleting,
}) => {
  const { card, border, foreground, muted, primary, background } =
    useThemeStyles();
  const [confirmationText, setConfirmationText] = useState("");

  // Required exact confirmation phrase
  const confirmationPhrase = `yes i want to delete "${appName}" app credentials`;

  const isConfirmed =
    confirmationText.trim().toLowerCase() === confirmationPhrase.toLowerCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl shadow-xl p-6 relative"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
              color: foreground.color,
            }}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={onCancel}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-neutral-200/20 transition"
              style={{ color: muted.color }}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <AlertTriangle size={48} color="#f59e0b" />
              <h2 className="text-xl font-semibold">Delete App Credentials?</h2>

              <p
                className="text-sm leading-relaxed"
                style={{ color: foreground.color }}
              >
                Please type the following sentence to confirm deletion:
              </p>

              <p className="text-sm font-medium px-3 py-2 rounded-md bg-red-500/10 border border-red-500 text-red-500">
                yes i want to delete{" "}
                <span className="font-semibold text-red-600">"{appName}"</span>{" "}
                app credentials
              </p>

              <input
                type="text"
                placeholder="Type the exact sentence above to confirm"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full mt-2 px-4 py-2 rounded-lg font-medium text-center focus:outline-none"
                style={{
                  border: `1px solid ${border.color}`,
                  backgroundColor: background.color,
                  color: foreground.color, 
                }}
              />

              <div className="flex gap-3 mt-4 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2 rounded-lg font-medium transition"
                  style={{
                    backgroundColor: muted.color,
                    color: foreground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={!isConfirmed || deleting}
                  className="flex-1 py-2 rounded-lg font-medium transition"
                  style={{
                    backgroundColor:
                      isConfirmed && !deleting ? "#ef4444" : "#ef444480",
                    color: "#fff",
                    cursor: isConfirmed ? "pointer" : "not-allowed",
                    opacity: deleting ? 0.7 : 1,
                  }}
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
