import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("darkMode", "true");
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("darkMode", "false");
    }
  }, [dark]);

  const s = {
    btn: {
      position: "relative",
      width: "48px",
      height: "26px",
      borderRadius: "13px",
      border: "none",
      cursor: "pointer",
      background: dark ? "#e85d04" : "#d1d5db",
      transition: "background 0.3s ease",
      padding: 0,
      flexShrink: 0,
    },
    knob: {
      position: "absolute",
      top: "3px",
      left: dark ? "25px" : "3px",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      background: "#fff",
      transition: "left 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
    },
  };

  return (
    <button style={s.btn} onClick={() => setDark((d) => !d)} title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"} aria-label="Toggle dark mode">
      <span style={s.knob}>{dark ? "🌙" : "☀️"}</span>
    </button>
  );
}
