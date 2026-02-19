"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/Navbar";
import { RELIGION_THEMES } from "../../constants/Religions";
import { ReligionKey } from "../../types/Religion";

interface PageProps {
  params: Promise<{ religion: string }>;
}

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  religion: string;
  queryType: string;
  marriageDate: string;
  state: string;
  message: string;
  preferredContact: string;
}

const QUERY_TYPES = [
  "Document Requirements",
  "Registration Process",
  "Timeline & Fees",
  "Application Status",
  "Legal Advice",
  "Technical Support",
  "Other",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
];

export default function ContactPage({ params }: PageProps) {
    const { religion } = use(params);   
const theme = RELIGION_THEMES[religion as ReligionKey];   const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    religion: theme?.label || "",
    queryType: "",
    marriageDate: "",
    state: "",
    message: "",
    preferredContact: "email",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  if (!theme) return null;

  const set = (field: keyof ContactForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<ContactForm> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Valid email required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) newErrors.phone = "Valid 10-digit Indian mobile number required";
    if (!form.queryType) newErrors.queryType = "Please select a query type";
    if (!form.state) newErrors.state = "Please select your state";
    if (!form.message.trim() || form.message.trim().length < 20)
      newErrors.message = "Please describe your query in at least 20 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Wire to your backend contact endpoint here
      // await axios.post(`${BASE_URL}/contact`, form);
      await new Promise((r) => setTimeout(r, 1200)); // simulate
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 9,
    border: "1.5px solid #e0f2f1",
    fontSize: "0.9rem",
    fontFamily: "'Lato', sans-serif",
    color: "#0f4c4c",
    background: "#fafffe",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "0.74rem",
    color: "#dc2626",
    marginTop: 4,
  };

  const Label = ({ text, required }: { text: string; required?: boolean }) => (
    <label
      style={{
        display: "block",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#0f4c4c",
        marginBottom: 6,
        letterSpacing: "0.02em",
      }}
    >
      {text} {required && <span style={{ color: "#0d9488" }}>*</span>}
    </label>
  );

  const contactInfo = [
    { icon: "📧", label: "Email", value: "help@vivahsetu.in" },
    { icon: "📞", label: "Phone", value: "+91 98765 43210" },
    { icon: "🕐", label: "Hours", value: "Mon–Sat, 9am – 7pm IST" },
    { icon: "📍", label: "Office", value: "New Delhi, India" },
  ];

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#fafffe", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus, textarea:focus { border-color: #0d9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
      `}</style>

      <Navbar religionKey={theme.key} />

      {/* Header */}
      <section style={{ background: theme.bannerBg, padding: "4rem 2rem 3.5rem", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#ccfbf1", display: "block", marginBottom: "0.75rem" }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "1rem" }}>
            How Can We Help You?
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", maxWidth: 480, margin: "0 auto", lineHeight: 1.8, fontSize: "0.97rem" }}>
            Our experts are ready to answer your questions and guide you through every step of your marriage registration.
          </p>
        </motion.div>
      </section>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2rem 5rem", display: "grid", gridTemplateColumns: "1fr 360px", gap: "3rem", alignItems: "start" }}>

        {/* ── FORM ── */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                borderRadius: 16,
                background: "#fff",
                border: "1px solid #e0f2f1",
                boxShadow: "0 4px 24px rgba(13,148,136,0.07)",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>✅</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "1rem" }}>
                Message Received
              </h2>
              <p style={{ color: "#4b7b7b", lineHeight: 1.8 }}>
                Thank you, <strong>{form.name}</strong>. We've received your query and a team member will reach out
                to you via <strong>{form.preferredContact}</strong> within <strong>24 working hours</strong>.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e0f2f1",
                padding: "2.5rem",
                boxShadow: "0 4px 24px rgba(13,148,136,0.06)",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "0.4rem" }}>
                Send Us a Message
              </h2>
              <p style={{ color: "#6b9e9e", fontSize: "0.84rem", marginBottom: "2rem" }}>
                Fill in the details below and we'll get back to you promptly.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

                {/* Full Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Label text="Full Name" required />
                  <input style={{ ...inputBase, borderColor: errors.name ? "#dc2626" : "#e0f2f1" }} placeholder="As per Aadhaar / PAN" value={form.name} onChange={set("name")} />
                  {errors.name && <p style={errorStyle}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label text="Email Address" required />
                  <input type="email" style={{ ...inputBase, borderColor: errors.email ? "#dc2626" : "#e0f2f1" }} placeholder="you@example.com" value={form.email} onChange={set("email")} />
                  {errors.email && <p style={errorStyle}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <Label text="Mobile Number" required />
                  <input style={{ ...inputBase, borderColor: errors.phone ? "#dc2626" : "#e0f2f1" }} placeholder="10-digit mobile number" value={form.phone} onChange={set("phone")} maxLength={10} />
                  {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
                </div>

                {/* Query Type */}
                <div>
                  <Label text="Nature of Query" required />
                  <select style={{ ...inputBase, borderColor: errors.queryType ? "#dc2626" : "#e0f2f1" }} value={form.queryType} onChange={set("queryType")}>
                    <option value="">Select query type...</option>
                    {QUERY_TYPES.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                  {errors.queryType && <p style={errorStyle}>{errors.queryType}</p>}
                </div>

                {/* State */}
                <div>
                  <Label text="State of Marriage" required />
                  <select style={{ ...inputBase, borderColor: errors.state ? "#dc2626" : "#e0f2f1" }} value={form.state} onChange={set("state")}>
                    <option value="">Select state...</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p style={errorStyle}>{errors.state}</p>}
                </div>

                {/* Marriage Date */}
                <div>
                  <Label text="Date of Marriage" />
                  <input type="date" style={{ ...inputBase, colorScheme: "light" }} value={form.marriageDate} onChange={set("marriageDate")} />
                </div>

                {/* Preferred Contact */}
                <div>
                  <Label text="Preferred Mode of Response" />
                  <select style={inputBase} value={form.preferredContact} onChange={set("preferredContact")}>
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                {/* Message */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Label text="Your Query / Message" required />
                  <textarea
                    rows={5}
                    style={{ ...inputBase, resize: "vertical", borderColor: errors.message ? "#dc2626" : "#e0f2f1" }}
                    placeholder="Please describe your query in detail. Include any specific challenges you're facing with your documentation or registration process..."
                    value={form.message}
                    onChange={set("message")}
                  />
                  {errors.message && <p style={errorStyle}>{errors.message}</p>}
                  <p style={{ fontSize: "0.72rem", color: "#6b9e9e", marginTop: 4 }}>{form.message.length} / 1000 characters</p>
                </div>

              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  marginTop: "1.75rem",
                  width: "100%",
                  padding: "14px",
                  borderRadius: 10,
                  border: "none",
                  background: submitting ? "#6b9e9e" : "linear-gradient(135deg, #0d9488, #0f4c4c)",
                  color: "#fff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  letterSpacing: "0.04em",
                  fontFamily: "'Lato', sans-serif",
                  transition: "background 0.2s",
                }}
              >
                {submitting ? "Sending..." : "Send Message →"}
              </motion.button>

              <p style={{ fontSize: "0.72rem", color: "#6b9e9e", textAlign: "center", marginTop: "1rem" }}>
                We typically respond within 24 working hours. Your information is kept strictly confidential.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── SIDEBAR ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Contact Info */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e0f2f1", padding: "1.75rem", boxShadow: "0 2px 12px rgba(13,148,136,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "1.25rem" }}>
              Contact Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {contactInfo.map((item) => (
                <div key={item.label} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#6b9e9e", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: "0.88rem", color: "#0f4c4c", fontWeight: 600 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ background: theme.lightTeal, borderRadius: 14, border: `1px solid ${theme.borderColor}`, padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "1.25rem" }}>
              Common Questions
            </h3>
            {[
              ["How long does registration take?", "Typically 7–21 working days depending on state and document completeness."],
              ["Do I need to visit any office?", "No. Our process is fully digital. We handle all government interactions."],
              ["What if my documents are rejected?", "We resubmit at no extra charge — our team reviews everything before filing."],
            ].map(([q, a]) => (
              <div key={q} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: `1px solid ${theme.borderColor}` }}>
                <div style={{ fontWeight: 600, color: "#0f4c4c", fontSize: "0.84rem", marginBottom: "0.3rem" }}>{q}</div>
                <div style={{ color: "#4b7b7b", fontSize: "0.8rem", lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #0f4c4c, #0d9488)", borderRadius: 14, padding: "1.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.8rem", color: "#ccfbf1", marginBottom: "0.5rem" }}>Ready to start?</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "1.25rem" }}>
              Register your marriage today
            </div>
            <a
              href={`/${theme.key}/register`}
              style={{
                display: "block",
                padding: "10px",
                borderRadius: 8,
                background: "#fff",
                color: "#0f4c4c",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.87rem",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Get Started →
            </a>
          </div>
        </motion.div>
      </main>

      <footer style={{ background: "#0a3a3a", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
        © 2024 VivahSetu · All Rights Reserved
      </footer>
    </div>
  );
}