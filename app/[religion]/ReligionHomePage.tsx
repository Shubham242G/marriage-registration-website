"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { ReligionTheme } from "../types/Religion";

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
  const whyUs = [
    {
      icon: "⚖️",
      title: "Legal Expertise",
      body: "Our in-house legal team has processed thousands of registrations across all Indian states. We know the law — and we know how it's applied on the ground.",
    },
    {
      icon: "📋",
      title: "End-to-End Guidance",
      body: "From document preparation to final certificate delivery, we handle every step. You never have to visit a government office or decipher bureaucratic language.",
    },
    {
      icon: "🔒",
      title: "Complete Privacy",
      body: "All your documents and personal information are encrypted and handled with the highest standards of confidentiality.",
    },
    {
      icon: "🕐",
      title: "Faster Processing",
      body: "Our experience means fewer errors, fewer rejections, and faster turnaround. Most certificates are delivered within 7–15 working days.",
    },
    {
      icon: "🤝",
      title: "Dedicated Support",
      body: "A dedicated case manager is assigned to your registration — a real person you can reach by phone or email with any question.",
    },
    {
      icon: "🌐",
      title: "All-Religion Coverage",
      body: "We are fluent in the legal nuances of Hindu, Muslim, Christian, Sikh, Buddhist, Jain, and civil marriages. No case is too complex.",
    },
  ];

  const steps = [
    { num: "01", title: "Register & Upload", body: "Create your account and upload all required documents through our secure portal." },
    { num: "02", title: "Expert Review", body: "Our legal team verifies every document and flags any issues before submission." },
    { num: "03", title: "Government Filing", body: "We file your application with the correct registrar for your state and religion." },
    { num: "04", title: "Certificate Delivery", body: "Your official marriage certificate is delivered digitally and by post." },
  ];

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <Navbar religionKey={theme.key} />

      {/* ── HERO BANNER ── */}
      <section
        style={{
          background: theme.bannerBg,
          padding: "5rem 2rem 4.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)",
          }}
        />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div  initial="hidden" animate="visible" custom={0}>
            <div
              style={{
                display: "inline-block",
                padding: "5px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                color: "#ccfbf1",
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              {theme.subtitle}
            </div>
          </motion.div>

          <motion.h1
            
            initial="hidden"
            animate="visible"
            custom={1}
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: "1.25rem",
              letterSpacing: "-0.02em",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {theme.heroHeading}
          </motion.h1>

          <motion.p
            
            initial="hidden"
            animate="visible"
            custom={2}
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.8,
              maxWidth: 620,
              margin: "0 auto 2.5rem",
              fontWeight: 300,
            }}
          >
            {theme.heroSubtext}
          </motion.p>

          <motion.div
           
            initial="hidden"
            animate="visible"
            custom={3}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href={`/${theme.key}/register`} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "14px 32px",
                  borderRadius: 10,
                  background: "#fff",
                  color: theme.darkTeal,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Start Registration →
              </motion.div>
            </Link>
            <Link href={`/${theme.key}/contact`} style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "14px 32px",
                  borderRadius: 10,
                  border: "1.5px solid rgba(255,255,255,0.35)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Talk to an Expert
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── LEGAL ACTS STRIP ── */}
      <div
        style={{
          background: theme.lightTeal,
          borderBottom: `1px solid ${theme.borderColor}`,
          padding: "1rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem 2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "#6b9e9e", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Covered under:
        </span>
        {theme.legalActs.map((act) => (
          <span
            key={act}
            style={{
              fontSize: "0.78rem",
              color: theme.darkTeal,
              fontWeight: 600,
              padding: "3px 12px",
              borderRadius: 999,
              background: "#fff",
              border: `1px solid ${theme.borderColor}`,
            }}
          >
            {act}
          </span>
        ))}
      </div>

      {/* ── ABOUT / DESCRIPTION ── */}
      <section style={{ padding: "5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: theme.accentTeal,
                fontWeight: 600,
              }}
            >
              Who We Are
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: "#0f4c4c",
                lineHeight: 1.25,
                margin: "0.75rem 0 1.5rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Simplifying Marriage Registration for Every Indian Family
            </h2>
            <p style={{ color: "#4b7b7b", lineHeight: 1.9, fontSize: "0.98rem", marginBottom: "1.25rem" }}>
              {theme.description}
            </p>
            <p style={{ color: "#4b7b7b", lineHeight: 1.9, fontSize: "0.98rem" }}>
              VivahSetu was built because we witnessed firsthand how many couples — especially those from
              communities unfamiliar with government procedures — struggled to navigate the registration process.
              Documents were rejected over minor technicalities. Appointments were missed. Years passed without
              a certificate. We exist to ensure that never happens to another couple.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {theme.howWeHelp.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "1.25rem 1.5rem",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderColor}`,
                  background: theme.lightTeal,
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
                    background: theme.accentTeal,
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
                      color: "#0f4c4c",
                      marginBottom: "0.3rem",
                      fontSize: "0.92rem",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ color: "#4b7b7b", fontSize: "0.85rem", lineHeight: 1.7 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: theme.lightTeal, padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: theme.accentTeal, fontWeight: 600 }}>
              The Process
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: "#0f4c4c",
                marginTop: "0.75rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Four Steps to Your Certificate
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: "2rem",
                  borderRadius: 14,
                  background: "#fff",
                  border: `1px solid ${theme.borderColor}`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: theme.borderColor,
                    lineHeight: 1,
                    marginBottom: "0.75rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#0f4c4c",
                    marginBottom: "0.5rem",
                    fontSize: "1rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {step.title}
                </div>
                <div style={{ color: "#4b7b7b", fontSize: "0.87rem", lineHeight: 1.7 }}>{step.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST US ── */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: theme.accentTeal, fontWeight: 600 }}>
              Why VivahSetu
            </span>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: "#0f4c4c",
                marginTop: "0.75rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Built Around Your Trust
            </h2>
            <p style={{ color: "#4b7b7b", maxWidth: 560, margin: "1rem auto 0", lineHeight: 1.8, fontSize: "0.97rem" }}>
              Thousands of couples have trusted us to handle one of the most important documents of their lives.
              Here is why they choose us over the traditional route.
            </p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(13,148,136,0.1)" }}
                style={{
                  padding: "1.75rem",
                  borderRadius: 14,
                  border: "1px solid #e0f2f1",
                  background: "#fff",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  transition: "all 0.25s ease",
                }}
              >
                <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f4c4c", marginBottom: "0.4rem", fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {item.title}
                  </div>
                  <div style={{ color: "#4b7b7b", fontSize: "0.87rem", lineHeight: 1.7 }}>{item.body}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDIA MARRIAGE CONTEXT ── */}
      <section style={{ background: "#0f4c4c", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "1.5rem",
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Why Legal Registration Matters in India
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.9, fontSize: "1rem", marginBottom: "1.5rem" }}>
              Despite India performing over 10 million marriages annually, a significant percentage remain unregistered.
              An unregistered marriage can create serious problems: difficulty obtaining a spouse visa, inability to
              claim inheritance, challenges in changing surname on government documents, and complications in
              legal proceedings. The Supreme Court of India has repeatedly emphasised that marriage registration
              must be made compulsory.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.9, fontSize: "1rem", marginBottom: "2.5rem" }}>
              VivahSetu exists to make compliance the default — not the exception. We believe every married couple
              in India, regardless of religion, language, or geography, deserves a registered marriage certificate
              delivered without confusion, delay, or unnecessary expense.
            </p>
            <Link href={`/${theme.key}/register`} style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  borderRadius: 10,
                  background: "#fff",
                  color: "#0f4c4c",
                  fontWeight: 700,
                  fontSize: "0.95rem",
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
          background: "#0a3a3a",
          padding: "3rem 2rem",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.78rem",
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem", fontFamily: "'Playfair Display', Georgia, serif" }}>
              VivahSetu
            </div>
            <div>India's trusted marriage registration platform</div>
          </div>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <Link href={`/${theme.key}/blog`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Blogs</Link>
            <Link href={`/${theme.key}/contact`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Contact</Link>
            <Link href={`/${theme.key}/register`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Register</Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Change Religion</Link>
          </div>
          <div>© 2024 VivahSetu · All Rights Reserved</div>
        </div>
      </footer>
    </div>
  );
}