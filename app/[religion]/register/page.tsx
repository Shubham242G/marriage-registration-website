"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { RELIGION_THEMES } from "../../constants/Religions";
import { ReligionKey } from "../../types/Religion";
import { useAuth } from "../../context/AuthContext";

interface PageProps {
  params: Promise<{ religion: string }>;
}

interface RegisterForm {
  name: string; email: string; phone: string;
  password: string; confirmPassword: string; agreeToTerms: boolean;
}

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

export default function RegisterPage({ params }: PageProps) {
  const { religion } = use(params);
  const theme = RELIGION_THEMES[religion as ReligionKey];
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({ name: "", email: "", phone: "", password: "", confirmPassword: "", agreeToTerms: false });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  if (!theme) return null;

  const set = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    setApiError("");
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Valid 10-digit Indian mobile number required";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!/[A-Z]/.test(form.password)) e.password = "Must contain at least one uppercase letter";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.agreeToTerms) e.agreeToTerms = "You must agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
      // Step 1: Register
      const res = await fetch(`${BASE_URL}/users/register/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Registration failed");

      // Step 2: Auto-login with correct route /login/User
      const loginRes = await fetch(`${BASE_URL}/users/login/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.token) {
        login(loginData.user, loginData.token);
      }

      // Step 3: Redirect to account
      router.push(`/${religion}/account`);
    } catch (err: any) {
      setApiError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 9,
    border: "1.5px solid #e0f2f1", fontSize: "0.9rem",
    fontFamily: "'Lato', sans-serif", color: "#0f4c4c",
    background: "#fafffe", outline: "none", boxSizing: "border-box",
  };

  const PasswordStrength = ({ pwd }: { pwd: string }) => {
    if (!pwd) return null;
    const score = [pwd.length >= 8, /[A-Z]/.test(pwd), /[0-9]/.test(pwd), /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;
    const colors = ["", "#fca5a5", "#fbbf24", "#34d399", "#0d9488"];
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return (
      <div style={{ marginTop: 6 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
          {[1,2,3,4].map((i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : "#e0f2f1" }} />)}
        </div>
        <span style={{ fontSize: "0.7rem", color: colors[score], fontWeight: 600 }}>{labels[score]}</span>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#fafffe", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #0d9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
      `}</style>
      <Navbar religionKey={theme.key} />

      <div style={{ minHeight: "calc(100vh - 68px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Left */}
        <div style={{ backgroundImage: `url(${theme.bannerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",padding: "4rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#ccfbf1", marginBottom: "1.25rem" }}>{theme.subtitle}</div>
            <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.25, marginBottom: "1.25rem" }}>
              Begin Your Registration Journey
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2.5rem" }}>
              Create your account to start your marriage registration. Guided step-by-step with expert support at every stage.
            </p>
            {["Secure document upload portal", "Real-time application tracking", "Dedicated legal case manager", "Certificate delivered digitally & by post"].map((item) => (
              <div key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.6rem" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#ccfbf1", fontSize: "0.65rem" }}>✓</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem" }}>{item}</span>
              </div>
            ))}
            <div style={{ marginTop: "2rem", padding: "1.25rem", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <p style={{ color: "#ccfbf1", fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1.7 }}>
                "Our certificate arrived within 10 days without visiting a single office."
              </p>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", marginTop: "0.5rem" }}>— Priya & Arjun, Delhi</div>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div style={{ padding: "2.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "center", overflowY: "auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 460 }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "0.3rem" }}>Create Your Account</h2>
            <p style={{ color: "#6b9e9e", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
              Already have an account?{" "}
              <Link href={`/${religion}/login`} style={{ color: "#0d9488", fontWeight: 600, textDecoration: "none" }}>Sign in →</Link>
            </p>

            <AnimatePresence>
              {apiError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.84rem", marginBottom: "1.25rem" }}>
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#0f4c4c", marginBottom: 5 }}>Full Name <span style={{ color: "#0d9488" }}>*</span></label>
                <input style={{ ...inp, borderColor: errors.name ? "#dc2626" : "#e0f2f1" }} placeholder="Your full name" value={form.name} onChange={set("name")} />
                {errors.name && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.name}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#0f4c4c", marginBottom: 5 }}>Email Address <span style={{ color: "#0d9488" }}>*</span></label>
                <input type="email" style={{ ...inp, borderColor: errors.email ? "#dc2626" : "#e0f2f1" }} placeholder="you@example.com" value={form.email} onChange={set("email")} />
                {errors.email && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#0f4c4c", marginBottom: 5 }}>Mobile Number <span style={{ color: "#0d9488" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b9e9e", fontSize: "0.88rem", fontWeight: 600 }}>+91</span>
                  <input style={{ ...inp, paddingLeft: 46, borderColor: errors.phone ? "#dc2626" : "#e0f2f1" }} placeholder="10-digit mobile" value={form.phone} onChange={set("phone")} maxLength={10} />
                </div>
                {errors.phone && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.phone}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#0f4c4c", marginBottom: 5 }}>Password <span style={{ color: "#0d9488" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} style={{ ...inp, paddingRight: 44, borderColor: errors.password ? "#dc2626" : "#e0f2f1" }} placeholder="Create a strong password" value={form.password} onChange={set("password")} />
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b9e9e" }}>{showPassword ? "🙈" : "👁️"}</button>
                </div>
                {errors.password && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.password}</p>}
                <PasswordStrength pwd={form.password} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#0f4c4c", marginBottom: 5 }}>Confirm Password <span style={{ color: "#0d9488" }}>*</span></label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirm ? "text" : "password"} style={{ ...inp, paddingRight: 44, borderColor: errors.confirmPassword ? "#dc2626" : "#e0f2f1" }} placeholder="Re-enter password" value={form.confirmPassword} onChange={set("confirmPassword")} />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b9e9e" }}>{showConfirm ? "🙈" : "👁️"}</button>
                </div>
                {errors.confirmPassword && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.confirmPassword}</p>}
              </div>
              <div>
                <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.agreeToTerms} onChange={set("agreeToTerms")} style={{ marginTop: 3, accentColor: "#0d9488", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", color: "#4b7b7b", lineHeight: 1.6 }}>
                    I agree to <a href="#" style={{ color: "#0d9488", fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: "#0d9488", fontWeight: 600 }}>Privacy Policy</a>
                  </span>
                </label>
                {errors.agreeToTerms && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.agreeToTerms}</p>}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={submitting}
                style={{ padding: "14px", borderRadius: 10, border: "none", background: submitting ? "#6b9e9e" : "linear-gradient(135deg, #0d9488, #0f4c4c)", color: "#fff", fontSize: "0.95rem", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'Lato', sans-serif" }}>
                {submitting ? "Creating Account..." : "Create Account →"}
              </motion.button>
              <p style={{ fontSize: "0.72rem", color: "#6b9e9e", textAlign: "center" }}>🔒 Your data is encrypted and never shared.</p>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}