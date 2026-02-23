"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReligionKey } from "../types/Religion";
import { RELIGION_THEMES } from "../constants/Religions";
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
    router.push(base || "/");
  };

  return (
    <nav
  style={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#074949", 

    borderBottom: "none",
    backdropFilter: "blur(16px)",
    fontFamily: "'Lato', sans-serif",
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
  }}
>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 2rem",
        
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        height: 68,
        gap: "1rem",
      }}>

        {/* LEFT: Blogs + Contact */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-left">
          {[
            { label: "Blogs", href: `${base}/blog` },
            { label: "Contact", href: `${base}/contact` },
          ].map((link) => (
            <Link key={link.label} href={link.href} style={{
              textDecoration: "none", padding: "8px 16px", borderRadius: 8,
              fontSize: "0.88rem", fontWeight: 500,
              color: isActive(link.href) ? "#0d9488" : "white",
              background: isActive(link.href) ? "#f0fdfa" : "transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* CENTER: Logo */}
<Link
  href={base || "/"}
  style={{
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <div
    style={{
      position: "relative",
      width: 150,
      height: 64, // must stay under 68
      overflow: "visible", // allow visual scaling
      flexShrink: 0,
    }}
  >
    <Image
      src="/media/logo.png"
      alt="Register My Marriage"
      fill
      style={{
        objectFit: "contain",
        transform: "scale(5)",   // 🔥 makes it look ~300px
        transformOrigin: "center",
      }}
    />
  </div>
</Link>

        {/* RIGHT: Register + Login/Account */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end" }} className="desktop-right">
          <Link href={`${base}/register`} style={{ textDecoration: "none" }}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
              padding: "9px 18px", borderRadius: 8,
              background: "linear-gradient(135deg, #061615, #021414)",
              color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>
              Register
            </motion.div>
          </Link>

          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setDropdownOpen((p) => !p)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 12px", borderRadius: 8,
                border: "1.5px solid #e0f2f1", background: "#f0fdfa",
                cursor: "pointer", fontFamily: "'Lato', sans-serif",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg, #0d9488, #0f4c4c)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0,
                }}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#0f4c4c", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.name?.split(" ")[0]}
                </span>
                <span style={{ color: "#6b9e9e", fontSize: "0.65rem" }}>▾</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#fff", border: "1px solid #e0f2f1", borderRadius: 10,
                    boxShadow: "0 8px 32px rgba(13,148,136,0.12)", minWidth: 190, zIndex: 200, overflow: "hidden",
                  }}>
                    <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e0f2f1" }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f4c4c" }}>{user?.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "#6b9e9e", marginTop: 2 }}>{user?.email}</div>
                    </div>
                    <Link href={`${base}/account`} onClick={() => setDropdownOpen(false)}
                      style={{ display: "block", padding: "0.75rem 1rem", textDecoration: "none", fontSize: "0.85rem", color: "#0f4c4c", fontWeight: 500 }}>
                      👤 My Account
                    </Link>
                    <button onClick={handleLogout} style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "0.75rem 1rem", background: "none", border: "none",
                      borderTop: "1px solid #e0f2f1", fontSize: "0.85rem", color: "#dc2626",
                      cursor: "pointer", fontFamily: "'Lato', sans-serif", fontWeight: 500,
                    }}>
                      🚪 Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href={`${base}/login`} style={{ textDecoration: "none" }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{
                padding: "9px 18px", borderRadius: 8,
                border: "1.5px solid #0d9488", color: "#0d9488",
                fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                background: "#fff", whiteSpace: "nowrap",
              }}>
                Login
              </motion.div>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen((p) => !p)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, gridColumn: "3", justifySelf: "end" }}
          className="mobile-menu-btn" aria-label="Toggle menu">
          <div style={{ width: 22, display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ display: "block", height: 2, borderRadius: 2, background: "#0f4c4c", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", height: 2, borderRadius: 2, background: "#0f4c4c", opacity: menuOpen ? 0 : 1, transition: "all 0.3s" }} />
            <span style={{ display: "block", height: 2, borderRadius: 2, background: "#0f4c4c", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid #e0f2f1", background: "#fff" }}>
            <div style={{ padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[{ label: "Blogs", href: `${base}/blog` }, { label: "Contact", href: `${base}/contact` }].map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: "#0f4c4c", background: "#f0fdfa", fontWeight: 500 }}>
                  {link.label}
                </Link>
              ))}
              <Link href={`${base}/register`} onClick={() => setMenuOpen(false)}
                style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: "#fff", background: "linear-gradient(135deg, #0d9488, #0f4c4c)", fontWeight: 600, textAlign: "center" }}>
                Register
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href={`${base}/account`} onClick={() => setMenuOpen(false)}
                    style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: "#0f4c4c", background: "#f0fdfa", fontWeight: 500 }}>
                    👤 My Account
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                    style={{ padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: "#dc2626", background: "#fff5f5", fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", textAlign: "left" }}>
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <Link href={`${base}/login`} onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 8, fontSize: "0.95rem", color: "#0d9488", background: "#f0fdfa", fontWeight: 600, textAlign: "center", border: "1.5px solid #0d9488" }}>
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