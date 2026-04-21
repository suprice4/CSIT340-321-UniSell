import { useState, useRef, useEffect } from "react";
import "../styles/NotificationBell.css";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "order",   message: "New order #ORD-1042 from Maria Santos",      time: "2 min ago",  read: false },
  { id: 2, type: "ship",    message: "Order #ORD-1038 has been shipped",            time: "15 min ago", read: false },
  { id: 3, type: "alert",   message: "Low stock alert: Wireless Earbuds (3 left)",  time: "1 hr ago",   read: false },
  { id: 4, type: "order",   message: "New order #ORD-1041 from Juan dela Cruz",     time: "2 hr ago",   read: true  },
  { id: 5, type: "success", message: "Payment confirmed for #ORD-1039",             time: "3 hr ago",   read: true  },
];

const TYPE_ICONS = {
  order:   { icon: "🛒", bg: "#fff1ee" },
  ship:    { icon: "📦", bg: "#ebf8ff" },
  alert:   { icon: "⚠️", bg: "#fefce8" },
  success: { icon: "✅", bg: "#f0fff4" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const [open, setOpen]                   = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <div className="notif-wrap" ref={ref}>

      {/* ── Bell Button ── */}
      <button
        className="notif-btn"
        onClick={() => setOpen((o) => !o)}
        title="Notifications"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {/* ── Dropdown ── */}
      {open && (
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

          <div className="notif-footer">View all notifications →</div>

        </div>
      )}

    </div>
  );
}
