"use client";

import { useState, CSSProperties, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
type ReligionKey = "muslim" | "hindu" | "christian" | "sikh";

interface ButtonStyle {
  background: string;
  color: string;
}

interface ReligionTheme {
  label: string;
  subtitle: string;
  emoji: string;
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  dark: string;
  bg: string;
  cardBg: string;
  border: string;
  font: string;
  pattern: string;
  patternColor: string;
  steps: string[];
  heroText: string;
  heroSub: string;
  gradient: string;
  buttonStyle: ButtonStyle;
  icon: JSX.Element;
}

type ReligionsMap = Record<ReligionKey, ReligionTheme>;

interface PatternBgProps {
  theme: ReligionTheme;
}

interface ReligionSelectorProps {
  onSelect: (key: ReligionKey) => void;
}

interface StepIndicatorProps {
  steps: string[];
  current: number;
  theme: ReligionTheme;
}

interface RegistrationFormProps {
  theme: ReligionTheme;
}

interface LandingPageProps {
  religionKey: ReligionKey;
  onBack: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  date: string;
}

// ─── Religion Themes ────────────────────────────────────────────────────────
const RELIGIONS: ReligionsMap = {
  muslim: {
    label: "Muslim",
    subtitle: "Nikah Registration",
    emoji: "☪️",
    primary: "#1a6b3c",
    secondary: "#2d9b5a",
    accent: "#f0c040",
    light: "#e8f5ee",
    dark: "#0d3d22",
    bg: "linear-gradient(135deg, #0d3d22 0%, #1a6b3c 50%, #145230 100%)",
    cardBg: "rgba(26, 107, 60, 0.15)",
    border: "rgba(240, 192, 64, 0.3)",
    font: "'Amiri', serif",
    pattern: "M 0 0 L 20 20 M 20 0 L 0 20",
    patternColor: "rgba(240,192,64,0.07)",
    steps: ["Nikah Documentation", "Witness Registration", "Qazi Verification", "Certificate Issuance"],
    heroText: "Blessed Union",
    heroSub: "Register your Nikah with official documentation",
    gradient: "from-green-900 via-green-700 to-emerald-800",
    buttonStyle: { background: "linear-gradient(135deg, #f0c040, #e0a820)", color: "#0d3d22" },
    icon: (
      <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
        <circle cx="30" cy="30" r="28" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M30 8 L32 22 L46 22 L35 30 L39 44 L30 36 L21 44 L25 30 L14 22 L28 22 Z" fill="#f0c040" opacity="0.9" />
        <circle cx="30" cy="12" r="3" fill="#f0c040" />
      </svg>
    ),
  },
  hindu: {
    label: "Hindu",
    subtitle: "Vivah Registration",
    emoji: "🕉️",
    primary: "#c2410c",
    secondary: "#ea580c",
    accent: "#fcd34d",
    light: "#fff7ed",
    dark: "#7c2d12",
    bg: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #9a3412 100%)",
    cardBg: "rgba(194, 65, 12, 0.15)",
    border: "rgba(252, 211, 77, 0.3)",
    font: "'Tiro Devanagari Hindi', serif",
    pattern: "M 10 0 L 20 10 L 10 20 L 0 10 Z",
    patternColor: "rgba(252,211,77,0.07)",
    steps: ["Vivah Documentation", "Pandit Verification", "Witness Statement", "Certificate Issuance"],
    heroText: "Sacred Union",
    heroSub: "Register your Vivah with official blessings",
    gradient: "from-orange-900 via-orange-700 to-red-800",
    buttonStyle: { background: "linear-gradient(135deg, #fcd34d, #f59e0b)", color: "#7c2d12" },
    icon: (
      <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
        <circle cx="30" cy="30" r="24" stroke="#fcd34d" strokeWidth="1.5" />
        <text x="30" y="38" textAnchor="middle" fontSize="28" fill="#fcd34d" fontFamily="serif">ॐ</text>
      </svg>
    ),
  },
  christian: {
    label: "Christian",
    subtitle: "Wedding Registration",
    emoji: "✝️",
    primary: "#1e3a8a",
    secondary: "#2563eb",
    accent: "#f8fafc",
    light: "#eff6ff",
    dark: "#1e1b4b",
    bg: "linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #172554 100%)",
    cardBg: "rgba(30, 58, 138, 0.2)",
    border: "rgba(248, 250, 252, 0.2)",
    font: "'Cormorant Garamond', serif",
    pattern: "M 10 0 L 10 20 M 0 10 L 20 10",
    patternColor: "rgba(248,250,252,0.05)",
    steps: ["Marriage Documentation", "Church Verification", "Witness Registration", "Certificate Issuance"],
    heroText: "Holy Matrimony",
    heroSub: "Register your wedding with official recognition",
    gradient: "from-indigo-900 via-blue-800 to-blue-900",
    buttonStyle: { background: "linear-gradient(135deg, #f8fafc, #e2e8f0)", color: "#1e3a8a" },
    icon: (
      <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
        <rect x="27" y="8" width="6" height="44" rx="3" fill="#f8fafc" opacity="0.9" />
        <rect x="12" y="20" width="36" height="6" rx="3" fill="#f8fafc" opacity="0.9" />
        <circle cx="30" cy="52" r="4" fill="#f8fafc" opacity="0.5" />
      </svg>
    ),
  },
  sikh: {
    label: "Sikh",
    subtitle: "Anand Karaj Registration",
    emoji: "🪯",
    primary: "#854d0e",
    secondary: "#ca8a04",
    accent: "#fde68a",
    light: "#fffbeb",
    dark: "#451a03",
    bg: "linear-gradient(135deg, #451a03 0%, #854d0e 50%, #713f12 100%)",
    cardBg: "rgba(133, 77, 14, 0.15)",
    border: "rgba(253, 230, 138, 0.3)",
    font: "'Mukta', sans-serif",
    pattern: "M 0 10 L 10 0 L 20 10 L 10 20 Z M 0 0 L 20 20 M 20 0 L 0 20",
    patternColor: "rgba(253,230,138,0.06)",
    steps: ["Anand Karaj Docs", "Granthi Verification", "Witness Registration", "Certificate Issuance"],
    heroText: "Anand Karaj",
    heroSub: "Register your blessed union under Waheguru's grace",
    gradient: "from-yellow-900 via-amber-700 to-orange-900",
    buttonStyle: { background: "linear-gradient(135deg, #fde68a, #fbbf24)", color: "#451a03" },
    icon: (
      <svg viewBox="0 0 60 60" width="48" height="48" fill="none">
        <circle cx="30" cy="30" r="14" stroke="#fde68a" strokeWidth="1.5" fill="none" />
        <path d="M30 8 L30 52 M8 30 L52 30" stroke="#fde68a" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="30" cy="30" r="4" fill="#fde68a" />
        <path
          d="M30 8 C 20 12, 16 20, 16 30 C 16 40, 20 48, 30 52 C 40 48, 44 40, 44 30 C 44 20, 40 12, 30 8Z"
          stroke="#fde68a"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      </svg>
    ),
  },
};

// ─── Ambient Pattern Background ─────────────────────────────────────────────
function PatternBg({ theme }: PatternBgProps): JSX.Element {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="bg-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d={theme.pattern} stroke={theme.patternColor} strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-pattern)" />
      </svg>
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.secondary}25 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Religion Selector Screen ────────────────────────────────────────────────
function ReligionSelector({ onSelect }: ReligionSelectorProps): JSX.Element {
  const [hovered, setHovered] = useState<ReligionKey | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0f0c1a 0%, #1a1428 50%, #0c1220 100%)",
        padding: "2rem",
        fontFamily: "Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div
          style={{
            position: "absolute", top: "10%", left: "15%", width: 300, height: 300,
            borderRadius: "50%", background: "radial-gradient(circle, rgba(45,155,90,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250,
            borderRadius: "50%", background: "radial-gradient(circle, rgba(194,65,12,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", top: "50%", right: "30%", width: 200, height: 200,
            borderRadius: "50%", background: "radial-gradient(circle, rgba(30,58,138,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900 }}>
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        >
          <div
            style={{
              display: "inline-block", padding: "6px 20px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
              fontSize: 12, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase", marginBottom: "1.5rem",
            }}
          >
            Government of India · Official Portal
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#fff",
              marginBottom: "0.75rem", lineHeight: 1.15, letterSpacing: "-0.02em",
            }}
          >
            Marriage Registration
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.45)",
              marginBottom: "3rem", fontWeight: 300, letterSpacing: "0.05em",
            }}
          >
            Select your religion to begin the registration process
          </p>
        </motion.div>

        {/* Religion Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.25rem",
            width: "100%",
          }}
        >
          {(Object.entries(RELIGIONS) as [ReligionKey, ReligionTheme][]).map(([key, theme], i) => (
            <motion.button
              key={key}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHovered(key)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => onSelect(key)}
              style={{
                padding: "2rem 1.25rem",
                borderRadius: 20,
                border: `1px solid ${hovered === key ? theme.secondary : "rgba(255,255,255,0.08)"}`,
                background:
                  hovered === key
                    ? `linear-gradient(160deg, ${theme.dark}cc, ${theme.primary}88)`
                    : "rgba(255,255,255,0.04)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.875rem",
                backdropFilter: "blur(12px)",
                transition: "border-color 0.3s, background 0.3s",
                outline: "none",
                boxSizing: "border-box",
                boxShadow: hovered === key ? `0 20px 60px ${theme.primary}30` : "none",
              }}
            >
              <motion.div
                animate={{ rotate: hovered === key ? [0, -5, 5, 0] : 0 }}
                transition={{ duration: 0.4 }}
              >
                {theme.icon}
              </motion.div>
              <div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: hovered === key ? theme.accent : "rgba(255,255,255,0.85)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {theme.label}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem", color: "rgba(255,255,255,0.35)",
                    marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase",
                  }}
                >
                  {theme.subtitle}
                </div>
              </div>
              <motion.div
                animate={{ opacity: hovered === key ? 1 : 0, y: hovered === key ? 0 : 8 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontSize: "0.75rem", color: theme.accent,
                  padding: "4px 14px", borderRadius: 999,
                  border: `1px solid ${theme.accent}50`,
                  background: `${theme.primary}40`,
                }}
              >
                Select →
              </motion.div>
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: "2.5rem", color: "rgba(255,255,255,0.2)",
            fontSize: "0.75rem", letterSpacing: "0.05em",
          }}
        >
          All registrations are legally binding under the Special Marriage Act, 1954
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ steps, current, theme }: StepIndicatorProps): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <motion.div
              animate={{ scale: i === current ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: i === current ? Infinity : 0, duration: 1.5 }}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background:
                  i < current ? theme.secondary : i === current ? theme.accent : "rgba(255,255,255,0.1)",
                border: `2px solid ${i <= current ? theme.accent : "rgba(255,255,255,0.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color:
                  i < current ? theme.dark : i === current ? theme.dark : "rgba(255,255,255,0.4)",
              }}
            >
              {i < current ? "✓" : i + 1}
            </motion.div>
            <span
              style={{
                fontSize: "0.65rem",
                color: i <= current ? theme.accent : "rgba(255,255,255,0.3)",
                textAlign: "center", maxWidth: 80, lineHeight: 1.3, letterSpacing: "0.03em",
              }}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 50, height: 2, margin: "0 4px",
                background:
                  i < current
                    ? `linear-gradient(90deg, ${theme.accent}, ${theme.accent})`
                    : "rgba(255,255,255,0.1)",
                marginBottom: 28, borderRadius: 999, flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Mini Form Section ───────────────────────────────────────────────────────
function RegistrationForm({ theme }: RegistrationFormProps): JSX.Element {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    name: "", phone: "", email: "", date: "",
  });

  const inputStyle: CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    border: `1px solid ${theme.border}`,
    background: "rgba(255,255,255,0.06)", color: "#fff",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "border-color 0.2s",
  };

  const documentFields: string[] = [
    "Groom Aadhaar (Front)",
    "Groom Aadhaar (Back)",
    "Bride Aadhaar (Front)",
    "Marriage Proof Photo",
  ];

  return (
    <div
      style={{
        background: theme.cardBg, borderRadius: 20, padding: "2rem",
        border: `1px solid ${theme.border}`, backdropFilter: "blur(10px)",
      }}
    >
      <h3
        style={{
          color: theme.accent, marginBottom: "1.5rem", fontWeight: 400,
          fontSize: "1.1rem", letterSpacing: "0.05em",
        }}
      >
        Begin Registration
      </h3>

      <div style={{ marginBottom: "1.5rem" }}>
        <StepIndicator
          steps={["Personal", "Documents", "Witnesses", "Review"]}
          current={step}
          theme={theme}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              style={inputStyle}
              placeholder="Full Name (as per Aadhaar)"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              style={inputStyle}
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            />
            <input
              style={inputStyle}
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            />
            <div>
              <label
                style={{
                  color: "rgba(255,255,255,0.4)", fontSize: "0.75rem",
                  letterSpacing: "0.05em", display: "block", marginBottom: 6,
                }}
              >
                Date of Marriage
              </label>
              <input
                type="date"
                style={{ ...inputStyle, colorScheme: "dark" } as CSSProperties}
                value={formData.date}
                onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {documentFields.map((doc) => (
              <div
                key={doc}
                style={{
                  padding: "1rem", borderRadius: 10,
                  border: `1px dashed ${theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer", transition: "background 0.2s",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{doc}</span>
                <span style={{ color: theme.accent, fontSize: "0.8rem" }}>Upload ↑</span>
              </div>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {([1, 2, 3] as const).map((w) => (
              <div
                key={w}
                style={{
                  padding: "1rem", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <p
                  style={{
                    color: theme.accent, fontSize: "0.8rem",
                    marginBottom: "0.5rem", letterSpacing: "0.05em",
                  }}
                >
                  Witness {w}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input
                    style={{ ...inputStyle, fontSize: "0.8rem", padding: "8px 12px" }}
                    placeholder="Full Name"
                  />
                  <input
                    style={{ ...inputStyle, fontSize: "0.8rem", padding: "8px 12px" }}
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "1rem 0" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              style={{ display: "inline-block", marginBottom: "1rem" }}
            >
              {theme.icon}
            </motion.div>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>
              Review your application
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
              All documents will be verified within 3-5 working days
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", gap: 10, marginTop: "1.5rem" }}>
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              padding: "10px 20px", borderRadius: 10,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: "rgba(255,255,255,0.5)",
              cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit", flex: 1,
            }}
          >
            ← Back
          </button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep((s) => Math.min(s + 1, 3))}
          style={{
            ...theme.buttonStyle,
            padding: "12px 24px", borderRadius: 10, border: "none",
            cursor: "pointer", fontSize: "0.9rem", fontWeight: 700,
            fontFamily: "inherit", flex: 3, letterSpacing: "0.05em",
          }}
        >
          {step === 3 ? "Submit Application ✓" : "Continue →"}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Themed Landing Page ─────────────────────────────────────────────────────
function LandingPage({ religionKey, onBack }: LandingPageProps): JSX.Element {
  const theme = RELIGIONS[religionKey];

  const stats: [string, string][] = [
    ["50K+", "Registrations"],
    ["98%", "Approval Rate"],
    ["3-5 Days", "Processing"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        background: theme.bg,
        fontFamily: theme.font,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PatternBg theme={theme} />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          position: "relative", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 2.5rem",
          borderBottom: `1px solid ${theme.border}`,
          backdropFilter: "blur(20px)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {theme.icon}
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: "1rem" }}>
              Marriage Registration
            </div>
            <div
              style={{
                color: theme.accent, fontSize: "0.7rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}
            >
              {theme.subtitle}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={onBack}
            style={{
              padding: "7px 16px", borderRadius: 8,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: "rgba(255,255,255,0.6)",
              cursor: "pointer", fontSize: "0.8rem", fontFamily: "inherit",
              letterSpacing: "0.05em",
            }}
          >
            ← Change Religion
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            style={{
              ...theme.buttonStyle, padding: "8px 20px", borderRadius: 8,
              border: "none", cursor: "pointer", fontSize: "0.82rem",
              fontWeight: 700, fontFamily: "inherit",
            }}
          >
            Login
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero */}
      <div
        style={{
          position: "relative", zIndex: 5,
          padding: "5rem 2.5rem 4rem",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "4rem", maxWidth: 1200, margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <div
            style={{
              display: "inline-block", padding: "5px 16px", borderRadius: 999,
              border: `1px solid ${theme.accent}50`,
              background: `${theme.accent}15`,
              color: theme.accent, fontSize: "0.72rem",
              letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem",
            }}
          >
            Official Government Portal
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff",
              fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            {theme.heroText}
            <br />
            <span style={{ color: theme.accent }}>Registered &amp;</span>
            <br />
            <span style={{ opacity: 0.6 }}>Recognised</span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.55)", fontSize: "1rem",
              lineHeight: 1.7, marginBottom: "2rem", maxWidth: 420,
            }}
          >
            {theme.heroSub}. Fully digital, paperless process with verified certificate delivery.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                ...theme.buttonStyle, padding: "14px 28px", borderRadius: 12,
                border: "none", cursor: "pointer", fontSize: "0.9rem",
                fontWeight: 700, fontFamily: "inherit", letterSpacing: "0.04em",
              }}
            >
              Register Now
            </motion.button>
            <button
              style={{
                padding: "14px 28px", borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)",
                cursor: "pointer", fontSize: "0.9rem", fontFamily: "inherit",
              }}
            >
              Track Status
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", marginTop: "3rem" }}>
            {stats.map(([num, label]) => (
              <div key={label}>
                <div style={{ color: theme.accent, fontSize: "1.4rem", fontWeight: 700 }}>{num}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          <RegistrationForm theme={theme} />
        </motion.div>
      </div>

      {/* Process Steps */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        style={{
          position: "relative", zIndex: 5,
          padding: "3rem 2.5rem",
          borderTop: `1px solid ${theme.border}`,
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.3)", fontSize: "0.72rem",
            letterSpacing: "0.15em", textTransform: "uppercase",
            textAlign: "center", marginBottom: "2rem",
          }}
        >
          How It Works
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <StepIndicator steps={theme.steps} current={-1} theme={theme} />
        </div>
      </motion.div>

      {/* Footer */}
      <div
        style={{
          position: "relative", zIndex: 5,
          padding: "1.5rem 2.5rem", textAlign: "center",
          borderTop: `1px solid ${theme.border}`,
          color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", letterSpacing: "0.05em",
        }}
      >
        © 2024 Marriage Registration Portal · All rights reserved · Government of India
      </div>
    </motion.div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App(): JSX.Element {
  const [selected, setSelected] = useState<ReligionKey | null>(null);

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@300;400;600&family=Mukta:wght@300;400;700&family=Tiro+Devanagari+Hindi&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0f0c1a; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>
      <AnimatePresence mode="wait">
        {!selected ? (
          <ReligionSelector key="selector" onSelect={setSelected} />
        ) : (
          <LandingPage key={selected} religionKey={selected} onBack={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}