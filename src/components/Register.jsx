import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/Register.css";

const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconEye = ({ show }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" style={{ cursor: "pointer" }}>
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData]                         = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors]                             = useState({});
  const [showPassword, setShowPassword]                 = useState(false);
  const [showConfirmPassword, setShowConfirmPassword]   = useState(false);
  const [isLoading, setIsLoading]                       = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length > 0) setErrors({});
  }, [formData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!formData.username) newErrors.username = "Username is required.";
    else if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 1000);
  };

  const st = {
    page:         { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },
    section:      { display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "48px 20px", background: "var(--page-bg, #f5f5f5)" },
    card:         { background: "var(--card-bg, #fff)", borderRadius: "10px", border: "1px solid var(--border-color, #e0e0e0)", padding: "36px 40px", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center" },
    cardLogo:     { width: "56px", height: "56px", background: "#e85d04", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", color: "white", marginBottom: "12px" },
    subtitle:     { fontSize: "13px", color: "var(--text-muted, #777)", marginBottom: "24px", textAlign: "center" },
    formGroup:    { width: "100%", marginBottom: "14px" },
    label:        { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-primary, #333)" },
    inputWrapper: (hasError) => ({ display: "flex", alignItems: "center", gap: "8px", border: `1px solid var(--border-color, ${hasError ? "#e53e3e" : "#ccc"}`, borderRadius: "6px", padding: "9px 12px", background: "var(--section-alt-bg, #fafafa)" }),
    input:        { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "var(--text-primary, #333)" },
    errorText:    { fontSize: "12px", color: "#e53e3e", marginTop: "4px" },
    terms:        { fontSize: "12px", color: "var(--text-muted, #777)", marginBottom: "18px", width: "100%" },
    termsLink:    { color: "#e85d04", textDecoration: "none" },
    submitBtn:    (loading) => ({ width: "100%", background: loading ? "#f0a070" : "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "13px", fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px", cursor: loading ? "not-allowed" : "pointer" }),
    bottomLink:   { marginTop: "14px", fontSize: "13px", color: "var(--text-muted, #777)" },
    anchor:       { color: "#e85d04", textDecoration: "none", fontWeight: "600", cursor: "pointer", background: "none", border: "none", fontSize: "13px" },
    footer:       { background: "#0f1923", color: "var(--text-muted, #ccc)", padding: "40px 60px 20px" },
    footerGrid:   { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", marginBottom: "32px" },
    footerBottom: { borderTop: "1px solid var(--border-color, #1e2d3d)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted, #666)" },
  };

  return (
    <div style={st.page}>

      {/* ── SHARED NAVBAR ── */}
      <Navbar activePage="/register" />

      {/* ── REGISTER FORM ── */}
      <div style={st.section}>
        <div style={st.card}>
          <div style={st.cardLogo}>🛍</div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "4px" }}>Create Account</h2>
          <p style={st.subtitle}>Sign up for E-Commerce Market Place</p>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={st.formGroup}>
              <label style={st.label}>Email</label>
              <div style={st.inputWrapper(!!errors.email)}>
                <IconEmail />
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} style={st.input} />
              </div>
              {errors.email && <p style={st.errorText}>{errors.email}</p>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Username</label>
              <div style={st.inputWrapper(!!errors.username)}>
                <IconUser />
                <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} style={st.input} />
              </div>
              {errors.username && <p style={st.errorText}>{errors.username}</p>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Password</label>
              <div style={st.inputWrapper(!!errors.password)}>
                <IconLock />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} style={st.input} />
                <span onClick={() => setShowPassword((p) => !p)}><IconEye show={showPassword} /></span>
              </div>
              {errors.password && <p style={st.errorText}>{errors.password}</p>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Confirm Password</label>
              <div style={st.inputWrapper(!!errors.confirmPassword)}>
                <IconLock />
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} style={st.input} />
                <span onClick={() => setShowConfirmPassword((p) => !p)}><IconEye show={showConfirmPassword} /></span>
              </div>
              {errors.confirmPassword && <p style={st.errorText}>{errors.confirmPassword}</p>}
            </div>

            <p style={st.terms}>
              By signing up, you agree to our <a href="#" style={st.termsLink}>Terms of Service</a> and <a href="#" style={st.termsLink}>Privacy Policy</a>
            </p>

            <button type="submit" style={st.submitBtn(isLoading)} disabled={isLoading}>
              {isLoading ? "Creating account..." : "SIGN UP"}
            </button>

            <p style={st.bottomLink}>
              Already have an account?{" "}
              <button type="button" style={st.anchor} onClick={() => navigate("/login")}>Log in</button>
            </p>
          </form>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={st.footer}>
        <div style={st.footerGrid}>
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>About Us</h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted, #aaa)", lineHeight: "1.6" }}>Your trusted centralized platform for managing products across Shopee, Lazada, and TikTok Shop.</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {["f", "t", "ig", "yt"].map((s) => (
                <span key={s} style={{ width: "28px", height: "28px", background: "#1e2d3d", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--text-muted, #aaa)", cursor: "pointer" }}>{s}</span>
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
              <button key={l.label} onClick={() => navigate(l.route)} style={{ display: "block", fontSize: "13px", color: "var(--text-muted, #aaa)", marginBottom: "6px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>{l.label}</button>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Platforms</h4>
            {["Shopee", "Lazada", "TikTok Shop", "Returns & Refunds", "FAQs"].map((l) => (
              <a key={l} href="#" style={{ display: "block", fontSize: "13px", color: "var(--text-muted, #aaa)", marginBottom: "6px", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: "700", marginBottom: "12px" }}>Contact Us</h4>
            <p style={{ fontSize: "13px", color: "var(--text-muted, #aaa)", marginBottom: "6px" }}>📍 123 Commerce Street, New York, NY 10001</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted, #aaa)", marginBottom: "6px" }}>📞 +1 (555) 123-4567</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted, #aaa)" }}>✉ ecommercemarketplace@gmail.com</p>
          </div>
        </div>
        <div style={st.footerBottom}>
          <span>© 2026 E-Commerce Marketplace. All rights reserved.</span>
          <div>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" style={{ color: "var(--text-muted, #666)", textDecoration: "none", marginLeft: "16px" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}