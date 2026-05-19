import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationBell.css";
import API_BASE from "../Config";

const TYPE_ICONS = {
  order:   { icon: "🛒", bg: "#fff1ee" },
  ship:    { icon: "📦", bg: "#ebf8ff" },
  alert:   { icon: "⚠️", bg: "#fefce8" },
  success: { icon: "✅", bg: "#f0fff4" },
};

function timeAgo(dateStr) {
  if (!dateStr) return "recently";
  const date = new Date(dateStr);
  if (isNaN(date)) return "recently";
  const diffMs   = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs  = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  if (diffMins < 1)   return "just now";
  if (diffMins < 60)  return `${diffMins} min ago`;
  if (diffHrs < 24)   return `${diffHrs} hr ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

function buildNotificationsFromOrders(orders) {
  if (!orders || orders.length === 0) return [];
  const recent = [...orders].reverse().slice(0, 5);
  return recent.map((o, i) => {
    const time = timeAgo(o.date);
    if (o.status === "Pending") {
      return { id: o.id, type: "order",   message: `New order #${o.id} from ${o.customer}`,          time, read: i > 1 };
    } else if (o.status === "Shipped") {
      return { id: o.id, type: "ship",    message: `Order #${o.id} (${o.product}) has been shipped`,  time, read: i > 1 };
    } else if (o.status === "Delivered") {
      return { id: o.id, type: "success", message: `Payment confirmed for order #${o.id}`,             time, read: i > 0 };
    } else if (o.status === "Cancelled") {
      return { id: o.id, type: "alert",   message: `Order #${o.id} was cancelled by ${o.customer}`,   time, read: true  };
    } else {
      return { id: o.id, type: "order",   message: `Order #${o.id} is being processed`,               time, read: i > 1 };
    }
  });
}

export default function NotificationBell({ isLoggedIn }) {
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref      = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const userId = currentUser.id;
    const params = userId ? `?userId=${userId}` : "";
    fetch(`${API_BASE}/api/orders${params}`)
      .then(res => res.json())
      .then(orders => setNotifications(buildNotificationsFromOrders(orders)))
      .catch(() => {});
  }, [isLoggedIn]);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleBellClick = () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setOpen((o) => !o);
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <div className="notif-wrap" ref={ref}>

      <button
        className="notif-btn"
        onClick={handleBellClick}
        title={isLoggedIn ? "Notifications" : "Login to view notifications"}
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {isLoggedIn && unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {isLoggedIn && open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span className="notif-header__title">
              Notifications {unread > 0 && `(${unread})`}
            </span>
            {unread > 0 && (
              <button className="notif-header__mark-btn" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">🎉 You're all caught up!</div>
            ) : (
              notifications.map((n) => {
                const t = TYPE_ICONS[n.type] || TYPE_ICONS.order;
                return (
                  <div
                    key={n.id}
                    className={`notif-item${n.read ? " notif-item--read" : " notif-item--unread"}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="notif-item__icon" style={{ background: t.bg }}>
                      {t.icon}
                    </div>
                    <div>
                      <div className="notif-item__msg">{n.message}</div>
                      <div className="notif-item__time">{n.time}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="notif-footer">Showing your 5 most recent orders →</div>
        </div>
      )}

    </div>
  );
}
