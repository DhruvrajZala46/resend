import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Zap,
  Shield,
  Code,
  CheckCircle,
  ArrowRight,
  Key,
  FileText,
  Clock,
  Globe,
  Users,
  Terminal,
} from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";
import TextType from "../components/TextType/TextType";
import TerminalEmailTester from "../components/TerminalEmailTester";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const Index = () => {
  const [stats, setStats] = useState({
    emailsSent: 0,
    activeUsers: 0,
    uptime: 0,
  });

  const [showTester, setShowTester] = useState(false);

  const {
    theme,
    background,
    foreground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted,
    mutedForeground,
    card,
    border,
  } = useThemeStyles();

  const themeColors = {
    background,
    foreground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted,
    mutedForeground,
    card,
    border,
  };

  const API_URL = import.meta.env.VITE_SMTP_SERVER_API_BASE_URL || "api.resend.dev";

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      emailsSent: 1250000,
      activeUsers: 5420,
      uptime: 99.9,
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setStats({
        emailsSent: Math.floor(targets.emailsSent * progress),
        activeUsers: Math.floor(targets.activeUsers * progress),
        uptime: (targets.uptime * progress).toFixed(1),
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description:
        "Send emails in milliseconds with our optimized infrastructure. No delays, no queues.",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected.",
    },
    {
      icon: <Code size={24} />,
      title: "Developer Friendly",
      description:
        "Simple REST API with comprehensive docs. Integrate in minutes with any language.",
    },
    {
      icon: <Globe size={24} />,
      title: "Global Delivery",
      description:
        "Worldwide email delivery with smart routing for optimal performance in every region.",
    },
    {
      icon: <Clock size={24} />,
      title: "Real-time Tracking",
      description:
        "Monitor delivery status, open rates, and engagement metrics instantaneously.",
    },
    {
      icon: <Users size={24} />,
      title: "24/7 Priority Support",
      description:
        "Our expert team is always available to help you succeed with your email capabilities.",
    },
  ];

  const useCases = [
    {
      title: "Password Resets",
      description: "Send secure password reset emails instantly with guaranteed delivery.",
      icon: <Key size={20} />,
    },
    {
      title: "Notifications",
      description: "Alert users about important account activities the second they happen.",
      icon: <Mail size={20} />,
    },
    {
      title: "Transactions",
      description: "Order confirmations, secure booking receipts, and verified records.",
      icon: <CheckCircle size={20} />,
    },
    {
      title: "Invoices",
      description: "Automated billing and compliant invoice delivery directly to inboxes.",
      icon: <FileText size={20} />,
    },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      {showTester && (
        <TerminalEmailTester
          onClose={() => setShowTester(false)}
          themeColors={themeColors}
        />
      )}

      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div 
          className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full mix-blend-screen blur-[120px]"
          style={{ backgroundColor: primary.color, opacity: 0.15 }}
        />
        <div 
          className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full mix-blend-screen blur-[100px]"
          style={{ backgroundColor: secondary.color, opacity: 0.2 }}
        />
      </div>

      <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 px-4 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              className="flex flex-col"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className="self-start mb-8">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm border"
                  style={{
                    backgroundColor: card.color,
                    color: foreground.color,
                    borderColor: border.color,
                  }}
                >
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  v2.0 Beta API Now Live
                </div>
              </motion.div>

              <motion.h1 
                variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
              >
                <span style={{ color: foreground.color }}>The email API for</span><br/>
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{ backgroundImage: `linear-gradient(to right, ${primary.color}, ${primaryForeground.color})` }}
                >
                  <TextType
                    text={["Modern Teams", "Fast Startups", "Global Brands"]}
                    typingSpeed={60}
                    pauseDuration={1500}
                  />
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeUp}
                className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-medium"
                style={{ color: mutedForeground.color }}
              >
                Reach your users reliably with an elegant API suite built for scale. No complex SMTP overhead—just powerful developer tools.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center mb-10">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                  style={{
                    backgroundColor: primary.color,
                    color: primaryForeground.color,
                    boxShadow: `0 8px 30px ${primary.color}30`
                  }}
                >
                  <span>Start Building Free</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/docs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold border-2 hover:-translate-y-0.5 transition-all duration-300 bg-transparent active:scale-95"
                  style={{
                    borderColor: border.color,
                    color: foreground.color,
                  }}
                >
                  <FileText size={18} />
                  <span>Read the Docs</span>
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2" style={{ color: mutedForeground.color }}>
                  <CheckCircle size={16} /> No credit card required
                </div>
                <div className="flex items-center gap-2" style={{ color: mutedForeground.color }}>
                  <CheckCircle size={16} /> Up to 3,000 emails/mo free
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Right Content - Terminal Faux Windows */}
            <motion.div 
              className="relative w-full"
              initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1000px" }}
            >
              {/* Aesthetic glow behind the terminal */}
              <div 
                className="absolute inset-x-10 inset-y-10 blur-2xl opacity-30 rounded-[3rem]"
                style={{ backgroundColor: primary.color }}
              />

              <div
                className="relative rounded-2xl shadow-2xl overflow-hidden border backdrop-blur-xl"
                style={{
                  backgroundColor: `${card.color}E6`, // 90% opacity
                  borderColor: border.color,
                }}
              >
                {/* Mac OS Window Controls */}
                <div 
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: border.color, backgroundColor: `${background.color}80` }}
                >
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-sm" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-sm" />
                  </div>
                  <div className="text-xs font-mono font-medium tracking-wider" style={{ color: mutedForeground.color }}>
                    terminal — bash
                  </div>
                  <button
                    onClick={() => setShowTester(true)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: primary.color, color: primaryForeground.color }}
                  >
                    <Terminal size={12} />
                    Run Test
                  </button>
                </div>

                <div className="p-6 overflow-x-auto text-sm font-mono leading-relaxed" style={{ color: foreground.color }}>
                  <div className="flex opacity-50 mb-4 select-none">
                    <span className="mr-2">$</span>
                    <span className="typing-effect">curl -X POST {API_URL}/send \</span>
                  </div>
                  <pre className="text-sm font-medium">
                    <code className="text-[#3b82f6]">-H</code> <code className="text-[#10b981]">'Authorization: Bearer RESEND_API_KEY'</code> <code className="text-[#fbbf24]">\</code><br/>
                    <code className="text-[#3b82f6]">-H</code> <code className="text-[#10b981]">'Content-Type: application/json'</code> <code className="text-[#fbbf24]">\</code><br/>
                    <code className="text-[#3b82f6]">-d</code> <code className="text-[#10b981]">'&#123;'</code><br/>
                    <code className="text-[#a855f7]">  "from": "onboarding@resend.dev",</code><br/>
                    <code className="text-[#a855f7]">  "to": "user@gmail.com",</code><br/>
                    <code className="text-[#a855f7]">  "subject": "Hello World",</code><br/>
                    <code className="text-[#a855f7]">  "html": "&lt;p&gt;Congrats on sending your first email!&lt;/p&gt;"</code><br/>
                    <code className="text-[#10b981]">'&#125;'</code>
                  </pre>
                  
                  <div className="mt-6 pt-6 border-t border-dashed" style={{ borderColor: border.color }}>
                    <div className="text-xs text-opacity-50 uppercase tracking-widest mb-2" style={{ color: mutedForeground.color }}>Response</div>
                    <pre className="text-sm font-medium text-[#10b981]">
                      {`{
  "id": "4b0d22c1-d4a8-4448-8df5",
  "success": true
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Segment */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight" style={{ color: foreground.color }}>
              Engineered for absolute performance.
            </h2>
            <p className="text-base md:text-lg lg:text-xl font-medium" style={{ color: mutedForeground.color }}>
              We've obsessed over every millisecond and API endpoint to build the most sophisticated email delivery platform on earth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-6 md:p-8 rounded-[1.5rem] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  backgroundColor: card.color,
                  border: `1px solid ${border.color}`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.015)`
                }}
              >
                {/* Premium Hover Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                  style={{ 
                    background: `radial-gradient(circle at 50% 0%, ${primary.color}10 0%, transparent 70%)`,
                    boxShadow: `inset 0 1px 0 0 ${primary.color}30` 
                  }}
                />
                
                <div className="relative flex flex-col gap-4 z-10">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm border"
                    style={{
                      backgroundColor: background.color, 
                      color: primary.color,
                      borderColor: border.color
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: foreground.color }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base font-medium leading-relaxed" style={{ color: mutedForeground.color }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Grid Segment */}
      <section className="py-16 md:py-24 relative z-10 border-t" style={{ backgroundColor: `${secondary.color}20`, borderColor: border.color }}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col text-center lg:text-left lg:flex-row justify-between items-center lg:items-end mb-12 md:mb-16 gap-6 md:gap-8"
          >
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight" style={{ color: foreground.color }}>
                One platform. Endless possibilities.
              </h2>
              <p className="text-base md:text-lg font-medium" style={{ color: mutedForeground.color }}>
                Designed meticulously for developers to orchestrate critical product funnels.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 md:p-8 rounded-[1.5rem] transition-all duration-300 hover:shadow-xl group backdrop-blur-sm"
                style={{
                  backgroundColor: `${card.color}E6`,
                  border: `1px solid ${border.color}`,
                }}
              >
                <div className="flex flex-col gap-4 md:gap-5">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-transparent border-2 border-dashed transition-all duration-500 group-hover:bg-foreground group-hover:border-solid group-hover:border-transparent group-hover:text-background"
                    style={{
                      borderColor: border.color,
                      color: foreground.color,
                    }}
                  >
                    {useCase.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-bold" style={{ color: foreground.color }}>
                    {useCase.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed opacity-80" style={{ color: mutedForeground.color }}>
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
