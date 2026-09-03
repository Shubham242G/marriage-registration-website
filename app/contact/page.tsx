"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";

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
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

const figmaColors = {
  bg: "#E4E0D5",
  darkText: "#4A0E19",
  lightBg: "#F0FDFA",
  cardBg: "#F8FEFE",
  white: "#FFFFFF",
  darkBg: "#380913",
  cream: "#F7F3EA",
  muted: "#76555C",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    religion: "",
    queryType: "",
    marriageDate: "",
    state: "",
    message: "",
    preferredContact: "email",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const set =
    (field: keyof ContactForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((p) => ({
        ...p,
        [field]: e.target.value,
      }));

      setErrors((p) => ({
        ...p,
        [field]: "",
      }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Valid email required";
    }

    if (!form.phone.match(/^[6-9]\d{9}$/)) {
      newErrors.phone = "Valid 10-digit Indian mobile number required";
    }

    if (!form.queryType) {
      newErrors.queryType = "Please select a query type";
    }

    if (!form.state) {
      newErrors.state = "Please select your state";
    }

    if (
      !form.message.trim() ||
      form.message.trim().length < 20
    ) {
      newErrors.message =
        "Please describe your query in at least 20 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Wire to your backend contact endpoint here.
      // Example:
      // await axios.post(`${BASE_URL}/contact`, form);

      await new Promise((r) => setTimeout(r, 1200));

      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1.5px solid ${figmaColors.darkText}`,
    fontSize: "0.9rem",
    fontFamily: "'Lato', sans-serif",
    color: figmaColors.darkText,
    background: "#FFFFFF",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "0.74rem",
    color: "#B91C1C",
    marginTop: 5,
  };

  const Label = ({
    text,
    required,
  }: {
    text: string;
    required?: boolean;
  }) => (
    <label
      style={{
        display: "block",
        fontSize: "0.78rem",
        fontWeight: 700,
        color: figmaColors.darkText,
        marginBottom: 7,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {text}{" "}
      {required && (
        <span style={{ color: figmaColors.darkText }}>*</span>
      )}
    </label>
  );

  const contactInfo = [
    {
      icon: "✉",
      label: "Email",
      value: "info@registermymarriage.in",
    },
    {
      icon: "☎",
      label: "Phone",
      value: "+91 98765 43210",
    },
    {
      icon: "◷",
      label: "Hours",
      value: "Mon–Sat, 9am – 7pm IST",
    },
    {
      icon: "⌖",
      label: "Office",
      value: "New Delhi, India",
    },
  ];

  const faqs = [
    [
      "How long does registration take?",
      "Typically 7–21 working days depending on state and document completeness.",
    ],
    [
      "Do I need to visit any office?",
      "No. Our process is fully digital. We handle all government interactions.",
    ],
    [
      "What if my documents are rejected?",
      "We resubmit at no extra charge — our team reviews everything before filing.",
    ],
  ];

  return (
    <div
      style={{
        fontFamily: "'Lato', sans-serif",
        background: figmaColors.bg,
        minHeight: "100vh",
        color: figmaColors.darkText,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #4A0E19 !important;
          box-shadow: 0 0 0 3px rgba(74,14,25,0.08);
        }

        input::placeholder,
        textarea::placeholder {
          color: #9B7D82;
        }

        select {
          appearance: auto;
        }

        .contact-main-grid {
          grid-template-columns: minmax(0, 1fr) 360px;
        }

        .contact-form-grid {
          grid-template-columns: 1fr 1fr;
        }

        .contact-card-hover {
          transition: all 0.25s ease;
        }

        .contact-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(74,14,25,0.10);
        }

        .contact-link:hover {
          color: #FFFFFF !important;
        }

        @media (max-width: 800px) {
          .contact-main-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 600px) {
          .contact-form-grid {
            grid-template-columns: 1fr !important;
          }

          .contact-form-card {
            padding: 1.5rem !important;
          }

          .contact-main-grid {
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
        }
      `}</style>

      {/* ───────────────── NAVBAR ───────────────── */}

      <Navbar />

      {/* ───────────────── HERO / HEADER ───────────────── */}

      <section
        style={{
          background: figmaColors.darkBg,
          padding: "5.5rem 2rem 5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}

        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            top: -120,
            left: -80,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
            bottom: -280,
            right: -100,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#D9BFC4",
              display: "block",
              marginBottom: "1rem",
              fontWeight: 700,
            }}
          >
            Get In Touch
          </span>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "'Playfair Display', Georgia, serif",
              lineHeight: 1.2,
              marginBottom: "1.2rem",
            }}
          >
            How Can We Help You?
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              maxWidth: 570,
              margin: "0 auto",
              lineHeight: 1.9,
              fontSize: "0.98rem",
            }}
          >
            Have questions about marriage registration? Our experts
            are ready to guide you through every step with clarity
            and care.
          </p>
        </motion.div>
      </section>

      {/* ───────────────── MAIN CONTENT ───────────────── */}

      <main
        className="contact-main-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "5rem 2rem 6rem",
          display: "grid",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* ───────────── FORM ───────────── */}

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{ duration: 0.5 }}
              className="contact-card-hover"
              style={{
                textAlign: "center",
                padding: "4.5rem 2rem",
                borderRadius: 14,
                background: figmaColors.cardBg,
                border: `1px solid ${figmaColors.darkText}`,
                boxShadow: "0 8px 30px rgba(74,14,25,0.08)",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: figmaColors.darkText,
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  margin: "0 auto 1.5rem",
                }}
              >
                ✓
              </div>

              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: figmaColors.darkText,
                  fontFamily:
                    "'Playfair Display', Georgia, serif",
                  marginBottom: "1rem",
                }}
              >
                Message Received
              </h2>

              <p
                style={{
                  color: figmaColors.muted,
                  lineHeight: 1.9,
                  maxWidth: 520,
                  margin: "0 auto",
                  fontSize: "0.95rem",
                }}
              >
                Thank you,{" "}
                <strong style={{ color: figmaColors.darkText }}>
                  {form.name}
                </strong>
                . We've received your query and a team member
                will reach out to you via{" "}
                <strong style={{ color: figmaColors.darkText }}>
                  {form.preferredContact}
                </strong>{" "}
                within{" "}
                <strong style={{ color: figmaColors.darkText }}>
                  24 working hours
                </strong>
                .
              </p>

              <Link
                href="/"
                style={{
                  display: "inline-block",
                  marginTop: "2rem",
                  padding: "11px 25px",
                  borderRadius: 8,
                  background: figmaColors.darkText,
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                Back to Home →
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.6 }}
              className="contact-form-card"
              style={{
                background: figmaColors.cardBg,
                borderRadius: 14,
                border: `1px solid ${figmaColors.darkText}`,
                padding: "2.5rem",
                boxShadow: "0 8px 30px rgba(74,14,25,0.06)",
              }}
            >
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: figmaColors.darkText,
                    fontWeight: 700,
                    opacity: 0.65,
                  }}
                >
                  Send A Message
                </span>

                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: figmaColors.darkText,
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
                    marginTop: "0.6rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Let's Talk
                </h2>

                <p
                  style={{
                    color: figmaColors.muted,
                    fontSize: "0.86rem",
                    lineHeight: 1.7,
                  }}
                >
                  Fill in the details below and our team will get
                  back to you promptly.
                </p>
              </div>

              <div
                className="contact-form-grid"
                style={{
                  display: "grid",
                  gap: "1.35rem",
                }}
              >
                {/* Full Name */}

                <div
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <Label text="Full Name" required />

                  <input
                    style={{
                      ...inputBase,
                      borderColor: errors.name
                        ? "#B91C1C"
                        : figmaColors.darkText,
                    }}
                    placeholder="As per Aadhaar / PAN"
                    value={form.name}
                    onChange={set("name")}
                  />

                  {errors.name && (
                    <p style={errorStyle}>{errors.name}</p>
                  )}
                </div>

                {/* Email */}

                <div>
                  <Label text="Email Address" required />

                  <input
                    type="email"
                    style={{
                      ...inputBase,
                      borderColor: errors.email
                        ? "#B91C1C"
                        : figmaColors.darkText,
                    }}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                  />

                  {errors.email && (
                    <p style={errorStyle}>{errors.email}</p>
                  )}
                </div>

                {/* Phone */}

                <div>
                  <Label text="Mobile Number" required />

                  <input
                    style={{
                      ...inputBase,
                      borderColor: errors.phone
                        ? "#B91C1C"
                        : figmaColors.darkText,
                    }}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={set("phone")}
                    maxLength={10}
                    inputMode="numeric"
                  />

                  {errors.phone && (
                    <p style={errorStyle}>{errors.phone}</p>
                  )}
                </div>

                {/* Query Type */}

                <div>
                  <Label text="Nature of Query" required />

                  <select
                    style={{
                      ...inputBase,
                      borderColor: errors.queryType
                        ? "#B91C1C"
                        : figmaColors.darkText,
                    }}
                    value={form.queryType}
                    onChange={set("queryType")}
                  >
                    <option value="">
                      Select query type...
                    </option>

                    {QUERY_TYPES.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>

                  {errors.queryType && (
                    <p style={errorStyle}>
                      {errors.queryType}
                    </p>
                  )}
                </div>

                {/* State */}

                <div>
                  <Label text="State of Marriage" required />

                  <select
                    style={{
                      ...inputBase,
                      borderColor: errors.state
                        ? "#B91C1C"
                        : figmaColors.darkText,
                    }}
                    value={form.state}
                    onChange={set("state")}
                  >
                    <option value="">
                      Select state...
                    </option>

                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  {errors.state && (
                    <p style={errorStyle}>{errors.state}</p>
                  )}
                </div>

                {/* Marriage Date */}

                <div>
                  <Label text="Date of Marriage" />

                  <input
                    type="date"
                    style={{
                      ...inputBase,
                      colorScheme: "light",
                    }}
                    value={form.marriageDate}
                    onChange={set("marriageDate")}
                  />
                </div>

                {/* Preferred Contact */}

                <div>
                  <Label text="Preferred Mode of Response" />

                  <select
                    style={inputBase}
                    value={form.preferredContact}
                    onChange={set("preferredContact")}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                {/* Message */}

                <div
                  style={{
                    gridColumn: "1 / -1",
                  }}
                >
                  <Label text="Your Query / Message" required />

                  <textarea
                    rows={5}
                    maxLength={1000}
                    style={{
                      ...inputBase,
                      resize: "vertical",
                      minHeight: 130,
                      borderColor: errors.message
                        ? "#B91C1C"
                        : figmaColors.darkText,
                    }}
                    placeholder="Please describe your query in detail. Include any specific challenges you're facing with your documentation or registration process..."
                    value={form.message}
                    onChange={set("message")}
                  />

                  {errors.message && (
                    <p style={errorStyle}>{errors.message}</p>
                  )}

                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: figmaColors.muted,
                      marginTop: 5,
                      textAlign: "right",
                    }}
                  >
                    {form.message.length} / 1000 characters
                  </p>
                </div>
              </div>

              {/* Submit */}

              <motion.button
                whileHover={{
                  scale: 1.015,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  marginTop: "1.75rem",
                  width: "100%",
                  padding: "14px",
                  borderRadius: 8,
                  border: `1.5px solid ${figmaColors.darkText}`,
                  background: submitting
                    ? "#76555C"
                    : figmaColors.darkText,
                  color: "#FFFFFF",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: submitting
                    ? "not-allowed"
                    : "pointer",
                  letterSpacing: "0.04em",
                  fontFamily: "'Lato', sans-serif",
                  transition: "all 0.25s ease",
                }}
              >
                {submitting
                  ? "Sending..."
                  : "Send Message →"}
              </motion.button>

              <p
                style={{
                  fontSize: "0.7rem",
                  color: figmaColors.muted,
                  textAlign: "center",
                  marginTop: "1rem",
                  lineHeight: 1.6,
                }}
              >
                We typically respond within 24 working hours.
                Your information is kept strictly confidential.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───────────── SIDEBAR ───────────── */}

        <motion.div
          initial={{
            opacity: 0,
            x: 25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.6,
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Contact Information */}

          <div
            className="contact-card-hover"
            style={{
              background: figmaColors.cardBg,
              borderRadius: 14,
              border: `1px solid ${figmaColors.darkText}`,
              padding: "1.75rem",
              boxShadow: "0 4px 20px rgba(74,14,25,0.05)",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: figmaColors.darkText,
                fontWeight: 700,
                opacity: 0.65,
              }}
            >
              Reach Us
            </span>

            <h3
              style={{
                fontSize: "1.45rem",
                fontWeight: 700,
                color: figmaColors.darkText,
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                marginTop: "0.55rem",
                marginBottom: "1.5rem",
              }}
            >
              Contact Information
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    gap: "0.9rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: figmaColors.darkText,
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: figmaColors.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 3,
                        fontWeight: 700,
                      }}
                    >
                      {item.label}
                    </div>

                    <div
                      style={{
                        fontSize: "0.88rem",
                        color: figmaColors.darkText,
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Questions */}

          <div
            className="contact-card-hover"
            style={{
              background: figmaColors.cardBg,
              borderRadius: 14,
              border: `1px solid ${figmaColors.darkText}`,
              padding: "1.75rem",
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: figmaColors.darkText,
                fontWeight: 700,
                opacity: 0.65,
              }}
            >
              FAQ
            </span>

            <h3
              style={{
                fontSize: "1.45rem",
                fontWeight: 700,
                color: figmaColors.darkText,
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                marginTop: "0.55rem",
                marginBottom: "1.4rem",
              }}
            >
              Common Questions
            </h3>

            {faqs.map(([q, a], index) => (
              <div
                key={q}
                style={{
                  marginBottom:
                    index === faqs.length - 1 ? 0 : "1.1rem",
                  paddingBottom:
                    index === faqs.length - 1 ? 0 : "1.1rem",
                  borderBottom:
                    index === faqs.length - 1
                      ? "none"
                      : `1px solid rgba(74,14,25,0.25)`,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: figmaColors.darkText,
                    fontSize: "0.86rem",
                    marginBottom: "0.35rem",
                    fontFamily:
                      "'Playfair Display', Georgia, serif",
                  }}
                >
                  {q}
                </div>

                <div
                  style={{
                    color: figmaColors.muted,
                    fontSize: "0.8rem",
                    lineHeight: 1.7,
                  }}
                >
                  {a}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}

          <motion.div
            whileHover={{
              y: -3,
            }}
            transition={{
              duration: 0.25,
            }}
            style={{
              background: figmaColors.darkBg,
              borderRadius: 14,
              padding: "2rem 1.75rem",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(56,9,19,0.15)",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#D9BFC4",
                marginBottom: "0.7rem",
                fontWeight: 700,
              }}
            >
              Ready to start?
            </div>

            <div
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                marginBottom: "1.35rem",
                lineHeight: 1.3,
              }}
            >
              Register Your Marriage Today
            </div>

            <Link
              href="/register"
              style={{
                display: "block",
                padding: "11px",
                borderRadius: 8,
                background: "#FFFFFF",
                color: figmaColors.darkText,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.87rem",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Get Started →
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* ───────────────── CTA ───────────────── */}

      <section
        style={{
          background: figmaColors.darkBg,
          padding: "4.5rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: 850,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#D9BFC4",
                fontWeight: 700,
              }}
            >
              Begin Your Journey
            </span>

            <h2
              style={{
                fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: "#FFFFFF",
                marginTop: "0.8rem",
                marginBottom: "1rem",
                fontFamily:
                  "'Playfair Display', Georgia, serif",
              }}
            >
              Ready to Make It Official?
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.8,
                fontSize: "0.95rem",
                maxWidth: 560,
                margin: "0 auto 1.75rem",
              }}
            >
              Start your marriage registration today and let our
              team guide you through the process.
            </p>

            <Link
              href="/register"
              style={{
                display: "inline-block",
                padding: "13px 32px",
                borderRadius: 8,
                background: "#FFFFFF",
                color: figmaColors.darkText,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.03em",
              }}
            >
              Register Your Marriage →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}

      <footer
        style={{
          background: figmaColors.darkBg,
          padding: "2.5rem 2rem",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "1rem",
                marginBottom: "0.3rem",
                fontFamily:
                  "'Playfair Display', Georgia, serif",
              }}
            >
              Register my marriage
            </div>

            <div
              style={{
                opacity: 0.5,
              }}
            >
              India's trusted marriage registration platform
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
             <Link href={`/blog`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Blogs</Link>
            <Link href={`/contact`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Contact</Link>
            <Link href={`/register`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Register</Link>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Change Religion</Link>
          </div>

          <div
            style={{
              opacity: 0.5,
            }}
          >
            © 2024 RegisterMyMarriage · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}