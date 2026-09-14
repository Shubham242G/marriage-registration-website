// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { RELIGIOUS_CATEGORIES, COURT_MARRIAGE } from "./constants/Religions";
import { ReligionKey } from "./types/Religion";
import { useAuth } from "./context/AuthContext";

/* ── BRAND FONT STACKS ── */
const FONT_DISPLAY =
  "'Coolvetica', 'Helvetica Neue', 'Arial Narrow', Arial, sans-serif";
const FONT_UI =
  "'Inter', 'Helvetica Neue', Arial, system-ui, -apple-system, sans-serif";

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<ReligionKey | null>(null);
  const [courtHovered, setCourtHovered] = useState(false);
  const { isLoggedIn } = useAuth();

  /* ── BRAND GUIDELINE COLORS ── */
  const colors = {
    bg: "#F7F0E7",            // Warm Cream
    darkText: "#650B18",      // Brand Burgundy
    lightBg: "#FBF6F0",       // Cream tint
    white: "#FFFFFF",
    darkBg: "#4A0812",        // Deeper burgundy
    accent: "#650B18",
    cardBg: "#FFFCF9",
  };

  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: colors.bg,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* Soft Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(101,11,24,0.04) 0%, rgba(255,255,255,0.06) 50%, rgba(101,11,24,0.03) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          {/* ── LOGO HEADER ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderBottom: `1px solid ${colors.darkText}15`,
              background: colors.bg,
              flexShrink: 0,
              height: "clamp(90px, 13vh, 125px)",
              overflow: "hidden",
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "min(420px, 75vw)",
                  height: "100%",
                }}
              >
                <Image
                  src="/media/logo.png"
                  alt="Register My Marriage"
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 75vw, 420px"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center",
                    transform: "scale(4.72)",
                  }}
                />
              </div>
            </Link>
          </div>

          {/* ── CENTER SECTION ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.5rem 1.5rem 0.75rem",
              gap: "0.75rem",
            }}
          >
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", maxWidth: 520 }}
            >
              <h1
                style={{
                  fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                  color: colors.darkText,
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                  marginBottom: "0.5rem",
                  fontFamily: FONT_DISPLAY,
                }}
              >
                Select Your Religion
              </h1>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: colors.darkText,
                  lineHeight: 1.5,
                  maxWidth: 480,
                  margin: "0 auto",
                  fontFamily: FONT_UI,
                  opacity: 0.8,
                }}
              >
                We provide religion-specific guidance and legal support for
                your marriage registration. Choose your faith to get started
                with a personalised experience.
              </p>
            </motion.div>

            {/* ── RELIGION CARDS GRID ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.85rem",
                width: "100%",
                maxWidth: 850,
              }}
            >
              {RELIGIOUS_CATEGORIES.map((religion, i) => (
                <motion.button
                  key={religion.key}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 14px 28px rgba(101,11,24,0.15)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHovered(religion.key)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => router.push(`/${religion.key}`)}
                  style={{
                    padding: "1rem 1rem",
                    borderRadius: 14,
                    border: `1.5px solid ${
                      hovered === religion.key
                        ? colors.darkText
                        : "rgba(101,11,24,0.15)"
                    }`,
                    background:
                      hovered === religion.key ? colors.darkText : colors.white,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.6rem",
                    transition: "all 0.25s ease",
                    boxShadow:
                      hovered === religion.key
                        ? "0 8px 24px rgba(101,11,24,0.2)"
                        : "0 4px 12px rgba(101,11,24,0.06)",
                    backdropFilter: "blur(10px)",
                    fontFamily: FONT_UI,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: colors.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div style={{ transform: "scale(0.75)" }}>
                      {religion.icon}
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color:
                          hovered === religion.key
                            ? colors.white
                            : colors.darkText,
                        marginBottom: 2,
                        fontFamily: FONT_DISPLAY,
                        transition: "color 0.25s",
                      }}
                    >
                      {religion.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color:
                          hovered === religion.key
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(101,11,24,0.6)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        fontFamily: FONT_UI,
                        transition: "color 0.25s",
                      }}
                    >
                      {religion.subtitle}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* ── DIVIDER ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                width: "100%",
                maxWidth: 850,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: `rgba(101,11,24,0.15)`,
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  color: colors.darkText,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "3px 10px",
                  borderRadius: 999,
                  border: `1px solid rgba(101,11,24,0.15)`,
                  whiteSpace: "nowrap",
                  fontFamily: FONT_UI,
                  opacity: 0.6,
                }}
              >
                Or, skip the ceremony entirely
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: `rgba(101,11,24,0.15)`,
                }}
              />
            </motion.div>

            {/* ── COURT MARRIAGE CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ width: "100%", maxWidth: 850 }}
            >
              <motion.button
                whileHover={{
                  y: -3,
                  boxShadow: "0 20px 48px rgba(101,11,24,0.15)",
                }}
                whileTap={{ scale: 0.99 }}
                onHoverStart={() => setCourtHovered(true)}
                onHoverEnd={() => setCourtHovered(false)}
                onClick={() => router.push("/court-marriage")}
                style={{
                  width: "100%",
                  padding: "1.2rem 1.8rem",
                  borderRadius: 16,
                  border: `2px solid ${
                    courtHovered ? colors.darkText : "rgba(101,11,24,0.2)"
                  }`,
                  background: courtHovered ? colors.darkText : colors.white,
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  alignItems: "center",
                  gap: "1.2rem",
                  transition: "all 0.25s ease",
                  boxShadow: courtHovered
                    ? "0 8px 28px rgba(101,11,24,0.25)"
                    : "0 4px 16px rgba(101,11,24,0.08)",
                  textAlign: "left",
                  fontFamily: FONT_UI,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: colors.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      transform: "scale(0.8)",
                      transition: "filter 0.3s",
                    }}
                  >
                    {COURT_MARRIAGE.icon}
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.2rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: courtHovered ? colors.white : colors.darkText,
                        transition: "color 0.25s",
                        fontFamily: FONT_DISPLAY,
                      }}
                    >
                      Court Marriage
                    </span>
                    <span
                      style={{
                        fontSize: "0.55rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: courtHovered
                          ? "rgba(255,255,255,0.15)"
                          : colors.lightBg,
                        color: courtHovered ? colors.white : colors.darkText,
                        fontWeight: 600,
                        transition: "all 0.25s",
                        fontFamily: FONT_UI,
                        opacity: courtHovered ? 0.8 : 0.7,
                      }}
                    >
                      Special Marriage Act, 1954
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: courtHovered
                        ? "rgba(255,255,255,0.85)"
                        : colors.darkText,
                      lineHeight: 1.5,
                      margin: 0,
                      transition: "color 0.25s",
                      maxWidth: 520,
                      fontFamily: FONT_UI,
                      opacity: courtHovered ? 0.9 : 0.75,
                    }}
                  >
                    For interfaith, inter-caste, NRI, or couples who prefer a
                    clean civil union — no religion required, no ceremony
                    required. Fully secular, legally binding, and recognised
                    everywhere in India and abroad.
                  </p>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      marginTop: "0.4rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      "Interfaith",
                      "Inter-caste",
                      "NRI Marriage",
                      "No Ceremony Needed",
                    ].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.55rem",
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: `1.5px solid ${
                            courtHovered
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(101,11,24,0.15)"
                          }`,
                          color: courtHovered
                            ? "rgba(255,255,255,0.75)"
                            : colors.darkText,
                          transition: "all 0.25s",
                          letterSpacing: "0.05em",
                          fontFamily: FONT_UI,
                          opacity: courtHovered ? 0.8 : 0.65,
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: courtHovered ? 4 : 0 }}
                  style={{
                    fontSize: "1.3rem",
                    color: courtHovered ? colors.white : colors.darkText,
                    transition: "color 0.25s",
                    flexShrink: 0,
                    opacity: courtHovered ? 0.9 : 0.4,
                  }}
                >
                  →
                </motion.div>
              </motion.button>
            </motion.div>

            {/* ── STATS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "0.25rem",
                paddingBottom: "0.5rem",
              }}
            >
              {[
                ["10,000+", "Registrations"],
                ["All Religions", "Covered"],
                ["Legal Experts", "Always"],
                ["100% Digital", "Process"],
              ].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: colors.darkText,
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 700,
                      opacity: 0.8,
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      color: colors.darkText,
                      textTransform: "uppercase",
                      fontFamily: FONT_UI,
                      opacity: 0.5,
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* FOOTER */}
          <footer
            style={{
              textAlign: "center",
              padding: "0.5rem",
              background: colors.darkBg,
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.55rem",
              borderTop: `1px solid rgba(255,255,255,0.05)`,
              fontFamily: FONT_UI,
            }}
          >
            © 2026 Register My Marriage · All Rights Reserved · Recognised
            under Indian Marriage Laws
          </footer>
        </div>
      </main>
    </>
  );
}