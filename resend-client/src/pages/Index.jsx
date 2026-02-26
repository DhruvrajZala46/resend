import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    cardForeground,
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
    cardForeground,
    border,
  };

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
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description:
        "Send emails in milliseconds with our optimized infrastructure. No delays, no queues.",
    },
    {
      icon: <Shield size={32} />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected.",
    },
    {
      icon: <Code size={32} />,
      title: "Developer Friendly",
      description:
        "Simple REST API with comprehensive docs. Integrate in minutes with any language.",
    },
    {
      icon: <Globe size={32} />,
      title: "Global Delivery",
      description:
        "Worldwide email delivery with smart routing for optimal performance in every region.",
    },
    {
      icon: <Clock size={32} />,
      title: "Email Status Tracking",
      description:
        "Monitor delivery status, open rates, and engagement metrics in fast.",
    },
    {
      icon: <Users size={32} />,
      title: "24/7 Support",
      description:
        "Our expert team is always available to help you succeed with your email needs.",
    },
  ];

  const useCases = [
    {
      title: "Password Resets",
      description: "Send secure password reset emails instantly",
      icon: <Key size={24} />,
    },
    {
      title: "Notifications",
      description: "Alert users about important account activities",
      icon: <Mail size={24} />,
    },
    {
      title: "Confirmations",
      description: "Order confirmations, booking receipts, and more",
      icon: <CheckCircle size={24} />,
    },
    {
      title: "Invoices",
      description: "Automated billing and invoice delivery",
      icon: <FileText size={24} />,
    },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
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

      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl p-2 md:py-15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col">
              <div
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 self-start"
                style={{
                  backgroundColor: secondary.color,
                  color: secondaryForeground.color,
                }}
              >
                <Zap size={16} />
                <span>Simple. Fast. Reliable.</span>
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ color: foreground.color }}
              >
                <TextType
                  text={["AnyKind of Email", "Delivered Effortlessly"]}
                  typingSpeed={75}
                  pauseDuration={1000}
                />
              </h1>

              <p
                className="text-base md:text-lg lg:text-xl mb-8 leading-relaxed"
                style={{ color: mutedForeground.color }}
              >
                Send emails with a single API call. No SMTP configuration, no
                hassle. Start sending in minutes, not days.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg transition-all duration-200 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  style={{
                    backgroundColor: primary.color,
                    color: primaryForeground.color,
                  }}
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={20} />
                </Link>

                <Link
                  to="/docs"
                  className="inline-flex items-center justify-center gap-2 border-2 px-7 py-3 rounded-lg transition-all duration-200 text-base md:text-lg font-semibold hover:scale-105"
                  style={{
                    borderColor: border.color,
                    color: foreground.color,
                  }}
                >
                  <span>View Documentations</span>
                  <FileText size={20} />
                </Link>
              </div>

              <div
                className="flex flex-wrap items-center gap-4 md:gap-6 text-sm"
                style={{ color: mutedForeground.color }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} style={{ color: primary.color }} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} style={{ color: primary.color }} />
                  <span>Free plan available</span>
                </div>
              </div>
            </div>

            <div className="relative w-full">
              <div
                className="rounded-lg shadow-2xl p-6 text-sm w-full"
                style={{
                  backgroundColor: card.color,
                  color: primary.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  <button
                    onClick={() => setShowTester(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: primary.color,
                      color: primaryForeground.color,
                    }}
                  >
                    <Terminal size={12} />
                    Test Your API
                  </button>
                </div>

                <pre className="overflow-x-auto text-xs md:text-sm">
                  <code>{`curl -X POST \\
  https://smtp-service-server.vercel.app/api/email/send \\
  -H 'x-api-key: YOUR_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "to": "user@example.com",
    "subject": "Welcome!",
    "html": "<h1>Hello</h1>"
  }'

// Response
{
  "success": true,
  "messageId": "abc123xyz"
}`}</code>
                </pre>
              </div>

              {/* <div
                className="absolute -bottom-4 -right-0 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
                style={{
                  backgroundColor: primary.color,
                  color: primaryForeground.color,
                }}
              >
                ✓ Email sent successfully
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl p-2">
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: foreground.color }}
            >
              Everything You Need
            </h2>
            <p
              className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto"
              style={{ color: mutedForeground.color }}
            >
              Powerful features designed for developers who want to focus on
              building, not managing email infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{
                  backgroundColor: card.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: secondary.color,
                      color: secondaryForeground.color,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-lg md:text-xl font-bold"
                    style={{ color: foreground.color }}
                  >
                    {feature.title}
                  </h3>
                </div>
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: mutedForeground.color }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto max-w-7xl p-2">
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: foreground.color }}
            >
              Perfect For Every Use Case
            </h2>
            <p
              className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto"
              style={{ color: mutedForeground.color }}
            >
              From startups to enterprises, SMTP-LITE handles all your
              transactional email needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="p-6 rounded-xl transition-shadow duration-200 hover:shadow-md flex flex-col border"
                style={{
                  backgroundColor: card.color,
                  borderColor: border.color,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: secondary.color,
                      color: secondaryForeground.color,
                    }}
                  >
                    {useCase.icon}
                  </div>
                  <h3
                    className="text-base md:text-lg font-bold"
                    style={{ color: foreground.color }}
                  >
                    {useCase.title}
                  </h3>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: mutedForeground.color }}
                >
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
