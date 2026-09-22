"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { ReligionTheme } from "../types/Religion";
import React from "react";

interface Props {
  theme: ReligionTheme;
}

/* ── BRAND FONT STACKS ── */
const FONT_DISPLAY =
  "'Coolvetica', 'Helvetica Neue', 'Arial Narrow', Arial, sans-serif";
const FONT_UI =
  "'Inter', 'Helvetica Neue', Arial, system-ui, -apple-system, sans-serif";

/* ── DESIGN TOKENS ── */
const T = {
  burgundy: "#650B18",       // Primary
  burgundyDeep: "#4A0812",
  cream: "#F7F0E7",          // Warm Cream
  creamTint: "#FBF6F0",      // Cream tint (secondary button bg)
  cardBg: "#FFFCF9",         // Warm neutral card
  ink: "#171717",            // Secondary button text/border
  white: "#FFFFFF",
  hairline: "rgba(101,11,24,0.08)",
  hairlineStrong: "rgba(101,11,24,0.15)",
  radiusCard: 10,            // 8–12 px band
  radiusBtn: 10,
};

/* ── LINE ICONS (rounded joins, no stock imagery) ── */
const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icon = {
  File: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  ),
  Shield: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Headset: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M4 13a8 8 0 1 1 16 0" />
      <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2z" />
      <path d="M20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Scale: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M7 7l-3 7h6z" />
      <path d="M17 7l-3 7h6z" />
      <path d="M8 20h8" />
    </svg>
  ),
  Lock: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  Bolt: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <path d="M13 3L5 13h6l-1 8 8-10h-6z" />
    </svg>
  ),
  Check: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  Globe: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
    </svg>
  ),
};

export default function ReligionHomePage({ theme }: Props) {
  const isCourtMarriage = theme.key === "court-marriage";

  const benefits = theme.benefits || [
    { title: "Valid Proof", text: "Gives official legal status to your marriage." },
    { title: "Prevents bigamy & fraud", text: "Prevents bigamy and fraud by creating an official marriage record." },
    { title: "Rights & Security", text: "Needed to access many welfare schemes, subsidies, and family pension benefits." },
    { title: "Legal Recognition", text: "Protects inheritance and spousal rights." },
  ];

  const displayedSteps = theme.steps || [
    { num: "01", title: "Register & Upload", body: "Create your account and upload all required documents through our secure portal." },
    { num: "02", title: "Expert Review", body: "Our legal team verifies every document and flags any issues before submission." },
    { num: "03", title: "Government Filing", body: "We file your application with the correct registrar for your state and religion." },
    { num: "04", title: "Certificate Delivery", body: "Your official marriage certificate is delivered digitally and by post." },
  ];

  const trustReasons = theme.trustReasons || [
    { title: "End-to-End Guidance", body: "From document preparation to final certificate delivery, we handle every step." },
    { title: "Complete Privacy", body: "All your documents and personal information are encrypted and handled with the highest standards of confidentiality." },
    { title: "Faster Processing", body: "Our experience means fewer errors, fewer rejections, and faster turnaround." },
    { title: "Dedicated Support", body: "A dedicated case manager is assigned to your registration — a real person you can reach." },
    { title: "All-Religion Coverage", body: "We are fluent in the legal nuances of Hindu, Muslim, Christian, Sikh, Buddhist, Jain, and civil marriages." },
    { title: "Legal Recognition", body: "Establishes your marriage as legally valid under Indian law and prevents future legal disputes." },
  ];

  const trustIcons = [Icon.Shield, Icon.Lock, Icon.Bolt, Icon.Headset, Icon.Globe, Icon.Scale];
  const helpIcons = [Icon.File, Icon.Shield, Icon.Headset, Icon.Scale];

  const ctaHeading = theme.ctaHeading || "Register today. Protect forever.";
  const ctaSubtext = theme.ctaSubtext || "Takes less than 10 minutes. Valid for a lifetime.";
  const footerBrand = theme.footerBrand || "Register my marriage";
  const footerTagline = theme.footerTagline || "India's trusted marriage registration platform";

  return (
    <div style={{ background: T.cream, minHeight: "100vh", fontFamily: FONT_UI }}>
      <Navbar religionKey={theme.key} />

      
       {/* ───────────────── HERO ───────────────── */}
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
        {/* Banner image — restored */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${theme.bannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />

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
              color: T.burgundy,
              lineHeight: 1.2,
              marginBottom: "1.3rem",
              fontFamily: FONT_DISPLAY,
              letterSpacing: "0.01em",
              textShadow: "0 2px 8px rgba(255,255,255,0.3)",
              maxWidth: "620px",
            }}
          >
            {theme.heroHeading}
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
            {/* PRIMARY — burgundy */}
            <Link href="/register" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "12px 28px",
                  borderRadius: T.radiusBtn,
                  background: T.burgundy,
                  color: T.white,
                  fontWeight: 700,
                  fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(101,11,24,0.22)",
                  border: `1px solid ${T.burgundy}`,
                  transition: "all 0.25s ease",
                  fontFamily: FONT_UI,
                }}
              >
                Start Registration →
              </motion.div>
            </Link>

            {/* SECONDARY — cream/ink */}
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "12px 28px",
                  borderRadius: T.radiusBtn,
                  border: `1px solid ${T.hairlineStrong}`,
                  background: T.creamTint,
                  color: T.ink,
                  fontWeight: 600,
                  fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(23,23,23,0.06)",
                  transition: "all 0.25s ease",
                  fontFamily: FONT_UI,
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
                color: T.burgundy,
                fontWeight: 700,
                opacity: 0.8,
                fontFamily: FONT_UI,
              }}
            >
              Who We Are
            </span>

            <h2
              style={{
                fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: T.burgundy,
                lineHeight: 1.25,
                margin: "0.75rem 0 1.5rem",
                fontFamily: FONT_DISPLAY,
              }}
            >
              Simplifying Marriage Registration for Every Indian Family
            </h2>

            <p style={{ color: T.burgundy, lineHeight: 1.9, fontSize: "clamp(0.85rem, 1vw, 0.98rem)", marginBottom: "1.25rem", opacity: 0.85, fontFamily: FONT_UI }}>
              {theme.description}
            </p>

            <p style={{ color: T.burgundy, lineHeight: 1.9, fontSize: "clamp(0.85rem, 1vw, 0.98rem)", opacity: 0.85, fontFamily: FONT_UI }}>
              We help couples complete registration smoothly with proper documentation, timely filings, and complete legal support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {theme.howWeHelp.map((item, i) => {
              const HelpIcon = helpIcons[i % helpIcons.length];
              return (
                <div
                  key={i}
                  style={{
                    padding: "1.1rem 1.3rem",
                    borderRadius: T.radiusCard,
                    border: `1px solid ${T.hairline}`,
                    background: T.cardBg,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    boxShadow: "0 2px 8px rgba(101,11,24,0.04)",
                  }}
                >
                  {/* Line icon, rounded joins */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: T.radiusCard,
                      background: T.creamTint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: T.burgundy,
                    }}
                  >
                    <HelpIcon size={18} />
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: T.burgundy, marginBottom: "0.3rem", fontSize: "clamp(0.85rem, 1vw, 0.92rem)", fontFamily: FONT_DISPLAY }}>
                      {item.title}
                    </div>
                    <div style={{ color: T.burgundy, fontSize: "clamp(0.78rem, 0.9vw, 0.85rem)", lineHeight: 1.7, opacity: 0.8, fontFamily: FONT_UI }}>
                      {item.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ background: T.cream, padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 3vw, 3.5rem)" }}>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: T.burgundy,
                fontFamily: FONT_DISPLAY,
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
              gap: "1.25rem",
            }}
          >
            {benefits.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "1.5rem 1.4rem",
                  borderRadius: T.radiusCard,
                  background: T.cardBg,
                  border: `1px solid ${T.hairline}`,
                  transition: "all 0.3s ease",
                  minHeight: "clamp(150px, 20vw, 184px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(101,11,24,0.04)",
                }}
              >
                <h3 style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)", fontWeight: 700, color: T.burgundy, marginBottom: "0.6rem", fontFamily: FONT_DISPLAY }}>
                  {item.title}
                </h3>
                <p style={{ color: T.burgundy, fontSize: "clamp(0.8rem, 1vw, 0.92rem)", lineHeight: 1.7, opacity: 0.8, fontFamily: FONT_UI }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: T.cream, padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 3vw, 4rem)" }}>
            <span style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.72rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: T.burgundy, fontWeight: 700, opacity: 0.8, fontFamily: FONT_UI }}>
              The Process
            </span>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 700, color: T.burgundy, marginTop: "0.75rem", fontFamily: FONT_DISPLAY }}>
              {displayedSteps.length} Steps To Your Union
            </h2>
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "100px",
              bottom: 0,
              width: "1px",
              background: T.hairlineStrong,
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
                justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: "clamp(2rem, 3vw, 4rem)",
                position: "relative",
              }}
              className="step-item"
            >
              <div
                style={{
                  width: "45%",
                  padding: index % 2 === 0 ? "0 2rem 0 0" : "0 0 0 2rem",
                  textAlign: index % 2 === 0 ? "right" : "left",
                }}
                className="step-content"
              >
                <div style={{ fontSize: "clamp(1.2rem, 1.5vw, 1.4rem)", fontWeight: 800, color: T.burgundy, marginBottom: "0.4rem", fontFamily: FONT_DISPLAY, opacity: 0.4 }}>
                  {step.num}
                </div>
                <div style={{ fontWeight: 700, color: T.burgundy, marginBottom: "0.5rem", fontSize: "clamp(0.9rem, 1.1vw, 1rem)", fontFamily: FONT_DISPLAY }}>
                  {step.title}
                </div>
                <div style={{ color: T.burgundy, fontSize: "clamp(0.8rem, 0.95vw, 0.9rem)", lineHeight: 1.7, opacity: 0.8, fontFamily: FONT_UI }}>
                  {step.body}
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "14px",
                  height: "14px",
                  background: T.cream,
                  border: `2px solid ${T.burgundy}`,
                  borderRadius: "50%",
                }}
                className="step-marker"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY TRUST US ── */}
      <section style={{ background: T.cream, padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "clamp(2rem, 3vw, 3.5rem)" }}
          >
            <span style={{ fontSize: "clamp(0.65rem, 0.8vw, 0.72rem)", letterSpacing: "0.18em", textTransform: "uppercase", color: T.burgundy, fontWeight: 700, opacity: 0.8, fontFamily: FONT_UI }}>
              Why Register my marriage
            </span>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 700, color: T.burgundy, marginTop: "0.75rem", fontFamily: FONT_DISPLAY }}>
              Built Around Your Trust
            </h2>
            <p style={{ color: T.burgundy, maxWidth: 560, margin: "1rem auto 0", lineHeight: 1.8, fontSize: "clamp(0.85rem, 1vw, 0.97rem)", opacity: 0.8, fontFamily: FONT_UI }}>
              Thousands of couples have trusted us to handle one of the most important documents of their lives. Here is why they choose us over the traditional route.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(1rem, 1.5vw, 1.5rem)",
            }}
          >
            {trustReasons.map((item, i) => {
              const TrustIcon = trustIcons[i % trustIcons.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  style={{
                    padding: "1.4rem 1.3rem",
                    borderRadius: T.radiusCard,
                    border: `1px solid ${T.hairline}`,
                    background: T.cardBg,
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    transition: "all 0.25s ease",
                    boxShadow: "0 2px 8px rgba(101,11,24,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: T.radiusCard,
                      background: T.creamTint,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: T.burgundy,
                    }}
                  >
                    <TrustIcon size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: T.burgundy, marginBottom: "0.4rem", fontSize: "clamp(0.9rem, 1vw, 1rem)", fontFamily: FONT_DISPLAY }}>
                      {item.title}
                    </div>
                    <div style={{ color: T.burgundy, fontSize: "clamp(0.8rem, 0.9vw, 0.87rem)", lineHeight: 1.7, opacity: 0.8, fontFamily: FONT_UI }}>
                      {item.body}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: T.burgundyDeep, padding: "clamp(2rem, 4vw, 4rem) 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2.4rem)", fontWeight: 700, color: T.cream, marginBottom: "1.5rem", fontFamily: FONT_DISPLAY }}>
              {ctaHeading}
            </h2>
            <p style={{ color: `${T.cream}B8`, lineHeight: 1.9, fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)", marginBottom: "1.5rem", fontFamily: FONT_UI }}>
              {ctaSubtext}
            </p>
            <Link href={`/${theme.key}/register`} style={{ textDecoration: "none" }}>
              {/* On dark background, cream acts as the high-contrast primary */}
              <motion.div
                whileHover={{ y: -2 }}
                style={{
                  display: "inline-block",
                  padding: "clamp(12px, 1.5vw, 14px) clamp(24px, 3vw, 36px)",
                  borderRadius: T.radiusBtn,
                  background: T.cream,
                  color: T.burgundy,
                  fontWeight: 700,
                  fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                  fontFamily: FONT_UI,
                  boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
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
          background: T.burgundyDeep,
          padding: "clamp(1.5rem, 2vw, 3rem) 1.5rem",
          color: "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.7rem, 0.8vw, 0.78rem)",
          letterSpacing: "0.04em",
          fontFamily: FONT_UI,
          borderTop: "1px solid rgba(255,255,255,0.06)",
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
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(0.85rem, 1vw, 1rem)", marginBottom: "0.3rem", fontFamily: FONT_DISPLAY }}>
              {footerBrand}
            </div>
            <div style={{ opacity: 0.5, fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)", fontFamily: FONT_UI }}>
              {footerTagline}
            </div>
          </div>

          <div style={{ display: "flex", gap: "clamp(0.5rem, 1vw, 2rem)", flexWrap: "wrap" }}>
            <Link href="/blog" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)", fontFamily: FONT_UI }}>Blogs</Link>
            <Link href="/contact" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)", fontFamily: FONT_UI }}>Contact</Link>
            <Link href="/register" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)", fontFamily: FONT_UI }}>Register</Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)", fontFamily: FONT_UI }}>Change Religion</Link>
          </div>

          <div style={{ opacity: 0.5, fontSize: "clamp(0.6rem, 0.7vw, 0.7rem)", fontFamily: FONT_UI }}>
            © 2024 Register my marriage · All Rights Reserved
          </div>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-content {
            margin-left: 0 !important;
            text-align: center !important;
            padding: 0 1.5rem !important;
            max-width: 100% !important;
            width: 100% !important;
            transform: translateY(-6vh) !important;
          }
          .hero-buttons { justify-content: center !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .step-item { justify-content: center !important; }
          .step-content { width: 100% !important; padding: 0 !important; text-align: center !important; }
          .step-marker { display: none !important; }
          .desktop-vertical-line { display: none !important; }
          .step-item { margin-bottom: 2rem !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-content { margin-left: 40% !important; transform: translateY(-3vh) !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }

        @media (min-width: 1025px) {
          .step-marker { display: block !important; }
          .desktop-vertical-line { display: block !important; }
        }
      `}</style>
    </div>
  );
}