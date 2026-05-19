import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle      from "./DarkModeToggle";
import NotificationBell    from "./NotificationBell";
import UserProfileDropdown from "./UserProfileDropdown";
import { IconSearch }      from "./Icons";
import API_BASE from "../Config";
import "../styles/Navbar.css";


const NAV_LINKS = [
  { label: "Home",          route: "/"            },
  { label: "Dashboard",     route: "/dashboard"   },
  { label: "Products",      route: "/products"    },
  { label: "Platforms",     route: "/platforms"   },
  { label: "Orders",        route: "/orders"      },
  { label: "Export Orders", route: "/export"      },
  { label: "Admin Users",   route: "/admin/users" },
  { label: "About Us",      route: "/about"       },
  { label: "Contact Us",    route: "/contact"     },
];

const PROTECTED_ROUTES = ["/products", "/platforms", "/dashboard", "/orders", "/export", "/profile", "/admin/users"];

export default function Navbar({ activePage }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [isAdmin, setIsAdmin]         = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      if (!loggedIn) { setIsAdmin(false); return; }

      // Verify role live from the database — not from localStorage
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      if (!storedUser.id) { setIsAdmin(false); return; }

      try {
        const res = await fetch(`${API_BASE}/api/users/${storedUser.id}`);
        if (res.ok) {
          const user = await res.json();
          setIsAdmin(user.role === "ADMIN");
          // Keep localStorage in sync with actual DB role
          localStorage.setItem("loggedInUser", JSON.stringify({ ...storedUser, role: user.role }));
        } else {
          setIsAdmin(false);
        }
      } catch {
        // If backend is unreachable, fall back to cached role
        setIsAdmin(storedUser.role === "ADMIN");
      }
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/login");
  };

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
      <nav className="navbar-top">

        <div className="navbar-logo-area">
          <div className="navbar-logo-circle">🛍</div>
          <div className="navbar-logo-text">E-COMMERCE <br /> MARKET PLACE</div>
        </div>

        <div className="navbar-search-bar">
          <IconSearch />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="navbar-right">
          <DarkModeToggle />
          <div className="navbar-divider" />
          <NotificationBell isLoggedIn={isLoggedIn} />
          <div className="navbar-divider" />
          <UserProfileDropdown isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        </div>

      </nav>

      <nav className="navbar-main">
        {NAV_LINKS
          .filter(link => link.label !== "Admin Users" || isAdmin)
          .map((link) => (
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