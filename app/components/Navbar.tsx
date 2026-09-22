"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lottie } from "lottie-react";
import logoAnimation from "../media/logo.json";
import { ReligionKey } from "../types/Religion";
import { useAuth } from "../context/AuthContext";

/* ── BRAND FONT STACKS ── */
const FONT_DISPLAY =
  "'Coolvetica', 'Helvetica Neue', 'Arial Narrow', Arial, sans-serif";
const FONT_UI =
  "'Inter', 'Helvetica Neue', Arial, system-ui, -apple-system, sans-serif";

const STORAGE_KEY = "lastSelectedReligion";

interface NavbarProps {
  religionKey?: ReligionKey;
}

export default function Navbar({ religionKey }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastReligion, setLastReligion] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuth();

  const base = religionKey ? `/${religionKey}` : "";
  const isActive = (href: string) => pathname === href;

  /* ── Persist / read last selected religion ── */
  useEffect(() => {
    // If a religionKey prop is passed (i.e. user is on a religion page),
    // save it as the "last selected religion".
    if (religionKey) {
      try {
        localStorage.setItem(STORAGE_KEY, religionKey);
      } catch {
        /* ignore storage errors */
      }
      setLastReligion(religionKey);
    } else {
      // Otherwise, read whatever was last stored.
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setLastReligion(stored);
      } catch {
        /* ignore */
      }
    }
  }, [religionKey]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  /* ── Compute logo href ──
     - If user is currently on a religion page, go to the OTHER last-selected religion
       (i.e. the one stored before this navigation). Since we update storage on mount,
       we fall back to the current religionKey only if nothing else exists.
     - Otherwise, go to the last selected religion, or "/" if none. */
  const logoHref = (() => {
    // If we're on a religion page, prefer the previously stored one (before this page).
    if (religionKey) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && stored !== religionKey) return `/${stored}`;
      } catch {
        /* ignore */
      }
      // fallback: current religion page
      return `/${religionKey}`;
    }
    // Not on a religion page → use last stored or home
    return lastReligion ? `/${lastReligion}` : "/";
  })();

  /* ── BRAND GUIDELINE COLORS ── */
  const colors = {
    bg: "#F7F0E7",
    darkText: "#650B18",
    lightBg: "#FBF6F0",
    white: "#FFFFFF",
    darkBg: "#4A0812",
    accent: "#650B18",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: colors.bg,
        borderBottom: "1px solid rgba(101,11,24,0.1)",
        backdropFilter: "blur(16px)",
        fontFamily: FONT_UI,
        boxShadow: "0 4px 24px rgba(101,11,24,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 90,
          gap: "1.5rem",
        }}
      >
        {/* LEFT: Blogs + Contact */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexShrink: 0,
          }}
          className="desktop-left"
        >
          {[
            { label: "Blogs", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: "0.88rem",
                fontWeight: 500,
                color: isActive(link.href) ? colors.white : colors.darkText,
                background: isActive(link.href)
                  ? colors.darkText
                  : "transparent",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                fontFamily: FONT_UI,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CENTER: Logo (Lottie animation) */}
        <Link
          href={logoHref}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            // If already on the target page, scroll to top.
            if (pathname === logoHref) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <div
            className="logo-anim"
            style={{
              position: "relative",
              width: "clamp(260px, 36vw, 500px)",
              height: "clamp(150px, 22vw, 300px)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lottie
              src={logoAnimation}
              loop
              autoplay
              style={{ width: "100%", height: "45%" }}
            />
          </div>
        </Link>

        {/* RIGHT: Register + Login/Account */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
          className="desktop-right"
        >
          <Link href="/register" style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                background: colors.darkText,
                color: colors.white,
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: FONT_UI,
              }}
            >
              Register
            </motion.div>
          </Link>

          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${colors.darkText}`,
                  background: colors.white,
                  cursor: "pointer",
                  fontFamily: FONT_UI,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: colors.darkText,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.white,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: colors.darkText,
                    maxWidth: 80,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name?.split(" ")[0]}
                </span>
                <span
                  style={{
                    color: colors.darkText,
                    fontSize: "0.65rem",
                    opacity: 0.6,
                  }}
                >
                  ▾
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: colors.white,
                      border: `1px solid ${colors.darkText}`,
                      borderRadius: 10,
                      boxShadow: "0 8px 32px rgba(101,11,24,0.12)",
                      minWidth: 190,
                      zIndex: 200,
                      overflow: "hidden",
                      fontFamily: FONT_UI,
                    }}
                  >
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        borderBottom: `1px solid ${colors.darkText}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: colors.darkText,
                        }}
                      >
                        {user?.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: colors.darkText,
                          opacity: 0.6,
                          marginTop: 2,
                        }}
                      >
                        {user?.email}
                      </div>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "block",
                        padding: "0.75rem 1rem",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        color: colors.darkText,
                        fontWeight: 500,
                      }}
                    >
                      👤 My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        background: "none",
                        border: "none",
                        borderTop: `1px solid ${colors.darkText}`,
                        fontSize: "0.85rem",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontFamily: FONT_UI,
                        fontWeight: 500,
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: `1.5px solid ${colors.darkText}`,
                  color: colors.darkText,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "transparent",
                  whiteSpace: "nowrap",
                  fontFamily: FONT_UI,
                }}
              >
                Login
              </motion.div>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <div
            style={{
              width: 24,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span
              style={{
                display: "block",
                height: 2.5,
                borderRadius: 2,
                background: colors.darkText,
                transition: "all 0.3s",
                transform: menuOpen
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                height: 2.5,
                borderRadius: 2,
                background: colors.darkText,
                opacity: menuOpen ? 0 : 1,
                transition: "all 0.3s",
              }}
            />
            <span
              style={{
                display: "block",
                height: 2.5,
                borderRadius: 2,
                background: colors.darkText,
                transition: "all 0.3s",
                transform: menuOpen
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: "hidden",
              borderTop: `1px solid ${colors.darkText}`,
              background: colors.white,
            }}
          >
            <div
              style={{
                padding: "1rem 2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[
                { label: "Blogs", href: "/blog" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: "0.95rem",
                    color: colors.darkText,
                    background: colors.lightBg,
                    fontWeight: 500,
                    fontFamily: FONT_UI,
                  }}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: "0.95rem",
                  color: colors.white,
                  background: colors.darkText,
                  fontWeight: 600,
                  textAlign: "center",
                  fontFamily: FONT_UI,
                }}
              >
                Register
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      textDecoration: "none",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: "0.95rem",
                      color: colors.darkText,
                      background: colors.lightBg,
                      fontWeight: 500,
                      fontFamily: FONT_UI,
                    }}
                  >
                    👤 My Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: "0.95rem",
                      color: "#dc2626",
                      background: "#fff5f5",
                      fontWeight: 500,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: FONT_UI,
                      textAlign: "left",
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: "none",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: "0.95rem",
                    color: colors.darkText,
                    background: colors.lightBg,
                    fontWeight: 600,
                    textAlign: "center",
                    border: `1.5px solid ${colors.darkText}`,
                    fontFamily: FONT_UI,
                  }}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
  @media (max-width: 1024px) {
    .logo-anim {
      width: clamp(240px, 40vw, 380px) !important;
      height: clamp(140px, 24vw, 220px) !important;
    }
  }

  @media (max-width: 768px) {
    .desktop-left { display: none !important; }
    .desktop-right { display: none !important; }
    .mobile-menu-btn { display: block !important; }
    .logo-anim {
      width: clamp(200px, 55vw, 320px) !important;
      height: clamp(120px, 33vw, 190px) !important;
    }
  }

  @media (max-width: 420px) {
    .logo-anim {
      width: clamp(170px, 60vw, 240px) !important;
      height: clamp(100px, 36vw, 145px) !important;
    }
  }
`}</style>
    </nav>
  );
}