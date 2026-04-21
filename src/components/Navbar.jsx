import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle       from "./DarkModeToggle";
import NotificationBell     from "./NotificationBell";
import UserProfileDropdown  from "./UserProfileDropdown";
import "../styles/Navbar.css";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",       route: "/"          },
  { label: "Products",   route: "/products"  },
  { label: "Dashboard",  route: "/dashboard" },
  { label: "Orders",     route: "/orders"    },
  { label: "About Us",   route: "/about"     },
  { label: "Contact Us", route: "/contact"   },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar({ activePage }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn]   = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      {/* ── Top bar ── */}
      <nav className="navbar-top">

        {/* Logo */}
        <div className="navbar-logo-area">
          <div className="navbar-logo-circle">🛍</div>
          <div className="navbar-logo-text">E-COMMERCE <br /> MARKET PLACE</div>
        </div>

        {/* Search */}
        <div className="navbar-search-bar">
          <IconSearch />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>

        {/* Right controls */}
        <div className="navbar-right">
          <DarkModeToggle />
          <div className="navbar-divider" />
          <NotificationBell />
          <div className="navbar-divider" />
          <UserProfileDropdown isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        </div>

      </nav>

      {/* ── Secondary nav ── */}
      <nav className="navbar-main">
        {NAV_LINKS.map((link) => (
          <button
            key={link.label}
            className={`navbar-link${activePage === link.route ? " active" : ""}`}
            onClick={() => link.route && navigate(link.route)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </>
  );
}
