import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { IconLock, IconEyeToggle, IconEmail } from "./Icons";
import { saveSession } from "./utils/auth";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData]         = useState({ emailOrUsername: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [isLoading, setIsLoading]       = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      setFormData((prev) => ({ ...prev, emailOrUsername: savedUser }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) setErrors({});
  }, [formData]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrUsername) newErrors.emailOrUsername = "Email or username is required.";
    if (!formData.password)        newErrors.password = "Password is required.";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: formData.emailOrUsername,
          password:        formData.password,
        }),
      });

      if (!res.ok) {
        setErrors({ emailOrUsername: "Incorrect email/username or password." });
        setIsLoading(false);
        return;
      }

      const session = await res.json();

      saveSession(session);

      if (rememberMe) {
        localStorage.setItem("rememberedUser", formData.emailOrUsername);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      setIsLoading(false);
      navigate("/dashboard");

    } catch (err) {
      setErrors({ emailOrUsername: "Cannot connect to server. Is Spring Boot running?" });
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar activePage="/login" />

      <div className="login-section">
        <div className="login-card">

          <div className="login-card__logo">🛍</div>
          <h2 className="login-card__title">Welcome Back</h2>
          <p className="login-card__subtitle">Login to your E-Commerce Market Place account</p>

          <div className="login-hint">
            🔑 <strong>Demo account:</strong> username <code>admin</code> / password <code>admin123</code>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            <div className="login-form-group">
              <label className="login-label">Email or Username</label>
              <div className={`login-input-wrapper${errors.emailOrUsername ? " login-input-wrapper--error" : ""}`}>
                <IconEmail />
                <input
                  type="text"
                  name="emailOrUsername"
                  placeholder="Enter your email or username"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                />
              </div>
              {errors.emailOrUsername && <p className="login-error-text">{errors.emailOrUsername}</p>}
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <div className={`login-input-wrapper${errors.password ? " login-input-wrapper--error" : ""}`}>
                <IconLock />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span onClick={() => setShowPassword((p) => !p)}>
                  <IconEyeToggle show={showPassword} />
                </span>
              </div>
              {errors.password && <p className="login-error-text">{errors.password}</p>}
            </div>

            <div className="login-remember-row">
              <label className="login-remember-left">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="login-remember-label">Remember me</span>
              </label>
              <button type="button" className="login-forgot-btn">Forgot password?</button>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "LOG IN"}
            </button>

            <p className="login-bottom-link">
              Don't have an account?{" "}
              <button type="button" className="login-anchor" onClick={() => navigate("/register")}>
                Sign up
              </button>
            </p>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}