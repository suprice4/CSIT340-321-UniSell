import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const IconAccount = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconShopee = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#ee4d2d">
    <circle cx="12" cy="12" r="10"/>
    <text x="5" y="16" fontSize="9" fill="white" fontWeight="bold">SP</text>
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


const FEATURES = [
  { icon: <IconDashboard />, title: "Centralized Dashboard", desc: "View and manage all your store data from Shopee, Lazada, and TikTok Shop in one place." },
  { icon: <IconSync />,      title: "Multi-Platform Sync",  desc: "Automatically sync your orders, products, and inventory across all selling platforms in real time." },
  { icon: <IconChart />,     title: "Sales Analytics",      desc: "Track your revenue, orders, and top products with clear charts and summaries per platform." },
  { icon: <IconShield />,    title: "Secure & Reliable",    desc: "Your store data is safe with us. We use secure authentication and data encryption." },
];

const PLATFORMS = [
  { name: "Shopee",      color: "#ee4d2d", bg: "#fff1ee", desc: "Connect your Shopee store and manage orders, products, and sales all in one tab." },
  { name: "Lazada",      color: "#0f146b", bg: "#eef0ff", desc: "Sync your Lazada listings and track your performance without switching apps." },
  { name: "TikTok Shop", color: "#010101", bg: "#f3f3f3", desc: "Manage your TikTok Shop orders and see what's trending alongside your other platforms." },
];

const TESTIMONIALS = [
  { name: "Maria Santos",  role: "Shopee Seller",          stars: 5, review: "I used to open 3 different apps just to check my orders. Now everything is in one dashboard. Game changer!" },
  { name: "Carlo Reyes",   role: "Lazada & TikTok Seller", stars: 5, review: "The platform breakdown feature helped me see that TikTok Shop actually brings in more revenue. Really useful." },
  { name: "Ana Villanueva",role: "Multi-Platform Seller",  stars: 4, review: "Super easy to use. The order filters and search make it so much faster to find what I'm looking for." },
];

const STATS = [
  { value: "3,800+",  label: "Orders Managed" },
  { value: "3",       label: "Platforms Supported" },
  { value: "876+",    label: "Registered Sellers" },
  { value: "₱284K+",  label: "Revenue Tracked" },
];

const NAV_LINKS = ["Home", "Products", "Dashboard", "Orders"];


export default function LandingPage() {
  const navigate = useNavigate();

  const [activeNav, setActiveNav]   = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const st = {
    page:       { fontFamily: "'Segoe UI', sans-serif", background: "#fff", color: "#222", minHeight: "100vh" },
    topNav:     { background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.07)" : "none", transition: "box-shadow 0.2s" },
    logoArea:   { display: "flex", alignItems: "center", gap: "10px" },
    logoCircle: { width: "44px", height: "44px", background: "#e85d04", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "white", flexShrink: 0 },
    logoText:   { fontSize: "12px", fontWeight: "700", color: "#e85d04", lineHeight: "1.3", textTransform: "uppercase" },
    searchBar:  { flex: 1, maxWidth: "480px", margin: "0 24px", display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", padding: "8px 14px", gap: "8px" },
    searchInput:{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "#444" },
    topNavRight:{ display: "flex", gap: "16px", alignItems: "center" },
    iconBtn:    { display: "flex", flexDirection: "column", alignItems: "center", fontSize: "11px", color: "#555", gap: "2px", cursor: "pointer", background: "none", border: "none" },
    mainNav:    { background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 40px", display: "flex", gap: "32px" },
    navBtn:     (active) => ({ display: "block", padding: "14px 0", fontSize: "15px", fontWeight: "500", color: active ? "#e85d04" : "#333", cursor: "pointer", background: "none", border: "none", borderBottom: active ? "2px solid #e85d04" : "2px solid transparent" }),

    hero: { background: "linear-gradient(135deg, #e85d04 0%, #bf3b00 60%, #7c2000 100%)", padding: "80px 60px", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", flexWrap: "wrap" },
    heroLeft:   { flex: 1, minWidth: "280px" },
    heroTag:    { display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", fontSize: "12px", fontWeight: "600", padding: "5px 14px", borderRadius: "20px", marginBottom: "16px", letterSpacing: "1px", textTransform: "uppercase" },
    heroTitle:  { fontSize: "44px", fontWeight: "800", lineHeight: "1.15", marginBottom: "16px" },
    heroSub:    { fontSize: "16px", opacity: 0.88, lineHeight: "1.7", marginBottom: "28px", maxWidth: "480px" },
    heroBtns:   { display: "flex", gap: "14px", flexWrap: "wrap" },
    heroPrimary:{ background: "white", color: "#e85d04", border: "none", borderRadius: "8px", padding: "13px 28px", fontSize: "15px", fontWeight: "700", cursor: "pointer" },
    heroSecondary:{ background: "transparent", color: "white", border: "2px solid white", borderRadius: "8px", padding: "13px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
    heroRight:  { flex: 1, minWidth: "260px", display: "flex", justifyContent: "center" },
    heroCard:   { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "14px", padding: "24px", width: "300px" },
    heroCardTitle:{ fontSize: "14px", color: "rgba(255,255,255,0.8)", marginBottom: "14px", fontWeight: "600" },
    heroStatRow:{ display: "flex", justifyContent: "space-between", marginBottom: "10px" },
    heroStatLabel:{ fontSize: "13px", color: "rgba(255,255,255,0.7)" },
    heroStatVal:{ fontSize: "13px", color: "white", fontWeight: "700" },
    heroDivider:{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "14px 0" },

    statsBar:   { background: "#1a1a2e", padding: "32px 60px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" },
    statItem:   { textAlign: "center" },
    statVal:    { fontSize: "28px", fontWeight: "800", color: "#e85d04" },
    statLabel:  { fontSize: "13px", color: "#aaa", marginTop: "4px" },

    section:    { padding: "64px 60px" },
    sectionAlt: { padding: "64px 60px", background: "#fafafa" },
    sectionTag: { fontSize: "12px", fontWeight: "700", color: "#e85d04", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" },
    sectionTitle:{ fontSize: "30px", fontWeight: "800", color: "#1a1a1a", marginBottom: "12px" },
    sectionSub: { fontSize: "15px", color: "#777", maxWidth: "520px", lineHeight: "1.7", marginBottom: "40px" },

    featGrid:   { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" },
    featCard:   { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", borderTop: "3px solid #e85d04" },
    featIcon:   { marginBottom: "14px" },
    featTitle:  { fontSize: "15px", fontWeight: "700", color: "#1a1a1a", marginBottom: "8px" },
    featDesc:   { fontSize: "13px", color: "#777", lineHeight: "1.6" },

    platGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
    platCard:   (color, bg) => ({ background: bg, border: `1px solid ${color}22`, borderRadius: "12px", padding: "28px", borderLeft: `4px solid ${color}` }),
    platName:   (color) => ({ fontSize: "20px", fontWeight: "800", color, marginBottom: "12px" }),
    platDesc:   { fontSize: "14px", color: "#555", lineHeight: "1.7", marginBottom: "16px" },
    platLink:   (color) => ({ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color, cursor: "pointer", background: "none", border: "none", padding: 0 }),

    stepsRow:   { display: "flex", gap: "0px", alignItems: "flex-start", flexWrap: "wrap" },
    step:       { flex: 1, minWidth: "180px", textAlign: "center", padding: "0 16px", position: "relative" },
    stepNum:    { width: "48px", height: "48px", background: "#e85d04", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800", margin: "0 auto 16px" },
    stepTitle:  { fontSize: "15px", fontWeight: "700", color: "#1a1a1a", marginBottom: "8px" },
    stepDesc:   { fontSize: "13px", color: "#777", lineHeight: "1.6" },

    testGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
    testCard:   { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px" },
    testStars:  { display: "flex", gap: "2px", marginBottom: "12px" },
    testReview: { fontSize: "14px", color: "#444", lineHeight: "1.7", marginBottom: "16px", fontStyle: "italic" },
    testName:   { fontSize: "14px", fontWeight: "700", color: "#1a1a1a" },
    testRole:   { fontSize: "12px", color: "#999" },

    cta:        { background: "linear-gradient(135deg, #e85d04, #bf3b00)", padding: "64px 60px", textAlign: "center", color: "white" },
    ctaTitle:   { fontSize: "32px", fontWeight: "800", marginBottom: "12px" },
    ctaSub:     { fontSize: "16px", opacity: 0.88, marginBottom: "28px" },
    ctaBtn:     { background: "white", color: "#e85d04", border: "none", borderRadius: "8px", padding: "14px 36px", fontSize: "16px", fontWeight: "700", cursor: "pointer" },
    ctaBtnSec:  { background: "transparent", color: "white", border: "2px solid white", borderRadius: "8px", padding: "14px 36px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginLeft: "14px" },

    footer:     { background: "#0f1923", color: "#ccc", padding: "40px 60px 20px" },
    footerGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", marginBottom: "32px" },
    footerBottom:{ borderTop: "1px solid #1e2d3d", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#666" },
  };

  return (
    <div style={st.page}>

      <nav style={st.topNav}>
        <div style={st.logoArea}>
          <div style={st.logoCircle}>🛍</div>
          <div style={st.logoText}>E-Commerce<br />Market Place</div>
        </div>
        <div style={st.searchBar}>
          <IconSearch />
          <input type="text" placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={st.searchInput} />
        </div>
        <div style={st.topNavRight}>
          <button style={st.iconBtn}><IconAccount />Account</button>
          <button style={{ ...st.iconBtn, background: "#e85d04", color: "white", borderRadius: "6px", padding: "6px 14px", fontSize: "13px", fontWeight: "600", flexDirection: "row", gap: "0" }} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      <nav style={st.mainNav}>
        {NAV_LINKS.map((link) => (
          <button key={link} style={st.navBtn(activeNav === link)} onClick={() => setActiveNav(link)}>{link}</button>
        ))}
      </nav>

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
            <button style={st.heroPrimary} onClick={() => navigate("/register")}>Get Started Free</button>
            <button style={st.heroSecondary} onClick={() => navigate("/login")}>Log In</button>
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

      <div style={st.statsBar}>
        {STATS.map((s) => (
          <div key={s.label} style={st.statItem}>
            <div style={st.statVal}>{s.value}</div>
            <div style={st.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

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

      <section style={st.sectionAlt}>
        <p style={st.sectionTag}>Supported Platforms</p>
        <h2 style={st.sectionTitle}>All your platforms, one dashboard</h2>
        <p style={st.sectionSub}>We support the biggest e-commerce platforms in Southeast Asia.</p>
        <div style={st.platGrid}>
          {PLATFORMS.map((p) => (
            <div key={p.name} style={st.platCard(p.color, p.bg)}>
              <p style={st.platName(p.color)}>{p.name}</p>
              <p style={st.platDesc}>{p.desc}</p>
              <button style={st.platLink(p.color)} onClick={() => navigate("/dashboard")}>
                View Dashboard <IconArrow />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section style={st.section}>
        <p style={st.sectionTag}>How It Works</p>
        <h2 style={st.sectionTitle}>Get started in 3 easy steps</h2>
        <p style={st.sectionSub}>No complicated setup. Just sign up, connect, and manage.</p>
        <div style={st.stepsRow}>
          {[
            { num: "1", title: "Create an Account",     desc: "Sign up for free and set up your seller profile in minutes." },
            { num: "2", title: "Connect Your Stores",   desc: "Link your Shopee, Lazada, and TikTok Shop accounts to the platform." },
            { num: "3", title: "Manage Everything",     desc: "Track orders, monitor sales, and manage products all from one dashboard." },
          ].map((step, i) => (
            <div key={i} style={st.step}>
              <div style={st.stepNum}>{step.num}</div>
              <p style={st.stepTitle}>{step.title}</p>
              <p style={st.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#444" }}>
              <IconCheck />{item}
            </div>
          ))}
        </div>
      </section>

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

      <section style={st.cta}>
        <h2 style={st.ctaTitle}>Ready to simplify your selling?</h2>
        <p style={st.ctaSub}>Join hundreds of sellers managing their stores smarter with our platform.</p>
        <button style={st.ctaBtn} onClick={() => navigate("/register")}>Create Free Account</button>
        <button style={st.ctaBtnSec} onClick={() => navigate("/login")}>Log In</button>
      </section>

      <footer style={st.footer}>
        <div style={st.footerGrid}>
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>About Us</h4>
            <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.6" }}>Your trusted centralized platform for managing products across Shopee, Lazada, and TikTok Shop.</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {["f", "t", "ig", "yt"].map((s) => (
                <span key={s} style={{ width: "28px", height: "28px", background: "#1e2d3d", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#aaa", cursor: "pointer" }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Quick Links</h4>
            {["Home", "About Us", "Contact Us", "Dashboard", "Register"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Platforms</h4>
            {["Shopee", "Lazada", "TikTok Shop", "Returns & Refunds", "FAQs"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Contact Us</h4>
            <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>📍 123 Commerce Street, New York, NY 10001</p>
            <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "6px" }}>📞 +1 (555) 123-4567</p>
            <p style={{ fontSize: "13px", color: "#aaa" }}>✉ ecommercemarketplace@gmail.com</p>
          </div>
        </div>
        <div style={st.footerBottom}>
          <span>© 2026 E-Commerce Marketplace. All rights reserved.</span>
          <div>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" style={{ color: "#666", textDecoration: "none", marginLeft: "16px" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}