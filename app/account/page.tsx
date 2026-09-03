"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  ReactNode,
} from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { RELIGION_THEMES } from "../constants/Religions";
import type { ReligionKey } from "../types/Religion";
import { useAuth } from "../context/AuthContext";
import {
  getMyDocument,
  createDocument,
  updateDocument,
  fileToBase64,
} from "../services/document.service";

type FormState = Record<string, any>;
type DocumentData = Record<string, any>;
type ImageField = string;

const colors = {
  bg: "#E4E0D5",
  darkText: "#4A0E19",
  lightBg: "#F0FDFA",
  cardBg: "#F8FEFE",
  white: "#FFFFFF",
  darkBg: "#380913",
  muted: "#765C62",
  border: "#D9C8C5",
  softBorder: "#E7DCD8",
  inputBg: "#FCFAF6",
  successBg: "#F0FDF4",
  successBorder: "#BBF7D0",
  successText: "#15803D",
  errorBg: "#FEF2F2",
  errorBorder: "#FECACA",
  errorText: "#B91C1C",
};

const EMPTY_FORM: FormState = {
  // Groom Documents
  groomAadharFront: "",
  groomAadharBack: "",
  groomVoterIdFront: "",
  groomVoterIdBack: "",
  groomPassportFront: "",
  groomPassportBack: "",
  groomBirthCertificateImage: "",

  // Bride Documents
  brideAadharFront: "",
  brideAadharBack: "",
  brideOtherProofImage: "",
  brideBirthProofImage: "",

  // Marriage Proof
  marriageProofPhoto: "",
  marriageProofCoupleImage: "",
  marriageProofInvitation: "",

  // Religious Certificate (Only for Sikh, Muslim, Christian)
  religiousCertificateImage: "",

  // Witness 1
  witness1AadharFront: "",
  witness1AadharBack: "",
  witness1PanCardPhoto: "",

  // Witness 2
  witness2AadharFront: "",
  witness2AadharBack: "",
  witness2PanCardPhoto: "",

  // Signatures
  signatureImageGroom: "",
  signatureImageBride: "",
  signatureImageWitness1: "",
  signatureImageWitness2: "",
};

function valueOrEmpty(value: any) {
  if (value === null || value === undefined) return "";
  return value;
}

function documentToForm(document: DocumentData): FormState {
  const form: FormState = { ...EMPTY_FORM };
  Object.keys(EMPTY_FORM).forEach((key) => {
    form[key] = valueOrEmpty(document?.[key]);
  });
  return form;
}

function cleanPayload(form: FormState): FormState {
  const payload = { ...form };
  delete payload._id;
  delete payload.__v;
  delete payload.createdAt;
  delete payload.updatedAt;
  delete payload.userId;
  delete payload.isDocumentVerified;
  delete payload.remark;
  delete payload.isDeleted;
  return payload;
}

function normalizeDocumentResponse(response: any): DocumentData | null {
  if (!response) return null;
  if (Array.isArray(response?.data)) {
    return response.data.length > 0 ? response.data[0] : null;
  }
  if (response?.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    if (response.data._id || response.data.userId) return response.data;
  }
  if (Array.isArray(response)) {
    return response.length > 0 ? response[0] : null;
  }
  if (response?._id || response?.userId) return response;
  return null;
}

/* =========================================================
   REUSABLE UI COMPONENTS
========================================================= */

function Label({ children }: { children: ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "clamp(12px, 1.2vw, 13px)",
        fontWeight: 700,
        marginBottom: 8,
        color: colors.darkText,
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      style={{
        marginBottom: "clamp(18px, 2vw, 26px)",
        padding: "clamp(16px, 2vw, 28px)",
        borderRadius: 16,
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 5px 22px rgba(74, 14, 25, 0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: "clamp(16px, 2vw, 24px)",
        }}
      >
        <div
          style={{
            width: 4,
            height: "clamp(20px, 2.5vw, 28px)",
            borderRadius: 999,
            background: colors.darkText,
          }}
        />
        <h2
          style={{
            fontSize: "clamp(17px, 1.8vw, 21px)",
            fontWeight: 700,
            margin: 0,
            color: colors.darkText,
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Grid({ children, columns = 2 }: { children: ReactNode; columns?: number }) {
  return (
    <div
      className="form-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: "clamp(12px, 1.5vw, 20px)",
      }}
    >
      {children}
    </div>
  );
}

function FileInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ImageField;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      setUploading(true);
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (error) {
      console.error("File upload error:", error);
      alert("Unable to process this file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div
        style={{
          border: `1px dashed ${colors.border}`,
          borderRadius: 12,
          padding: "clamp(10px, 1vw, 14px)",
          background: "#FBF9F4",
        }}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            width: "100%",
            fontSize: "clamp(11px, 1vw, 13px)",
            color: colors.darkText,
          }}
        />
        {uploading && (
          <p style={{ margin: "8px 0 0", fontSize: "clamp(10px, 1vw, 12px)", color: colors.muted }}>
            Processing file...
          </p>
        )}
        {value && !uploading && (
          <p style={{ 
            margin: "8px 0 0", 
            fontSize: "clamp(10px, 1vw, 12px)", 
            color: colors.successText, 
            fontWeight: 600 
          }}>
            ✓ File selected
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();

  const religion = (params?.religion as string) || "";
  const theme =
    RELIGION_THEMES[religion as ReligionKey] ||
    RELIGION_THEMES["hinduism-sikhism-buddhism-jainism"];

  const { token, isLoggedIn, logout } = useAuth();

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loadedTokenRef = useRef<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = useCallback((field: string, value: any) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
    setSuccess("");
  }, []);

  useEffect(() => {
    if (isLoggedIn) return;
    router.push(religion ? `/${religion}/login` : "/login");
  }, [isLoggedIn, religion, router]);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setLoading(false);
      return;
    }

    if (loadedTokenRef.current === token) return;
    loadedTokenRef.current = token;

    const loadDocument = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getMyDocument(token);
        const existingDocument = normalizeDocumentResponse(response);
        if (existingDocument) {
          setDocument(existingDocument);
          setForm(documentToForm(existingDocument));
          setIsSubmitted(true);
        } else {
          setDocument(null);
          setForm({ ...EMPTY_FORM });
          setIsSubmitted(false);
        }
      } catch (err: any) {
        console.error("Error loading document:", err);
        setError(err?.message || "Unable to load your documents.");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [token, isLoggedIn]);

  const refreshDocument = async () => {
    if (!token) return;
    try {
      const response = await getMyDocument(token);
      const existingDocument = normalizeDocumentResponse(response);
      if (existingDocument) {
        setDocument(existingDocument);
        setForm(documentToForm(existingDocument));
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Error refreshing document:", err);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Your session has expired. Please login again.");
      return;
    }

    setError("");
    setSuccess("");

    const payload = cleanPayload(form);

    setSaving(true);

    try {
      let response;
      if (document?._id) {
        response = await updateDocument(document._id, payload as any, token);
        setSuccess("Your documents have been updated successfully.");
      } else {
        response = await createDocument(payload as any, token);
        setSuccess("Your documents have been submitted successfully.");
      }

      await refreshDocument();
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Save document error:", err);
      setError(err?.message || "Something went wrong while saving your documents.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setForm({ ...EMPTY_FORM });
    setDocument(null);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isLoggedIn) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        input::placeholder,
        textarea::placeholder {
          color: #9A8589;
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }

          .account-main {
            padding: 20px 12px 40px !important;
          }

          .account-title {
            font-size: 28px !important;
          }

          .account-submit {
            width: 100% !important;
          }

          .success-state {
            padding: 40px 20px !important;
          }

          .success-icon {
            width: 60px !important;
            height: 60px !important;
            font-size: 30px !important;
          }

          .success-title {
            font-size: 22px !important;
          }

          .success-text {
            font-size: 14px !important;
          }

          .header-container {
            padding: 0.75rem 1rem !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }

          .header-back-link {
            font-size: 0.85rem !important;
          }

          .header-actions {
            gap: 0.5rem !important;
          }

          .header-actions button,
          .header-actions a {
            font-size: 0.75rem !important;
            padding: 6px 14px !important;
          }
        }

        @media (max-width: 480px) {
          .account-main {
            padding: 16px 10px 30px !important;
          }

          .account-title {
            font-size: 24px !important;
          }

          .section-title {
            font-size: 16px !important;
          }

          .success-state {
            padding: 30px 16px !important;
          }

          .success-icon {
            width: 50px !important;
            height: 50px !important;
            font-size: 24px !important;
          }

          .success-title {
            font-size: 20px !important;
          }

          .success-text {
            font-size: 13px !important;
          }

          .success-buttons {
            flex-direction: column !important;
            width: 100% !important;
          }

          .success-buttons button,
          .success-buttons a {
            width: 100% !important;
            text-align: center !important;
          }

          .header-container {
            padding: 0.5rem 0.75rem !important;
          }

          .header-back-link {
            font-size: 0.8rem !important;
          }

          .header-actions button,
          .header-actions a {
            font-size: 0.7rem !important;
            padding: 5px 10px !important;
          }
        }
      `}</style>

      {/* ── CUSTOM HEADER ── */}
      <div
        className="header-container"
        style={{
          padding: "1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${colors.darkText}15`,
          background: colors.bg,
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <Link
          href="/"
          className="header-back-link"
          style={{
            textDecoration: "none",
            color: colors.darkText,
            fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "'Lato', sans-serif",
          }}
        >
          ← Back to Home
        </Link>

        <div className="header-actions" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/account"
            style={{
              textDecoration: "none",
              color: colors.darkText,
              fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
              fontWeight: 600,
              fontFamily: "'Lato', sans-serif",
              opacity: 0.6,
            }}
          >
            My Account
          </Link>
          <button
            onClick={logout}
            style={{
              padding: "clamp(6px, 0.8vw, 8px) clamp(14px, 1.5vw, 20px)",
              borderRadius: 8,
              background: colors.darkText,
              color: colors.white,
              border: "none",
              cursor: "pointer",
              fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
              fontWeight: 600,
              fontFamily: "'Lato', sans-serif",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <main
        className="account-main"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 46px) clamp(12px, 2vw, 20px) clamp(40px, 6vw, 90px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: "clamp(20px, 2.5vw, 32px)", textAlign: "center" }}>
            <p
              style={{
                color: colors.darkText,
                fontSize: "clamp(10px, 0.9vw, 12px)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Register my marriage
            </p>
            <h1
              className="account-title"
              style={{
                fontSize: "clamp(28px, 3.5vw, 38px)",
                lineHeight: 1.15,
                fontWeight: 700,
                margin: 0,
                color: colors.darkText,
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              Upload Documents
            </h1>
            <p
              style={{
                marginTop: 10,
                color: colors.muted,
                fontSize: "clamp(13px, 1.2vw, 15px)",
                lineHeight: 1.6,
                maxWidth: 650,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Upload the required documents for your marriage registration.
            </p>
          </div>

          {/* INTRODUCTION CARD */}
          <div
            style={{
              marginBottom: "clamp(18px, 2vw, 28px)",
              padding: "clamp(14px, 1.5vw, 18px) clamp(16px, 1.8vw, 22px)",
              background: colors.darkBg,
              borderRadius: 14,
              color: colors.white,
              display: "flex",
              alignItems: "center",
              gap: "clamp(10px, 1vw, 14px)",
              boxShadow: "0 6px 22px rgba(56, 9, 19, 0.14)",
            }}
          >
            <div
              style={{
                width: "clamp(28px, 2.5vw, 34px)",
                height: "clamp(28px, 2.5vw, 34px)",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(14px, 1.2vw, 17px)",
              }}
            >
              i
            </div>
            <p style={{ fontSize: "clamp(11px, 1vw, 13px)", lineHeight: 1.6, color: "#F8EEEE" }}>
              Upload clear copies of all required documents. You can update them later if necessary.
              None of the fields are required - submit only what you have.
            </p>
          </div>

          {/* STATUS */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "clamp(12px, 1.2vw, 16px) clamp(14px, 1.5vw, 18px)",
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                color: colors.darkText,
                borderRadius: 12,
                marginBottom: 24,
                fontSize: "clamp(12px, 1vw, 14px)",
              }}
            >
              Loading your documents...
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "clamp(12px, 1.2vw, 15px) clamp(14px, 1.5vw, 18px)",
                background: colors.errorBg,
                border: `1px solid ${colors.errorBorder}`,
                color: colors.errorText,
                borderRadius: 12,
                marginBottom: 24,
                fontSize: "clamp(12px, 1vw, 14px)",
              }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "clamp(12px, 1.2vw, 15px) clamp(14px, 1.5vw, 18px)",
                background: colors.successBg,
                border: `1px solid ${colors.successBorder}`,
                color: colors.successText,
                borderRadius: 12,
                marginBottom: 24,
                fontSize: "clamp(12px, 1vw, 14px)",
              }}
            >
              {success}
            </motion.div>
          )}

          {/* ── SUCCESS STATE ── */}
          {isSubmitted && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="success-state"
              style={{
                padding: "clamp(40px, 4vw, 60px) clamp(20px, 3vw, 40px)",
                background: colors.cardBg,
                borderRadius: 16,
                border: `2px solid ${colors.successBorder}`,
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(21, 128, 61, 0.08)",
              }}
            >
              <div
                className="success-icon"
                style={{
                  width: "clamp(60px, 6vw, 80px)",
                  height: "clamp(60px, 6vw, 80px)",
                  borderRadius: "50%",
                  background: colors.successBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  border: `2px solid ${colors.successBorder}`,
                }}
              >
                <span style={{ fontSize: "clamp(30px, 3vw, 40px)" }}>✅</span>
              </div>
              <h2
                className="success-title"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                  fontWeight: 700,
                  color: colors.successText,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  marginBottom: 12,
                }}
              >
                Documents Uploaded Successfully!
              </h2>
              <p
                className="success-text"
                style={{
                  fontSize: "clamp(14px, 1.3vw, 16px)",
                  color: colors.muted,
                  maxWidth: 500,
                  margin: "0 auto 24px",
                  lineHeight: 1.6,
                }}
              >
                Your documents have been submitted successfully. The team will review them and get back to you shortly.
              </p>
              <div
                className="success-buttons"
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={handleReset}
                  style={{
                    padding: "clamp(10px, 1vw, 12px) clamp(20px, 2vw, 28px)",
                    borderRadius: 10,
                    background: colors.darkText,
                    color: colors.white,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "clamp(0.85rem, 0.9vw, 0.95rem)",
                    fontWeight: 600,
                    fontFamily: "'Lato', sans-serif",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Upload New Documents
                </button>
                <Link
                  href="/"
                  style={{
                    padding: "clamp(10px, 1vw, 12px) clamp(20px, 2vw, 28px)",
                    borderRadius: 10,
                    background: "transparent",
                    color: colors.darkText,
                    border: `1.5px solid ${colors.darkText}`,
                    textDecoration: "none",
                    fontSize: "clamp(0.85rem, 0.9vw, 0.95rem)",
                    fontWeight: 600,
                    fontFamily: "'Lato', sans-serif",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.darkText;
                    e.currentTarget.style.color = colors.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = colors.darkText;
                  }}
                >
                  Go to Home
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── FORM (Hidden after successful submission) ── */}
          {!isSubmitted && !loading && (
            <form onSubmit={handleSubmit}>
              {/* Groom Documents */}
              <Section title="Groom Documents">
                <Grid>
                  <FileInput
                    label="Groom Aadhar Front"
                    value={form.groomAadharFront}
                    onChange={(value) => updateField("groomAadharFront", value)}
                  />
                  <FileInput
                    label="Groom Aadhar Back"
                    value={form.groomAadharBack}
                    onChange={(value) => updateField("groomAadharBack", value)}
                  />
                  <FileInput
                    label="Groom Voter ID Front"
                    value={form.groomVoterIdFront}
                    onChange={(value) => updateField("groomVoterIdFront", value)}
                  />
                  <FileInput
                    label="Groom Voter ID Back"
                    value={form.groomVoterIdBack}
                    onChange={(value) => updateField("groomVoterIdBack", value)}
                  />
                  <FileInput
                    label="Groom Passport Front"
                    value={form.groomPassportFront}
                    onChange={(value) => updateField("groomPassportFront", value)}
                  />
                  <FileInput
                    label="Groom Passport Back"
                    value={form.groomPassportBack}
                    onChange={(value) => updateField("groomPassportBack", value)}
                  />
                  <FileInput
                    label="Groom Birth Certificate"
                    value={form.groomBirthCertificateImage}
                    onChange={(value) => updateField("groomBirthCertificateImage", value)}
                  />
                </Grid>
              </Section>

              {/* Bride Documents */}
              <Section title="Bride Documents">
                <Grid>
                  <FileInput
                    label="Bride Aadhar Front"
                    value={form.brideAadharFront}
                    onChange={(value) => updateField("brideAadharFront", value)}
                  />
                  <FileInput
                    label="Bride Aadhar Back"
                    value={form.brideAadharBack}
                    onChange={(value) => updateField("brideAadharBack", value)}
                  />
                  <FileInput
                    label="Bride Other Proof"
                    value={form.brideOtherProofImage}
                    onChange={(value) => updateField("brideOtherProofImage", value)}
                  />
                  <FileInput
                    label="Bride Birth Proof"
                    value={form.brideBirthProofImage}
                    onChange={(value) => updateField("brideBirthProofImage", value)}
                  />
                </Grid>
              </Section>

              {/* Marriage Proof */}
              <Section title="Marriage Proof">
                <Grid>
                  <FileInput
                    label="Marriage Proof Photo"
                    value={form.marriageProofPhoto}
                    onChange={(value) => updateField("marriageProofPhoto", value)}
                  />
                  <FileInput
                    label="Couple Photograph"
                    value={form.marriageProofCoupleImage}
                    onChange={(value) => updateField("marriageProofCoupleImage", value)}
                  />
                  <FileInput
                    label="Marriage Invitation"
                    value={form.marriageProofInvitation}
                    onChange={(value) => updateField("marriageProofInvitation", value)}
                  />
                </Grid>
              </Section>

              {/* Religious Certificate */}
              <Section title="Religious Certificate (Sikh, Muslim, Christian)">
                <Grid>
                  <FileInput
                    label="Religious Certificate"
                    value={form.religiousCertificateImage}
                    onChange={(value) => updateField("religiousCertificateImage", value)}
                  />
                </Grid>
              </Section>

              {/* Witness 1 */}
              <Section title="Witness 1 Documents">
                <Grid>
                  <FileInput
                    label="Witness 1 Aadhar Front"
                    value={form.witness1AadharFront}
                    onChange={(value) => updateField("witness1AadharFront", value)}
                  />
                  <FileInput
                    label="Witness 1 Aadhar Back"
                    value={form.witness1AadharBack}
                    onChange={(value) => updateField("witness1AadharBack", value)}
                  />
                  <FileInput
                    label="Witness 1 PAN Card"
                    value={form.witness1PanCardPhoto}
                    onChange={(value) => updateField("witness1PanCardPhoto", value)}
                  />
                </Grid>
              </Section>

              {/* Witness 2 */}
              <Section title="Witness 2 Documents">
                <Grid>
                  <FileInput
                    label="Witness 2 Aadhar Front"
                    value={form.witness2AadharFront}
                    onChange={(value) => updateField("witness2AadharFront", value)}
                  />
                  <FileInput
                    label="Witness 2 Aadhar Back"
                    value={form.witness2AadharBack}
                    onChange={(value) => updateField("witness2AadharBack", value)}
                  />
                  <FileInput
                    label="Witness 2 PAN Card"
                    value={form.witness2PanCardPhoto}
                    onChange={(value) => updateField("witness2PanCardPhoto", value)}
                  />
                </Grid>
              </Section>

              {/* Signatures */}
              <Section title="Signatures">
                <Grid>
                  <FileInput
                    label="Groom Signature"
                    value={form.signatureImageGroom}
                    onChange={(value) => updateField("signatureImageGroom", value)}
                  />
                  <FileInput
                    label="Bride Signature"
                    value={form.signatureImageBride}
                    onChange={(value) => updateField("signatureImageBride", value)}
                  />
                  <FileInput
                    label="Witness 1 Signature"
                    value={form.signatureImageWitness1}
                    onChange={(value) => updateField("signatureImageWitness1", value)}
                  />
                  <FileInput
                    label="Witness 2 Signature"
                    value={form.signatureImageWitness2}
                    onChange={(value) => updateField("signatureImageWitness2", value)}
                  />
                </Grid>
              </Section>

              {/* SUBMIT */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "clamp(12px, 1vw, 20px)",
                }}
              >
                <motion.button
                  className="account-submit"
                  whileHover={{ scale: saving || loading ? 1 : 1.02 }}
                  whileTap={{ scale: saving || loading ? 1 : 0.97 }}
                  type="submit"
                  disabled={saving || loading}
                  style={{
                    border: "none",
                    borderRadius: 10,
                    padding: "clamp(12px, 1.2vw, 15px) clamp(20px, 2vw, 30px)",
                    fontSize: "clamp(12px, 1vw, 14px)",
                    fontWeight: 700,
                    cursor: saving || loading ? "not-allowed" : "pointer",
                    opacity: saving || loading ? 0.65 : 1,
                    background: colors.darkText,
                    color: colors.white,
                    minWidth: "clamp(160px, 15vw, 200px)",
                    fontFamily: "'Lato', sans-serif",
                    boxShadow: "0 5px 18px rgba(74,14,25,0.18)",
                  }}
                >
                  {saving ? "Saving..." : document?._id ? "Update Documents" : "Submit Documents"}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: colors.darkBg,
          color: colors.white,
          padding: "clamp(20px, 2vw, 30px) clamp(16px, 2vw, 20px)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(16px, 1.5vw, 18px)",
            marginBottom: 6,
          }}
        >
          Register my marriage
        </p>
        <p style={{ fontSize: "clamp(10px, 0.9vw, 12px)", color: "#D8BEC3" }}>
          Simplifying marriage registration with care and clarity.
        </p>
      </footer>
    </div>
  );
}