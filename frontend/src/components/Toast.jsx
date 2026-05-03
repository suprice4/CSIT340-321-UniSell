import "../styles/Toast.css";
import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ─── Toast Context ────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconError = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── Toast config ─────────────────────────────────────────────────────────────

const TOAST_CONFIG = {
  success: { bg: "#276749", icon: <IconSuccess />, bar: "#4ade80" },
  error:   { bg: "#9b2c2c", icon: <IconError />,   bar: "#f87171" },
  info:    { bg: "#1e40af", icon: <IconInfo />,    bar: "#60a5fa" },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }) {
  const cfg = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Slide in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Start exit
    const t2 = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration ?? 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const style = {
    wrapper: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      background: cfg.bg,
      color: "white",
      padding: "14px 16px",
      borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      minWidth: "280px",
      maxWidth: "380px",
      position: "relative",
      overflow: "hidden",
      transform: visible && !leaving ? "translateX(0)" : "translateX(110%)",
      opacity: visible && !leaving ? 1 : 0,
      transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
      marginBottom: "10px",
      cursor: "pointer",
    },
    icon: { flexShrink: 0, marginTop: "1px", opacity: 0.9 },
    body: { flex: 1 },
    msg:  { fontSize: "14px", fontWeight: "600", lineHeight: "1.5" },
    sub:  { fontSize: "12px", opacity: 0.8, marginTop: "3px" },
    close: { background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: "0 0 0 8px", flexShrink: 0, lineHeight: 1 },
    bar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      height: "3px",
      background: cfg.bar,
      borderRadius: "0 0 10px 10px",
      animation: `toast-shrink ${toast.duration ?? 3500}ms linear forwards`,
    },
  };

  return (
    <div style={style.wrapper} onClick={dismiss}>
      <span style={style.icon}>{cfg.icon}</span>
      <div style={style.body}>
        <p style={style.msg}>{toast.msg}</p>
        {toast.sub && <p style={style.sub}>{toast.sub}</p>}
      </div>
      <button style={style.close} onClick={(e) => { e.stopPropagation(); dismiss(); }}>
        <IconX />
      </button>
      <div style={style.bar} />
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ msg, sub, type = "success", duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, sub, type, duration }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, sub) => addToast({ msg, sub, type: "success" }),
    error:   (msg, sub) => addToast({ msg, sub, type: "error" }),
    info:    (msg, sub) => addToast({ msg, sub, type: "info" }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div style={{
        position: "fixed", bottom: "24px", right: "24px",
        zIndex: 9999, display: "flex", flexDirection: "column-reverse",
        alignItems: "flex-end",
      }}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
