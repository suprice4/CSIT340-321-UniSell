import { useState } from "react";
import { useNavigate } from "react-router-dom";

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconAccount = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="7" r="4"/>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Navbar({ activePage }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const NAV_LINKS = [
    { label: "Home", route: "/" },
    { label: "Products", route: null },
    { label: "Dashboard", route: "/dashboard" },
    { label: "Orders", route: null },
    { label: "About Us", route: "/about" },
    { label: "Contact Us", route: "/contact" },
  ];

  const s = {
    topNav: {
      background: "#fff",
      borderBottom: "1px solid #e0e0e0",
      padding: "12px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    },

    logoArea: {
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },

    logoCircle: {
      width: "44px",
      height: "44px",
      background: "#e85d04",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      color: "#fff"
    },

    logoText: {
      fontSize: "12px",
      fontWeight: "700",
      color: "#e85d04",
      lineHeight: "1.3",
      textTransform: "uppercase"
    },

    searchBar: {
      flex: 1,
      maxWidth: "480px",
      margin: "0 24px",
      display: "flex",
      alignItems: "center",
      border: "1px solid #ccc",
      borderRadius: "6px",
      background: "#f9f9f9",
      padding: "8px 14px",
      gap: "8px"
    },

    searchInput: {
      border: "none",
      background: "transparent",
      outline: "none",
      width: "100%",
      fontSize: "14px",
      color: "#444"
    },

    topNavRight: {
      display: "flex",
      gap: "16px",
      alignItems: "center"
    },

    iconBtn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: "11px",
      color: "#555",
      gap: "2px",
      cursor: "pointer",
      background: "none",
      border: "none"
    },

    logoutBtn: {
      background: "#e85d04",
      color: "white",
      borderRadius: "6px",
      padding: "8px 18px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "6px"
    },

    mainNav: {
      background: "#fff",
      borderBottom: "1px solid #e0e0e0",
      padding: "0 40px",
      display: "flex",
      gap: "24px"
    },

    navBtn: (active) => ({
      display: "block",
      padding: "14px 0",
      fontSize: "14px",
      fontWeight: "500",
      color: active ? "#e85d04" : "#333",
      cursor: "pointer",
      background: "none",
      border: "none",
      borderBottom: active ? "2px solid #e85d04" : "2px solid transparent",
      whiteSpace: "nowrap"
    })
  };

  return (
    <>
      <nav style={s.topNav}>
        <div style={s.logoArea}>
          <div style={s.logoCircle}>🛍</div>
          <div style={s.logoText}>
            E-Commerce<br />Market Place
          </div>
        </div>

        <div style={s.searchBar}>
          <IconSearch />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            style={s.searchInput}
          />
        </div>

        <div style={s.topNavRight}>

          <button style={s.iconBtn}>
            <IconAccount />
            Account
          </button>

          <button style={s.logoutBtn} onClick={() => navigate("/login")}>
            <IconLogout />
            Logout
          </button>
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