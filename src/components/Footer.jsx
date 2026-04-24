import { useNavigate } from "react-router-dom";
import "../styles/Footer.css";

// ─── Shared Footer Component ──────────────────────────────────────────────────
// Used across all pages for consistency.

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* About */}
        <div>
          <h4 className="footer-heading">About Us</h4>
          <p className="footer-text">
            Your trusted centralized platform for managing products across Shopee, Lazada, and TikTok Shop.
          </p>
          <div className="footer-socials">
            {["f", "t", "ig", "yt"].map((s) => (
              <span key={s} className="footer-social-icon">{s}</span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-heading">Quick Links</h4>
          {[
            { label: "Home",       route: "/"          },
            { label: "About Us",   route: "/about"     },
            { label: "Contact Us", route: "/contact"   },
            { label: "Dashboard",  route: "/dashboard" },
            { label: "Register",   route: "/register"  },
          ].map((l) => (
            <button
              key={l.label}
              onClick={() => navigate(l.route)}
              className="footer-link-btn"
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Platforms */}
        <div>
          <h4 className="footer-heading">Platforms</h4>
          {["Shopee", "Lazada", "TikTok Shop", "Returns & Refunds", "FAQs"].map((l) => (
            <a key={l} href="#" className="footer-link">{l}</a>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 className="footer-heading">Contact Us</h4>
          <p className="footer-text">📍 123 Commerce Street, New York, NY 10001</p>
          <p className="footer-text">📞 +1 (555) 123-4567</p>
          <p className="footer-text">✉ ecommercemarketplace@gmail.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2026 E-Commerce Marketplace. All rights reserved.</span>
        <div>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
            <a key={l} href="#" className="footer-bottom-link">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
