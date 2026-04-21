import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { icon: "👤", label: "My Profile",       action: "profile"   },
  { icon: "⚙️", label: "Account Settings", action: "settings"  },
  { icon: "🛒", label: "My Orders",        action: "orders"    },
  { icon: "❤️", label: "Wishlist",          action: "wishlist"  },
  { icon: "🔒", label: "Change Password",   action: "password"  },
];

export default function UserProfileDropdown({ isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAction = (action) => {
    setOpen(false);
    if (action === "profile")  return;
    if (action === "settings") return;
    if (action === "orders")   navigate("/dashboard");
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  const s = {
    wrap: { position: "relative" },
    trigger: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "none",
      border: "1px solid var(--border-color, #e0e0e0)",
      borderRadius: "24px",
      padding: "5px 12px 5px 5px",
      cursor: "pointer",
      color: "var(--text-primary, #333)",
      transition: "border-color 0.2s, background 0.2s",
    },
    avatar: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #e85d04, #f59e0b)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: "700",
      color: "#fff",
      flexShrink: 0,
    },
    triggerLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "var(--text-primary, #333)",
      maxWidth: "80px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    chevron: {
      fontSize: "10px",
      color: "var(--text-muted, #888)",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s",
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      width: "220px",
      background: "var(--card-bg, #fff)",
      border: "1px solid var(--border-color, #e0e0e0)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      zIndex: 1000,
      overflow: "hidden",
    },
    profileHeader: {
      padding: "16px",
      borderBottom: "1px solid var(--border-color, #f0f0f0)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    avatarLg: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #e85d04, #f59e0b)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: "700",
      color: "#fff",
      flexShrink: 0,
    },
    profileName: { fontSize: "14px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)" },
    profileEmail: { fontSize: "11px", color: "var(--text-muted, #888)", marginTop: "2px" },
    menuList: { padding: "8px 0" },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "13px",
      color: "var(--text-primary, #333)",
      transition: "background 0.15s",
      border: "none",
      background: "none",
      width: "100%",
      textAlign: "left",
    },
    menuIcon: { fontSize: "15px", width: "20px", textAlign: "center" },
    divider: { height: "1px", background: "var(--border-color, #f0f0f0)", margin: "4px 0" },
    logoutItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "13px",
      color: "#e85d04",
      fontWeight: "600",
      transition: "background 0.15s",
      border: "none",
      background: "none",
      width: "100%",
      textAlign: "left",
    },
    loginPrompt: {
      padding: "16px",
      textAlign: "center",
    },
    loginBtn: {
      width: "100%",
      padding: "9px",
      background: "#e85d04",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  return (
    <div style={s.wrap} ref={ref}>
      <button style={s.trigger} onClick={() => setOpen((o) => !o)} aria-label="User menu">
        <div style={s.avatar}>A</div>
        <span style={s.triggerLabel}>{isLoggedIn ? "Admin" : "Guest"}</span>
        <span style={s.chevron}>▼</span>
      </button>

      {open && (
        <div style={s.dropdown}>
          {isLoggedIn ? (
            <>
              <div style={s.profileHeader}>
                <div style={s.avatarLg}>A</div>
                <div>
                  <div style={s.profileName}>Admin User</div>
                  <div style={s.profileEmail}>admin@marketplace.ph</div>
                </div>
              </div>

              <div style={s.menuList}>
                {MENU_ITEMS.map((item) => (
                  <button key={item.action} style={s.menuItem} onClick={() => handleAction(item.action)}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover-bg, #f9f9f9)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    <span style={s.menuIcon}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                <div style={s.divider} />
                <button style={s.logoutItem} onClick={handleLogout}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#fff8f5"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  <span style={s.menuIcon}>🚪</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={s.loginPrompt}>
              <p style={{ fontSize: "13px", color: "var(--text-muted, #888)", marginBottom: "12px" }}>Sign in to access your account</p>
              <button style={s.loginBtn} onClick={() => { setOpen(false); navigate("/login"); }}>Login</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
