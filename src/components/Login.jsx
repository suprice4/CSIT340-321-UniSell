import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Login.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
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

// ─── Hardcoded admin account ──────────────────────────────────────────────────
// This account always works — even in incognito — because it's in the code itself.
// Username: admin   Password: admin123
// Email:    admin@ecommerce.com  Password: admin123

const ADMIN_ACCOUNT = {
  email:    "admin@ecommerce.com",
  username: "admin",
  password: "admin123",
};

// ─── Helper: get all registered accounts from localStorage ───────────────────
// Register.jsx saves new accounts here so Login can verify them.

const getRegisteredAccounts = () => {
  try {
    const data = localStorage.getItem("registeredAccounts");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData]         = useState({ emailOrUsername: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  // Pre-fill remembered user
  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      setFormData((prev) => ({ ...prev, emailOrUsername: savedUser }));
      setRememberMe(true);
    }
  }, []);

  // Clear errors when user types
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

  // Basic format validation
  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrUsername) newErrors.emailOrUsername = "Email or username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  // Credential verification — checks admin account first, then registered accounts
  const verifyCredentials = (emailOrUsername, password) => {
    const input = emailOrUsername.toLowerCase().trim();

    // Check hardcoded admin account
    if (
      (input === ADMIN_ACCOUNT.email || input === ADMIN_ACCOUNT.username) &&
      password === ADMIN_ACCOUNT.password
    ) {
      return { valid: true, user: ADMIN_ACCOUNT };
    }

    // Check registered accounts saved by Register.jsx
    const accounts = getRegisteredAccounts();
    const found = accounts.find(
      (acc) =>
        (acc.email.toLowerCase() === input || acc.username.toLowerCase() === input) &&
        acc.password === password
    );

    if (found) return { valid: true, user: found };

    return { valid: false };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Step 1: format check
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Step 2: credential check
    const { valid, user } = verifyCredentials(formData.emailOrUsername, formData.password);
    if (!valid) {
      setErrors({ emailOrUsername: "Incorrect email/username or password." });
      return;
    }

    // Step 3: save session + remember me
    if (rememberMe) {
      localStorage.setItem("rememberedUser", formData.emailOrUsername);
    } else {
      localStorage.removeItem("rememberedUser");
    }

    // Save logged in user info so other pages can read it
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loggedInUser", JSON.stringify({
      email:    user.email,
      username: user.username,
    }));

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const st = {
    page:         { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },
    section:      { display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "48px 20px", background: "var(--page-bg, #f5f5f5)" },
    card:         { background: "var(--card-bg, #fff)", borderRadius: "10px", border: "1px solid var(--border-color, #e0e0e0)", padding: "36px 40px", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center" },
    cardLogo:     { width: "56px", height: "56px", background: "#e85d04", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", color: "white", marginBottom: "12px" },
    subtitle:     { fontSize: "13px", color: "var(--text-muted, #777)", marginBottom: "24px", textAlign: "center" },
    hint:         { fontSize: "12px", color: "#888", background: "#f9f5f0", border: "1px solid #e85d0433", borderRadius: "6px", padding: "8px 12px", width: "100%", marginBottom: "16px", lineHeight: "1.6" },
    formGroup:    { width: "100%", marginBottom: "14px" },
    label:        { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-primary, #333)" },
    inputWrapper: (hasError) => ({ display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${hasError ? "#e53e3e" : "var(--border-color, #ccc)"}`, borderRadius: "6px", padding: "9px 12px", background: "var(--section-alt-bg, #fafafa)" }),
    input:        { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "var(--text-primary, #333)" },
    errorText:    { fontSize: "12px", color: "#e53e3e", marginTop: "4px" },
    rememberRow:  { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "18px" },
    rememberLeft: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
    rememberLabel:{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary, #333)", cursor: "pointer" },
    forgotBtn:    { fontSize: "13px", color: "#e85d04", textDecoration: "none", cursor: "pointer", background: "none", border: "none" },
    submitBtn:    (loading) => ({ width: "100%", background: loading ? "#f0a070" : "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "13px", fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px", cursor: loading ? "not-allowed" : "pointer" }),
    bottomLink:   { marginTop: "14px", fontSize: "13px", color: "var(--text-muted, #777)" },
    anchor:       { color: "#e85d04", textDecoration: "none", fontWeight: "600", cursor: "pointer", background: "none", border: "none", fontSize: "13px" },
    footer:       { background: "#0f1923", color: "var(--text-muted, #ccc)", padding: "40px 60px 20px" },
    footerBottom: { borderTop: "1px solid var(--border-color, #1e2d3d)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted, #666)" },
  };

  return (
    <div style={st.page}>

      <Navbar activePage="/login" />

      <div style={st.section}>
        <div style={st.card}>
          <div style={st.cardLogo}>🛍</div>
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "4px" }}>Welcome Back</h2>
          <p style={st.subtitle}>Login to your E-Commerce Market Place account</p>

          {/* Demo hint for professor/testing */}
          <div style={st.hint}>
            🔑 <strong>Demo account:</strong> username <code>admin</code> / password <code>admin123</code>
          </div>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={st.formGroup}>
              <label style={st.label}>Email or Username</label>
              <div style={st.inputWrapper(!!errors.emailOrUsername)}>
                <IconEmail />
                <input type="text" name="emailOrUsername" placeholder="Enter your email or username" value={formData.emailOrUsername} onChange={handleChange} style={st.input} />
              </div>
              {errors.emailOrUsername && <p style={st.errorText}>{errors.emailOrUsername}</p>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Password</label>
              <div style={st.inputWrapper(!!errors.password)}>
                <IconLock />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} style={st.input} />
                <span onClick={() => setShowPassword((p) => !p)}><IconEye show={showPassword} /></span>
              </div>
              {errors.password && <p style={st.errorText}>{errors.password}</p>}
            </div>

            <div style={st.rememberRow}>
              <label style={st.rememberLeft}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span style={st.rememberLabel}>Remember me</span>
              </label>
              <button type="button" style={st.forgotBtn}>Forgot password?</button>
            </div>

            <button type="submit" style={st.submitBtn(isLoading)} disabled={isLoading}>
              {isLoading ? "Logging in..." : "LOG IN"}
            </button>

            <p style={st.bottomLink}>
              Don't have an account?{" "}
              <button type="button" style={st.anchor} onClick={() => navigate("/register")}>Sign up</button>
            </p>
          </form>
        </div>
      </div>
      {/* ── SHARED FOOTER ── */}
      <Footer />

    </div>
  );
}
