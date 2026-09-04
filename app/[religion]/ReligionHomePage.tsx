"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { ReligionTheme } from "../types/Religion";
import React from "react";

interface Props {
  theme: ReligionTheme;
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" },
  }),
};

export default function ReligionHomePage({ theme }: Props) {
  const isCourtMarriage = theme.key === "court-marriage";

  // Fallback values for optional fields
  const benefits = theme.benefits || [
    {
      title: "Valid Proof",
      text: "Gives official legal status to your marriage.",
    },
    {
      title: "Prevents bigamy & fraud",
      text: "Prevents bigamy and fraud by creating an official marriage record.",
    },
    {
      title: "Rights & Security",
      text: "Needed to access many welfare schemes, subsidies, and family pension benefits.",
    },
    {
      title: "Legal Recognition",
      text: "Protects inheritance and spousal rights.",
    },
  ];

  const displayedSteps = theme.steps || [
    {
      num: "01",
      title: "Register & Upload",
      body: "Create your account and upload all required documents through our secure portal.",
    },
    {
      num: "02",
      title: "Expert Review",
      body: "Our legal team verifies every document and flags any issues before submission.",
    },
    {
      num: "03",
      title: "Government Filing",
      body: "We file your application with the correct registrar for your state and religion.",
    },
    {
      num: "04",
      title: "Certificate Delivery",
      body: "Your official marriage certificate is delivered digitally and by post.",
    },
  ];

  const trustReasons = theme.trustReasons || [
    {
      title: "End-to-End Guidance",
      body: "From document preparation to final certificate delivery, we handle every step. You never have to visit a government office or decipher bureaucratic language.",
    },
    {
      title: "Complete Privacy",
      body: "All your documents and personal information are encrypted and handled with the highest standards of confidentiality.",
    },
    {
      title: "Faster Processing",
      body: "Our experience means fewer errors, fewer rejections, and faster turnaround. Most certificates are delivered within 7–15 working days.",
    },
    {
      title: "Dedicated Support",
      body: "A dedicated case manager is assigned to your registration — a real person you can reach by phone or email with any question.",
    },
    {
      title: "All-Religion Coverage",
      body: "We are fluent in the legal nuances of Hindu, Muslim, Christian, Sikh, Buddhist, Jain, and civil marriages. No case is too complex.",
    },
    {
      title: "Legal Recognition",
      body: "Establishes your marriage as legally valid under Indian law and prevents future legal disputes.",
    },
  ];

  const ctaHeading = theme.ctaHeading || "Register today. Protect forever.";
  const ctaSubtext =
    theme.ctaSubtext || "Takes less than 10 minutes. Valid for a lifetime.";
  const footerBrand = theme.footerBrand || "Register my marriage";
  const footerTagline =
    theme.footerTagline || "India's trusted marriage registration platform";

  // Figma design colors
  const figmaColors = {
    bg: "#E4E0D5",
    darkText: "#4A0E19",
    lightBg: "#F0FDFA",
    cardBg: "#F8FEFE",
    white: "#FFFFFF",
    darkBg: "#380913",
  };

  return (
    <div style={{ background: figmaColors.bg, minHeight: "100vh" }}>
      <Navbar religionKey={theme.key} />

      {/* ───────────────── HERO SECTION ───────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "95vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginTop: "-1px",
        }}
      >
        {/* IMAGE LAYER */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${theme.bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />

        {/* HERO CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 650,
            padding: "0 2rem",
            marginLeft: "58%",
            transform: "translateY(-12svh)",
            textAlign: "left",
          }}
          className="hero-content"
        >
          <motion.h1
            key={theme.heroHeading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 700,
              color: figmaColors.darkText,
              lineHeight: 1.2,
              marginBottom: "1.3rem",
              fontFamily: "'Playfair Display', Georgia, serif",
              textShadow: "0 2px 8px rgba(255,255,255,0.3)",
              maxWidth: "620px",
            }}
          >
            {theme.heroHeading.split(" ").map((word, index) => (
              <React.Fragment key={index}>
                {index > 0 && " "}
                <span style={{ whiteSpace: "nowrap" }}>{word}</span>
              </React.Fragment>
            ))}
          </motion.h1>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
            className="hero-buttons"
          >
            <Link href={`/register`} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  background: figmaColors.darkText,
                  color: figmaColors.white,
                  fontWeight: 700,
                  fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(74,14,25,0.25)",
                  border: `1px solid ${figmaColors.darkText}`,
                  transition: "all 0.25s ease",
                }}
              >
                Start Registration →
              </motion.div>
            </Link>

            <Link href={`/contact`} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  border: `1.5px solid ${figmaColors.darkText}`,
                  background: figmaColors.white,
                  color: figmaColors.darkText,
                  fontWeight: 500,
                  fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(74,14,25,0.1)",
                  transition: "all 0.25s ease",
                }}
              >
                Talk to an Expert
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT / DESCRIPTION ── */}
      <section
        style={{
          padding: "clamp(2rem, 5vw, 5rem) 1.5rem",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(2rem, 4vw, 4rem)",
            alignItems: "center",
          }}
          className="about-grid"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              style={{
                fontSize: "clamp(0.65rem, 1vw, 0.72rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: figmaColors.darkText,
                fontWeight: 700,
                opacity: 0.7,
              }}
            >
              Who We Are
            </span>

            <h2
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: figmaColors.darkText,
                lineHeight: 1.25,
                margin: "0.75rem 0 1.5rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Simplifying Marriage Registration for Every Indian Family
            </h2>

            <p
              style={{
                color: figmaColors.darkText,
                lineHeight: 1.9,
                fontSize: "clamp(0.85rem, 1vw, 0.98rem)",
                marginBottom: "1.25rem",
                opacity: 0.85,
              }}
            >
              {theme.description}
            </p>

            <p
              style={{
                color: figmaColors.darkText,
                lineHeight: 1.9,
                fontSize: "clamp(0.85rem, 1vw, 0.98rem)",
                opacity: 0.85,
              }}
            >
              We help couples complete registration smoothly with proper
              documentation, timely filings, and complete legal support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {theme.howWeHelp.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(1rem, 1.5vw, 1.5rem) 1.5rem",
                  borderRadius: 12,
                  border: `1px solid ${figmaColors.darkText}`,
                  background: figmaColors.lightBg,
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: figmaColors.darkText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: figmaColors.darkText,
                      marginBottom: "0.3rem",
                      fontSize: "clamp(0.85rem, 1vw, 0.92rem)",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      color: figmaColors.darkText,
                      fontSize: "clamp(0.78rem, 0.9vw, 0.85rem)",
                      lineHeight: 1.7,
                      opacity: 0.8,
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Marriage Registration is Important */}
      <section
        style={{
          background: figmaColors.bg,
          padding: "clamp(2rem, 4vw, 4rem) 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(2rem, 3vw, 3.5rem)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: figmaColors.darkText,
                fontFamily: "'Playfair Display', Georgia, serif",
                marginBottom: "1rem",
              }}
            >
              How {isCourtMarriage ? "court" : "marriage"} registration helps?
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {benefits.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "clamp(1.2rem, 1.5vw, 2rem) 1.5rem",
                  borderRadius: 14,
                  background: figmaColors.cardBg,
                  border: `1px solid ${figmaColors.darkText}`,
                  transition: "all 0.3s ease",
                  minHeight: "clamp(150px, 20vw, 184px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
                    fontWeight: 700,
                    color: figmaColors.darkText,
                    marginBottom: "0.6rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    color: figmaColors.darkText,
                    fontSize: "clamp(0.8rem, 1vw, 0.92rem)",
                    lineHeight: 1.7,
                    opacity: 0.8,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{
          background: figmaColors.bg,
          padding: "clamp(2rem, 4vw, 4rem) 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(2rem, 3vw, 4rem)",
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.65rem, 0.8vw, 0.72rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: figmaColors.darkText,
                fontWeight: 700,
                opacity: 0.7,
              }}
            >
              The Process
            </span>

            <h2
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: figmaColors.darkText,
                marginTop: "0.75rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {displayedSteps.length} Steps To Your Union
            </h2>
          </div>

          {/* Vertical Line - Hidden on mobile */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "100px",
              bottom: 0,
              width: "3px",
              background: figmaColors.darkText,
              transform: "translateX(-50%)",
              display: "none",
            }}
            className="desktop-vertical-line"
          />

          {displayedSteps.map((step, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  index % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: "clamp(2rem, 3vw, 4rem)",
                position: "relative",
              }}
              className="step-item"
            >
              <div
                style={{
                  width: index % 2 === 0 ? "45%" : "45%",
                  padding:
                    index % 2 === 0
                      ? "0 2rem 0 0"
                      : "0 0 0 2rem",
                  textAlign: index % 2 === 0 ? "right" : "left",
                }}
                className="step-content"
              >
                <div
                  style={{
                    fontSize: "clamp(1.2rem, 1.5vw, 1.4rem)",
                    fontWeight: 800,
                    color: figmaColors.darkText,
                    marginBottom: "0.4rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    opacity: 0.5,
                  }}
                >
                  {step.num}
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    color: figmaColors.darkText,
                    marginBottom: "0.5rem",
                    fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {step.title}
                </div>

                <div
                  style={{
                    color: figmaColors.darkText,
                    fontSize: "clamp(0.8rem, 0.95vw, 0.9rem)",
                    lineHeight: 1.7,
                    opacity: 0.8,
                  }}
                >
                  {step.body}
                </div>
              </div>

              {/* Circle Marker */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "16px",
                  height: "16px",
                  background: figmaColors.darkText,
                  borderRadius: "50%",
                  border: `4px solid ${figmaColors.bg}`,
                }}
                className="step-marker"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY TRUST US ── */}
      <section
        style={{
          background: figmaColors.bg,
          padding: "clamp(2rem, 4vw, 4rem) 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              textAlign: "center",
              marginBottom: "clamp(2rem, 3vw, 3.5rem)",
            }}
          >
            <span
              style={{
                fontSize: "clamp(0.65rem, 0.8vw, 0.72rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: figmaColors.darkText,
                fontWeight: 700,
                opacity: 0.7,
              }}
            >
              Why Register my marriage
            </span>

            <h2
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: figmaColors.darkText,
                marginTop: "0.75rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Built Around Your Trust
            </h2>

            <p
              style={{
                color: figmaColors.darkText,
                maxWidth: 560,
                margin: "1rem auto 0",
                lineHeight: 1.8,
                fontSize: "clamp(0.85rem, 1vw, 0.97rem)",
                opacity: 0.8,
              }}
            >
              Thousands of couples have trusted us to handle one of the most
              important documents of their lives. Here is why they choose us
              over the traditional route.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(1rem, 1.5vw, 2rem)",
            }}
          >
            {trustReasons.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{
                  y: -4,
                  boxShadow: `0 12px 32px ${figmaColors.darkText}1A`,
                }}
                style={{
                  padding: "clamp(1.2rem, 1.5vw, 1.75rem)",
                  borderRadius: 14,
                  border: `1px solid ${figmaColors.darkText}`,
                  background: figmaColors.white,
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  transition: "all 0.25s ease",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: figmaColors.darkText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: figmaColors.white,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: figmaColors.darkText,
                      marginBottom: "0.4rem",
                      fontSize: "clamp(0.9rem, 1vw, 1rem)",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {item.title}
                  </div>

                  <div
                    style={{
                      color: figmaColors.darkText,
                      fontSize: "clamp(0.8rem, 0.9vw, 0.87rem)",
                      lineHeight: 1.7,
                      opacity: 0.8,
                    }}
                  >
                    {item.body}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: figmaColors.darkBg,
          padding: "clamp(2rem, 4vw, 4rem) 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: figmaColors.bg,
                marginBottom: "1.5rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {ctaHeading}
            </h2>

            <p
              style={{
                color: `${figmaColors.bg}B8`,
                lineHeight: 1.9,
                fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
                marginBottom: "1.5rem",
              }}
            >
              {ctaSubtext}
            </p>

            <Link
              href={`/${theme.key}/register`}
              style={{ textDecoration: "none" }}
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                style={{
                  display: "inline-block",
                  padding:
                    "clamp(12px, 1.5vw, 14px) clamp(24px, 3vw, 36px)",
                  borderRadius: 10,
                  background: figmaColors.bg,
                  color: figmaColors.darkText,
                  fontWeight: 700,
                  fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Register Your Marriage Today →
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: figmaColors.darkBg,
          padding: "clamp(1.5rem, 2vw, 3rem) 1.5rem",
          color: "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.7rem, 0.8vw, 0.78rem)",
          letterSpacing: "0.04em",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(1rem, 1.5vw, 2rem)",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "clamp(0.85rem, 1vw, 1rem)",
                marginBottom: "0.3rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {footerBrand}
            </div>

            <div
              style={{
                opacity: 0.5,
                fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)",
              }}
            >
              {footerTagline}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "clamp(0.5rem, 1vw, 2rem)",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={`/blog`}
              style={{
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)",
              }}
            >
              Blogs
            </Link>

            <Link
              href={`/contact`}
              style={{
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)",
              }}
            >
              Contact
            </Link>

            <Link
              href={`/register`}
              style={{
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)",
              }}
            >
              Register
            </Link>

            <Link
              href="/"
              style={{
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)",
              }}
            >
              Change Religion
            </Link>
          </div>

          <div
            style={{
              opacity: 0.5,
              fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)",
            }}
          >
            © 2024 Register my marriage · All Rights Reserved
          </div>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        /* Mobile Styles */
        @media (max-width: 768px) {
          .hero-content {
            margin-left: 0 !important;
            text-align: center !important;
            padding: 0 1.5rem !important;
            max-width: 100% !important;
            width: 100% !important;
            transform: translateY(-12vh) !important;
          }

          .hero-buttons {
            justify-content: center !important;
          }

          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }

          .step-item {
            justify-content: center !important;
          }

          .step-content {
            width: 100% !important;
            padding: 0 !important;
            text-align: center !important;
          }

          .step-marker {
            display: none !important;
          }

          .desktop-vertical-line {
            display: none !important;
          }

          .step-item {
            margin-bottom: 2rem !important;
          }
        }

        /* Tablet Styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-content {
            margin-left: 40% !important;
            transform: translateY(-5vh) !important;
          }

          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }

        /* Large Screens */
        @media (min-width: 1025px) {
          .step-marker {
            display: block !important;
          }

          .desktop-vertical-line {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}