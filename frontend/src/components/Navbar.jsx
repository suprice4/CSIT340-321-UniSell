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
  { label: "Home",          route: "/"           },
  { label: "Products",      route: "/products"   },
  { label: "Dashboard",     route: "/dashboard"  },
  { label: "Orders",        route: "/orders"     },
  { label: "Export Orders", route: "/export"     },
  { label: "Admin Users",   route: "/admin/users"},
  { label: "About Us",      route: "/about"      },
  { label: "Contact Us",    route: "/contact"    },
];

// ─── Routes that require login ─────────────────────────────────────────────
// If user is not logged in and clicks these, redirect to /login

const PROTECTED_ROUTES = ["/products", "/dashboard", "/orders", "/export", "/profile", "/admin/users"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar({ activePage }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn]   = useState(false);

  // Re-check login status on every render so it stays in sync
  useEffect(() => {
    const checkLogin = () =>
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    checkLogin();
    // Also listen for storage changes (e.g. logout in another tab)
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Guard nav click — if route is protected and not logged in, go to /login
  const handleNavClick = (link) => {
    if (!link.route) return;
    if (PROTECTED_ROUTES.includes(link.route) && !isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(link.route);
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
          {/* Pass isLoggedIn so bell can guard itself too */}
          <NotificationBell isLoggedIn={isLoggedIn} />
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
            onClick={() => handleNavClick(link)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </>
  );
}
