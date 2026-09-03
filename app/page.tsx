// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RELIGIOUS_CATEGORIES, COURT_MARRIAGE } from "./constants/Religions";
import { ReligionKey } from "./types/Religion";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<ReligionKey | null>(null);
  const [courtHovered, setCourtHovered] = useState(false);
  const { isLoggedIn } = useAuth();

  // Figma color scheme
  const colors = {
    bg: "#E4E0D5",
    darkText: "#4A0E19",
    lightBg: "#F0FDFA",
    white: "#FFFFFF",
    darkBg: "#380913",
    accent: "#4A0E19",
    cardBg: "#F8FEFE",
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
              "linear-gradient(160deg, rgba(74,14,25,0.04) 0%, rgba(255,255,255,0.06) 50%, rgba(74,14,25,0.03) 100%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />

          {/* ── CENTER SECTION ── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 1.5rem 1rem",
              gap: "1.4rem",
            }}
          >
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center", maxWidth: 520 }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: colors.lightBg,
                  border: `1px solid ${colors.darkText}`,
                  color: colors.darkText,
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginBottom: "0.8rem",
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.7,
                }}
              >
                India's Trusted Marriage Registration Service
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                  color: colors.darkText,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.5rem",
                  fontFamily: "'Playfair Display', Georgia, serif",
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
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.8,
                }}
              >
                We provide religion-specific guidance and legal support for your marriage registration.
                Choose your faith to get started with a personalised experience.
              </p>
            </motion.div>

            {/* ── RELIGION CARDS GRID (4 religions only) ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
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
                  whileHover={{ y: -4, boxShadow: "0 14px 28px rgba(74,14,25,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHovered(religion.key)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => router.push(`/${religion.key}`)}
                  style={{
                    padding: "1.2rem 1rem",
                    borderRadius: 14,
                    border: `1.5px solid ${hovered === religion.key ? colors.darkText : "rgba(74,14,25,0.15)"}`,
                    background: hovered === religion.key ? colors.darkText : colors.white,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.7rem",
                    transition: "all 0.25s ease",
                    boxShadow: hovered === religion.key 
                      ? "0 8px 24px rgba(74,14,25,0.2)" 
                      : "0 4px 12px rgba(74,14,25,0.06)",
                    backdropFilter: "blur(10px)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: hovered === religion.key
                        ? colors.white
                        : colors.lightBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <div
                      style={{
                        transform: "scale(0.8)",
                        filter: hovered === religion.key ? "none" : "none",
                      }}
                    >
                      {religion.icon}
                    </div>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: hovered === religion.key ? colors.white : colors.darkText,
                        marginBottom: 2,
                        fontFamily: "'Playfair Display', Georgia, serif",
                        transition: "color 0.25s",
                      }}
                    >
                      {religion.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        color: hovered === religion.key ? "rgba(255,255,255,0.7)" : "rgba(74,14,25,0.6)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        fontFamily: "'Inter', sans-serif",
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
              <div style={{ flex: 1, height: "1px", background: `rgba(74,14,25,0.15)` }} />
              <span
                style={{
                  fontSize: "0.7rem",
                  color: colors.darkText,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: 999,
                  border: `1px solid rgba(74,14,25,0.15)`,
                  whiteSpace: "nowrap",
                  fontFamily: "'Inter', sans-serif",
                  opacity: 0.6,
                }}
              >
                Or, skip the ceremony entirely
              </span>
              <div style={{ flex: 1, height: "1px", background: `rgba(74,14,25,0.15)` }} />
            </motion.div>

            {/* ── COURT MARRIAGE CARD ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ width: "100%", maxWidth: 850 }}
            >
              <motion.button
                whileHover={{ y: -3, boxShadow: "0 20px 48px rgba(74,14,25,0.15)" }}
                whileTap={{ scale: 0.99 }}
                onHoverStart={() => setCourtHovered(true)}
                onHoverEnd={() => setCourtHovered(false)}
                onClick={() => router.push("/court-marriage")}
                style={{
                  width: "100%",
                  padding: "1.4rem 2rem",
                  borderRadius: 16,
                  border: `1.5px solid ${courtHovered ? colors.darkText : "rgba(74,14,25,0.15)"}`,
                  background: courtHovered ? colors.darkText : colors.white,
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  alignItems: "center",
                  gap: "1.5rem",
                  transition: "all 0.25s ease",
                  boxShadow: courtHovered 
                    ? "0 8px 28px rgba(74,14,25,0.2)" 
                    : "0 4px 16px rgba(74,14,25,0.06)",
                  textAlign: "left",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: courtHovered
                      ? colors.white
                      : colors.lightBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      transform: "scale(0.85)",
                      transition: "filter 0.3s",
                    }}
                  >
                    {COURT_MARRIAGE.icon}
                  </div>
                </div>

                {/* Text */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "1.05rem",
                        color: courtHovered ? colors.white : colors.darkText,
                        transition: "color 0.25s",
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      Court Marriage
                    </span>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: courtHovered ? "rgba(255,255,255,0.15)" : colors.lightBg,
                        color: courtHovered ? colors.white : colors.darkText,
                        fontWeight: 600,
                        transition: "all 0.25s",
                        fontFamily: "'Inter', sans-serif",
                        opacity: courtHovered ? 0.8 : 0.7,
                      }}
                    >
                      Special Marriage Act, 1954
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.78rem",
                      color: courtHovered ? "rgba(255,255,255,0.8)" : colors.darkText,
                      lineHeight: 1.5,
                      margin: 0,
                      transition: "color 0.25s",
                      maxWidth: 520,
                      fontFamily: "'Inter', sans-serif",
                      opacity: courtHovered ? 0.9 : 0.7,
                    }}
                  >
                    For interfaith, inter-caste, NRI, or couples who prefer a clean civil union — no religion required, no ceremony required.
                    Fully secular, legally binding, and recognised everywhere in India and abroad.
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                    {["Interfaith", "Inter-caste", "NRI Marriage", "No Ceremony Needed"].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: "0.58rem",
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: `1px solid ${courtHovered ? "rgba(255,255,255,0.2)" : "rgba(74,14,25,0.1)"}`,
                          color: courtHovered ? "rgba(255,255,255,0.7)" : colors.darkText,
                          transition: "all 0.25s",
                          letterSpacing: "0.05em",
                          fontFamily: "'Inter', sans-serif",
                          opacity: courtHovered ? 0.8 : 0.6,
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
                    opacity: courtHovered ? 0.8 : 0.3,
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
                gap: "1.2rem",
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
                  <div style={{
                    fontSize: "0.9rem",
                    color: colors.darkText,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    opacity: 0.8,
                  }}>
                    {num}
                  </div>
                  <div style={{
                    fontSize: "0.6rem",
                    color: colors.darkText,
                    textTransform: "uppercase",
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.5,
                  }}>
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
              padding: "0.6rem",
              background: colors.darkBg,
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.6rem",
              borderTop: `1px solid rgba(255,255,255,0.05)`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            © 2026 Register My Marriage · All Rights Reserved · Recognised under Indian Marriage Laws
          </footer>
        </div>
      </main>
    </>
  );
}