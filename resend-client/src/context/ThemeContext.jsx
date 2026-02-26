import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [themeMode, setThemeMode] = useState("system");
  const [theme, setTheme] = useState("light");

  // Load theme from storage after mount
  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode") || "system";
    setThemeMode(storedMode);

    // Determine actual theme
    const actualTheme = storedMode === "system" ? getSystemTheme() : storedMode;
    setTheme(actualTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(actualTheme);
  }, []);

  // Apply theme whenever themeMode changes
  useEffect(() => {
    if (!themeMode) return;
    const newTheme = themeMode === "system" ? getSystemTheme() : themeMode;
    setTheme(newTheme);
    localStorage.setItem("themeMode", themeMode);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  }, [themeMode]);

  // Listen for system theme change (works on mobile too)
  useEffect(() => {
    if (themeMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    };

    // Add event listener for theme changes
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
        setThemeMode,
        isSearchOpen,
        setIsSearchOpen,
        copiedCode,
        setCopiedCode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
