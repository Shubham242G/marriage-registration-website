"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  bg: "#E4E0D5",
  burgundy: "#4A0E19",
  darkBurgundy: "#380913",
  cream: "#F7F3EA",
  card: "#FBF9F4",
  muted: "#76555C",
  lightBorder: "#C9B8BA",
  white: "#FFFFFF",
};

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

type FormErrors = Partial<
  Record<keyof RegisterForm, string>
>;

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const set =
    (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value;

      setForm((p) => ({
        ...p,
        [field]: value,
      }));

      setErrors((p) => ({
        ...p,
        [field]: "",
      }));

      setApiError("");
    };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.name.trim()) {
      e.name = "Full name is required";
    }

    if (
      !form.email.match(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      )
    ) {
      e.email = "Valid email required";
    }

    if (!form.phone.match(/^[6-9]\d{9}$/)) {
      e.phone =
        "Valid 10-digit Indian mobile number required";
    }

    if (form.password.length < 8) {
      e.password =
        "Password must be at least 8 characters";
    }

    if (!/[A-Z]/.test(form.password)) {
      e.password =
        "Must contain at least one uppercase letter";
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (!form.agreeToTerms) {
      e.agreeToTerms =
        "You must agree to continue";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    try {
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "";

      const res = await fetch(
        `${BASE_URL}/users/register/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Registration failed"
        );
      }

      const loginRes = await fetch(
        `${BASE_URL}/users/login/User`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.token) {
        login(
          loginData.user,
          loginData.token
        );
      }

      router.push("/account");
    } catch (err: any) {
      setApiError(
        err?.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: `1.5px solid ${COLORS.lightBorder}`,
    fontSize: "0.88rem",
    fontFamily: "'Lato', sans-serif",
    color: COLORS.burgundy,
    background: COLORS.white,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  };

  const PasswordStrength = ({
    pwd,
  }: {
    pwd: string;
  }) => {
    if (!pwd) return null;

    const score = [
      pwd.length >= 8,
      /[A-Z]/.test(pwd),
      /[0-9]/.test(pwd),
      /[^A-Za-z0-9]/.test(pwd),
    ].filter(Boolean).length;

    const colors = [
      "",
      "#DC2626",
      "#D97706",
      "#8B6F47",
      COLORS.burgundy,
    ];

    const labels = [
      "",
      "Weak",
      "Fair",
      "Good",
      "Strong",
    ];

    return (
      <div style={{ marginTop: 7 }}>
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 4,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background:
                  i <= score
                    ? colors[score]
                    : "#D8C9CA",
              }}
            />
          ))}
        </div>

        <span
          style={{
            fontSize: "0.68rem",
            color: colors[score],
            fontWeight: 700,
          }}
        >
          {labels[score]}
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "'Lato', sans-serif",
        background: COLORS.bg,
        minHeight: "100vh",
        color: COLORS.burgundy,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        input:focus {
          border-color: #4A0E19 !important;
          box-shadow: 0 0 0 3px rgba(74,14,25,0.08);
        }

        input::placeholder {
          color: #9B8589;
        }

        .register-card {
          transition: all 0.3s ease;
        }

        .register-card:hover {
          box-shadow: 0 18px 45px rgba(74,14,25,0.12) !important;
        }

        @media (max-width: 520px) {
          .register-wrapper {
            padding: 1.25rem !important;
          }

          .register-card {
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
            border:
              "1px solid rgba(255,255,255,0.07)",
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
            border:
              "1px solid rgba(255,255,255,0.06)",
            bottom: -260,
            right: -100,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#D9BFC4",
              fontWeight: 700,
            }}
          >
            Begin Your Journey
          </span>

          <h1
            style={{
              marginTop: "0.7rem",
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              color: COLORS.white,
              fontFamily:
                "'Playfair Display', Georgia, serif",
              lineHeight: 1.2,
            }}
          >
            Create Your Regsiter my marriage Account
          </h1>

          <p
            style={{
              marginTop: "0.9rem",
              color: "rgba(255,255,255,0.68)",
              fontSize: "0.9rem",
            }}
          >
            Start your marriage registration journey
            with us.
          </p>
        </motion.div>
      </section>

      {/* REGISTER */}

      <div
        className="register-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "4rem 2rem 6rem",
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.6 }}
          className="register-card"
          style={{
            width: "100%",
            maxWidth: 480,
            background: COLORS.card,
            padding: "2.5rem",
            borderRadius: 14,
            border: `1px solid ${COLORS.burgundy}`,
            boxShadow:
              "0 8px 30px rgba(74,14,25,0.07)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
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
                fontFamily:
                  "'Playfair Display', Georgia, serif",
                marginBottom: "0.5rem",
              }}
            >
              Create Your Account
            </h2>

            <p
              style={{
                color: COLORS.muted,
                fontSize: "0.83rem",
              }}
            >
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: COLORS.burgundy,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign in →
              </Link>
            </p>
          </div>

          <AnimatePresence>
            {apiError && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                style={{
                  padding: "11px 14px",
                  borderRadius: 8,
                  background: "#FBEEEE",
                  border:
                    "1px solid #E8BABA",
                  color: "#A51D2D",
                  fontSize: "0.82rem",
                  marginBottom: "1.2rem",
                  lineHeight: 1.5,
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
              gap: "1.15rem",
            }}
          >
            {/* NAME */}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: COLORS.burgundy,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Full Name *
              </label>

              <input
                style={{
                  ...inp,
                  borderColor: errors.name
                    ? "#DC2626"
                    : COLORS.lightBorder,
                }}
                placeholder="Your full name"
                value={form.name}
                onChange={set("name")}
              />

              {errors.name && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#DC2626",
                    marginTop: 4,
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* EMAIL */}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: COLORS.burgundy,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Email Address *
              </label>

              <input
                type="email"
                style={{
                  ...inp,
                  borderColor: errors.email
                    ? "#DC2626"
                    : COLORS.lightBorder,
                }}
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />

              {errors.email && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#DC2626",
                    marginTop: 4,
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* PHONE */}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: COLORS.burgundy,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Mobile Number *
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 13,
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    color: COLORS.muted,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  +91
                </span>

                <input
                  style={{
                    ...inp,
                    paddingLeft: 47,
                    borderColor: errors.phone
                      ? "#DC2626"
                      : COLORS.lightBorder,
                  }}
                  placeholder="10-digit mobile"
                  value={form.phone}
                  onChange={set("phone")}
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>

              {errors.phone && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#DC2626",
                    marginTop: 4,
                  }}
                >
                  {errors.phone}
                </p>
              )}
            </div>

            {/* PASSWORD */}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: COLORS.burgundy,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Password *
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  style={{
                    ...inp,
                    paddingRight: 48,
                    borderColor: errors.password
                      ? "#DC2626"
                      : COLORS.lightBorder,
                  }}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={set("password")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (p) => !p
                    )
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: COLORS.muted,
                    fontSize: "0.95rem",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.password && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#DC2626",
                    marginTop: 4,
                  }}
                >
                  {errors.password}
                </p>
              )}

              <PasswordStrength
                pwd={form.password}
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.73rem",
                  fontWeight: 700,
                  color: COLORS.burgundy,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Confirm Password *
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  style={{
                    ...inp,
                    paddingRight: 48,
                    borderColor:
                      errors.confirmPassword
                        ? "#DC2626"
                        : COLORS.lightBorder,
                  }}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={set(
                    "confirmPassword"
                  )}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      (p) => !p
                    )
                  }
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: COLORS.muted,
                    fontSize: "0.95rem",
                  }}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>

              {errors.confirmPassword && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#DC2626",
                    marginTop: 4,
                  }}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* TERMS */}

            <div>
              <label
                style={{
                  display: "flex",
                  gap: "0.7rem",
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={set(
                    "agreeToTerms"
                  )}
                  style={{
                    marginTop: 4,
                    accentColor:
                      COLORS.burgundy,
                    flexShrink: 0,
                  }}
                />

                <span
                  style={{
                    fontSize: "0.78rem",
                    color: COLORS.muted,
                    lineHeight: 1.6,
                  }}
                >
                  I agree to{" "}
                  <a
                    href="#"
                    style={{
                      color: COLORS.burgundy,
                      fontWeight: 700,
                    }}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    style={{
                      color: COLORS.burgundy,
                      fontWeight: 700,
                    }}
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              {errors.agreeToTerms && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#DC2626",
                    marginTop: 4,
                  }}
                >
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* BUTTON */}

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
                padding: "14px",
                borderRadius: 8,
                border: `1px solid ${COLORS.burgundy}`,
                background: submitting
                  ? COLORS.muted
                  : `linear-gradient(135deg, ${COLORS.burgundy}, ${COLORS.darkBurgundy})`,
                color: COLORS.white,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: submitting
                  ? "not-allowed"
                  : "pointer",
                fontFamily:
                  "'Lato', sans-serif",
                marginTop: "0.15rem",
              }}
            >
              {submitting
                ? "Creating Account..."
                : "Create Account →"}
            </motion.button>

            <div
              style={{
                height: 1,
                background: "#D8C9CA",
                margin: "0.1rem 0",
              }}
            />

            <p
              style={{
                fontSize: "0.7rem",
                color: COLORS.muted,
                textAlign: "center",
              }}
            >
              🔒 Your data is encrypted and
              never shared.
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
          borderTop:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        © 2024 RegisterMyMarriage · India's trusted marriage
        registration platform
      </footer>
    </div>
  );
}