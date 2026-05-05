import { useState, useEffect } from "react";
import "../styles/DarkModeToggle.css";

const DARK_OVERRIDE_STYLE = `
  body, #root, [class*="-page"] {
    background-color: #0d0d0d !important;
    color: #e8e8e8 !important;
  }
  .login-section, .register-section, .about-section, .contact-section {
    background-color: #0d0d0d !important;
    color: #e8e8e8 !important;
  }
  .navbar-top, .navbar-main {
    background: #000 !important;
    border-bottom-color: #222 !important;
  }
  .navbar-search-bar {
    background: #222 !important;
    border-color: #333 !important;
  }
  .navbar-search-bar input, .navbar-link, .navbar-icon-btn {
    color: #e8e8e8 !important;
  }
  /* Cards & panels */
  [class*="-card"]:not([class*="lp-"]):not([class*="lp-hero"]), [class*="-modal"], [class*="login-card"],
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
  td { border-bottom-color: #333 !important; color: #e8e8e8 !important; }
  th { border-bottom-color: #333 !important; }
  /* Pagination */
  [class*="page-btn"], [class*="nav-btn"] {
    background: #1a1a1a !important;
    border-color: #333 !important;
    color: #e8e8e8 !important;
  }
  [class*="page-btn"].active { background: #e85d04 !important; color: #fff !important; }
  /* Footer */
  [class*="-footer"] { background: #000 !important; }
  /* Stats bars */
  [class*="stats-bar"] { background: #000 !important; }
  /* FAQ */
  [class*="faq__item"] { background: #1a1a1a !important; border-color: #333 !important; }
  [class*="faq__question"] { background: #1a1a1a !important; color: #e8e8e8 !important; }
  [class*="faq__question--open"] { background: #1f1008 !important; color: #e85d04 !important; }
  /* Section alt — non-landing */
  .about-section--alt, .login-section, .register-section { background: #151515 !important; }
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
  /* Landing page */
  .lp-page { background: #0d0d0d !important; }
  .lp-section { background: #0d0d0d !important; color: #e8e8e8 !important; }
  .lp-section--alt { background: #111 !important; color: #e8e8e8 !important; }
  .lp-section__tag { color: #e85d04 !important; }
  .lp-section__title { color: #e8e8e8 !important; }
  .lp-section__sub { color: #aaa !important; }
  .lp-feat-card { background: #1a1a1a !important; border-color: #333 !important; }
  .lp-feat-card__title { color: #e8e8e8 !important; }
  .lp-feat-card__desc { color: #aaa !important; }
  .lp-plat-card--shopee, .lp-plat-card--lazada, .lp-plat-card--tiktok { background: #1a1a1a !important; }
  .lp-plat-card__name--shopee { color: #f97316 !important; }
  .lp-plat-card__name--lazada { color: #818cf8 !important; }
  .lp-plat-card__name--tiktok { color: #e8e8e8 !important; }
  .lp-plat-card__desc { color: #aaa !important; }
  .lp-test-card { background: #1a1a1a !important; border-color: #333 !important; }
  .lp-test-card__review, .lp-test-card__name { color: #e8e8e8 !important; }
  .lp-test-card__role { color: #aaa !important; }
  .lp-included-item { color: #e8e8e8 !important; }
  .lp-step__title { color: #e8e8e8 !important; }
  .lp-step__desc { color: #aaa !important; }
  .lp-stat-item__label { color: #aaa !important; }
  .lp-hero-card { background: rgba(255,255,255,0.1) !important; }
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
