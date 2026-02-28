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
              className="w-10 h-10 object-contain"
            />
            <span
              className="text-2xl font-bold tracking-tight logo-title"
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
                  className="relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg"
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
                className="p-2 rounded-full transition-all duration-300"
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
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: legacy.secondary.color,
                  color: legacy.secondaryForeground.color,
                  border: `1px solid ${legacy.border.color}`,
                }}
              >
                <Search size={18} />
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
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300"
                    style={{
                      color: legacy.foreground.color,
                      border: `1px solid ${legacy.border.color}`,
                    }}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: legacy.primary.color,
                      color: legacy.primaryForeground.color,
                    }}
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden mt-2">
              <button
                onClick={toggleMenu}
                className="focus:outline-none"
                style={{ color: legacy.foreground.color }}
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-0 left-0 h-full w-full z-40 overflow-y-auto"
            style={{
              backgroundColor: legacy.background.color,
              color: legacy.foreground.color,
              borderRight: `1px solid ${legacy.border.color}`,
            }}
          >
            <div className="px-4 pt-4 pb-4 space-y-2">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
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
                    className="text-2xl font-bold"
                    style={{ color: legacy.primary.color }}
                  >
                    SMTP-LITE
                  </span>
                </Link>
                <button
                  onClick={toggleMenu}
                  style={{ color: legacy.foreground.color }}
                >
                  <X size={26} />
                </button>
              </div>

              {/* Theme Toggle in Mobile */}
              {/* <div
                className="pb-4 mb-2 border-b"
                style={{ borderColor: legacy.border.color }}
              >
                <div
                  className="text-xs font-medium mb-2 px-3"
                  style={{ color: legacy.mutedForeground.color }}
                >
                  Theme
                </div>
                <div className="space-y-1">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = themeMode === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setThemeMode(option.value);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200"
                        style={{
                          color: legacy.foreground.color,
                          backgroundColor: isSelected
                            ? legacy.secondary.color
                            : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {isSelected && (
                          <Check
                            size={18}
                            style={{ color: legacy.primary.color }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div> */}

              {/* Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200"
                    style={{
                      color: legacy.foreground.color,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = legacy.primary.color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = legacy.foreground.color)
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}

              {/* Auth */}
              <div
                className="pt-4 border-t space-y-2"
                style={{ borderColor: legacy.border.color }}
              >
                {user ? (
                  <>
                    <div
                      className="px-3 py-2 font-medium"
                      style={{ color: legacy.foreground.color }}
                    >
                      Hi, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: legacy.primary.color,
                        color: legacy.primaryForeground.color,
                      }}
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                      style={{
                        color: legacy.foreground.color,
                        border: `1px solid ${legacy.border.color}`,
                      }}
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: legacy.primary.color,
                        color: legacy.primaryForeground.color,
                      }}
                    >
                      <UserPlus size={18} />
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
