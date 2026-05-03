import { useState, useEffect } from "react";
import "../styles/DarkModeToggle.css";

// Injected style tag beats inline styles with !important
const DARK_OVERRIDE_STYLE = `
  body, #root, [class*="-page"], [class*="-section"] {
    background-color: #0d0d0d !important;
    color: #e8e8e8 !important;
  }
  .navbar-top, .navbar-main {
    background: #111 !important;
    border-bottom-color: #333 !important;
  }
  .navbar-search-bar {
    background: #222 !important;
    border-color: #333 !important;
  }
  .navbar-search-bar input, .navbar-link, .navbar-icon-btn {
    color: #e8e8e8 !important;
  }
  /* Cards & panels */
  [class*="-card"], [class*="-modal"], [class*="login-card"],
  [class*="register-card"], [class*="profile-header"],
  [class*="profile-tabs"], [class*="profile-tab"],
  [class*="-wrap"], [class*="hero-card"],
  [class*="feature-card"], [class*="testimonial-card"],
  [class*="platform-card"], [class*="about-who-row__right"],
  [class*="about-value-card"], [class*="about-team-card"],
  [class*="contact-info-card"], [class*="contact-form-card"],
  .notif-dropdown, .profile-drop-menu {
    background: #1a1a1a !important;
    border-color: #333 !important;
    color: #e8e8e8 !important;
  }
  /* Inputs */
  input, select, textarea,
  [class*="-input"], [class*="-select"],
  [class*="search-wrap"], [class*="input-wrapper"],
  [class*="pass-wrapper"] {
    background: #222 !important;
    border-color: #333 !important;
    color: #e8e8e8 !important;
  }
  /* Table rows */
  td { 
    border-bottom-color: #333 !important;
    color: #e8e8e8 !important;
  }
  th { border-bottom-color: #333 !important; }
  /* Pagination */
  [class*="page-btn"], [class*="nav-btn"] {
    background: #1a1a1a !important;
    border-color: #333 !important;
    color: #e8e8e8 !important;
  }
  [class*="page-btn"].active { background: #e85d04 !important; color: #fff !important; }
  /* Footer */
  [class*="-footer"] { background: #050505 !important; }
  /* Stats bars */
  [class*="stats-bar"] { background: #0a0a0a !important; }
  /* FAQ */
  [class*="faq__item"] { background: #1a1a1a !important; border-color: #333 !important; }
  [class*="faq__question"] { background: #1a1a1a !important; color: #e8e8e8 !important; }
  [class*="faq__question--open"] { background: #1f1008 !important; color: #e85d04 !important; }
  /* Section alt */
  [class*="section--alt"], [class*="-section--alt"],
  .login-section, .register-section { background: #151515 !important; }
  /* General text */
  p, h1, h2, h3, h4, span:not(.navbar-logo-circle):not(.dark-toggle__knob):not([class*="badge"]):not([class*="status"]) {
    color: inherit;
  }
  /* Profile tabs */
  [class*="profile-tab"] { color: #888 !important; background: transparent !important; }
  [class*="profile-tab"].active { background: #e85d04 !important; color: #fff !important; }
  /* Overlay modals */
  [class*="-overlay"] { background: rgba(0,0,0,0.7) !important; }
  /* Products */
  .products-container { background: #0d0d0d !important; }
  /* Landing page white bg */
  .landing-page { background: #0d0d0d !important; }
  /* Navbar: true black (not navy) */
  .navbar-top, .navbar-main {
    background: #000 !important;
    border-bottom-color: #222 !important;
  }
  /* Stats bar & footer: true black */
  [class*="stats-bar"] { background: #000 !important; }
  [class*="-footer"] { background: #000 !important; }
  /* Platform landing cards — inline bg can't be beaten by class selector alone */
  .platform-landing-card {
    background: #1a1a1a !important;
    border-color: #333 !important;
  }
  .platform-landing-card p,
  .platform-landing-card__desc { color: #ccc !important; }
  /* Section alt on landing page */
  .landing-section--alt { background: #111 !important; }
  /* Footer social icons & divider */
  .landing-footer__social-icon { background: #222 !important; }
  .landing-footer__bottom { border-top-color: #222 !important; }
`;

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const root = document.documentElement;

    // Remove any existing injected style
    const existing = document.getElementById("dark-mode-override");
    if (existing) existing.remove();

    if (dark) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");

      // Inject override style to beat inline styles
      const styleEl = document.createElement("style");
      styleEl.id = "dark-mode-override";
      styleEl.textContent = DARK_OVERRIDE_STYLE;
      document.head.appendChild(styleEl);
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("darkMode", "false");
    }
  }, [dark]);

  return (
    <button
      className={`dark-toggle${dark ? " dark-toggle--on" : ""}`}
      onClick={() => setDark((d) => !d)}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle dark mode"
    >
      <span className="dark-toggle__knob">
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
