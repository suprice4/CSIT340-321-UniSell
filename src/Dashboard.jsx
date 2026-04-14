import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const IconAccount = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconTrendUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconRevenue = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const IconOrders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);
const IconBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconCustomers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);


const SUMMARY_CARDS = [
  { label: "Total Revenue",    value: "₱284,500", change: "+12.4%", icon: <IconRevenue />,   color: "#e85d04" },
  { label: "Total Orders",     value: "1,340",    change: "+8.1%",  icon: <IconOrders />,    color: "#2563eb" },
  { label: "Products Sold",    value: "3,892",    change: "+5.3%",  icon: <IconBox />,       color: "#16a34a" },
  { label: "Total Customers",  value: "876",      change: "+3.7%",  icon: <IconCustomers />, color: "#9333ea" },
];

const PLATFORM_DATA = [
  { name: "Shopee",      color: "#ee4d2d", orders: 580, revenue: "₱118,200", growth: "+14.2%", topProduct: "Wireless Earbuds", status: "Active" },
  { name: "Lazada",      color: "#0f146b", orders: 420, revenue: "₱96,700",  growth: "+9.8%",  topProduct: "Phone Case Set",   status: "Active" },
  { name: "TikTok Shop", color: "#010101", orders: 340, revenue: "₱69,600",  growth: "+18.5%", topProduct: "LED Desk Lamp",    status: "Active" },
];

const RECENT_ORDERS = [
  { id: "#ORD-1041", customer: "Maria Santos",    platform: "Shopee",      product: "Wireless Earbuds",    amount: "₱850",   status: "Delivered",  date: "Mar 27, 2026" },
  { id: "#ORD-1040", customer: "Juan dela Cruz",  platform: "Lazada",      product: "Phone Case Set",      amount: "₱320",   status: "Shipped",    date: "Mar 27, 2026" },
  { id: "#ORD-1039", customer: "Ana Reyes",       platform: "TikTok Shop", product: "LED Desk Lamp",       amount: "₱650",   status: "Pending",    date: "Mar 26, 2026" },
  { id: "#ORD-1038", customer: "Carlo Mendoza",   platform: "Shopee",      product: "USB-C Hub",           amount: "₱1,200", status: "Delivered",  date: "Mar 26, 2026" },
  { id: "#ORD-1037", customer: "Lea Villanueva",  platform: "Lazada",      product: "Laptop Stand",        amount: "₱980",   status: "Processing", date: "Mar 25, 2026" },
  { id: "#ORD-1036", customer: "Ryan Torres",     platform: "TikTok Shop", product: "Mechanical Keyboard", amount: "₱2,100", status: "Delivered",  date: "Mar 25, 2026" },
  { id: "#ORD-1035", customer: "Sofia Lim",       platform: "Shopee",      product: "Ring Light",          amount: "₱750",   status: "Shipped",    date: "Mar 24, 2026" },
  { id: "#ORD-1034", customer: "Marco Aquino",    platform: "Lazada",      product: "Gaming Mouse",        amount: "₱1,450", status: "Cancelled",  date: "Mar 24, 2026" },
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

const NAV_LINKS = [
  { label: "Home", route: "/" },
  { label: "Products", route: null },
  { label: "Dashboard", route: "/dashboard" },
  { label: "Orders", route: null },
  { label: "About Us", route: "/about" },
  { label: "Contact Us", route: "/contact" },
];
const ORDERS_PER_PAGE = 5;


export default function Dashboard() {
  const navigate = useNavigate();

  const [activeNav, setActiveNav]       = useState("Dashboard");
  const [searchQuery, setSearchQuery]   = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage]   = useState(1);
  const [greeting, setGreeting]         = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)      setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else                setGreeting("Good evening");
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterPlatform, filterStatus, searchQuery]);

  const filteredOrders = RECENT_ORDERS.filter((order) => {
    const matchesPlatform = filterPlatform === "All" || order.platform === filterPlatform;
    const matchesStatus   = filterStatus   === "All" || order.status   === filterStatus;
    const matchesSearch   =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const totalPages      = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );


  const s = {
    page:       { fontFamily: "'Segoe UI', sans-serif", background: "#f5f5f5", color: "#222", minHeight: "100vh" },
    topNav:     { background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logoArea:   { display: "flex", alignItems: "center", gap: "10px" },
    logoCircle: { width: "44px", height: "44px", background: "#e85d04", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "white", flexShrink: 0 },
    logoText:   { fontSize: "12px", fontWeight: "700", color: "#e85d04", lineHeight: "1.3", textTransform: "uppercase" },
    searchBar:  { flex: 1, maxWidth: "480px", margin: "0 24px", display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", padding: "8px 14px", gap: "8px" },
    searchInput:{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "#444" },
    topNavRight:{ display: "flex", gap: "16px", alignItems: "center" },
    iconBtn:    { display: "flex", flexDirection: "column", alignItems: "center", fontSize: "11px", color: "#555", gap: "2px", cursor: "pointer", background: "none", border: "none" },
    logoutBtn:  { display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#e85d04", fontWeight: "600", cursor: "pointer", background: "none", border: "1px solid #e85d04", borderRadius: "6px", padding: "6px 14px" },
    mainNav:    { background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 40px", display: "flex", gap: "32px" },
    navBtn:     (active) => ({ display: "block", padding: "14px 0", fontSize: "15px", fontWeight: "500", color: active ? "#e85d04" : "#333", cursor: "pointer", background: "none", border: "none", borderBottom: active ? "2px solid #e85d04" : "2px solid transparent" }),
    main:       { padding: "32px 40px", maxWidth: "1200px", margin: "0 auto" },
    sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#222", marginBottom: "16px" },
    cardsGrid:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" },
    summaryCard:(accent) => ({ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", borderTop: `3px solid ${accent}` }),
    cardTop:    { display: "flex", alignItems: "center", justifyContent: "space-between" },
    cardLabel:  { fontSize: "13px", color: "#888", fontWeight: "500" },
    cardIcon:   (color) => ({ width: "36px", height: "36px", borderRadius: "50%", background: color + "18", color, display: "flex", alignItems: "center", justifyContent: "center" }),
    cardValue:  { fontSize: "24px", fontWeight: "700", color: "#1a1a1a" },
    cardChange: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#16a34a" },
    platGrid:   { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" },
    platCard:   (color) => ({ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px", borderTop: `3px solid ${color}` }),
    platHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" },
    platName:   (color) => ({ fontSize: "16px", fontWeight: "700", color }),
    platBadge:  { fontSize: "11px", background: "#f0fff4", color: "#276749", padding: "3px 10px", borderRadius: "12px", fontWeight: "600" },
    platRow:    { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#555", marginBottom: "8px" },
    platVal:    { fontWeight: "600", color: "#222" },
    platGrowth: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#16a34a", marginTop: "10px", fontWeight: "600" },
    tableCard:  { background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px" },
    tableTop:   { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
    filterRow:  { display: "flex", gap: "10px", flexWrap: "wrap" },
    filterSel:  { fontSize: "13px", padding: "7px 12px", border: "1px solid #ddd", borderRadius: "6px", background: "#fafafa", color: "#444", outline: "none", cursor: "pointer" },
    orderSearch:{ fontSize: "13px", padding: "7px 12px", border: "1px solid #ddd", borderRadius: "6px", background: "#fafafa", color: "#444", outline: "none", width: "200px" },
    table:      { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th:         { padding: "10px 14px", textAlign: "left", fontWeight: "600", color: "#888", borderBottom: "1px solid #f0f0f0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" },
    td:         { padding: "12px 14px", borderBottom: "1px solid #f7f7f7", color: "#333" },
    badge:      (bg, color) => ({ display: "inline-block", background: bg, color, padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }),
    pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", fontSize: "13px", color: "#888" },
    pageBtn:    (active) => ({ padding: "5px 11px", borderRadius: "6px", border: "1px solid #ddd", background: active ? "#e85d04" : "#fff", color: active ? "#fff" : "#555", cursor: "pointer", fontSize: "13px", fontWeight: active ? "600" : "400", marginLeft: "4px" }),
    emptyRow:   { textAlign: "center", padding: "32px", color: "#aaa", fontSize: "14px" },
    footer:     { background: "#0f1923", color: "#ccc", padding: "24px 40px", marginTop: "40px" },
    footerBottom:{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#666" },
  };


  return (
    <div style={s.page}>

      <Navbar activePage="/dashboard" />

      <div style={s.main}>

        <div style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a1a", marginBottom: "4px" }}>{greeting}, Admin 👋</h2>
          <p style={{ fontSize: "14px", color: "#777" }}>Here's what's happening across your platforms today.</p>
        </div>

        <p style={s.sectionTitle}>Sales Overview</p>
        <div style={s.cardsGrid}>
          {SUMMARY_CARDS.map((card) => (
            <div key={card.label} style={s.summaryCard(card.color)}>
              <div style={s.cardTop}>
                <span style={s.cardLabel}>{card.label}</span>
                <div style={s.cardIcon(card.color)}>{card.icon}</div>
              </div>
              <div style={s.cardValue}>{card.value}</div>
              <div style={s.cardChange}><IconTrendUp />{card.change} this month</div>
            </div>
          ))}
        </div>

        <p style={s.sectionTitle}>Platform Breakdown</p>
        <div style={s.platGrid}>
          {PLATFORM_DATA.map((p) => (
            <div key={p.name} style={s.platCard(p.color)}>
              <div style={s.platHeader}>
                <span style={s.platName(p.color)}>{p.name}</span>
                <span style={s.platBadge}>{p.status}</span>
              </div>
              <div style={s.platRow}><span>Total Orders</span><span style={s.platVal}>{p.orders}</span></div>
              <div style={s.platRow}><span>Revenue</span><span style={s.platVal}>{p.revenue}</span></div>
              <div style={s.platRow}><span>Top Product</span><span style={s.platVal}>{p.topProduct}</span></div>
              <div style={s.platGrowth}><IconTrendUp />{p.growth} vs last month</div>
            </div>
          ))}
        </div>

        <div style={s.tableCard}>
          <div style={s.tableTop}>
            <p style={{ ...s.sectionTitle, marginBottom: 0 }}>Recent Orders</p>
            <div style={s.filterRow}>
              <input type="text" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={s.orderSearch} />
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} style={s.filterSel}>
                <option value="All">All Platforms</option>
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
                <option value="TikTok Shop">TikTok Shop</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={s.filterSel}>
                <option value="All">All Status</option>
                <option value="Delivered">Delivered</option>
                <option value="Shipped">Shipped</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <table style={s.table}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Platform", "Product", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ ...s.td, fontWeight: "600", color: "#e85d04" }}>{order.id}</td>
                    <td style={s.td}>{order.customer}</td>
                    <td style={s.td}><span style={s.badge(PLATFORM_BADGE[order.platform]?.bg, PLATFORM_BADGE[order.platform]?.color)}>{order.platform}</span></td>
                    <td style={s.td}>{order.product}</td>
                    <td style={{ ...s.td, fontWeight: "600" }}>{order.amount}</td>
                    <td style={s.td}><span style={s.badge(STATUS_COLORS[order.status]?.bg, STATUS_COLORS[order.status]?.color)}>{order.status}</span></td>
                    <td style={{ ...s.td, color: "#888" }}>{order.date}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} style={s.emptyRow}>No orders found.</td></tr>
              )}
            </tbody>
          </table>

          <div style={s.pagination}>
            <span>
              Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1}–{Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} style={s.pageBtn(currentPage === page)} onClick={() => setCurrentPage(page)}>{page}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer style={s.footer}>
        <div style={s.footerBottom}>
          <span>© 2026 E-Commerce Marketplace. All rights reserved.</span>
          <div>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
              <a key={l} href="#" style={{ color: "#666", textDecoration: "none", marginLeft: "16px" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}