import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Exportorders.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconFilter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_ORDERS = [
  { id: "#ORD-1041", customer: "Maria Santos",   platform: "Shopee",      product: "Wireless Earbuds",    amount: "850",  status: "Delivered",  date: "2026-03-27" },
  { id: "#ORD-1040", customer: "Juan dela Cruz", platform: "Lazada",      product: "Phone Case Set",      amount: "320",  status: "Shipped",    date: "2026-03-27" },
  { id: "#ORD-1039", customer: "Ana Reyes",      platform: "TikTok Shop", product: "LED Desk Lamp",       amount: "650",  status: "Pending",    date: "2026-03-26" },
  { id: "#ORD-1038", customer: "Carlo Mendoza",  platform: "Shopee",      product: "USB-C Hub",           amount: "1200", status: "Delivered",  date: "2026-03-26" },
  { id: "#ORD-1037", customer: "Lea Villanueva", platform: "Lazada",      product: "Laptop Stand",        amount: "980",  status: "Processing", date: "2026-03-25" },
  { id: "#ORD-1036", customer: "Ryan Torres",    platform: "TikTok Shop", product: "Mechanical Keyboard", amount: "2100", status: "Delivered",  date: "2026-03-25" },
  { id: "#ORD-1035", customer: "Sofia Lim",      platform: "Shopee",      product: "Ring Light",          amount: "750",  status: "Shipped",    date: "2026-03-24" },
  { id: "#ORD-1034", customer: "Marco Aquino",   platform: "Lazada",      product: "Gaming Mouse",        amount: "1450", status: "Cancelled",  date: "2026-03-24" },
];

const STATUS_COLORS = {
  Delivered:  { bg: "#f0fff4", color: "#276749" },
  Shipped:    { bg: "#ebf8ff", color: "#2b6cb0" },
  Pending:    { bg: "#fefce8", color: "#854d0e" },
  Processing: { bg: "#faf5ff", color: "#6b21a8" },
  Cancelled:  { bg: "#fff5f5", color: "#9b2c2c" },
};

const PLATFORM_BADGE = {
  Shopee:        { bg: "#fff1ee", color: "#ee4d2d" },
  Lazada:        { bg: "#eef0ff", color: "#0f146b" },
  "TikTok Shop": { bg: "#f3f3f3", color: "#010101" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExportOrders() {
  const [search, setSearch]                 = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterStatus, setFilterStatus]     = useState("All");
  const [selectedIds, setSelectedIds]       = useState([]);
  const [exportSuccess, setExportSuccess]   = useState(false);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (exportSuccess) {
      const timer = setTimeout(() => setExportSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [exportSuccess]);

  // Filter orders
  const filteredOrders = ALL_ORDERS.filter((order) => {
    const matchesPlatform = filterPlatform === "All" || order.platform === filterPlatform;
    const matchesStatus   = filterStatus   === "All" || order.status   === filterStatus;
    const matchesSearch   =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  // Toggle single row checkbox
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle select all visible rows
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  // Export to CSV — real file download
  const handleExport = () => {
    const toExport = selectedIds.length > 0
      ? filteredOrders.filter((o) => selectedIds.includes(o.id))
      : filteredOrders;

    if (toExport.length === 0) return;

    const headers = ["Order ID", "Customer", "Platform", "Product", "Amount (PHP)", "Status", "Date"];
    const rows    = toExport.map((o) => [o.id, o.customer, o.platform, o.product, o.amount, o.status, o.date]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setSelectedIds([]);
  };

  const allSelected = selectedIds.length === filteredOrders.length && filteredOrders.length > 0;

  const s = {
    page:        { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },
    main:        { padding: "32px 40px", maxWidth: "1200px", margin: "0 auto" },
    pageTitle:   { fontSize: "22px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "4px" },
    pageSub:     { fontSize: "14px", color: "var(--text-muted, #777)", marginBottom: "16px" },
    infoBar:     { background: "#fff5f0", border: "1px solid #e85d0433", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#bf3b00", display: "flex", alignItems: "center", gap: "8px" },
    card:        { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "10px", padding: "20px" },
    topRow:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
    filterRow:   { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
    searchWrap:  { display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", padding: "7px 12px", background: "var(--section-alt-bg, #fafafa)" },
    searchInput: { border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "var(--text-primary, #444)", width: "180px" },
    select:      { fontSize: "13px", padding: "7px 12px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", background: "var(--section-alt-bg, #fafafa)", color: "var(--text-primary, #444)", outline: "none", cursor: "pointer" },
    exportBtn:   (disabled) => ({ display: "flex", alignItems: "center", gap: "6px", background: disabled ? "#ccc" : "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: disabled ? "not-allowed" : "pointer" }),
    table:       { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th:          { padding: "10px 14px", textAlign: "left", fontWeight: "600", color: "var(--text-muted, #888)", borderBottom: "1px solid var(--border-color, #f0f0f0)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" },
    td:          { padding: "12px 14px", borderBottom: "1px solid var(--border-color, #f7f7f7)", color: "var(--text-primary, #333)" },
    badge:       (bg, color) => ({ display: "inline-block", background: bg, color, padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }),
    selectedRow: { background: "#fff8f5" },
    summaryBar:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", fontSize: "13px", color: "var(--text-muted, #888)", flexWrap: "wrap", gap: "8px" },
    toast:       { position: "fixed", bottom: "24px", right: "24px", background: "#276749", color: "white", padding: "12px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", zIndex: 300, display: "flex", alignItems: "center", gap: "8px" },
  };

  return (
    <div style={s.page}>

      {/* ── SHARED NAVBAR — Orders is the active page ── */}
      <Navbar activePage="/orders" />

      {/* MAIN CONTENT */}
      <div style={s.main}>
        <h2 style={s.pageTitle}>Export Orders to CSV</h2>
        <p style={s.pageSub}>Filter, select, and download your orders as a spreadsheet file.</p>

        <div style={s.infoBar}>
          <IconFilter />
          <span>Filter orders first, then select specific rows to export — or export all filtered results at once.</span>
        </div>

        <div style={s.card}>
          {/* Top Row */}
          <div style={s.topRow}>
            <div style={s.filterRow}>
              <div style={s.searchWrap}>
                <IconSearch />
                <input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} style={s.searchInput} />
              </div>
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} style={s.select}>
                <option value="All">All Platforms</option>
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
                <option value="TikTok Shop">TikTok Shop</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={s.select}>
                <option value="All">All Status</option>
                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <button
              style={s.exportBtn(filteredOrders.length === 0)}
              onClick={handleExport}
              disabled={filteredOrders.length === 0}
            >
              <IconDownload />
              {selectedIds.length > 0
                ? `Export Selected (${selectedIds.length})`
                : `Export All (${filteredOrders.length})`}
            </button>
          </div>

          {/* Table */}
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} title="Select All" />
                </th>
                {["Order ID", "Customer", "Platform", "Product", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                return (
                  <tr key={order.id} style={isSelected ? s.selectedRow : {}}>
                    <td style={s.td}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(order.id)} />
                    </td>
                    <td style={{ ...s.td, fontWeight: "600", color: "#e85d04" }}>{order.id}</td>
                    <td style={s.td}>{order.customer}</td>
                    <td style={s.td}><span style={s.badge(PLATFORM_BADGE[order.platform]?.bg, PLATFORM_BADGE[order.platform]?.color)}>{order.platform}</span></td>
                    <td style={s.td}>{order.product}</td>
                    <td style={{ ...s.td, fontWeight: "600" }}>₱{Number(order.amount).toLocaleString()}</td>
                    <td style={s.td}><span style={s.badge(STATUS_COLORS[order.status]?.bg, STATUS_COLORS[order.status]?.color)}>{order.status}</span></td>
                    <td style={{ ...s.td, color: "var(--text-muted, #888)" }}>{order.date}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted, #aaa)", fontSize: "14px" }}>No orders found.</td></tr>
              )}
            </tbody>
          </table>

          {/* Summary Bar */}
          <div style={s.summaryBar}>
            <span>{filteredOrders.length} orders shown · {selectedIds.length} selected</span>
            {selectedIds.length > 0 && (
              <button onClick={() => setSelectedIds([])} style={{ background: "none", border: "none", color: "#e85d04", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                Clear Selection
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {exportSuccess && (
        <div style={s.toast}>
          <IconCheck /> CSV downloaded successfully!
        </div>
      )}

      {/* FOOTER */}
      {/* ── SHARED FOOTER ── */}
      <Footer />

    </div>
  );
}