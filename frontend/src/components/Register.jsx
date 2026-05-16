import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Register.css";

import { IconEmail, IconLock, IconEyeToggle, IconUser } from "./Icons";
import API_BASE from "../Config";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData]                       = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors]                           = useState({});
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading]                     = useState(false);

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

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.username) {
      newErrors.username = "Username is required.";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    } else if (formData.username.toLowerCase() === "admin") {
      newErrors.username = "This username is already taken.";
    } 

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:    formData.email,
        username: formData.username,
        password: formData.password,
        role:     "VENDOR",  
      }),
    });

    if (!res.ok) {
      setErrors({ email: "Registration failed. Email or username may already exist." });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    navigate("/login");

  } catch (err) {
    setErrors({ email: "Cannot connect to server. Is Spring Boot running?" });
    setIsLoading(false);
  }
};

  const st = {
    page:         { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },
    section:      { display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "48px 20px", background: "var(--page-bg, #f5f5f5)" },
    card:         { background: "var(--card-bg, #fff)", borderRadius: "10px", border: "1px solid var(--border-color, #e0e0e0)", padding: "36px 40px", width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center" },
    cardLogo:     { width: "56px", height: "56px", background: "#e85d04", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", color: "white", marginBottom: "12px" },
    subtitle:     { fontSize: "13px", color: "var(--text-muted, #777)", marginBottom: "24px", textAlign: "center" },
    formGroup:    { width: "100%", marginBottom: "14px" },
    label:        { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-primary, #333)" },
    inputWrapper: (hasError) => ({ display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${hasError ? "#e53e3e" : "var(--border-color, #ccc)"}`, borderRadius: "6px", padding: "9px 12px", background: "var(--section-alt-bg, #fafafa)" }),
    input:        { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "var(--text-primary, #333)" },
    errorText:    { fontSize: "12px", color: "#e53e3e", marginTop: "4px" },
    terms:        { fontSize: "12px", color: "var(--text-muted, #777)", marginBottom: "18px", width: "100%" },
    termsLink:    { color: "#e85d04", textDecoration: "none" },
    submitBtn:    (loading) => ({ width: "100%", background: loading ? "#f0a070" : "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "13px", fontSize: "15px", fontWeight: "700", letterSpacing: "0.5px", cursor: loading ? "not-allowed" : "pointer" }),
    bottomLink:   { marginTop: "14px", fontSize: "13px", color: "var(--text-muted, #777)" },
    anchor:       { color: "#e85d04", textDecoration: "none", fontWeight: "600", cursor: "pointer", background: "none", border: "none", fontSize: "13px" },
    footer:       { background: "#0f1923", color: "var(--text-muted, #ccc)", padding: "40px 60px 20px" },
    footerBottom: { borderTop: "1px solid var(--border-color, #1e2d3d)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted, #666)" },
  };

  return (
    <div style={st.page}>

      <Navbar activePage="/register" />

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
                <span onClick={() => setShowPassword((p) => !p)}><IconEyeToggle show={showPassword} /></span>
              </div>
              {errors.password && <p style={st.errorText}>{errors.password}</p>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Confirm Password</label>
              <div style={st.inputWrapper(!!errors.confirmPassword)}>
                <IconLock />
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} style={st.input} />
                <span onClick={() => setShowConfirmPassword((p) => !p)}><IconEyeToggle show={showPassword} /></span>
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
      <Footer />

    </div>
  );
}
