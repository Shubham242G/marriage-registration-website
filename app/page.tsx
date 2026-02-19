"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ALL_RELIGIONS } from "./constants/Religions";
import { ReligionKey } from "./types/Religion";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<ReligionKey | null>(null);
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(160deg, #f0fdfa 0%, #ffffff 50%, #ecfdf5 100%)", fontFamily: "'Lato', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600&display=swap');`}</style>

      {/* Top strip */}
      <div style={{ background: "linear-gradient(90deg, #0f4c4c, #0d9488)", color: "#ccfbf1", textAlign: "center", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 1rem" }}>
        Government Recognised · All Religions · Fully Digital Process
      </div>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid #e0f2f1", backdropFilter: "blur(16px)", boxShadow: "0 1px 24px rgba(13,148,136,0.07)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", height: 68, gap: "1rem" }}>
          {/* Left: empty on homepage */}
          <div />

          {/* Center: Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
            <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0, borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg, #0d9488, #0f4c4c)" }}>
              <Image src="/media/logo.png" alt="Register My Marriage" fill style={{ objectFit: "contain" }} />
            </div>
            <div>
              <span style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f4c4c", letterSpacing: "-0.01em", fontFamily: "'Playfair Display', Georgia, serif", whiteSpace: "nowrap" }}>
                Register My Marriage
              </span>
              <span style={{ display: "block", fontSize: "0.55rem", color: "#0d9488", letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1 }}>
                Official Marriage Registration
              </span>
            </div>
          </Link>

          {/* Right: Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end" }}>
            {isLoggedIn ? (
              <>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e0f2f1", background: "#f0fdfa" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #0d9488, #0f4c4c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 700 }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#0f4c4c" }}>{user?.name?.split(" ")[0]}</span>
                  </div>
                </Link>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={logout}
                  style={{ padding: "9px 16px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", fontFamily: "'Lato', sans-serif" }}>
                  Sign Out
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/islam/login" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: "9px 18px", borderRadius: 8, border: "1.5px solid #0d9488", color: "#0d9488", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", background: "#fff", whiteSpace: "nowrap" }}>
                    Login
                  </motion.div>
                </Link>
                <Link href="/islam/register" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ padding: "9px 18px", borderRadius: 8, background: "linear-gradient(135deg, #0d9488, #0f4c4c)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                    Register
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem 3rem" }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ textAlign: "center", maxWidth: 600, marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-block", padding: "5px 18px", borderRadius: 999, background: "#f0fdfa", border: "1px solid #99f6e4", color: "#0d9488", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            India's Trusted Marriage Registration Service
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "#0f4c4c", lineHeight: 1.2, marginBottom: "1rem", letterSpacing: "-0.02em", fontFamily: "'Playfair Display', Georgia, serif" }}>
            Select Your Religion
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#4b7b7b", lineHeight: 1.8, fontWeight: 400 }}>
            We provide religion-specific guidance and legal support for your marriage registration. Choose your faith to get started with a personalised experience.
          </p>
        </motion.div>

        {/* Religion Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", width: "100%", maxWidth: 960 }}>
          {ALL_RELIGIONS.map((religion, i) => (
            <motion.button
              key={religion.key}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(13,148,136,0.15)" }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHovered(religion.key)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => router.push(`/${religion.key}`)}
              style={{
                padding: "2rem 1.5rem", borderRadius: 16,
                border: `1.5px solid ${hovered === religion.key ? "#0d9488" : "#e0f2f1"}`,
                background: hovered === religion.key ? "#f0fdfa" : "#ffffff",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
                transition: "all 0.25s ease", outline: "none",
                boxShadow: "0 2px 12px rgba(13,148,136,0.05)",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: hovered === religion.key ? "linear-gradient(135deg, #0d9488, #0f4c4c)" : "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s ease", flexShrink: 0,
              }}>
                <div style={{ transform: "scale(0.85)", filter: hovered === religion.key ? "brightness(10)" : "none", transition: "filter 0.3s" }}>
                  {religion.icon}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: hovered === religion.key ? "#0d9488" : "#0f4c4c", lineHeight: 1.3, marginBottom: 4, transition: "color 0.25s" }}>
                  {religion.label}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#6b9e9e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif" }}>
                  {religion.subtitle}
                </div>
              </div>
              <motion.div animate={{ opacity: hovered === religion.key ? 1 : 0 }} style={{ fontSize: "0.78rem", color: "#0d9488", fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>
                Get Started →
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Trust bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          style={{ marginTop: "4rem", display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center", justifyContent: "center" }}>
          {[["10,000+", "Registrations Completed"], ["All Religions", "Covered"], ["Legal Experts", "On Every Case"], ["100% Digital", "Process"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0d9488" }}>{num}</div>
              <div style={{ fontSize: "0.72rem", color: "#6b9e9e", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "'Lato', sans-serif" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <footer style={{ textAlign: "center", padding: "1.5rem", borderTop: "1px solid #e0f2f1", color: "#9abcbc", fontSize: "0.75rem", fontFamily: "'Lato', sans-serif" }}>
        © 2024 Register My Marriage · All Rights Reserved · Recognised under Indian Marriage Laws
      </footer>
    </main>
  );
}