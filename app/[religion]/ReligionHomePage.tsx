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

  const isHindu =
    theme.key === "hinduism-sikhism-buddhism-jainism";

  const hinduSlides = [
    {
      image: "/media/Hindu1.gif",
      heading: "Register Your Union.",
    },
    {
      image: "/media/Hindu2.jpeg",
      heading: "Anand Karaj. Legally Registered.",
    },
    {
      image: "/media/Hindu3.jpeg",
      heading: "Legally Yours.",
    },
    {
      image: "/media/Hindu4.png",
      heading: "One marriage, one form",
    },
  ];

 

  


  const whyUs = [
    
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

  const steps = [
    { num: "01", title: "Register & Upload", body: "Create your account and upload all required documents through our secure portal." },
    { num: "02", title: "Expert Review", body: "Our legal team verifies every document and flags any issues before submission." },
    { num: "03", title: "Government Filing", body: "We file your application with the correct registrar for your state and religion." },
    { num: "04", title: "Certificate Delivery", body: "Your official marriage certificate is delivered digitally and by post." },
  ];



const [currentSlide, setCurrentSlide] = React.useState(0);

React.useEffect(() => {
  if (theme.key !== "hinduism-sikhism-buddhism-jainism") return;

  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % hinduSlides.length);
  }, 4000);

  return () => clearInterval(interval);
}, [theme.key]);

  return (
    <div
      style={{
        fontFamily: "'Lato', sans-serif",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
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
        }}
      >
        {/* IMAGE LAYER */}
        {isHindu && hinduSlides.length > 0 ? (
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${hinduSlides[currentSlide]?.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    />
  </AnimatePresence>
) : (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${theme.bannerImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center bottom",
    }}
  />
)}

        

        {/* HERO CONTENT */}
        <div
  style={{
    position: "relative",
    zIndex: 2,
    maxWidth: 650,
    padding: "0 2rem",
    marginLeft: "58%",        // pushes it slightly from left edge
    textAlign: "left",       // 👈 left aligned
  }}
>
  <AnimatePresence mode="wait">
    <motion.h1
      key={
        isHindu && hinduSlides[currentSlide]
          ? hinduSlides[currentSlide].heading
          : theme.heroHeading
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      style={{
        fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", // 👈 reduced size
        fontWeight: 700,
        color: "#fff",
        lineHeight: 1.3,
        marginBottom: "1.2rem",
        fontFamily: "'Playfair Display', Georgia, serif",
      }}
    >
      {isHindu && hinduSlides[currentSlide]
        ? hinduSlides[currentSlide].heading
        : theme.heroHeading}
    </motion.h1>
  </AnimatePresence>

  <div
    style={{
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      justifyContent: "flex-start",  // 👈 align buttons left
    }}
  >
    <Link
      href={`/${theme.key}/register`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          padding: "12px 28px",
          borderRadius: 8,
          background: "#fff",
          color: theme.darkTeal,
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        Start Registration →
      </div>
    </Link>

    <Link
      href={`/${theme.key}/contact`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          padding: "12px 28px",
          borderRadius: 8,
          border: "1.5px solid rgba(255,255,255,0.4)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          fontWeight: 500,
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        Talk to an Expert
      </div>
    </Link>
  </div>
</div>
      </section>

     

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
              Register my marriage was built because we witnessed firsthand how many couples — especially those from
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


      {/* Why Marriage Registration is Important */}
<section
  style={{
    background: "#ffffff",
    padding: "6rem 2rem",
  }}
>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
      <h2
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          fontWeight: 700,
          color: "#0f4c4c",
          fontFamily: "'Playfair Display', Georgia, serif",
          marginBottom: "1rem",
        }}
      >
        Why Marriage Registration is Important
      </h2>

      <p
        style={{
          maxWidth: 640,
          margin: "0 auto",
          color: "#4b7b7b",
          fontSize: "1rem",
          lineHeight: 1.7,
        }}
      >
        A legally registered marriage protects your rights, secures your
        future, and ensures government recognition of your union.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {[
        {
          title: "Protection of Rights",
          text: "Ensures inheritance rights, maintenance claims, and financial security for both spouses.",
        },
        {
          title: "Visa & Immigration",
          text: "Mandatory for spouse visas, passport updates, and international relocation.",
        },
        {
          title: "Financial & Insurance Benefits",
          text: "Required for bank nominations, insurance claims, pensions, and joint investments.",
        },
        {
          title: "Child Documentation",
          text: "Simplifies birth certificates, school admissions, and official records for children.",
        },
      ].map((item, index) => (
        <div
          key={index}
          style={{
            padding: "2rem",
            borderRadius: 14,
            background: "#f8fefe",
            border: "1px solid #d1f3f1",
            transition: "all 0.3s ease",
          }}
        >
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#0d9488",
              marginBottom: "0.6rem",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {item.title}
          </h3>

          <p
            style={{
              color: "#4b7b7b",
              fontSize: "0.92rem",
              lineHeight: 1.7,
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

<section style={{ background: theme.lightTeal, padding: "6rem 2rem" }}>
  <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
    <div style={{textAlign: "center", marginBottom: "4rem" }}>
      <span
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: theme.accentTeal,
          fontWeight: 600,
        }}
      >
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
    </div>

    {/* Vertical Line */}
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "140px",
        bottom: 0,
        width: "3px",
        background: theme.accentTeal,
        transform: "translateX(-50%)",
      }}
    />

    {steps.map((step, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent:
            index % 2 === 0 ? "flex-start" : "flex-end",
          marginBottom: "4rem",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "45%",
            padding:
              index % 2 === 0
                ? "0 2rem 0 0"
                : "0 0 0 2rem",
            textAlign:
              index % 2 === 0 ? "right" : "left",
          }}
        >
          <div
            style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: theme.accentTeal,
              marginBottom: "0.4rem",
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

          <div
            style={{
              color: "#4b7b7b",
              fontSize: "0.9rem",
              lineHeight: 1.7,
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
            background: theme.accentTeal,
            borderRadius: "50%",
            border: `4px solid ${theme.lightTeal}`,
          }}
        />
      </div>
    ))}
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
              Why Register my marriage
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
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
                <img
  src={`/media/icons/icon${i + 1}.png`}
  alt={item.title}
  style={{
    width: "36px",
    height: "36px",
    objectFit: "contain",
    flexShrink: 0,
  }}
/>
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
              Register today. Protect forever.

            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.9, fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              Takes less than 10 minutes. Valid for a lifetime.
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
              Register my marriage
            </div>
            <div>India's trusted marriage registration platform</div>
          </div>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <Link href={`/${theme.key}/blog`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Blogs</Link>
            <Link href={`/${theme.key}/contact`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Contact</Link>
            <Link href={`/${theme.key}/register`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Register</Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Change Religion</Link>
          </div>
          <div>© 2024 Register my marriage · All Rights Reserved</div>
        </div>
      </footer>
    </div>
  );
}