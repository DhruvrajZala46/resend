import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  CheckCircle,
  Code,
  Key,
  Mail,
  Lock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThemeStyles } from "../utils/useThemeStyles";

gsap.registerPlugin(ScrollTrigger);

const QuickStart = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const {
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
    hover,
  } = useThemeStyles();

  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Steps animation on scroll
      cardsRef.current.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const steps = [
    {
      number: "01",
      title: "Set Up App Credentials",
      description: "Configure your Google SMTP credentials to send emails",
      icon: <Lock size={24} />,
      action: "Go to App Credentials",
      link: "/app-credentials",
      details: [
        "Enable 2-Step Verification in Google",
        "Generate an App Password",
        "Add credentials securely (AES-256 encrypted)",
      ],
      code: null,
    },
    {
      number: "02",
      title: "Generate Your API Key",
      description: "Create an API key to authenticate your requests",
      icon: <Key size={24} />,
      action: "Get API Key",
      link: "/apikeys",
      details: [
        "Navigate to API Keys Management",
        "Click 'Create New API Key'",
        "Copy and store it securely",
      ],
      code: null,
    },
    {
      number: "03",
      title: "Send Your First Email",
      description: "Make a POST request to send an email",
      icon: <Mail size={24} />,
      action: "View Full Docs",
      link: "/docs#overview",
      details: [
        "Include x-api-key header",
        "Provide to, subject, and html fields",
        "Receive email ID in response",
      ],
      code: `curl -X POST https://smtp-service-server.vercel.app/api/email/send \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: YOUR_API_KEY_HERE' \\
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello World",
    "html": "<h1>My first email!</h1>"
  }'`,
    },
    {
      number: "04",
      title: "Track Email Status",
      description: "Connect to event stream endpoint to check email status",
      icon: <Zap size={24} />,
      action: "Learn More",
      link: "/docs#sse-events",
      details: [
        "Use the email ID from step 3",
        "Connect to event route and listen the update",
        "Status: pending → sending → sent/failed",
      ],
      code: `// just connect to this event stream to see live email status
const checkStatus = async (emailId) => {
  const res = await fetch(
    \`https://smtp-service-server.vercel.app/api/email/event/\${response._id}\`
  );
  return await res.json();
};`,
    },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: background.color, color: foreground.color }}
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="container mx-auto px-2 py-10 text-center"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            backgroundColor: secondary.color,
            color: secondaryForeground.color,
          }}
        >
          <Zap size={16} style={{ color: primary.color }} />
          <span className="text-sm font-medium">Quick Start Guide</span>
        </div>

        <h1
          className="text-5xl md:text-6xl font-bold mb-6"
          style={{ color: foreground.color }}
        >
          Get Started in{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${primary.color}, #6366f1)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            4 Simple Steps
          </span>
        </h1>

        <p
          className="text-xl max-w-2xl mx-auto mb-8"
          style={{ color: mutedForeground.color }}
        >
          Send your first email with SMTP-LITE in under 5 minutes. No complex
          setup required.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/docs")}
            className="px-6 py-3 rounded-lg font-semibold border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: border.color,
              color: foreground.color,
              backgroundColor: "transparent",
            }}
          >
            <Code size={18} className="inline mr-2" />
            Full docs
          </button>
        </div>
      </section>

      {/* Steps Section */}
      <section
        id="steps"
        ref={stepsRef}
        className="container mx-auto px-4 py-16"
      >
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="rounded-xl shadow-lg p-8 border transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: card.color,
                borderColor: border.color,
              }}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Step Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: secondary.color,
                        color: primary.color,
                      }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <div
                        className="text-sm font-mono mb-2"
                        style={{ color: mutedForeground.color }}
                      >
                        {step.number}
                      </div>
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ color: foreground.color }}
                      >
                        {step.title}
                      </h3>
                      <p style={{ color: mutedForeground.color }}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <ul className="space-y-2 mb-6 ml-20">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle
                          size={18}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: "#16a34a" }}
                        />
                        <span style={{ color: mutedForeground.color }}>
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(step.link)}
                    className="ml-20 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: primary.color,
                      color: primaryForeground.color,
                    }}
                  >
                    {step.action}
                    <ExternalLink size={16} />
                  </button>
                </div>

                {/* Right: Code Block */}
                {step.code && (
                  <div className="flex-1">
                    <div className="relative">
                      <button
                        onClick={() => copyToClipboard(step.code, index)}
                        className="absolute top-3 right-3 p-2 rounded-md transition-colors duration-300 z-10"
                        style={{
                          backgroundColor: muted.color,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            hover.background;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = muted.color;
                        }}
                      >
                        {copiedCode === index ? (
                          <Check size={16} style={{ color: "#16a34a" }} />
                        ) : (
                          <Copy size={16} style={{ color: primary.color }} />
                        )}
                      </button>
                      <pre
                        className="p-4 rounded-lg overflow-x-auto text-sm font-mono"
                        style={{
                          backgroundColor: muted.color,
                          color: mutedForeground.color,
                        }}
                      >
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuickStart;
