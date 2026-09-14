"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

/* ── BRAND GUIDELINE COLORS ── */
const COLORS = {
  bg: "#F7F0E7",              // Warm Cream — brand default
  burgundy: "#650B18",        // Brand Burgundy — primary
  darkBurgundy: "#4A0812",    // Deeper burgundy (derived)
  cream: "#FBF6F0",           // Cream tint
  card: "#FFFCF9",            // Card background
  muted: "#7A5A60",           // Muted burgundy-grey
  lightBorder: "#C9B8BA",     // Soft border
  white: "#FFFFFF",
  ink: "#171717",             // Ink from brand
  gold: "#D6AD62",            // Antique Gold accent
};

/* ── BRAND FONT STACKS ── */
const FONT_DISPLAY =
  "'Coolvetica', 'Helvetica Neue', 'Arial Narrow', Arial, sans-serif";
const FONT_UI =
  "'Inter', 'Helvetica Neue', Arial, system-ui, -apple-system, sans-serif";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("session") === "expired") {
      setApiError("Your session has expired. Please log in again.");

      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const set =
    (field: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: "" }));
      setApiError("");
    };

  const validate = () => {
    const e: typeof errors = {};

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      e.email = "Valid email required";
    }

    if (!form.password) {
      e.password = "Password is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const res = await fetch(`${BASE_URL}/users/login/User`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      login(data.user, data.token);
      router.push("/account");
    } catch (err: any) {
      setApiError(
        err?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 8,
    border: `1.5px solid ${COLORS.lightBorder}`,
    fontSize: "0.9rem",
    fontFamily: FONT_UI,
    color: COLORS.burgundy,
    background: COLORS.white,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        fontFamily: FONT_UI,
        background: COLORS.bg,
        minHeight: "100vh",
        color: COLORS.burgundy,
      }}
    >
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        input:focus {
          border-color: #650B18 !important;
          box-shadow: 0 0 0 3px rgba(101,11,24,0.08);
        }

        input::placeholder {
          color: #9B8589;
        }

        .login-card {
          transition: all 0.3s ease;
        }

        .login-card:hover {
          box-shadow: 0 18px 45px rgba(101,11,24,0.12) !important;
        }

        @media (max-width: 520px) {
          .login-wrapper {
            padding: 1.25rem !important;
          }

          .login-card {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>

      <Navbar />

      {/* HERO */}
      <section
        style={{
          background: COLORS.darkBurgundy,
          padding: "4rem 2rem 4.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
            top: -160,
            left: -70,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
            bottom: -260,
            right: -100,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", zIndex: 2 }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D9BFC4",
              fontWeight: 700,
              fontFamily: FONT_UI,
            }}
          >
            Welcome Back
          </span>

          <h1
            style={{
              marginTop: "0.7rem",
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              color: COLORS.white,
              fontFamily: FONT_DISPLAY,
              lineHeight: 1.2,
            }}
          >
            Sign In to Register my marriage
          </h1>

          <p
            style={{
              marginTop: "0.9rem",
              color: "rgba(255,255,255,0.68)",
              fontSize: "0.9rem",
              fontFamily: FONT_UI,
            }}
          >
            Continue your marriage registration journey.
          </p>
        </motion.div>
      </section>

      {/* LOGIN */}
      <div
        className="login-wrapper"
        style={{
          minHeight: "calc(100vh - 68px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "4rem 2rem 6rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="login-card"
          style={{
            width: "100%",
            maxWidth: 430,
            background: COLORS.card,
            padding: "2.5rem",
            borderRadius: 14,
            border: `1px solid ${COLORS.burgundy}`,
            boxShadow: "0 8px 30px rgba(101,11,24,0.07)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: COLORS.darkBurgundy,
                color: COLORS.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                fontSize: "1.2rem",
              }}
            >
              ♡
            </div>

            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: COLORS.burgundy,
                fontFamily: FONT_DISPLAY,
                marginBottom: "0.45rem",
              }}
            >
              Welcome Back
            </h2>

            <p
              style={{
                color: COLORS.muted,
                fontSize: "0.84rem",
                lineHeight: 1.6,
                fontFamily: FONT_UI,
              }}
            >
              Enter your credentials to continue
            </p>
          </div>

          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: "11px 14px",
                  borderRadius: 8,
                  background: "#FBEEEE",
                  border: "1px solid #E8BABA",
                  color: "#A51D2D",
                  fontSize: "0.82rem",
                  marginBottom: "1.25rem",
                  lineHeight: 1.5,
                  fontFamily: FONT_UI,
                }}
              >
                {apiError}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* EMAIL */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  color: COLORS.burgundy,
                  marginBottom: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: FONT_UI,
                }}
              >
                Email Address <span>*</span>
              </label>

              <input
                type="email"
                style={{
                  ...inp,
                  borderColor: errors.email ? "#DC2626" : COLORS.lightBorder,
                }}
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />

              {errors.email && (
                <p
                  style={{
                    fontSize: "0.73rem",
                    color: "#DC2626",
                    marginTop: 5,
                    fontFamily: FONT_UI,
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  color: COLORS.burgundy,
                  marginBottom: 7,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: FONT_UI,
                }}
              >
                Password <span>*</span>
              </label>

              <input
                type="password"
                style={{
                  ...inp,
                  borderColor: errors.password ? "#DC2626" : COLORS.lightBorder,
                }}
                placeholder="Your password"
                value={form.password}
                onChange={set("password")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />

              {errors.password && (
                <p
                  style={{
                    fontSize: "0.73rem",
                    color: "#DC2626",
                    marginTop: 5,
                    fontFamily: FONT_UI,
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: "14px",
                borderRadius: 8,
                border: `1px solid ${COLORS.burgundy}`,
                background: submitting
                  ? COLORS.muted
                  : `linear-gradient(135deg, ${COLORS.burgundy}, ${COLORS.darkBurgundy})`,
                color: COLORS.white,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: FONT_UI,
                marginTop: "0.15rem",
              }}
            >
              {submitting ? "Signing in..." : "Sign In →"}
            </motion.button>

            <div
              style={{
                height: 1,
                background: "#D8C9CA",
                margin: "0.2rem 0",
              }}
            />

            <p
              style={{
                fontSize: "0.82rem",
                color: COLORS.muted,
                textAlign: "center",
                fontFamily: FONT_UI,
              }}
            >
              New here?{" "}
              <Link
                href="/register"
                style={{
                  color: COLORS.burgundy,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Create an account →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          background: COLORS.darkBurgundy,
          padding: "2rem",
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.73rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontFamily: FONT_UI,
        }}
      >
        © 2024 RegisterMyMarriage · India's trusted marriage registration
        platform
      </footer>
    </div>
  );
}