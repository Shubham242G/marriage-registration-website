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
  burgundy: "#650B18",
  burgundyDeep: "#4A0812",
  cream: "#F7F0E7",
  creamTint: "#FBF6F0",
  cardBg: "#FFFCF9",
  ink: "#171717",
  white: "#FFFFFF",
  hairline: "rgba(101,11,24,0.08)",
  hairlineStrong: "rgba(101,11,24,0.15)",
  radiusCard: 10,
  radiusBtn: 10,
};

/* ── LINE ICONS ── */
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
  Tick: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...strokeProps} strokeWidth={2.4}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
};

export default function ReligionHomePage({ theme }: Props) {
  const isCourtMarriage = theme.key === "court-marriage";
  const isOther = theme.key === "other";

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

  /* Hero-specific copy */
  const heroEyebrow = isOther
    ? ""
    : isCourtMarriage
      ? "Court Marriage & Registration"
      : "Marriage Registration";

  const heroLine1 = isOther
    ? theme.heroHeading
    : isCourtMarriage
      ? "Your Love."
      : "Your Marriage.";

  const heroLine2 = isOther
    ? ""
    : isCourtMarriage
      ? "Legally Yours."
      : "Legally Registered.";

  const heroSub =
    "Hassle-free marriage registration — documents, appointments and legal support handled end to end.";

  const heroTrustItems = [
    "10,000+ couples",
    "Verified lawyers",
  ];

  return (
    <div style={{ background: T.cream, minHeight: "100vh", fontFamily: FONT_UI }}>
      <Navbar religionKey={theme.key} />

      {/* ───────────────── HERO ───────────────── */}
      <section className="hero">
        <div className={`hero-content${isOther ? " hero-content--minimal" : ""}`}>
          {/* Eyebrow — hidden on `other` */}
          {!isOther && (
            <motion.p
              className="hero-eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {heroEyebrow}
            </motion.p>
          )}

          {/* Heading — single line for `other` (italic), two lines otherwise */}
          <motion.h1
            key={heroLine1 + heroLine2}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {isOther ? (
              <em>{heroLine1}</em>
            ) : (
              <>
                {heroLine1}
                <br />
                <em>{heroLine2}</em>
              </>
            )}
          </motion.h1>

          {/* CTA buttons — shown on every page */}
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: isOther ? 0.25 : 0.4 }}
          >
            <Link href="/register" className="btn-primary">
              Start Registration →
            </Link>
            <Link href="/contact" className="btn-secondary">
              Talk to an Expert
            </Link>
          </motion.div>

          {/* Subtext + trust — hidden on `other` */}
          {!isOther && (
            <>
              <motion.p
                className="sub"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                {heroSub}
              </motion.p>

              <motion.ul
                className="trust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                {heroTrustItems.map((item) => (
                  <li key={item}>
                    <span className="trust-tick" aria-hidden="true">
                      <Icon.Tick size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </motion.ul>
            </>
          )}
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

        /* ── HERO — just background image + text ── */
        .hero {
          position: relative;
          min-height: 88vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: var(--hero-banner);
          background-size: cover;
          background-position: center bottom;
          background-repeat: no-repeat;
          overflow: hidden;
          margin-top: -1px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 0 6% 0 0;
          max-width: 560px;
          transform: translateY(-3%);
          transform: translateX(18%);
        }

        .hero-eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.6rem, 0.72vw, 0.68rem);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #7a2b38;
          margin: 0 0 0.85rem 0;
        }

        .hero h1 {
          font-family: 'Playfair Display', 'Times New Roman', serif;
          font-weight: 700;
          font-size: clamp(1.9rem, 3.6vw, 3.2rem);
          line-height: 1.08;
          color: #6b0f1a;
          margin: 0 0 1rem 0;
          letter-spacing: -0.005em;
        }
        .hero h1 em {
          font-style: italic;
          font-weight: 500;
        }

        .hero p.sub {
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.76rem, 0.88vw, 0.86rem);
          line-height: 1.55;
          color: #5b4038;
          max-width: 420px;
          margin: 0 0 1.3rem 0;
        }

        .hero-buttons {
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
          margin-bottom: 1.1rem;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.7rem 1.2rem;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.72rem, 0.85vw, 0.82rem);
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .btn-primary {
          background: #6b0f1a;
          color: #ffffff;
          border: 1.5px solid #6b0f1a;
          box-shadow: 0 6px 18px rgba(107, 15, 26, 0.22);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(107, 15, 26, 0.3);
          background: #5a0c15;
          border-color: #5a0c15;
        }
        .btn-secondary {
          background: #ffffff;
          color: #6b0f1a;
          border: 1.5px solid #6b0f1a;
        }
        .btn-secondary:hover {
          transform: translateY(-2px);
          background: #fbf6f0;
          box-shadow: 0 8px 20px rgba(107, 15, 26, 0.12);
        }

        .trust {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.68rem, 0.78vw, 0.75rem);
          color: #6b4a44;
        }
        .trust li {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .trust-tick {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #6b0f1a;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero {
            min-height: 92vh;
            justify-content: center;
            text-align: center;
            background-position: center top;
          }
          .hero-content {
            padding: 3rem 1.5rem 2rem;
            max-width: 100%;
            transform: none;
          }
          .hero p.sub {
            margin-left: auto;
            margin-right: auto;
            max-width: 440px;
          }
          .hero-buttons {
            justify-content: center;
          }
          .trust {
            justify-content: center;
          }
          .hero-content--minimal h1 {
            white-space: normal;
          }
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .step-item { justify-content: center !important; }
          .step-content { width: 100% !important; padding: 0 !important; text-align: center !important; }
          .step-marker { display: none !important; }
          .desktop-vertical-line { display: none !important; }
          .step-item { margin-bottom: 2rem !important; }
        }

        @media (min-width: 901px) and (max-width: 1024px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }

        @media (min-width: 1025px) {
          .step-marker { display: block !important; }
          .desktop-vertical-line { display: block !important; }
        }

        /* ── other page only — CTA positioning ── */
        .hero-content--minimal h1 {
          white-space: nowrap;
          font-size: clamp(1.8rem, 3.4vw, 3rem);
          margin-bottom: 0;
          margin-right:200px;
          font-family: 'Playfair Display', 'Times New Roman', serif;
          font-weight: 700;
        }

        .hero-content--minimal .hero-buttons {
          justify-content: center;
          margin-top: 1.5rem;
          margin-left: 180px;
        }

        .hero-content--minimal {
          margin-bottom: 300px;
          margin-left: -100px;
        }
      `}</style>

      {/* Bind the theme banner image into a CSS variable so .hero can use it */}
      <style>{`
        .hero { --hero-banner: url(${theme.bannerImage}); }
      `}</style>
    </div>
  );
}