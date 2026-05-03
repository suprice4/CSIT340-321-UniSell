import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Contact.css";

const IconPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconPhone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.17 9a19.79 19.79 0 01-3.07-8.67A2 2 0 012.08 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.36 6.36l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e85d04" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CONTACT_INFO = [
  { icon: <IconPin />,   label: "Address",       value: "123 Commerce Street, New York, NY 10001" },
  { icon: <IconPhone />, label: "Phone",          value: "+1 (555) 123-4567" },
  { icon: <IconMail />,  label: "Email",          value: "ecommercemarketplace@gmail.com" },
  { icon: <IconClock />, label: "Business Hours", value: "Mon – Fri, 9:00 AM – 6:00 PM" },
];

const FAQS = [
  { q: "How do I connect my Shopee store?",        a: "After logging in, go to the Dashboard and click 'Connect Platform'. Follow the steps to link your Shopee account." },
  { q: "Is the platform free to use?",             a: "Yes! All features are completely free for registered sellers. No hidden fees or subscriptions." },
  { q: "Which platforms are supported?",           a: "We currently support Shopee, Lazada, and TikTok Shop, with more platforms coming soon." },
  { q: "How long does it take to get a response?", a: "We aim to respond to all messages within 24 hours on business days." },
];

export default function Contact() {
  const navigate = useNavigate();

  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq]     = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) setErrors({});
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name)    newErrors.name    = "Name is required.";
    if (!form.email)   newErrors.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (!form.subject) newErrors.subject = "Subject is required.";
    if (!form.message) newErrors.message = "Message is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  const st = {
    page:        { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },

    hero:        { background: "linear-gradient(135deg, #e85d04 0%, #bf3b00 60%, #7c2000 100%)", padding: "60px 60px", color: "white" },
    heroTag:     { display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", fontSize: "12px", fontWeight: "600", padding: "5px 14px", borderRadius: "20px", marginBottom: "16px", letterSpacing: "1px", textTransform: "uppercase" },
    heroTitle:   { fontSize: "40px", fontWeight: "800", marginBottom: "12px" },
    heroSub:     { fontSize: "16px", opacity: 0.88, maxWidth: "520px", lineHeight: "1.7" },

    content:     { padding: "60px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "40px", maxWidth: "1100px", margin: "0 auto" },

    infoCard:    { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "12px", padding: "28px" },
    infoTitle:   { fontSize: "18px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "20px" },
    infoRow:     { display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "20px" },
    infoIconBox: { width: "40px", height: "40px", background: "#fff5f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    infoLabel:   { fontSize: "12px", color: "var(--text-muted, #aaa)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" },
    infoValue:   { fontSize: "14px", color: "var(--text-primary, #333)", fontWeight: "500" },

    formCard:    { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "12px", padding: "28px" },
    formTitle:   { fontSize: "18px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "20px" },
    formGroup:   { marginBottom: "14px" },
    label:       { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-primary, #333)" },
    input:       (hasError) => ({ width: "100%", padding: "10px 12px", border: `1px solid var(--border-color, ${hasError ? "#e53e3e" : "#ddd"}`, borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #333)", outline: "none", boxSizing: "border-box", background: "var(--section-alt-bg, #fafafa)" }),
    textarea:    (hasError) => ({ width: "100%", padding: "10px 12px", border: `1px solid var(--border-color, ${hasError ? "#e53e3e" : "#ddd"}`, borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #333)", outline: "none", boxSizing: "border-box", background: "var(--section-alt-bg, #fafafa)", height: "120px", resize: "vertical" }),
    errorText:   { fontSize: "12px", color: "#e53e3e", marginTop: "4px" },
    submitBtn:   { width: "100%", background: "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "13px", fontSize: "15px", fontWeight: "700", cursor: "pointer", marginTop: "4px" },
    successBox:  { background: "#f0fff4", border: "1px solid #68d391", borderRadius: "8px", padding: "20px", textAlign: "center" },

    faqSection:  { padding: "0 60px 60px" },
    faqTag:      { fontSize: "12px", fontWeight: "700", color: "#e85d04", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" },
    faqTitle:    { fontSize: "26px", fontWeight: "800", color: "var(--text-primary, #1a1a1a)", marginBottom: "8px" },
    faqSub:      { fontSize: "15px", color: "var(--text-muted, #777)", marginBottom: "28px" },
    faqItem:     { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "10px", marginBottom: "10px", overflow: "hidden" },
    faqQ:        (open) => ({ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer", background: open ? "#fff5f0" : "#fff", fontSize: "14px", fontWeight: "600", color: open ? "#e85d04" : "#222", border: "none", width: "100%", textAlign: "left" }),
    faqA:        { padding: "0 20px 16px", fontSize: "14px", color: "var(--text-muted, #666)", lineHeight: "1.7" },

    footer:      { background: "#0f1923", color: "var(--text-muted, #ccc)", padding: "40px 60px 20px" },
    footerGrid:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", marginBottom: "32px" },
    footerBottom:{ borderTop: "1px solid var(--border-color, #1e2d3d)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted, #666)" },
  };

  return (
    <div style={st.page}>

      {/* ── SHARED NAVBAR (handles login/logout automatically) ── */}
      <Navbar activePage="/contact" />

      <section style={st.hero}>
        <span style={st.heroTag}>Contact Us</span>
        <h1 style={st.heroTitle}>We'd Love to Hear From You</h1>
        <p style={st.heroSub}>
          Have a question, a suggestion, or just want to say hi?
          Fill out the form and we'll get back to you as soon as possible.
        </p>
      </section>

      <div style={st.content}>
        <div style={st.infoCard}>
          <p style={st.infoTitle}>Contact Information</p>
          {CONTACT_INFO.map((info) => (
            <div key={info.label} style={st.infoRow}>
              <div style={st.infoIconBox}>{info.icon}</div>
              <div>
                <p style={st.infoLabel}>{info.label}</p>
                <p style={st.infoValue}>{info.value}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #f0f0f0", margin: "20px 0" }} />
          <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary, #333)", marginBottom: "10px" }}>Follow Us</p>
          <div style={{ display: "flex", gap: "10px" }}>
            {["f", "t", "ig", "yt"].map((s) => (
              <span key={s} style={{ width: "32px", height: "32px", background: "var(--page-bg, #f5f5f5)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--text-muted, #555)", cursor: "pointer" }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={st.formCard}>
          <p style={st.formTitle}>Send Us a Message</p>

          {submitted ? (
            <div style={st.successBox}>
              <p style={{ fontSize: "20px", marginBottom: "8px" }}>✅</p>
              <p style={{ fontWeight: "700", color: "#276749", fontSize: "16px" }}>Message Sent!</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted, #555)", marginTop: "6px" }}>
                Thanks, <strong>{form.name}</strong>! We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                style={{ marginTop: "14px", background: "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "8px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={st.formGroup}>
                <label style={st.label}>Full Name</label>
                <input name="name" type="text" placeholder="Enter your name" value={form.name} onChange={handleChange} style={st.input(!!errors.name)} />
                {errors.name && <p style={st.errorText}>{errors.name}</p>}
              </div>
              <div style={st.formGroup}>
                <label style={st.label}>Email Address</label>
                <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} style={st.input(!!errors.email)} />
                {errors.email && <p style={st.errorText}>{errors.email}</p>}
              </div>
              <div style={st.formGroup}>
                <label style={st.label}>Subject</label>
                <input name="subject" type="text" placeholder="What is this about?" value={form.subject} onChange={handleChange} style={st.input(!!errors.subject)} />
                {errors.subject && <p style={st.errorText}>{errors.subject}</p>}
              </div>
              <div style={st.formGroup}>
                <label style={st.label}>Message</label>
                <textarea name="message" placeholder="Write your message here..." value={form.message} onChange={handleChange} style={st.textarea(!!errors.message)} />
                {errors.message && <p style={st.errorText}>{errors.message}</p>}
              </div>
              <button type="submit" style={st.submitBtn}>Send Message</button>
            </form>
          )}
        </div>
      </div>

      <div style={st.faqSection}>
        <p style={st.faqTag}>FAQ</p>
        <h2 style={st.faqTitle}>Frequently Asked Questions</h2>
        <p style={st.faqSub}>Quick answers to common questions.</p>
        {FAQS.map((faq, i) => (
          <div key={i} style={st.faqItem}>
            <button style={st.faqQ(openFaq === i)} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {faq.q}
              <span>{openFaq === i ? "▲" : "▼"}</span>
            </button>
            {openFaq === i && <p style={st.faqA}>{faq.a}</p>}
          </div>
        ))}
      </div>
      {/* ── SHARED FOOTER ── */}
      <Footer />

    </div>
  );
}