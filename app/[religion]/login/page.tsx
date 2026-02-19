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

export default function LoginPage({ params }: PageProps) {
  const { religion } = use(params);
  const theme = RELIGION_THEMES[religion as ReligionKey];
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  if (!theme) return null;

  const set = (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: "" }));
      setApiError("");
    };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
      // Correct route: POST /v1/users/login/User
      const res = await fetch(`${BASE_URL}/users/login/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      login(data.user, data.token);
      // Redirect to account page after login
      router.push(`/${religion}/account`);
    } catch (err: any) {
      setApiError(err?.message || "Invalid credentials. Please try again.");
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

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#fafffe", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { border-color: #0d9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.08); }
      `}</style>

      <Navbar religionKey={theme.key} />

      <div style={{ minHeight: "calc(100vh - 68px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

        {/* Left panel */}
        <div style={{ background: theme.bannerBg, padding: "4rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#ccfbf1", marginBottom: "1.25rem" }}>
              Welcome Back
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)", fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.25, marginBottom: "1.25rem" }}>
              Continue Your Registration Journey
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, fontSize: "0.97rem", marginBottom: "2rem" }}>
              Sign in to access your account, track your application status, and manage your marriage registration documents.
            </p>
            <div style={{ padding: "1.25rem", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ color: "#ccfbf1", fontSize: "0.82rem", lineHeight: 1.7 }}>
                Don't have an account?{" "}
                <Link href={`/${religion}/register`} style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>
                  Create one free →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Form */}
        <div style={{ padding: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: "100%", maxWidth: 420 }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#0f4c4c", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "0.3rem" }}>
              Sign In
            </h2>
            <p style={{ color: "#6b9e9e", fontSize: "0.85rem", marginBottom: "2rem" }}>Enter your credentials to continue</p>

            <AnimatePresence>
              {apiError && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.84rem", marginBottom: "1.25rem" }}>
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#0f4c4c", marginBottom: 6 }}>
                  Email Address <span style={{ color: "#0d9488" }}>*</span>
                </label>
                <input type="email" style={{ ...inp, borderColor: errors.email ? "#dc2626" : "#e0f2f1" }}
                  placeholder="you@example.com" value={form.email} onChange={set("email")}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                {errors.email && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.email}</p>}
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f4c4c" }}>
                    Password <span style={{ color: "#0d9488" }}>*</span>
                  </label>
                </div>
                <input type="password" style={{ ...inp, borderColor: errors.password ? "#dc2626" : "#e0f2f1" }}
                  placeholder="Your password" value={form.password} onChange={set("password")}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                {errors.password && <p style={{ fontSize: "0.74rem", color: "#dc2626", marginTop: 4 }}>{errors.password}</p>}
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubmit} disabled={submitting}
                style={{
                  padding: "14px", borderRadius: 10, border: "none",
                  background: submitting ? "#6b9e9e" : "linear-gradient(135deg, #0d9488, #0f4c4c)",
                  color: "#fff", fontSize: "0.95rem", fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "'Lato', sans-serif", marginTop: "0.25rem",
                }}>
                {submitting ? "Signing in..." : "Sign In →"}
              </motion.button>

              <p style={{ fontSize: "0.82rem", color: "#6b9e9e", textAlign: "center" }}>
                New here?{" "}
                <Link href={`/${religion}/register`} style={{ color: "#0d9488", fontWeight: 600, textDecoration: "none" }}>
                  Create an account →
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}