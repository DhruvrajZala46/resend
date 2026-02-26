import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { useThemeStyles } from "../utils/useThemeStyles";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();
  const {
    background,
    foreground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    mutedForeground,
    border,
    hover,
    theme,
  } = useThemeStyles();

  const containerRef = useRef(null);
  const numberRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);
  const glitchRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set([numberRef.current, textRef.current, buttonsRef.current], {
        opacity: 0,
        y: 30,
      });

      // Animation timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate 404 number with glitch effect
      tl.to(numberRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
        .to(
          glitchRef.current,
          {
            x: -5,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            ease: "power1.inOut",
          },
          "-=0.3"
        )
        .to(
          textRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.3"
        );

      // Floating animation for 404
      gsap.to(numberRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center px-4 my-5 overflow-hidden relative transition-colors duration-300"
      style={{ backgroundColor: background.color }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(168, 85, 247, 0.1)"
                : "rgba(168, 85, 247, 0.05)",
          }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(59, 130, 246, 0.1)"
                : "rgba(59, 130, 246, 0.05)",
            animationDelay: "1s",
          }}
        ></div>
      </div>

      <div className="text-center relative z-10">
        {/* 404 Number with glitch effect */}
        <div ref={numberRef} className="relative mb-8">
          <h1
            ref={glitchRef}
            className="text-9xl md:text-[12rem] font-bold leading-none"
            style={{
              background: `linear-gradient(135deg, ${primary.color}, ${foreground.color})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>
          {/* Glitch layer */}
          <h1
            className="absolute top-0 left-0 text-9xl md:text-[12rem] font-bold leading-none -z-10 blur-sm opacity-20"
            style={{ color: primary.color }}
          >
            404
          </h1>
        </div>

        {/* Text content */}
        <div ref={textRef} className="mb-12 space-y-4">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: foreground.color }}
          >
            Page Not Found
          </h2>
          <p
            className="text-lg md:text-xl max-w-md mx-auto"
            style={{ color: mutedForeground.color }}
          >
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>
        </div>

        {/* Action buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 border"
            style={{
              backgroundColor: secondary.color,
              color: secondaryForeground.color,
              borderColor: border.color,
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: hover.secondary,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Go Back
          </motion.button>

          <motion.button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: hover.primary,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Home
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            Home Page
          </motion.button>
        </div>

        {/* Decorative bouncing dots */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: primary.color,
                animationDelay: `${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
