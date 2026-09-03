"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReligionKey } from "../types/Religion";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  religionKey?: ReligionKey;
}

export default function Navbar({ religionKey }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuth();

  const base = religionKey ? `/${religionKey}` : "";
  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  // Figma color scheme
  const colors = {
    bg: "#E4E0D5",
    darkText: "#4A0E19",
    lightBg: "#F0FDFA",
    white: "#FFFFFF",
    darkBg: "#380913",
    accent: "#4A0E19",
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: colors.bg,
        borderBottom: "1px solid rgba(74, 14, 25, 0.1)",
        backdropFilter: "blur(16px)",
        fontFamily: "'Lato', sans-serif",
        boxShadow: "0 4px 24px rgba(74, 14, 25, 0.08)",
      }}
    >
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 90,
        gap: "1.5rem",
      }}>
        {/* LEFT: Blogs + Contact */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }} className="desktop-left">
          {[
            { label: "Blogs", href: "/blog" },
            { label: "Contact", href: "/contact" },
          ].map((link) => (
            <Link key={link.label} href={link.href} style={{
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: "0.88rem",
              fontWeight: 500,
              color: isActive(link.href) ? colors.white : colors.darkText,
              background: isActive(link.href) ? colors.darkText : "transparent",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* CENTER: Logo - MUCH BIGGER */}
        <Link
          href={base || "/"}
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
          }}
        >
          <div
            style={{
              position: "relative",
              width: 500,
              height: 300,
              flexShrink: 0,
            }}
          >
            <Image
              src="/media/logo.png"
              alt="Register My Marriage"
              fill
              priority
              loading="eager"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        </Link>

        {/* RIGHT: Register + Login/Account */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }} className="desktop-right">
          <Link href="/register" style={{ textDecoration: "none" }}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
              padding: "10px 24px",
              borderRadius: 8,
              background: colors.darkText,
              color: colors.white,
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
              Register
            </motion.div>
          </Link>

          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen((p) => !p)} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                borderRadius: 8,
                border: `1.5px solid ${colors.darkText}`,
                background: colors.white,
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
              }}>
                <div style={{
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
                }}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: colors.darkText, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.name?.split(" ")[0]}
                </span>
                <span style={{ color: colors.darkText, fontSize: "0.65rem", opacity: 0.6 }}>▾</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: colors.white,
                    border: `1px solid ${colors.darkText}`,
                    borderRadius: 10,
                    boxShadow: "0 8px 32px rgba(74, 14, 25, 0.12)",
                    minWidth: 190,
                    zIndex: 200,
                    overflow: "hidden",
                  }}>
                    <div style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${colors.darkText}` }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: colors.darkText }}>{user?.name}</div>
                      <div style={{ fontSize: "0.72rem", color: colors.darkText, opacity: 0.6, marginTop: 2 }}>{user?.email}</div>
                    </div>
                    <Link href="/account" onClick={() => setDropdownOpen(false)}
                      style={{ display: "block", padding: "0.75rem 1rem", textDecoration: "none", fontSize: "0.85rem", color: colors.darkText, fontWeight: 500 }}>
                      👤 My Account
                    </Link>
                    <button onClick={handleLogout} style={{
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
                      fontFamily: "'Lato', sans-serif",
                      fontWeight: 500,
                    }}>
                      🚪 Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: `1.5px solid ${colors.darkText}`,
                color: colors.darkText,
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                background: "transparent",
                whiteSpace: "nowrap",
              }}>
                Login
              </motion.div>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen((p) => !p)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8 }}
          className="mobile-menu-btn" aria-label="Toggle menu">
          <div style={{ width: 24, display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", height: 2.5, borderRadius: 2, background: colors.darkText, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", height: 2.5, borderRadius: 2, background: colors.darkText, opacity: menuOpen ? 0 : 1, transition: "all 0.3s" }} />
            <span style={{ display: "block", height: 2.5, borderRadius: 2, background: colors.darkText, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderTop: `1px solid ${colors.darkText}`, background: colors.white }}>
            <div style={{ padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: "Blogs", href: "/blog" },
                { label: "Contact", href: "/contact" }
              ].map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: colors.darkText, background: colors.lightBg, fontWeight: 500 }}>
                  {link.label}
                </Link>
              ))}
              
              <Link href="/register" onClick={() => setMenuOpen(false)}
                style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: colors.white, background: colors.darkText, fontWeight: 600, textAlign: "center" }}>
                Register
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: colors.darkText, background: colors.lightBg, fontWeight: 500 }}>
                    👤 My Account
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                    style={{ padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: "#dc2626", background: "#fff5f5", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", textAlign: "left" }}>
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: colors.darkText, background: colors.lightBg, fontWeight: 600, textAlign: "center", border: `1.5px solid ${colors.darkText}` }}>
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-left { display: none !important; }
          .desktop-right { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}