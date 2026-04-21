import { useState, useRef, useEffect } from "react";

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "order",   message: "New order #ORD-1042 from Maria Santos",   time: "2 min ago",  read: false },
  { id: 2, type: "ship",    message: "Order #ORD-1038 has been shipped",         time: "15 min ago", read: false },
  { id: 3, type: "alert",   message: "Low stock alert: Wireless Earbuds (3 left)", time: "1 hr ago", read: false },
  { id: 4, type: "order",   message: "New order #ORD-1041 from Juan dela Cruz",  time: "2 hr ago",  read: true  },
  { id: 5, type: "success", message: "Payment confirmed for #ORD-1039",          time: "3 hr ago",  read: true  },
];

const TYPE_ICONS = {
  order:   { icon: "🛒", bg: "#fff1ee", accent: "#e85d04" },
  ship:    { icon: "📦", bg: "#ebf8ff", accent: "#2563eb" },
  alert:   { icon: "⚠️", bg: "#fefce8", accent: "#ca8a04" },
  success: { icon: "✅", bg: "#f0fff4", accent: "#16a34a" },
};

export default function NotificationBell() {
  const [open, setOpen]               = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const ref = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead    = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const s = {
    wrap: { position: "relative" },
    btn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      position: "relative",
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--nav-icon-color, #555)",
      transition: "background 0.2s",
    },
    badge: {
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: "#e85d04",
      color: "#fff",
      fontSize: "10px",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
    },
    dropdown: {
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      width: "320px",
      background: "var(--card-bg, #fff)",
      border: "1px solid var(--border-color, #e0e0e0)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      zIndex: 1000,
      overflow: "hidden",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 16px 10px",
      borderBottom: "1px solid var(--border-color, #f0f0f0)",
    },
    headerTitle: { fontSize: "14px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)" },
    markBtn: {
      fontSize: "12px",
      color: "#e85d04",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      padding: 0,
    },
    list: { maxHeight: "300px", overflowY: "auto" },
    item: (read) => ({
      display: "flex",
      gap: "10px",
      padding: "12px 16px",
      background: read ? "transparent" : "var(--notif-unread-bg, #fff8f5)",
      borderBottom: "1px solid var(--border-color, #f5f5f5)",
      cursor: "pointer",
      transition: "background 0.2s",
    }),
    iconBox: (bg) => ({
      width: "34px", height: "34px", borderRadius: "50%",
      background: bg, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: "15px", flexShrink: 0,
    }),
    msgText: { fontSize: "13px", color: "var(--text-primary, #222)", lineHeight: "1.4", marginBottom: "3px" },
    timeText: { fontSize: "11px", color: "var(--text-muted, #999)" },
    emptyState: { padding: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-muted, #aaa)" },
    footer: {
      padding: "10px 16px",
      textAlign: "center",
      borderTop: "1px solid var(--border-color, #f0f0f0)",
      fontSize: "12px",
      color: "#e85d04",
      fontWeight: "600",
      cursor: "pointer",
    },
  };

  return (
    <div style={s.wrap} ref={ref}>
      <button style={s.btn} onClick={() => setOpen((o) => !o)} title="Notifications" aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && <span style={s.badge}>{unread}</span>}
      </button>

      {open && (
        <div style={s.dropdown}>
          <div style={s.header}>
            <span style={s.headerTitle}>Notifications {unread > 0 && `(${unread})`}</span>
            {unread > 0 && <button style={s.markBtn} onClick={markAllRead}>Mark all read</button>}
          </div>

          <div style={s.list}>
            {notifications.length === 0 ? (
              <div style={s.emptyState}>🎉 You're all caught up!</div>
            ) : (
              notifications.map((n) => {
                const t = TYPE_ICONS[n.type] || TYPE_ICONS.order;
                return (
                  <div key={n.id} style={s.item(n.read)} onClick={() => markRead(n.id)}>
                    <div style={s.iconBox(t.bg)}>{t.icon}</div>
                    <div>
                      <div style={s.msgText}>{n.message}</div>
                      <div style={s.timeText}>{n.time}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={s.footer}>View all notifications →</div>
        </div>
      )}
    </div>
  );
}
