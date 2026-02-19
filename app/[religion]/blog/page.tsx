"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { RELIGION_THEMES } from "../../constants/Religions";
import { ReligionKey } from "../../types/Religion";

interface IBlog {
  _id?: string;
  bannerImage: string;
  Date: string;
  categoryId: string;
  createdBy: string;
  bannerTitle: string;
  slug: string;
  description: string;
}

// Static fallback articles (shown while real blogs load or if none exist yet)
const STATIC_ARTICLES: IBlog[] = [
  {
    _id: "static-1",
    bannerTitle: "Why Every Married Couple in India Must Register Their Marriage",
    description:
      "Despite India conducting over 10 million weddings every year, a staggering proportion remain legally unregistered. The consequences — from inheritance disputes to visa complications — can be severe. We explain why registration is not optional.",
    Date: "2024-01-15",
    createdBy: "VivahSetu Legal Team",
    categoryId: "legal",
    slug: "why-register-marriage-india",
    bannerImage: "",
  },
  {
    _id: "static-2",
    bannerTitle: "Hindu Marriage Act vs Special Marriage Act: Which Applies to You?",
    description:
      "Two of India's most important marriage laws govern millions of couples — but most people don't understand the difference. We break down who qualifies under each act, the procedural differences, and which route is faster.",
    Date: "2024-01-22",
    createdBy: "VivahSetu Legal Team",
    categoryId: "legal",
    slug: "hindu-marriage-act-vs-special-marriage-act",
    bannerImage: "",
  },
  {
    _id: "static-3",
    bannerTitle: "The Indian Wedding Industry: A ₹5 Lakh Crore Market",
    description:
      "India's wedding market is one of the largest in the world — and it's growing at 15% annually. From destination weddings to digital invitations, we explore how the Indian marriage landscape is transforming.",
    Date: "2024-02-05",
    createdBy: "VivahSetu Editorial",
    categoryId: "insights",
    slug: "india-wedding-industry-overview",
    bannerImage: "",
  },
  {
    _id: "static-4",
    bannerTitle: "Nikah Registration: Bridging Islamic Tradition and Indian Law",
    description:
      "A Nikah holds deep religious significance, but without civil registration, couples face legal vulnerability. This guide explains exactly how Muslim couples can register their marriage under Indian law while preserving their religious customs.",
    Date: "2024-02-18",
    createdBy: "VivahSetu Legal Team",
    categoryId: "religion",
    slug: "nikah-registration-guide",
    bannerImage: "",
  },
  {
    _id: "static-5",
    bannerTitle: "Documents Required for Marriage Registration in India: A Complete Checklist",
    description:
      "One of the most common reasons marriage applications are rejected is incomplete documentation. Our comprehensive checklist covers every document you'll need — across all religions and all Indian states.",
    Date: "2024-03-01",
    createdBy: "VivahSetu Legal Team",
    categoryId: "guides",
    slug: "marriage-registration-documents-checklist",
    bannerImage: "",
  },
  {
    _id: "static-6",
    bannerTitle: "Court Marriage vs Religious Marriage: Rights, Differences & What Couples Should Know",
    description:
      "Many couples are confused about the difference between a court marriage and a religious ceremony. This article clarifies legal rights under each, addresses common misconceptions, and guides couples in choosing the right path.",
    Date: "2024-03-14",
    createdBy: "VivahSetu Editorial",
    categoryId: "guides",
    slug: "court-marriage-vs-religious-marriage",
    bannerImage: "",
  },
];

const CATEGORIES = ["All", "Legal", "Religion", "Guides", "Insights"];

const CATEGORY_COLORS: Record<string, string> = {
  legal: "#0d9488",
  religion: "#7c3aed",
  guides: "#b45309",
  insights: "#0e7490",
  all: "#374151",
};

interface PageProps {
  params: Promise<{ religion: string }>;
}

export default function BlogPage({ params }: PageProps) {
  const { religion } = use(params);
  const theme = RELIGION_THEMES[religion as ReligionKey];
  const [blogs, setBlogs] = useState<IBlog[]>(STATIC_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Fetch real blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(
          `${BASE_URL}/blog/?pageIndex=0&pageSize=20`
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
            setBlogs(data.data);
          }
        }
      } catch (err) {
        // Keep static articles as fallback — no console noise in prod
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = blogs.filter((b) => {
    const matchCategory =
      activeCategory === "All" ||
      b.categoryId?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch =
      !search ||
      b.bannerTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch {
      return d;
    }
  };

  const CategoryBadge = ({ cat }: { cat: string }) => (
    <span
      style={{
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: CATEGORY_COLORS[cat.toLowerCase()] || "#374151",
        background: `${CATEGORY_COLORS[cat.toLowerCase()] || "#374151"}14`,
        padding: "3px 10px",
        borderRadius: 999,
      }}
    >
      {cat}
    </span>
  );

  if (!theme) return null;

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", background: "#fafffe", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <Navbar religionKey={theme.key} />

      {/* Page Header */}
      <section
        style={{
          background: theme.bannerBg,
          padding: "4rem 2rem 3.5rem",
          textAlign: "center",
        }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ccfbf1",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            Insights & Guides
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Playfair Display', Georgia, serif",
              marginBottom: "1rem",
            }}
          >
            Marriage Knowledge Hub
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", maxWidth: 520, margin: "0 auto", lineHeight: 1.8, fontSize: "0.97rem" }}>
            Expert articles on Indian marriage laws, traditions, registration processes, and everything couples need to know.
          </p>
        </motion.div>
      </section>

      {/* Search + Filter Bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e0f2f1",
          padding: "1.25rem 2rem",
          position: "sticky",
          top: 68,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Categories */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  border: `1.5px solid ${activeCategory === cat ? theme.accentTeal : "#e0f2f1"}`,
                  background: activeCategory === cat ? theme.accentTeal : "#fff",
                  color: activeCategory === cat ? "#fff" : "#4b7b7b",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1.5px solid #e0f2f1",
              fontSize: "0.87rem",
              outline: "none",
              fontFamily: "'Lato', sans-serif",
              color: "#0f4c4c",
              width: 220,
              background: "#fafffe",
            }}
          />
        </div>
      </div>

      {/* Articles Grid */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
        {loading && (
          <div style={{ textAlign: "center", color: "#6b9e9e", padding: "3rem" }}>
            Loading articles...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#6b9e9e", padding: "4rem" }}>
            No articles found.{" "}
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }} style={{ color: theme.accentTeal, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>
              Clear filters
            </button>
          </div>
        )}

        {/* Featured: first article large */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              marginBottom: "2.5rem",
              borderRadius: 18,
              border: "1px solid #e0f2f1",
              overflow: "hidden",
              background: "#fff",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              boxShadow: "0 4px 24px rgba(13,148,136,0.07)",
            }}
          >
            {/* Image placeholder */}
            <div
              style={{
                background: theme.bannerBg,
                minHeight: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {filtered[0].bannerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={filtered[0].bannerImage} alt={filtered[0].bannerTitle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "4rem" }}>📖</div>
              )}
            </div>
            <div style={{ padding: "2.5rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", color: "#6b9e9e" }}>Featured</span>
                <CategoryBadge cat={filtered[0].categoryId || "legal"} />
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#0f4c4c",
                  lineHeight: 1.3,
                  marginBottom: "1rem",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {filtered[0].bannerTitle}
              </h2>
              <p style={{ color: "#4b7b7b", lineHeight: 1.8, fontSize: "0.92rem", marginBottom: "1.5rem" }}>
                {filtered[0].description}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#0f4c4c" }}>{filtered[0].createdBy}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b9e9e" }}>{formatDate(filtered[0].Date)}</div>
                </div>
                <Link
                  href={`/${theme.key}/blog/${filtered[0].slug || filtered[0]._id}`}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 8,
                    background: theme.accentTeal,
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  Read More →
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rest of articles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.slice(1).map((blog, i) => (
            <motion.article
              key={blog._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(13,148,136,0.1)" }}
              style={{
                borderRadius: 14,
                border: "1px solid #e0f2f1",
                background: "#fff",
                overflow: "hidden",
                transition: "all 0.25s ease",
              }}
            >
              {/* Card image */}
              <div
                style={{
                  height: 160,
                  background: theme.bannerBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {blog.bannerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blog.bannerImage} alt={blog.bannerTitle} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "2.5rem" }}>📄</span>
                )}
                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                  <CategoryBadge cat={blog.categoryId || "legal"} />
                </div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#0f4c4c",
                    lineHeight: 1.4,
                    marginBottom: "0.75rem",
                    fontFamily: "'Playfair Display', Georgia, serif",
                  }}
                >
                  {blog.bannerTitle}
                </h3>
                <p
                  style={{
                    color: "#4b7b7b",
                    fontSize: "0.84rem",
                    lineHeight: 1.7,
                    marginBottom: "1.25rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  } as React.CSSProperties}
                >
                  {blog.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#0f4c4c" }}>{blog.createdBy}</div>
                    <div style={{ fontSize: "0.7rem", color: "#6b9e9e" }}>{formatDate(blog.Date)}</div>
                  </div>
                  <Link
                    href={`/${theme.key}/blog/${blog.slug || blog._id}`}
                    style={{
                      fontSize: "0.8rem",
                      color: theme.accentTeal,
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Read →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "#0a3a3a", padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
        © 2024 VivahSetu · All Rights Reserved
      </footer>
    </div>
  );
}