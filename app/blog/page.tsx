"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";

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

// Static fallback articles
const STATIC_ARTICLES: IBlog[] = [
  {
    _id: "static-1",
    bannerTitle: "Why Every Married Couple in India Must Register Their Marriage",
    description:
      "Despite India conducting over 10 million weddings every year, a staggering proportion remain legally unregistered. The consequences — from inheritance disputes to visa complications — can be severe. We explain why registration is not optional.",
    Date: "2024-01-15",
    createdBy: "RegisterMyMarriage Legal Team",
    categoryId: "legal",
    slug: "why-register-marriage-india",
    bannerImage: "",
  },
  {
    _id: "static-2",
    bannerTitle:
      "Hindu Marriage Act vs Special Marriage Act: Which Applies to You?",
    description:
      "Two of India's most important marriage laws govern millions of couples — but most people don't understand the difference. We break down who qualifies under each act, the procedural differences, and which route is faster.",
    Date: "2024-01-22",
    createdBy: "Register my marriage Legal Team",
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
    createdBy: "Register my marriage Editorial",
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
    createdBy: "Register my marriage Legal Team",
    categoryId: "religion",
    slug: "nikah-registration-guide",
    bannerImage: "",
  },
  {
    _id: "static-5",
    bannerTitle:
      "Documents Required for Marriage Registration in India: A Complete Checklist",
    description:
      "One of the most common reasons marriage applications are rejected is incomplete documentation. Our comprehensive checklist covers every document you'll need — across all religions and all Indian states.",
    Date: "2024-03-01",
    createdBy: "Register my marriage Legal Team",
    categoryId: "guides",
    slug: "marriage-registration-documents-checklist",
    bannerImage: "",
  },
  {
    _id: "static-6",
    bannerTitle:
      "Court Marriage vs Religious Marriage: Rights, Differences & What Couples Should Know",
    description:
      "Many couples are confused about the difference between a court marriage and a religious ceremony. This article clarifies legal rights under each, addresses common misconceptions, and guides couples in choosing the right path.",
    Date: "2024-03-14",
    createdBy: "Register my marriage Editorial",
    categoryId: "guides",
    slug: "court-marriage-vs-religious-marriage",
    bannerImage: "",
  },
];

const CATEGORIES = ["All", "Legal", "Religion", "Guides", "Insights"];

/* ── BRAND GUIDELINE COLORS ── */
const brand = {
  burgundy: "#650B18",
  ruby: "#7A1220",
  gold: "#D6AD62",
  rose: "#D98383",
  cream: "#F7F0E7",
  ink: "#171717",
  white: "#FFFFFF",
  creamTint: "#FBF6F0",
  cardBg: "#FFFCF9",
  darkBg: "#4A0812",
};

const CATEGORY_COLORS: Record<string, string> = {
  legal: brand.burgundy,
  religion: brand.burgundy,
  guides: brand.burgundy,
  insights: brand.burgundy,
  all: brand.burgundy,
};

/* ── BRAND FONT STACKS ── */
const FONT_DISPLAY =
  "'Coolvetica', 'Helvetica Neue', 'Arial Narrow', Arial, sans-serif";
const FONT_UI =
  "'Inter', 'Helvetica Neue', Arial, system-ui, -apple-system, sans-serif";

export default function BlogPage() {
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

        const res = await fetch(`${BASE_URL}/blog/?pageIndex=0&pageSize=20`);

        if (res.ok) {
          const data = await res.json();

          if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
            setBlogs(data.data);
          }
        }
      } catch (err) {
        // Static articles remain as fallback
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
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  const CategoryBadge = ({ cat }: { cat: string }) => {
    return (
      <span
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: brand.burgundy,
          background: `${brand.burgundy}14`,
          padding: "3px 10px",
          borderRadius: 999,
          fontFamily: FONT_UI,
        }}
      >
        {cat}
      </span>
    );
  };

  return (
    <div
      style={{
        fontFamily: FONT_UI,
        background: brand.cream,
        minHeight: "100vh",
      }}
    >
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* Page Header */}
      <section
        style={{
          background: brand.darkBg,
          padding: "4rem 2rem 3.5rem",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: brand.cream,
              opacity: 0.7,
              display: "block",
              marginBottom: "0.75rem",
              fontFamily: FONT_UI,
            }}
          >
            Insights & Guides
          </span>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: brand.white,
              fontFamily: FONT_DISPLAY,
              marginBottom: "1rem",
            }}
          >
            Marriage Knowledge Hub
          </h1>

          <p
            style={{
              color: brand.cream,
              opacity: 0.72,
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.8,
              fontSize: "0.97rem",
              fontFamily: FONT_UI,
            }}
          >
            Expert articles on Indian marriage laws, traditions, registration
            processes, and everything couples need to know.
          </p>
        </motion.div>
      </section>

      {/* Search + Filter Bar */}
      <div
        style={{
          background: brand.white,
          borderBottom: `1px solid ${brand.burgundy}15`,
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
                  border: `1.5px solid ${
                    activeCategory === cat
                      ? brand.burgundy
                      : `${brand.burgundy}20`
                  }`,
                  background:
                    activeCategory === cat ? brand.burgundy : brand.white,
                  color: activeCategory === cat ? brand.white : brand.burgundy,
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: FONT_UI,
                  opacity: activeCategory === cat ? 1 : 0.7,
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
              border: `1.5px solid ${brand.burgundy}20`,
              fontSize: "0.87rem",
              outline: "none",
              fontFamily: FONT_UI,
              color: brand.burgundy,
              width: 220,
              background: brand.creamTint,
            }}
          />
        </div>
      </div>

      {/* Articles */}
      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "3rem 2rem 5rem",
        }}
      >
        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              color: brand.burgundy,
              opacity: 0.6,
              padding: "3rem",
              fontFamily: FONT_UI,
            }}
          >
            Loading articles...
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: brand.burgundy,
              opacity: 0.6,
              padding: "4rem",
              fontFamily: FONT_UI,
            }}
          >
            No articles found.{" "}
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              style={{
                color: brand.burgundy,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: FONT_UI,
                opacity: 0.8,
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Featured Article */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="blog-featured-grid"
            style={{
              marginBottom: "2.5rem",
              borderRadius: 18,
              border: `1px solid ${brand.burgundy}15`,
              overflow: "hidden",
              background: brand.white,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              boxShadow: `0 4px 24px ${brand.burgundy}0D`,
            }}
          >
            {/* Featured Image */}
            <div
              style={{
                background: brand.darkBg,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {filtered[0].bannerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={filtered[0].bannerImage}
                  alt={filtered[0].bannerTitle}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ color: `${brand.white}30`, fontSize: "4rem" }}>
                  📖
                </div>
              )}
            </div>

            {/* Featured Content */}
            <div style={{ padding: "2.5rem" }}>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: brand.burgundy,
                    opacity: 0.6,
                    fontFamily: FONT_UI,
                  }}
                >
                  Featured
                </span>

                <CategoryBadge cat={filtered[0].categoryId || "legal"} />
              </div>

              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: brand.burgundy,
                  lineHeight: 1.3,
                  marginBottom: "1rem",
                  fontFamily: FONT_DISPLAY,
                }}
              >
                {filtered[0].bannerTitle}
              </h2>

              <p
                style={{
                  color: brand.burgundy,
                  opacity: 0.8,
                  lineHeight: 1.8,
                  fontSize: "0.92rem",
                  marginBottom: "1.5rem",
                  fontFamily: FONT_UI,
                }}
              >
                {filtered[0].description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: brand.burgundy,
                      fontFamily: FONT_UI,
                    }}
                  >
                    {filtered[0].createdBy}
                  </div>

                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: brand.burgundy,
                      opacity: 0.6,
                      fontFamily: FONT_UI,
                    }}
                  >
                    {formatDate(filtered[0].Date)}
                  </div>
                </div>

                <Link
                  href={`/blog/${filtered[0].slug || filtered[0]._id}`}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 8,
                    background: brand.burgundy,
                    color: brand.white,
                    textDecoration: "none",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    fontFamily: FONT_UI,
                  }}
                >
                  Read More →
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rest of Articles */}
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
              whileHover={{
                y: -5,
                boxShadow: `0 16px 40px ${brand.burgundy}0D`,
              }}
              style={{
                borderRadius: 14,
                border: `1px solid ${brand.burgundy}15`,
                background: brand.white,
                overflow: "hidden",
                transition: "all 0.25s ease",
              }}
            >
              {/* Card Image */}
              <div
                style={{
                  height: 160,
                  background: brand.darkBg,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {blog.bannerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.bannerImage}
                    alt={blog.bannerTitle}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: `${brand.white}25`, fontSize: "2.5rem" }}>
                    📄
                  </span>
                )}

                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                  }}
                >
                  <CategoryBadge cat={blog.categoryId || "legal"} />
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: "1.5rem" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: brand.burgundy,
                    lineHeight: 1.4,
                    marginBottom: "0.75rem",
                    fontFamily: FONT_DISPLAY,
                  }}
                >
                  {blog.bannerTitle}
                </h3>

                <p
                  style={
                    {
                      color: brand.burgundy,
                      opacity: 0.8,
                      fontSize: "0.84rem",
                      lineHeight: 1.7,
                      marginBottom: "1.25rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontFamily: FONT_UI,
                    } as React.CSSProperties
                  }
                >
                  {blog.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: brand.burgundy,
                        fontFamily: FONT_UI,
                      }}
                    >
                      {blog.createdBy}
                    </div>

                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: brand.burgundy,
                        opacity: 0.6,
                        fontFamily: FONT_UI,
                      }}
                    >
                      {formatDate(blog.Date)}
                    </div>
                  </div>

                  <Link
                    href={`/blog/${blog.slug || blog._id}`}
                    style={{
                      fontSize: "0.8rem",
                      color: brand.burgundy,
                      textDecoration: "none",
                      fontWeight: 600,
                      opacity: 0.8,
                      fontFamily: FONT_UI,
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
      <footer
        style={{
          background: brand.darkBg,
          padding: "2rem",
          textAlign: "center",
          color: brand.cream,
          opacity: 0.5,
          fontSize: "0.75rem",
          borderTop: `1px solid ${brand.white}05`,
          fontFamily: FONT_UI,
        }}
      >
        © 2024 Register my marriage · All Rights Reserved
      </footer>
    </div>
  );
}