"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, ReactNode } from "react";
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

/* ── BRAND GUIDELINE COLORS ── */
const colors = {
  bg: "#F7F0E7",
  darkText: "#650B18",
  lightBg: "#FBF6F0",
  cardBg: "#FFFCF9",
  white: "#FFFFFF",
  darkBg: "#4A0812",
  muted: "#7A5A60",
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

/* ── BRAND FONT STACKS ── */
const FONT_DISPLAY =
  "'Coolvetica', 'Helvetica Neue', 'Arial Narrow', Arial, sans-serif";
const FONT_UI =
  "'Inter', 'Helvetica Neue', Arial, system-ui, -apple-system, sans-serif";

const EMPTY_FORM: FormState = {
  // Groom Documents
  groomId: "",
  groomPassport: "",
  groomBirthCertificateOrMarksheet: "",

  // Bride Documents
  brideId: "",
  bridePassport: "",
  brideBirthCertificateOrMarksheet: "",

  // Marriage Proof
  marriageProofPhoto: "",
  marriageProofCoupleImage: "",
  marriageProofInvitation: "",

  // Religious Certificate
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
  if (
    response?.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
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

function InfoIcon({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        marginLeft: 6,
        verticalAlign: "middle",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={(e) => {
        e.preventDefault();
        setOpen((o) => !o);
      }}
    >
      <span
        style={{
          width: 15,
          height: 15,
          borderRadius: "50%",
          border: `1.2px solid ${colors.darkText}`,
          color: colors.darkText,
          fontSize: 10,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "help",
          fontFamily: FONT_UI,
          lineHeight: 1,
        }}
      >
        i
      </span>
      {open && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: colors.darkBg,
            color: colors.white,
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(74,8,18,0.2)",
            zIndex: 20,
            fontFamily: FONT_UI,
            pointerEvents: "none",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function Label({
  children,
  info,
}: {
  children: ReactNode;
  info?: string;
}) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "clamp(12px, 1.2vw, 13px)",
        fontWeight: 700,
        marginBottom: 8,
        color: colors.darkText,
        letterSpacing: "0.01em",
        fontFamily: FONT_UI,
      }}
    >
      {children}
      {info && <InfoIcon text={info} />}
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
        boxShadow: "0 5px 22px rgba(101, 11, 24, 0.06)",
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
            fontFamily: FONT_DISPLAY,
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

/* ── SINGLE-FILE INPUT ── */
function FileInput({
  label,
  value,
  onChange,
  info,
}: {
  label: string;
  value: ImageField;
  onChange: (value: string) => void;
  info?: string;
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
      <Label info={info}>{label}</Label>
      <div
        style={{
          border: `1px dashed ${colors.border}`,
          borderRadius: 12,
          padding: "clamp(10px, 1vw, 14px)",
          background: colors.lightBg,
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
            fontFamily: FONT_UI,
          }}
        />
        {uploading && (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(10px, 1vw, 12px)",
              color: colors.muted,
              fontFamily: FONT_UI,
            }}
          >
            Processing file...
          </p>
        )}
        {value && !uploading && (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(10px, 1vw, 12px)",
              color: colors.successText,
              fontWeight: 600,
              fontFamily: FONT_UI,
            }}
          >
            ✓ File selected
          </p>
        )}
      </div>
    </div>
  );
}

/* ── MULTI-FILE INPUT ── */
function MultiFileInput({
  label,
  info,
  value,
  onChange,
}: {
  label: string;
  info?: string;
  value: ImageField;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const files: string[] = (() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  })();

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (picked.length === 0) return;

    try {
      setUploading(true);
      const base64s = await Promise.all(picked.map((f) => fileToBase64(f)));
      const next = [...files, ...base64s];
      onChange(JSON.stringify(next));
    } catch (err) {
      console.error("File upload error:", err);
      alert("Unable to process one of the files.");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onChange(next.length ? JSON.stringify(next) : "");
  };

  return (
    <div>
      <Label info={info}>{label}</Label>
      <div
        style={{
          border: `1px dashed ${colors.border}`,
          borderRadius: 12,
          padding: "clamp(10px, 1vw, 14px)",
          background: colors.lightBg,
        }}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          style={{
            width: "100%",
            fontSize: "clamp(11px, 1vw, 13px)",
            color: colors.darkText,
            fontFamily: FONT_UI,
          }}
        />
        {uploading && (
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(10px, 1vw, 12px)",
              color: colors.muted,
              fontFamily: FONT_UI,
            }}
          >
            Processing files...
          </p>
        )}
        {files.length > 0 && !uploading && (
          <ul
            style={{
              margin: "10px 0 0",
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {files.map((_, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  fontSize: "clamp(10px, 1vw, 12px)",
                  color: colors.successText,
                  fontWeight: 600,
                  fontFamily: FONT_UI,
                  background: colors.white,
                  border: `1px solid ${colors.successBorder}`,
                  borderRadius: 8,
                  padding: "6px 10px",
                }}
              >
                <span>✓ File {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  style={{
                    background: "none",
                    border: "none",
                    color: colors.errorText,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: FONT_UI,
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
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
          // Returning user sees the editable form directly — not the success screen.
          // The success screen only shows right after a fresh submit.
          setIsSubmitted(false);
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
      if (document?._id) {
        await updateDocument(document._id, payload as any, token);
        setSuccess("Your documents have been updated successfully.");
      } else {
        // Backend addDocument is now upsert-safe: creates on first submit,
        // silently updates if a document already exists.
        await createDocument(payload as any, token);
        setSuccess("Your documents have been submitted successfully.");
      }

      await refreshDocument();
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Save document error:", err);
      setError(
        err?.message || "Something went wrong while saving your documents."
      );
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
        fontFamily: FONT_UI,
      }}
    >
      <style>{`
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
            fontFamily: FONT_UI,
          }}
        >
          ← Back to Home
        </Link>

        <div
          className="header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/account"
            style={{
              textDecoration: "none",
              color: colors.darkText,
              fontSize: "clamp(0.75rem, 0.9vw, 0.85rem)",
              fontWeight: 600,
              fontFamily: FONT_UI,
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
              fontFamily: FONT_UI,
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
          padding:
            "clamp(20px, 4vw, 46px) clamp(12px, 2vw, 20px) clamp(40px, 6vw, 90px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* HEADER */}
          <div
            style={{
              marginBottom: "clamp(20px, 2.5vw, 32px)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: colors.darkText,
                fontSize: "clamp(10px, 0.9vw, 12px)",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 10,
                fontFamily: FONT_UI,
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
                fontFamily: FONT_DISPLAY,
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
                fontFamily: FONT_UI,
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
              boxShadow: "0 6px 22px rgba(74, 8, 18, 0.14)",
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
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(14px, 1.2vw, 17px)",
              }}
            >
              i
            </div>
            <p
              style={{
                fontSize: "clamp(11px, 1vw, 13px)",
                lineHeight: 1.6,
                color: "#F8EEEE",
                fontFamily: FONT_UI,
              }}
            >
              Upload clear copies of all required documents. You can update
              them later if necessary. None of the fields are required - submit
              only what you have.
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
                fontFamily: FONT_UI,
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
                fontFamily: FONT_UI,
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
                fontFamily: FONT_UI,
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
                  fontFamily: FONT_DISPLAY,
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
                  fontFamily: FONT_UI,
                }}
              >
                Your documents have been submitted successfully. The team will
                review them and get back to you shortly.
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
                  onClick={() => {
                    setIsSubmitted(false);
                    setSuccess("");
                    setError("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  style={{
                    padding:
                      "clamp(10px, 1vw, 12px) clamp(20px, 2vw, 28px)",
                    borderRadius: 10,
                    background: colors.darkText,
                    color: colors.white,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "clamp(0.85rem, 0.9vw, 0.95rem)",
                    fontWeight: 600,
                    fontFamily: FONT_UI,
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  ✏️ Edit My Documents
                </button>
                <Link
                  href="/"
                  style={{
                    padding:
                      "clamp(10px, 1vw, 12px) clamp(20px, 2vw, 28px)",
                    borderRadius: 10,
                    background: "transparent",
                    color: colors.darkText,
                    border: `1.5px solid ${colors.darkText}`,
                    textDecoration: "none",
                    fontSize: "clamp(0.85rem, 0.9vw, 0.95rem)",
                    fontWeight: 600,
                    fontFamily: FONT_UI,
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

          {/* ── FORM ── */}
          {!isSubmitted && !loading && (
            <form onSubmit={handleSubmit}>
              {/* GROOM DOCUMENTS */}
              <Section title="Groom Documents">
                <Grid columns={1}>
                  <MultiFileInput
                    label="Groom ID"
                    info="You can upload Aadhaar Card or Voter ID"
                    value={form.groomId}
                    onChange={(v) => updateField("groomId", v)}
                  />
                  <MultiFileInput
                    label="Groom Passport"
                    value={form.groomPassport}
                    onChange={(v) => updateField("groomPassport", v)}
                  />
                  <MultiFileInput
                    label="Groom Birth Certificate / 10th Marksheet"
                    info="Upload whichever you have — Birth Certificate, 10th Marksheet, or both"
                    value={form.groomBirthCertificateOrMarksheet}
                    onChange={(v) =>
                      updateField("groomBirthCertificateOrMarksheet", v)
                    }
                  />
                </Grid>
              </Section>

              {/* BRIDE DOCUMENTS */}
              <Section title="Bride Documents">
                <Grid columns={1}>
                  <MultiFileInput
                    label="Bride ID"
                    info="You can upload Aadhaar Card or Voter ID"
                    value={form.brideId}
                    onChange={(v) => updateField("brideId", v)}
                  />
                  <MultiFileInput
                    label="Bride Passport"
                    value={form.bridePassport}
                    onChange={(v) => updateField("bridePassport", v)}
                  />
                  <MultiFileInput
                    label="Bride Birth Certificate / 10th Marksheet"
                    info="Upload whichever you have — Birth Certificate, 10th Marksheet, or both"
                    value={form.brideBirthCertificateOrMarksheet}
                    onChange={(v) =>
                      updateField("brideBirthCertificateOrMarksheet", v)
                    }
                  />
                </Grid>
              </Section>

              {/* MARRIAGE PROOF */}
              <Section title="Marriage Proof">
                <Grid>
                  <FileInput
                    label="Marriage Proof Photo"
                    value={form.marriageProofPhoto}
                    onChange={(v) => updateField("marriageProofPhoto", v)}
                  />
                  <FileInput
                    label="Couple Photo"
                    value={form.marriageProofCoupleImage}
                    onChange={(v) =>
                      updateField("marriageProofCoupleImage", v)
                    }
                  />
                  <FileInput
                    label="Marriage Invitation Card"
                    value={form.marriageProofInvitation}
                    onChange={(v) =>
                      updateField("marriageProofInvitation", v)
                    }
                  />
                </Grid>
              </Section>

              {/* RELIGIOUS CERTIFICATE */}
              <Section title="Religious Certificate (Sikh, Muslim, Christian)">
                <Grid columns={1}>
                  <FileInput
                    label="Religious Certificate"
                    value={form.religiousCertificateImage}
                    onChange={(v) =>
                      updateField("religiousCertificateImage", v)
                    }
                  />
                </Grid>
              </Section>

              {/* WITNESS 1 */}
              <Section title="Witness 1 Documents">
                <Grid>
                  <FileInput
                    label="Witness 1 Aadhar Front"
                    value={form.witness1AadharFront}
                    onChange={(v) => updateField("witness1AadharFront", v)}
                  />
                  <FileInput
                    label="Witness 1 Aadhar Back"
                    value={form.witness1AadharBack}
                    onChange={(v) => updateField("witness1AadharBack", v)}
                  />
                  <FileInput
                    label="Witness 1 PAN Card"
                    value={form.witness1PanCardPhoto}
                    onChange={(v) => updateField("witness1PanCardPhoto", v)}
                  />
                </Grid>
              </Section>

              {/* WITNESS 2 */}
              <Section title="Witness 2 Documents">
                <Grid>
                  <FileInput
                    label="Witness 2 Aadhar Front"
                    value={form.witness2AadharFront}
                    onChange={(v) => updateField("witness2AadharFront", v)}
                  />
                  <FileInput
                    label="Witness 2 Aadhar Back"
                    value={form.witness2AadharBack}
                    onChange={(v) => updateField("witness2AadharBack", v)}
                  />
                  <FileInput
                    label="Witness 2 PAN Card"
                    value={form.witness2PanCardPhoto}
                    onChange={(v) => updateField("witness2PanCardPhoto", v)}
                  />
                </Grid>
              </Section>

              {/* SIGNATURES */}
              <Section title="Signatures">
                <Grid>
                  <FileInput
                    label="Groom Signature"
                    value={form.signatureImageGroom}
                    onChange={(v) => updateField("signatureImageGroom", v)}
                  />
                  <FileInput
                    label="Bride Signature"
                    value={form.signatureImageBride}
                    onChange={(v) => updateField("signatureImageBride", v)}
                  />
                  <FileInput
                    label="Witness 1 Signature"
                    value={form.signatureImageWitness1}
                    onChange={(v) =>
                      updateField("signatureImageWitness1", v)
                    }
                  />
                  <FileInput
                    label="Witness 2 Signature"
                    value={form.signatureImageWitness2}
                    onChange={(v) =>
                      updateField("signatureImageWitness2", v)
                    }
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
                    padding:
                      "clamp(12px, 1.2vw, 15px) clamp(20px, 2vw, 30px)",
                    fontSize: "clamp(12px, 1vw, 14px)",
                    fontWeight: 700,
                    cursor: saving || loading ? "not-allowed" : "pointer",
                    opacity: saving || loading ? 0.65 : 1,
                    background: colors.darkText,
                    color: colors.white,
                    minWidth: "clamp(160px, 15vw, 200px)",
                    fontFamily: FONT_UI,
                    boxShadow: "0 5px 18px rgba(101,11,24,0.18)",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : document?._id
                    ? "Update Documents"
                    : "Submit Documents"}
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
            fontFamily: FONT_DISPLAY,
            fontSize: "clamp(16px, 1.5vw, 18px)",
            marginBottom: 6,
          }}
        >
          Register my marriage
        </p>
        <p
          style={{
            fontSize: "clamp(10px, 0.9vw, 12px)",
            color: "#D8BEC3",
            fontFamily: FONT_UI,
          }}
        >
          Simplifying marriage registration with care and clarity.
        </p>
      </footer>
    </div>
  );
}