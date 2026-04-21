import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserProfileDropdown.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  { icon: "👤", label: "My Profile",       action: "profile"  },
  { icon: "⚙️", label: "Account Settings", action: "settings" },
  { icon: "🛒", label: "My Orders",        action: "orders"   },
  { icon: "❤️", label: "Wishlist",          action: "wishlist" },
  { icon: "🔒", label: "Change Password",   action: "password" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserProfileDropdown({ isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);
  const navigate        = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAction = (action) => {
    setOpen(false);
    if (action === "profile")  navigate("/profile");
    if (action === "orders")   navigate("/orders");
    if (action === "settings") navigate("/profile");
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="profile-drop-wrap" ref={ref}>

      {/* ── Trigger Pill ── */}
      <button
        className="profile-drop-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
      >
        <div className="profile-drop-trigger__avatar">A</div>
        <span className="profile-drop-trigger__label">
          {isLoggedIn ? "Admin" : "Guest"}
        </span>
        <span className={`profile-drop-trigger__chevron${open ? " profile-drop-trigger__chevron--open" : ""}`}>
          ▼
        </span>
      </button>

      {/* ── Dropdown Menu ── */}
      {open && (
        <div className="profile-drop-menu">

          {isLoggedIn ? (
            <>
              {/* Profile header */}
              <div className="profile-drop-header">
                <div className="profile-drop-header__avatar">A</div>
                <div>
                  <div className="profile-drop-header__name">Admin User</div>
                  <div className="profile-drop-header__email">admin@marketplace.ph</div>
                </div>
              </div>

              {/* Menu items */}
              <div className="profile-drop-list">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.action}
                    className="profile-drop-item"
                    onClick={() => handleAction(item.action)}
                  >
                    <span className="profile-drop-item__icon">{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <div className="profile-drop-divider" />

                <button className="profile-drop-logout" onClick={handleLogout}>
                  <span className="profile-drop-item__icon">🚪</span>
                  Logout
                </button>
              </div>
            </>
          ) : (
            /* Guest / not logged in */
            <div className="profile-drop-login-prompt">
              <p className="profile-drop-login-prompt__text">
                Sign in to access your account
              </p>
              <button
                className="profile-drop-login-prompt__btn"
                onClick={() => { setOpen(false); navigate("/login"); }}
              >
                Login
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
