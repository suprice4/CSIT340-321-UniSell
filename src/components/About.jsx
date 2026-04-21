import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const IconTarget = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconEye = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconHeart = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);
const IconUsers = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const TEAM = [
  { name: "Alex Rivera",  role: "Project Lead & Frontend", initial: "AR", color: "#e85d04" },
  { name: "Jamie Santos", role: "Backend & Database",       initial: "JS", color: "#2563eb" },
  { name: "Chris Reyes",  role: "UI/UX & Frontend",         initial: "CR", color: "#16a34a" },
];

const VALUES = [
  { icon: <IconTarget />, title: "Our Mission", desc: "To simplify online selling by giving multi-platform sellers one unified system to manage their orders, products, and revenue across Shopee, Lazada, and TikTok Shop." },
  { icon: <IconEye />,    title: "Our Vision",  desc: "To become the go-to platform for multi-channel e-commerce management in Southeast Asia, empowering sellers of all sizes to grow smarter." },
  { icon: <IconHeart />,  title: "Our Values",  desc: "We believe in simplicity, transparency, and putting sellers first. Every feature we build is designed to save you time and help you sell more." },
  { icon: <IconUsers />,  title: "Our People",  desc: "We're a small team of developers and designers who are passionate about e-commerce and building tools that actually make a difference." },
];

const STATS = [
  { value: "3,800+", label: "Orders Managed" },
  { value: "3",      label: "Platforms Supported" },
  { value: "876+",   label: "Registered Sellers" },
  { value: "₱284K+", label: "Revenue Tracked" },
];

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const st = {
    page:        { fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5", color: "#222", minHeight: "100vh" },

    hero:        { background: "linear-gradient(135deg, #e85d04 0%, #bf3b00 60%, #7c2000 100%)", padding: "60px 60px", color: "white" },
    heroTag:     { display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", fontSize: "12px", fontWeight: "600", padding: "5px 14px", borderRadius: "20px", marginBottom: "16px", letterSpacing: "1px", textTransform: "uppercase" },
    heroTitle:   { fontSize: "40px", fontWeight: "800", marginBottom: "12px" },
    heroSub:     { fontSize: "16px", opacity: 0.88, maxWidth: "520px", lineHeight: "1.7" },

    statsBar:    { background: "#1a1a2e", padding: "28px 60px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" },
    statItem:    { textAlign: "center" },
    statVal:     { fontSize: "26px", fontWeight: "800", color: "#e85d04" },
    statLabel:   { fontSize: "13px", color: "#aaa", marginTop: "4px" },

    section:     { padding: "60px 60px" },
    sectionAlt:  { padding: "60px 60px", background: "#fff" },
    sectionTag:  { fontSize: "12px", fontWeight: "700", color: "#e85d04", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" },
    sectionTitle:{ fontSize: "28px", fontWeight: "800", color: "#1a1a1a", marginBottom: "12px" },
    sectionSub:  { fontSize: "15px", color: "#777", maxWidth: "520px", lineHeight: "1.7", marginBottom: "40px" },

    valGrid:     { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" },
    valCard:     { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "28px", borderTop: "3px solid #e85d04" },
    valIcon:     { marginBottom: "14px" },
    valTitle:    { fontSize: "16px", fontWeight: "700", color: "#1a1a1a", marginBottom: "8px" },
    valDesc:     { fontSize: "14px", color: "#666", lineHeight: "1.7" },

    whoRow:      { display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "center" },
    whoLeft:     { flex: 1, minWidth: "260px" },
    whoRight:    { flex: 1, minWidth: "260px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "28px" },
    whoText:     { fontSize: "15px", color: "#555", lineHeight: "1.8", marginBottom: "16px" },

    teamGrid:    { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
    teamCard:    { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "24px", textAlign: "center" },
    teamAvatar:  (color) => ({ width: "60px", height: "60px", borderRadius: "50%", background: color + "18", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", margin: "0 auto 14px" }),
    teamName:    { fontSize: "15px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" },
    teamRole:    { fontSize: "13px", color: "#888" },

    cta:         { background: "linear-gradient(135deg, #e85d04, #bf3b00)", padding: "56px 60px", textAlign: "center", color: "white" },
    ctaTitle:    { fontSize: "28px", fontWeight: "800", marginBottom: "10px" },
    ctaSub:      { fontSize: "15px", opacity: 0.88, marginBottom: "24px" },
    ctaBtn:      { background: "white", color: "#e85d04", border: "none", borderRadius: "8px", padding: "12px 32px", fontSize: "15px", fontWeight: "700", cursor: "pointer" },
    ctaBtnSec:   { background: "transparent", color: "white", border: "2px solid white", borderRadius: "8px", padding: "12px 32px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginLeft: "12px" },

    footer:      { background: "#0f1923", color: "#ccc", padding: "40px 60px 20px" },
    footerGrid:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", marginBottom: "32px" },
    footerBottom:{ borderTop: "1px solid #1e2d3d", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#666" },
  };

  return (
    <div style={st.page}>

      {/* ── SHARED NAVBAR (handles login/logout automatically) ── */}
      <Navbar activePage="/about" />

      <section style={st.hero}>
        <span style={st.heroTag}>About Us</span>
        <h1 style={st.heroTitle}>Your Centralized E-Commerce Solution</h1>
        <p style={st.heroSub}>
          We built this platform to solve a real problem — managing multiple online stores
          is frustrating. So we created one place to handle all of it.
        </p>
      </section>

      <div style={st.statsBar}>
        {STATS.map((s) => (
          <div key={s.label} style={st.statItem}>
            <div style={st.statVal}>{s.value}</div>
            <div style={st.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <section style={st.sectionAlt}>
        <p style={st.sectionTag}>Who We Are</p>
        <div style={st.whoRow}>
          <div style={st.whoLeft}>
            <h2 style={st.sectionTitle}>Built by sellers, for sellers</h2>
            <p style={st.whoText}>
              UniSell is a student-built centralized e-commerce management system designed
              to help online sellers track and manage their products, orders, and revenue
              across multiple platforms from a single dashboard.
            </p>
            <p style={st.whoText}>
              We started this project because we saw how difficult it was for small sellers
              to keep up with orders on Shopee, Lazada, and TikTok Shop simultaneously.
              Switching between apps wastes time and leads to missed orders.
            </p>
            <p style={st.whoText}>
              Our goal is simple — give every seller one dashboard that shows them
              everything they need to know, without the chaos.
            </p>
          </div>
          <div style={st.whoRight}>
            {[
              { label: "Founded",    value: "2026" },
              { label: "Platform",   value: "Web-based" },
              { label: "Supported",  value: "Shopee, Lazada, TikTok Shop" },
              { label: "Users",      value: "876+ Sellers" },
              { label: "Technology", value: "ReactJS + Node.js" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f0f0f0", fontSize: "14px" }}>
                <span style={{ color: "#888" }}>{item.label}</span>
                <span style={{ fontWeight: "600", color: "#222" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={st.section}>
        <p style={st.sectionTag}>What Drives Us</p>
        <h2 style={st.sectionTitle}>Our mission, vision, and values</h2>
        <p style={st.sectionSub}>Everything we build is guided by a clear purpose.</p>
        <div style={st.valGrid}>
          {VALUES.map((v) => (
            <div key={v.title} style={st.valCard}>
              <div style={st.valIcon}>{v.icon}</div>
              <p style={st.valTitle}>{v.title}</p>
              <p style={st.valDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={st.sectionAlt}>
        <p style={st.sectionTag}>The Team</p>
        <h2 style={st.sectionTitle}>Meet the people behind the platform</h2>
        <p style={st.sectionSub}>A small but dedicated group of developers building something useful.</p>
        <div style={st.teamGrid}>
          {TEAM.map((member) => (
            <div key={member.name} style={st.teamCard}>
              <div style={st.teamAvatar(member.color)}>{member.initial}</div>
              <p style={st.teamName}>{member.name}</p>
              <p style={st.teamRole}>{member.role}</p>
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
            {[
              { label: "Home",       route: "/"          },
              { label: "About Us",   route: "/about"     },
              { label: "Contact Us", route: "/contact"   },
              { label: "Dashboard",  route: "/dashboard" },
              { label: "Register",   route: "/register"  },
            ].map((l) => (
              <button key={l.label} onClick={() => navigate(l.route)} style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "6px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>{l.label}</button>
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