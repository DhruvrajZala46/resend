import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  KeyRound,
  Sun,
  Moon,
  User,
  Search,
  Check,
} from "lucide-react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { PiDevicesLight } from "react-icons/pi";
import { TbLockAccess } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import logo from "../../public/logo.png";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const { themeMode, setThemeMode, setIsSearchOpen } = useTheme();
  const { theme, ...legacy } = useThemeStyles();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredBounds, setHoveredBounds] = useState(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const navRef = useRef(null);
  const linkRefs = useRef([]);
  const themeMenuRef = useRef(null);

  // Close menu automatically when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll hiding
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isOpen) return;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target)
      ) {
        setIsThemeMenuOpen(false);
      }
    };

    if (isThemeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isThemeMenuOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const publicLinks = [
    {
      name: "Documentations",
      href: "/docs",
      icon: MdOutlineDocumentScanner,
    },
    { name: "Email Template", href: "/email-template", icon: User },
  ];

  const privateLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "API Keys", href: "/apikeys", icon: KeyRound },
    { name: "APP Credentials", href: "/app-credentials", icon: TbLockAccess },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const navLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  // Handle hover with precise positioning
  const handleMouseEnter = (index) => {
    const linkElement = linkRefs.current[index];
    const navElement = navRef.current;

    if (linkElement && navElement) {
      const linkRect = linkElement.getBoundingClientRect();
      const navRect = navElement.getBoundingClientRect();

      setHoveredBounds({
        left: linkRect.left - navRect.left,
        top: linkRect.top - navRect.top,
        width: linkRect.width,
        height: linkRect.height,
      });
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setHoveredBounds(null);
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: PiDevicesLight },
  ];

  const getCurrentThemeIcon = () => {
    const option = themeOptions.find((opt) => opt.value === themeMode);
    return option ? option.icon : Sun;
  };

  const ThemeIcon = getCurrentThemeIcon();

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: legacy.background.color,
        color: legacy.foreground.color,
        borderBottom: `1px solid ${legacy.border.color}`,
      }}
    >
      <div className="max-w-8xl mx-auto px-3">
        <div
          className="flex justify-between items-center h-16"
          style={{ color: legacy.foreground.color }}
        >
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="MailFlow Logo"
              className="w-8 h-8 object-contain"
            />
            <span
              className="text-xl font-bold tracking-tight logo-title"
              style={{ color: legacy.primary.color }}
            >
              RESEND
            </span>
          </Link>

          {/* Desktop Nav with smooth sliding background */}
          <div
            ref={navRef}
            className="hidden md:flex relative items-center gap-1"
          >
            {/* Animated Background - Positioned absolutely based on hovered element */}
            <AnimatePresence>
              {hoveredIndex !== null && hoveredBounds && (
                <motion.div
                  key="hover-bg"
                  className="absolute rounded-xs border-1 pointer-events-none"
                  style={{
                    backgroundColor: "#6f6f6fff",
                    opacity: 0.12,
                  }}
                  initial={{
                    left: hoveredBounds.left,
                    top: hoveredBounds.top,
                    width: hoveredBounds.width,
                    height: hoveredBounds.height,
                  }}
                  animate={{
                    left: hoveredBounds.left,
                    top: hoveredBounds.top,
                    width: hoveredBounds.width,
                    height: hoveredBounds.height,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.5,
                  }}
                />
              )}
            </AnimatePresence>

            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  ref={(el) => (linkRefs.current[i] = el)}
                  to={link.href}
                  className="relative z-10 px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg"
                  style={{
                    color: isActive
                      ? legacy.primary.color
                      : legacy.foreground.color,
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={handleMouseLeave}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: legacy.secondary.color,
                  color: legacy.secondaryForeground.color,
                }}
                aria-label="Toggle Theme"
              >
                <ThemeIcon size={22} />
              </button>

              {/* Theme Dropdown Menu */}
              <AnimatePresence>
                {isThemeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg overflow-hidden"
                    style={{
                      backgroundColor: legacy.background.color,
                      border: `1px solid ${legacy.border.color}`,
                    }}
                  >
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = themeMode === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            setThemeMode(option.value);
                            setIsThemeMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-200"
                          style={{
                            color: legacy.foreground.color,
                            backgroundColor: isSelected
                              ? legacy.secondary.color
                              : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor =
                                legacy.secondary.color;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            <span>{option.label}</span>
                          </div>
                          {isSelected && (
                            <Check
                              size={16}
                              style={{ color: legacy.primary.color }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Button Desktop */}
            {location.pathname === "/documentations" && (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: legacy.secondary.color,
                  color: legacy.secondaryForeground.color,
                  border: `1px solid ${legacy.border.color}`,
                }}
              >
                <Search size={16} />
                <span className="text-sm">Search</span>
                <kbd
                  className="px-2 py-1 rounded text-xs"
                  style={{
                    backgroundColor: legacy.muted.color,
                    color: legacy.mutedForeground.color,
                  }}
                >
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Desktop Auth */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300"
                    style={{
                      color: legacy.foreground.color,
                      border: `1px solid ${legacy.border.color}`,
                    }}
                  >
                    <LogIn size={16} />
                    <span className="text-sm">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: legacy.primary.color,
                      color: legacy.primaryForeground.color,
                    }}
                  >
                    <UserPlus size={16} />
                    <span className="text-sm">Register</span>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
                style={{ color: legacy.foreground.color }}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed inset-0 z-40 overflow-y-auto"
            style={{
              backgroundColor: `${legacy.background.color}E6`, // 90% opacity for glass effect
              color: legacy.foreground.color,
            }}
          >
            <div className="px-3 pb-3 min-h-screen flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center h-16 mb-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <img
                      src={logo}
                      alt="MailFlow Logo"
                      className="w-8 h-8 object-contain"
                    />
                    <span
                      className="text-xl font-bold tracking-tight logo-title"
                      style={{ color: legacy.primary.color }}
                    >
                      RESEND
                    </span>
                  </Link>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  onClick={toggleMenu}
                  style={{ color: legacy.foreground.color }}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Links */}
              <div className="flex-1 space-y-0.5 mt-2">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 px-3 py-1.5 rounded-lg transition-all duration-300"
                        style={{
                          color: legacy.foreground.color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = legacy.secondary.color;
                          e.currentTarget.style.color = legacy.primary.color;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = legacy.foreground.color;
                        }}
                      >
                        <Icon size={20} className="opacity-80" />
                        <span className="text-base font-medium tracking-wide">{link.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Auth */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-2 pt-2 space-y-2"
                style={{ borderTop: `1px solid ${legacy.border.color}` }}
              >
                {user ? (
                  <>
                    <div
                      className="px-3 py-1.5 font-medium text-sm opacity-80"
                      style={{ color: legacy.foreground.color }}
                    >
                      Hi, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex justify-center items-center space-x-2 px-3 py-2.5 rounded-lg shadow-sm transition-transform active:scale-95"
                      style={{
                        backgroundColor: legacy.primary.color,
                        color: legacy.primaryForeground.color,
                      }}
                    >
                      <LogOut size={18} />
                      <span className="text-base font-semibold">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center space-x-2 px-3 py-2 rounded-lg transition-all active:scale-95"
                      style={{
                        color: legacy.foreground.color,
                        border: `1px solid ${legacy.border.color}`,
                        backgroundColor: legacy.background.color,
                      }}
                    >
                      <LogIn size={18} />
                      <span className="text-base font-semibold">Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center space-x-2 px-3 py-2 rounded-lg shadow-sm transition-all active:scale-95"
                      style={{
                        backgroundColor: legacy.primary.color,
                        color: legacy.primaryForeground.color,
                      }}
                    >
                      <UserPlus size={18} />
                      <span className="text-base font-semibold">Register</span>
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
