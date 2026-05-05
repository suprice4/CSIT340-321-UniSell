import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { IconLock, IconUser, IconEyeToggle, IconEmail } from "./Icons";
import "../styles/Register.css";

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

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    formData.email,
          username: formData.username,
          password: formData.password,
          role:     "VENDOR",
        }),
      });

      if (res.status === 409) {
        const message = await res.text();
        if (message.toLowerCase().includes("email")) {
          setErrors({ email: message });
        } else {
          setErrors({ username: message });
        }
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        setErrors({ email: "Registration failed. Please try again." });
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

  return (
    <div className="register-page">
      <Navbar activePage="/register" />

      <div className="register-section">
        <div className="register-card">

          <div className="register-card__logo">🛍</div>
          <h2 className="register-card__title">Create Account</h2>
          <p className="register-card__subtitle">Sign up for E-Commerce Market Place</p>

          <form className="register-form" onSubmit={handleSubmit}>

            <div className="register-form-group">
              <label className="register-label">Email</label>
              <div className={`register-input-wrapper${errors.email ? " register-input-wrapper--error" : ""}`}>
                <IconEmail />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="register-error-text">{errors.email}</p>}
            </div>

            <div className="register-form-group">
              <label className="register-label">Username</label>
              <div className={`register-input-wrapper${errors.username ? " register-input-wrapper--error" : ""}`}>
                <IconUser />
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && <p className="register-error-text">{errors.username}</p>}
            </div>

            <div className="register-form-group">
              <label className="register-label">Password</label>
              <div className={`register-input-wrapper${errors.password ? " register-input-wrapper--error" : ""}`}>
                <IconLock />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span onClick={() => setShowPassword((p) => !p)}>
                  <IconEyeToggle show={showPassword} />
                </span>
              </div>
              {errors.password && <p className="register-error-text">{errors.password}</p>}
            </div>

            <div className="register-form-group">
              <label className="register-label">Confirm Password</label>
              <div className={`register-input-wrapper${errors.confirmPassword ? " register-input-wrapper--error" : ""}`}>
                <IconLock />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <span onClick={() => setShowConfirmPassword((p) => !p)}>
                  <IconEyeToggle show={showConfirmPassword} />
                </span>
              </div>
              {errors.confirmPassword && <p className="register-error-text">{errors.confirmPassword}</p>}
            </div>

            <p className="register-terms">
              By signing up, you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>

            <button type="submit" className="register-submit-btn" disabled={isLoading}>
              {isLoading ? "Creating account..." : "SIGN UP"}
            </button>

            <p className="register-bottom-link">
              Already have an account?{" "}
              <button type="button" className="register-anchor" onClick={() => navigate("/login")}>
                Log in
              </button>
            </p>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}