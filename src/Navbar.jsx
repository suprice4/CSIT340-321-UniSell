import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./components/DarkModeToggle";
import NotificationBell from "./components/NotificationBell";
import UserProfileDropdown from "./components/UserProfileDropdown";

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #aaa)" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const NAV_LINKS = [
  { label: "Home",       route: "/"          },
  { label: "Products",   route: null         },
  { label: "Dashboard",  route: "/dashboard" },
  { label: "Orders",     route: null         },
  { label: "About Us",   route: "/about"     },
  { label: "Contact Us", route: "/contact"   },
];

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

  const s = {
    topNav: {
      background: "var(--nav-bg, #fff)",
      borderBottom: "1px solid var(--border-color, #e0e0e0)",
      padding: "10px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
    },
    logoArea: { display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 },
    logoCircle: {
      width: "44px", height: "44px", background: "#e85d04",
      borderRadius: "50%", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: "20px", color: "#fff",
    },
    logoText: { fontSize: "12px", fontWeight: "700", color: "#e85d04", lineHeight: "1.3" },
    searchBar: {
      flex: 1, maxWidth: "480px", margin: "0 16px",
      display: "flex", alignItems: "center",
      border: "1px solid var(--border-color, #ccc)",
      borderRadius: "6px", background: "var(--input-bg, #f9f9f9)",
      padding: "8px 14px", gap: "8px",
    },
    searchInput: {
      border: "none", background: "transparent", outline: "none",
      width: "100%", color: "var(--text-primary, #333)", fontSize: "14px",
    },
    topNavRight: {
      display: "flex", gap: "10px", alignItems: "center", flexShrink: 0,
    },
    divider: {
      width: "1px", height: "22px",
      background: "var(--border-color, #e0e0e0)",
      margin: "0 4px",
    },
    mainNav: {
      background: "var(--nav-bg, #fff)",
      borderBottom: "1px solid var(--border-color, #e0e0e0)",
      padding: "0 40px", display: "flex", gap: "32px",
    },
    navBtn: (active) => ({
      padding: "14px 0", background: "none", border: "none",
      cursor: "pointer",
      color: active ? "#e85d04" : "var(--text-primary, #333)",
      borderBottom: active ? "2px solid #e85d04" : "2px solid transparent",
      fontSize: "14px", fontWeight: "500", transition: "color 0.2s",
    }),
  };

  return (
    <>
      <style>{`
        :root {
          --nav-bg: #fff;
          --card-bg: #fff;
          --input-bg: #f9f9f9;
          --border-color: #e0e0e0;
          --text-primary: #222;
          --text-muted: #888;
          --hover-bg: #f9f9f9;
          --nav-icon-color: #555;
          --notif-unread-bg: #fff8f5;
        }
        [data-theme="dark"] {
          --nav-bg: #1a1a2e;
          --card-bg: #16213e;
          --input-bg: #0f3460;
          --border-color: #2d3561;
          --text-primary: #e0e0e0;
          --text-muted: #9ca3af;
          --hover-bg: #0f3460;
          --nav-icon-color: #d1d5db;
          --notif-unread-bg: #1f2a40;
        }
        [data-theme="dark"] body,
        [data-theme="dark"] #root {
          background: #0f0f23;
          color: #e0e0e0;
        }
      `}</style>

      <nav style={s.topNav}>
        <div style={s.logoArea}>
          <div style={s.logoCircle}>🛍</div>
          <div style={s.logoText}>E-COMMERCE <br />MARKET PLACE</div>
        </div>

        <div style={s.searchBar}>
          <IconSearch />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders..."
            style={s.searchInput}
          />
        </div>

        <div style={s.topNavRight}>
          <DarkModeToggle />
          <div style={s.divider} />
          <NotificationBell />
          <div style={s.divider} />
          <UserProfileDropdown isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        </div>
      </nav>

      <nav style={s.mainNav}>
        {NAV_LINKS.map((link) => (
          <button
            key={link.label}
            style={s.navBtn(activePage === link.route)}
            onClick={() => link.route && navigate(link.route)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </>
  );
}
