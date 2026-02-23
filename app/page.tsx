"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ALL_RELIGIONS } from "./constants/Religions";
import { ReligionKey } from "./types/Religion";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<ReligionKey | null>(null);
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* Font Setup */}
      <style jsx global>{`
        @font-face {
          font-family: 'Quasira';
          src: url('/fonts/quasira.otf') format('opentype');
          font-weight: 400 900;
          font-style: normal;
          font-display: swap;
        }

        .quasira-heading {
          font-family: 'Quasira', sans-serif !important;
          font-weight: 700 !important;
        }

        .body-text {
          font-family: 'Inter', sans-serif !important;
        }
      `}</style>

      <main
        style={{
          height: "100vh",
          backgroundColor: "#074949",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Soft Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(240,253,250,0.12) 0%, rgba(255,255,255,0.08) 50%, rgba(236,253,245,0.1) 100%)",
          }}
        />

        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Navbar />

          {/* CENTER SECTION */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem 1.5rem 1rem",
              gap: "1.2rem",
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
                className="body-text"
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: "rgba(240,253,250,0.9)",
                  border: "1px solid rgba(153,246,228,0.8)",
                  color: "#0d9488",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginBottom: "0.8rem",
                }}
              >
                India's Trusted Marriage Registration Service
              </div>

              <h1
                className="quasira-heading"
                style={{
                  fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                  color: "#ffffff",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.5rem",
                  textShadow: "0 2px 6px rgba(0,0,0,0.35)",
                }}
              >
                Select Your Religion
              </h1>

              <p
                className="body-text"
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.5,
                  maxWidth: 480,
                  margin: "0 auto",
                }}
              >
                We provide religion-specific guidance and legal support for your
                marriage registration. Choose your faith to get started with a
                personalised experience.
              </p>
            </motion.div>

            {/* RELIGION GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                width: "100%",
                maxWidth: 850,
              }}
            >
              {ALL_RELIGIONS.map((religion, i) => (
                <motion.button
                  key={religion.key}
                  className="body-text"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 14px 28px rgba(13,148,136,0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHovered(religion.key)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => router.push(`/${religion.key}`)}
                  style={{
                    padding: "1.2rem 1rem",
                    borderRadius: 14,
                    border: `1.5px solid ${
                      hovered === religion.key
                        ? "#0d9488"
                        : "rgba(224,242,241,0.6)"
                    }`,
                    background:
                      hovered === religion.key
                        ? "rgba(240,253,250,0.95)"
                        : "rgba(255,255,255,0.92)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.7rem",
                    transition: "all 0.25s ease",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* ICON */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background:
                        hovered === religion.key
                          ? "linear-gradient(135deg, #0d9488, #0f4c4c)"
                          : "linear-gradient(135deg, rgba(240,253,250,0.95), rgba(204,251,241,0.9))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        transform: "scale(0.8)",
                        filter:
                          hovered === religion.key
                            ? "brightness(10%) invert(1)"
                            : "none",
                      }}
                    >
                      {religion.icon}
                    </div>
                  </div>

                  {/* TEXT */}
                  <div style={{ textAlign: "center" }}>
                    <div
                      className="quasira-heading"
                      style={{
                        fontSize: "0.9rem",
                        color:
                          hovered === religion.key
                            ? "#0d9488"
                            : "#074949",
                        marginBottom: 2,
                      }}
                    >
                      {religion.label}
                    </div>

                    <div
                      className="body-text"
                      style={{
                        fontSize: "0.65rem",
                        color: "rgba(107,158,158,0.9)",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {religion.subtitle}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.2rem",
                justifyContent: "center",
                marginTop: "0.5rem",
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
                    className="quasira-heading"
                    style={{
                      fontSize: "0.9rem",
                      color: "#0d9488",
                    }}
                  >
                    {num}
                  </div>
                  <div
                    className="body-text"
                    style={{
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.9)",
                      textTransform: "uppercase",
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
            className="body-text"
            style={{
              textAlign: "center",
              padding: "0.6rem",
              background: "rgba(7,73,73,0.95)",
              color: "rgba(255,255,255,0.9)",
              fontSize: "0.6rem",
              borderTop: "1px solid rgba(224,242,241,0.2)",
            }}
          >
            © 2026 Register My Marriage · All Rights Reserved · Recognised under
            Indian Marriage Laws
          </footer>
        </div>
      </main>
    </>
  );
}