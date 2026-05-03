import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Landingpage.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconDashboard = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconSync = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <polyline points="1 4 1 10 7 10"/>
    <polyline points="23 20 23 14 17 14"/>
    <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
  </svg>
);
const IconChart = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconShield = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: <IconDashboard />, title: "Centralized Dashboard", desc: "View and manage all your store data from Shopee, Lazada, and TikTok Shop in one place." },
  { icon: <IconSync />,      title: "Multi-Platform Sync",  desc: "Automatically sync your orders, products, and inventory across all selling platforms in real time." },
  { icon: <IconChart />,     title: "Sales Analytics",      desc: "Track your revenue, orders, and top products with clear charts and summaries per platform." },
  { icon: <IconShield />,    title: "Secure & Reliable",    desc: "Your store data is safe with us. We use secure authentication and data encryption." },
];

const PLATFORMS = [
  { name: "Shopee",      color: "#ee4d2d", bg: "var(--plat-shopee-bg, #fff1ee)", desc: "Connect your Shopee store and manage orders, products, and sales all in one tab." },
  { name: "Lazada",      color: "#0f146b", bg: "var(--plat-lazada-bg, #eef0ff)", desc: "Sync your Lazada listings and track your performance without switching apps." },
  { name: "TikTok Shop", color: "#333",    bg: "var(--plat-tiktok-bg, #f3f3f3)", desc: "Manage your TikTok Shop orders and see what's trending alongside your other platforms." },
];

const TESTIMONIALS = [
  { name: "Maria Santos",   role: "Shopee Seller",          stars: 5, review: "I used to open 3 different apps just to check my orders. Now everything is in one dashboard. Game changer!" },
  { name: "Carlo Reyes",    role: "Lazada & TikTok Seller", stars: 5, review: "The platform breakdown feature helped me see that TikTok Shop actually brings in more revenue. Really useful." },
  { name: "Ana Villanueva", role: "Multi-Platform Seller",  stars: 4, review: "Super easy to use. The order filters and search make it so much faster to find what I'm looking for." },
];

const STATS = [
  { value: "3,800+", label: "Orders Managed" },
  { value: "3",      label: "Platforms Supported" },
  { value: "876+",   label: "Registered Sellers" },
  { value: "₱284K+", label: "Revenue Tracked" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate   = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const st = {
    page: { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #fff)", color: "var(--text-primary, #222)", minHeight: "100vh" },

    // ── Hero ──
    hero:         { background: "linear-gradient(135deg, #e85d04 0%, #bf3b00 60%, #7c2000 100%)", padding: "80px 60px", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", flexWrap: "wrap" },
    heroLeft:     { flex: 1, minWidth: "280px" },
    heroTag:      { display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", fontSize: "12px", fontWeight: "600", padding: "5px 14px", borderRadius: "20px", marginBottom: "16px", letterSpacing: "1px", textTransform: "uppercase" },
    heroTitle:    { fontSize: "44px", fontWeight: "800", lineHeight: "1.15", marginBottom: "16px" },
    heroSub:      { fontSize: "16px", opacity: 0.88, lineHeight: "1.7", marginBottom: "28px", maxWidth: "480px" },
    heroBtns:     { display: "flex", gap: "14px", flexWrap: "wrap" },
    heroPrimary:  { background: "var(--card-bg, #fff)", color: "#e85d04", border: "none", borderRadius: "8px", padding: "13px 28px", fontSize: "15px", fontWeight: "700", cursor: "pointer" },
    heroSecondary:{ background: "transparent", color: "white", border: "2px solid white", borderRadius: "8px", padding: "13px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
    heroRight:    { flex: 1, minWidth: "260px", display: "flex", justifyContent: "center" },
    heroCard:     { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "14px", padding: "24px", width: "300px" },
    heroCardTitle:{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "14px", fontWeight: "600" },
    heroStatRow:  { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
    heroStatLabel:{ fontSize: "13px", color: "rgba(255,255,255,0.7)" },
    heroStatVal:  { fontSize: "13px", color: "white", fontWeight: "700" },
    heroDivider:  { borderTop: "1px solid rgba(255,255,255,0.15)", margin: "14px 0" },

    // ── Stats Bar — matches footer color ──
    statsBar:  { background: "#0f1923", padding: "32px 60px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" },
    statItem:  { textAlign: "center" },
    statVal:   { fontSize: "28px", fontWeight: "800", color: "#e85d04" },
    statLabel: { fontSize: "13px", color: "#aaa", marginTop: "4px" },

    // ── Sections — alternating white / light grey, both consistent ──
    section:      { padding: "64px 60px", background: "var(--page-bg, #fff)" },
    sectionAlt:   { padding: "64px 60px", background: "var(--section-alt-bg, #f5f5f5)" },
    sectionTag:   { fontSize: "12px", fontWeight: "700", color: "#e85d04", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" },
    sectionTitle: { fontSize: "30px", fontWeight: "800", color: "var(--text-primary, #1a1a1a)", marginBottom: "12px" },
    sectionSub:   { fontSize: "15px", color: "var(--text-muted, #777)", maxWidth: "520px", lineHeight: "1.7", marginBottom: "40px" },

    // ── Features ──
    featGrid:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" },
    featCard:  { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "12px", padding: "24px", borderTop: "3px solid #e85d04" },
    featIcon:  { marginBottom: "14px" },
    featTitle: { fontSize: "15px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "8px" },
    featDesc:  { fontSize: "13px", color: "var(--text-muted, #777)", lineHeight: "1.6" },

    // ── Platforms ──
    platGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
    platCard: (color, bg) => ({ background: bg, border: `1px solid ${color}22`, borderRadius: "12px", padding: "28px", borderLeft: `4px solid ${color}` }),
    platName: (color) => ({ fontSize: "20px", fontWeight: "800", color, marginBottom: "12px" }),
    platDesc: { fontSize: "14px", color: "var(--text-muted, #555)", lineHeight: "1.7", marginBottom: "16px" },
    platLink: (color) => ({ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color, cursor: "pointer", background: "none", border: "none", padding: 0 }),

    // ── How It Works ──
    stepsRow:  { display: "flex", gap: "0px", alignItems: "flex-start", flexWrap: "wrap" },
    step:      { flex: 1, minWidth: "180px", textAlign: "center", padding: "0 16px" },
    stepNum:   { width: "48px", height: "48px", background: "#e85d04", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800", margin: "0 auto 16px" },
    stepTitle: { fontSize: "15px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "8px" },
    stepDesc:  { fontSize: "13px", color: "var(--text-muted, #777)", lineHeight: "1.6" },

    // ── Testimonials ──
    testGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
    testCard:   { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "12px", padding: "24px" },
    testStars:  { display: "flex", gap: "2px", marginBottom: "12px" },
    testReview: { fontSize: "14px", color: "var(--text-primary, #444)", lineHeight: "1.7", marginBottom: "16px", fontStyle: "italic" },
    testName:   { fontSize: "14px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)" },
    testRole:   { fontSize: "12px", color: "var(--text-muted, #999)" },

    // ── CTA ──
    cta:       { background: "linear-gradient(135deg, #e85d04, #bf3b00)", padding: "64px 60px", textAlign: "center", color: "white" },
    ctaTitle:  { fontSize: "32px", fontWeight: "800", marginBottom: "12px" },
    ctaSub:    { fontSize: "16px", opacity: 0.88, marginBottom: "28px" },
    ctaBtn:    { background: "var(--card-bg, #fff)", color: "#e85d04", border: "none", borderRadius: "8px", padding: "14px 36px", fontSize: "16px", fontWeight: "700", cursor: "pointer" },
    ctaBtnSec: { background: "transparent", color: "white", border: "2px solid white", borderRadius: "8px", padding: "14px 36px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginLeft: "14px" },
  };

  // Guard: platform "View Dashboard" buttons require login
  const handleViewDashboard = () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    navigate("/dashboard");
  };

  return (
    <div style={st.page}>

      {/* ── SHARED NAVBAR ── */}
      <Navbar activePage="/" />

      {/* ── HERO ── */}
      <section style={st.hero}>
        <div style={st.heroLeft}>
          <span style={st.heroTag}>Multi-Platform Management</span>
          <h1 style={st.heroTitle}>
            Manage All Your<br />Online Stores<br />In One Place
          </h1>
          <p style={st.heroSub}>
            Stop switching between Shopee, Lazada, and TikTok Shop.
            Our centralized platform lets you track orders, monitor sales,
            and manage products all from a single dashboard.
          </p>
          <div style={st.heroBtns}>
            {isLoggedIn ? (
              <button style={st.heroPrimary} onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
            ) : (
              <>
                <button style={st.heroPrimary} onClick={() => navigate("/register")}>Get Started Free</button>
                <button style={st.heroSecondary} onClick={() => navigate("/login")}>Log In</button>
              </>
            )}
          </div>
        </div>
        <div style={st.heroRight}>
          <div style={st.heroCard}>
            <p style={st.heroCardTitle}>📊 Platform Overview</p>
            {[
              { name: "Shopee",      orders: 580, rev: "₱118,200" },
              { name: "Lazada",      orders: 420, rev: "₱96,700"  },
              { name: "TikTok Shop", orders: 340, rev: "₱69,600"  },
            ].map((p) => (
              <div key={p.name}>
                <div style={st.heroStatRow}>
                  <span style={st.heroStatLabel}>{p.name}</span>
                  <span style={st.heroStatVal}>{p.rev}</span>
                </div>
                <div style={{ ...st.heroStatRow, marginBottom: "6px" }}>
                  <span style={{ ...st.heroStatLabel, fontSize: "11px" }}>{p.orders} orders</span>
                </div>
                <div style={st.heroDivider} />
              </div>
            ))}
            <div style={st.heroStatRow}>
              <span style={{ ...st.heroStatLabel, fontWeight: "700", color: "white" }}>Total Revenue</span>
              <span style={{ ...st.heroStatVal, fontSize: "16px", color: "#ffb347" }}>₱284,500</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR — same dark color as footer ── */}
      <div style={st.statsBar}>
        {STATS.map((s) => (
          <div key={s.label} style={st.statItem}>
            <div style={st.statVal}>{s.value}</div>
            <div style={st.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES — white bg ── */}
      <section style={st.section}>
        <p style={st.sectionTag}>Why Choose Us</p>
        <h2 style={st.sectionTitle}>Everything you need to sell smarter</h2>
        <p style={st.sectionSub}>One platform to replace all the tabs you have open right now.</p>
        <div style={st.featGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={st.featCard}>
              <div style={st.featIcon}>{f.icon}</div>
              <p style={st.featTitle}>{f.title}</p>
              <p style={st.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLATFORMS — light grey bg ── */}
      <section style={st.sectionAlt}>
        <p style={st.sectionTag}>Supported Platforms</p>
        <h2 style={st.sectionTitle}>All your platforms, one dashboard</h2>
        <p style={st.sectionSub}>We support the biggest e-commerce platforms in Southeast Asia.</p>
        <div style={st.platGrid}>
          {PLATFORMS.map((p) => (
            <div key={p.name} style={st.platCard(p.color, p.bg)}>
              <p style={st.platName(p.color)}>{p.name}</p>
              <p style={st.platDesc}>{p.desc}</p>
              {/* Requires login */}
              <button style={st.platLink(p.color)} onClick={handleViewDashboard}>
                View Dashboard <IconArrow />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS — white bg ── */}
      <section style={st.section}>
        <p style={st.sectionTag}>How It Works</p>
        <h2 style={st.sectionTitle}>Get started in 3 easy steps</h2>
        <p style={st.sectionSub}>No complicated setup. Just sign up, connect, and manage.</p>
        <div style={st.stepsRow}>
          {[
            { num: "1", title: "Create an Account",   desc: "Sign up for free and set up your seller profile in minutes." },
            { num: "2", title: "Connect Your Stores", desc: "Link your Shopee, Lazada, and TikTok Shop accounts to the platform." },
            { num: "3", title: "Manage Everything",   desc: "Track orders, monitor sales, and manage products all from one dashboard." },
          ].map((step, i) => (
            <div key={i} style={st.step}>
              <div style={st.stepNum}>{step.num}</div>
              <p style={st.stepTitle}>{step.title}</p>
              <p style={st.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S INCLUDED — light grey bg ── */}
      <section style={st.sectionAlt}>
        <p style={st.sectionTag}>What's Included</p>
        <h2 style={st.sectionTitle}>Everything is free for sellers</h2>
        <p style={st.sectionSub}>No hidden fees. All features are available to all registered sellers.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", maxWidth: "600px" }}>
          {[
            "Centralized order management",
            "Multi-platform sales tracking",
            "Revenue and order analytics",
            "Platform-specific breakdowns",
            "Order search and filtering",
            "Secure account management",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-primary, #444)" }}>
              <IconCheck />{item}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS — white bg ── */}
      <section style={st.section}>
        <p style={st.sectionTag}>What Sellers Say</p>
        <h2 style={st.sectionTitle}>Trusted by sellers across platforms</h2>
        <p style={st.sectionSub}>Here's what our users have to say about the platform.</p>
        <div style={st.testGrid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={st.testCard}>
              <div style={st.testStars}>
                {Array.from({ length: t.stars }).map((_, i) => <IconStar key={i} />)}
              </div>
              <p style={st.testReview}>"{t.review}"</p>
              <p style={st.testName}>{t.name}</p>
              <p style={st.testRole}>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={st.cta}>
        <h2 style={st.ctaTitle}>Ready to simplify your selling?</h2>
        <p style={st.ctaSub}>Join hundreds of sellers managing their stores smarter with our platform.</p>
        {isLoggedIn ? (
          <button style={st.ctaBtn} onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        ) : (
          <>
            <button style={st.ctaBtn} onClick={() => navigate("/register")}>Create Free Account</button>
            <button style={st.ctaBtnSec} onClick={() => navigate("/login")}>Log In</button>
          </>
        )}
      </section>

      {/* ── SHARED FOOTER COMPONENT ── */}
      <Footer />

    </div>
  );
}
