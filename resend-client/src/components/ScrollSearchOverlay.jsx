import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";
import { useTheme } from "../context/ThemeContext";

const MobileScrollSearchBar = () => {
  const { theme, ...legacy } = useThemeStyles();
  const { setIsSearchOpen } = useTheme();
  const [showBar, setShowBar] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll logic — show on scroll down, hide immediately on scroll up
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Scrolling down
      if (currentY > lastScrollY && currentY > 120) {
        setShowBar(true);
      }
      // Scrolling up → hide immediately
      else if (currentY < lastScrollY) {
        setShowBar(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 md:hidden"
          style={{
            backgroundColor: legacy.card.color,
            borderBottom: `1px solid ${legacy.border.color}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <div className="p-2">
            <div className="relative flex items-center">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: legacy.mutedForeground.color }}
              />
              <input
                type="text"
                placeholder="Search documentation..."
                onClick={() => setIsSearchOpen(true)}
                className="w-full pl-12 pr-4 py-2 text-base rounded-md outline-none transition-all"
                style={{
                  backgroundColor: legacy.background.color,
                  color: legacy.foreground.color,
                  border: `1px solid ${legacy.border.color}`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileScrollSearchBar;
