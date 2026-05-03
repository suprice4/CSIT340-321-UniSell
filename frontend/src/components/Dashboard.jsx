import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useToast } from "./Toast";
import "../styles/Dashboard.css";

import { IconTrendUp, IconRevenue, IconOrders, IconBox, IconCustomers, IconSearch, IconExternalLink } from "./Icons";

const CHART_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
const CHART_SERIES = {
  Shopee:        [82000, 95000, 78000, 101000, 118200, 124000],
  Lazada:        [61000, 74000, 58000,  80000,  96700, 103000],
  "TikTok Shop": [38000, 52000, 45000,  56000,  69600,  78000],
};
const PLATFORM_LINE_COLORS = {
  Shopee: "#ee4d2d", Lazada: "#0f146b", "TikTok Shop": "#888",
};
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
  "TikTok Shop": { bg: "#f3f3f3", color: "#555" },
};
const PLATFORM_FILTERS = ["All", "Shopee", "Lazada", "TikTok Shop"];
const TAB_COLORS = { All: "#e85d04", Shopee: "#ee4d2d", Lazada: "#0f146b", "TikTok Shop": "#555" };
const ORDERS_PER_PAGE = 5;

function RevenueChart({ activePlatform }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 680, H = 200;
  const pad = { top: 16, right: 16, bottom: 34, left: 58 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const showAll   = activePlatform === "All";
  const platforms = showAll ? ["Shopee", "Lazada", "TikTok Shop"] : [activePlatform];

  let maxVal = 0;
  platforms.forEach((pl) => { const m = Math.max(...CHART_SERIES[pl]); if (m > maxVal) maxVal = m; });
  maxVal = Math.ceil(maxVal / 50000) * 50000;

  const toX = (i) => pad.left + (i / (CHART_MONTHS.length - 1)) * cW;
  const toY = (v) => pad.top + cH - (v / maxVal) * cH;

  const smooth = (pts) => {
    if (!pts.length) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i];
      const mx = (px + cx) / 2;
      d += ` C${mx},${py} ${mx},${cy} ${cx},${cy}`;
    }
    return d;
  };

  const area = (pts) => {
    const line = smooth(pts);
    if (!line) return "";
    return `${line} L${pts[pts.length - 1][0]},${pad.top + cH} L${pts[0][0]},${pad.top + cH} Z`;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const fmtK   = (v) => v >= 1000 ? `₱${(v / 1000).toFixed(0)}k` : `₱${v}`;

  const seriesData = platforms.map((pl) => ({
    name: pl, color: PLATFORM_LINE_COLORS[pl],
    pts: CHART_SERIES[pl].map((v, i) => [toX(i), toY(v)]),
    values: CHART_SERIES[pl],
  }));

  return (
    <div className="revenue-chart">
      <style>{`@keyframes dash{from{stroke-dashoffset:800}to{stroke-dashoffset:0}}`}</style>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          {seriesData.map((s) => (
            <linearGradient key={s.name} id={`g-${s.name.replace(/\s/g,"")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={s.color} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={s.color} stopOpacity="0"/>
            </linearGradient>
          ))}
        </defs>
        {yTicks.map((f) => {
          const v = maxVal * f, y = toY(v);
          return (
            <g key={f}>
              <line x1={pad.left} y1={y} x2={W - pad.right} y2={y}
                stroke={f === 0 ? "#ddd" : "#f0f0f0"} strokeWidth="1"
                strokeDasharray={f === 0 ? undefined : "4,4"} />
              <text x={pad.left - 6} y={y + 4} fontSize="10" fill="#bbb" textAnchor="end">{fmtK(v)}</text>
            </g>
          );
        })}
        {seriesData.map((s) => (
          <path key={`a-${s.name}`} d={area(s.pts)} fill={`url(#g-${s.name.replace(/\s/g,"")})`} />
        ))}
        {seriesData.map((s) => (
          <path key={`l-${s.name}`} d={smooth(s.pts)} fill="none" stroke={s.color} strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="800" strokeDashoffset="0"
            style={{ animation: "dash 1s ease forwards" }} />
        ))}
        {seriesData.map((s) =>
          s.pts.map(([x, y], i) => (
            <g key={`d-${s.name}-${i}`}>
              <circle cx={x} cy={y} r="3.5" fill={s.color} stroke="white" strokeWidth="2"/>
              <circle cx={x} cy={y} r="14" fill="transparent"
                onMouseEnter={() => setTooltip({ x, y, name: s.name, val: s.values[i], month: CHART_MONTHS[i] })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "crosshair" }} />
            </g>
          ))
        )}
        {CHART_MONTHS.map((m, i) => (
          <text key={m} x={toX(i)} y={H - 6} fontSize="11" fill="#aaa" textAnchor="middle">{m}</text>
        ))}
        {tooltip && (
          <g>
            <rect x={Math.min(tooltip.x + 10, W - 125)} y={tooltip.y - 30} width="115" height="34"
              rx="6" fill="rgba(15,25,35,0.88)" />
            <text x={Math.min(tooltip.x + 10, W - 125) + 8} y={tooltip.y - 14} fontSize="11" fill="white" fontWeight="600">
              {tooltip.month} · {tooltip.name}
            </text>
            <text x={Math.min(tooltip.x + 10, W - 125) + 8} y={tooltip.y} fontSize="12" fill="#fbbf24" fontWeight="700">
              ₱{tooltip.val.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
      {showAll && (
        <div className="revenue-chart__legend">
          {seriesData.map((s) => (
            <div key={s.name} className="revenue-chart__legend-item">
              <div className="revenue-chart__legend-line" style={{ background: s.color }} />
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const toast    = useToast();

  const [activePlatformFilter, setActivePlatformFilter] = useState("All");
  const [searchQuery, setSearchQuery]   = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage]   = useState(1);
  const [greeting, setGreeting]         = useState("");
  const [chartPlatform, setChartPlatform] = useState("All");
  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then(res => res.json()).then(data => setOrders(data))
      .catch(err => console.error("Failed to fetch orders:", err));
    fetch("http://localhost:8080/api/products")
      .then(res => res.json()).then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const totalRevenue  = orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const totalOrders   = orders.length;
  const totalProducts = products.length;

  const shopeeOrders  = orders.filter(o => o.platform === "Shopee");
  const lazadaOrders  = orders.filter(o => o.platform === "Lazada");
  const tiktokOrders  = orders.filter(o => o.platform === "TikTok Shop");

  const shopeeRevenue = shopeeOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const lazadaRevenue = lazadaOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const tiktokRevenue = tiktokOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

  const getTopProduct = (platformOrders) => {
    if (!platformOrders.length) return "N/A";
    const freq = {};
    platformOrders.forEach(o => { freq[o.product] = (freq[o.product] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  };

  const SUMMARY_CARDS = [
    { label: "Total Revenue",   value: `₱${totalRevenue.toLocaleString()}`,  change: "+12.4%", icon: <IconRevenue />,   color: "#e85d04" },
    { label: "Total Orders",    value: totalOrders.toLocaleString(),          change: "+8.1%",  icon: <IconOrders />,    color: "#2563eb" },
    { label: "Products Sold",   value: totalProducts.toLocaleString(),        change: "+5.3%",  icon: <IconBox />,       color: "#16a34a" },
    { label: "Total Customers", value: [...new Set(orders.map(o => o.customer))].length.toLocaleString(), change: "+3.7%", icon: <IconCustomers />, color: "#9333ea" },
  ];

  const PLATFORM_DATA = [
    { name: "Shopee",      color: "#ee4d2d", orders: shopeeOrders.length, revenue: `₱${shopeeRevenue.toLocaleString()}`, growth: "+14.2%", topProduct: getTopProduct(shopeeOrders),  status: "Active" },
    { name: "Lazada",      color: "#0f146b", orders: lazadaOrders.length, revenue: `₱${lazadaRevenue.toLocaleString()}`, growth: "+9.8%",  topProduct: getTopProduct(lazadaOrders),  status: "Active" },
    { name: "TikTok Shop", color: "#555555", orders: tiktokOrders.length, revenue: `₱${tiktokRevenue.toLocaleString()}`, growth: "+18.5%", topProduct: getTopProduct(tiktokOrders),  status: "Active" },
  ];

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => { setCurrentPage(1); }, [activePlatformFilter, filterStatus, searchQuery]);

  const visiblePlatforms = activePlatformFilter === "All"
    ? PLATFORM_DATA
    : PLATFORM_DATA.filter((p) => p.name === activePlatformFilter);

  const filteredOrders = orders.filter((order) => {
    const matchPlatform = activePlatformFilter === "All" || order.platform === activePlatformFilter;
    const matchStatus   = filterStatus === "All" || order.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      order.customer.toLowerCase().includes(q) ||
      String(order.id).includes(q) ||
      order.product.toLowerCase().includes(q) ||
      order.platform.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q) ||
      String(order.amount).includes(q);
    return matchPlatform && matchStatus && matchSearch;
  });

  const totalPages      = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handleProductLink = (productName) => {
    navigate(`/products?search=${encodeURIComponent(productName)}`);
    toast.info(`Navigating to product: ${productName}`);
  };

  const statusClass   = (s) => `badge badge--${s.toLowerCase()}`;
  const platformClass = (p) => {
    const map = { Shopee: "shopee", Lazada: "lazada", "TikTok Shop": "tiktok" };
    return `badge badge--${map[p] || ""}`;
  };

  return (
    <div className="dashboard-page">
      <Navbar activePage="/dashboard" />
      <div className="dashboard-main">

        {/* Greeting */}
        <div className="dashboard-greeting">
          <h2 className="dashboard-greeting__title">{greeting}, Admin 👋</h2>
          <p className="dashboard-greeting__sub">Here's what's happening across your platforms today.</p>
        </div>

        {/* Summary Cards */}
        <p className="dashboard-section-title">Sales Overview</p>
        <div className="dashboard-cards-grid">
          {SUMMARY_CARDS.map((card) => (
            <div key={card.label} className="dashboard-summary-card" style={{ borderTop: `3px solid ${card.color}` }}>
              <div className="dashboard-summary-card__top">
                <span className="dashboard-summary-card__label">{card.label}</span>
                <div className="dashboard-summary-card__icon" style={{ background: card.color + "18", color: card.color }}>
                  {card.icon}
                </div>
              </div>
              <div className="dashboard-summary-card__value">{card.value}</div>
              <div className="dashboard-summary-card__change"><IconTrendUp />{card.change} this month</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="dashboard-chart-card" style={{ background: "var(--card-bg,#fff)", border: "1px solid var(--border-color,#e0e0e0)", borderRadius: "10px", padding: "20px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <p className="dashboard-section-title" style={{ margin: 0 }}>Revenue Trend (6 months)</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["All", "Shopee", "Lazada", "TikTok Shop"].map((p) => (
                <button key={p}
                  className={`dashboard-chart-tab${chartPlatform === p ? " active" : ""}`}
                  style={{ padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: "1px solid var(--border-color,#ddd)", background: chartPlatform === p ? "#e85d04" : "var(--card-bg,#fff)", color: chartPlatform === p ? "white" : "var(--text-muted,#555)" }}
                  onClick={() => setChartPlatform(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <RevenueChart activePlatform={chartPlatform} />
        </div>

        {/* Platform Filter + Breakdown */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
          <p className="dashboard-section-title" style={{ margin: 0 }}>Platform Breakdown</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {PLATFORM_FILTERS.map((pf) => (
              <button key={pf}
                style={{ padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", border: `2px solid ${activePlatformFilter === pf ? TAB_COLORS[pf] : "var(--border-color,#ddd)"}`, background: activePlatformFilter === pf ? TAB_COLORS[pf] : "var(--card-bg,#fff)", color: activePlatformFilter === pf ? "white" : "var(--text-muted,#555)" }}
                onClick={() => setActivePlatformFilter(pf)}>
                {pf}
              </button>
            ))}
          </div>
        </div>
        <div className="dashboard-platform-grid" style={{ gridTemplateColumns: visiblePlatforms.length === 1 ? "minmax(0,400px)" : "repeat(3,1fr)" }}>
          {visiblePlatforms.map((p) => (
            <div key={p.name} className="dashboard-platform-card" style={{ borderTop: `3px solid ${p.color}` }}>
              <div className="dashboard-platform-card__header">
                <span style={{ fontSize: "16px", fontWeight: "700", color: p.color }}>{p.name}</span>
                <span className="dashboard-platform-card__badge">{p.status}</span>
              </div>
              <div className="dashboard-platform-card__row"><span>Total Orders</span><span className="dashboard-platform-card__val">{p.orders}</span></div>
              <div className="dashboard-platform-card__row"><span>Revenue</span><span className="dashboard-platform-card__val">{p.revenue}</span></div>
              <div className="dashboard-platform-card__row">
                <span>Top Product</span>
                <button className="dashboard-product-link" onClick={() => handleProductLink(p.topProduct)} title={`View ${p.topProduct} in Products`}>
                  {p.topProduct}&nbsp;<IconExternalLink />
                </button>
              </div>
              <div className="dashboard-platform-card__growth"><IconTrendUp />{p.growth} vs last month</div>
            </div>
          ))}
        </div>

        {/* Recent Orders Table */}
        <div className="dashboard-table-card">
          <div className="dashboard-table-top">
            <p className="dashboard-section-title" style={{ margin: 0 }}>Recent Orders</p>
            <div className="dashboard-filter-row">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--border-color,#ddd)", borderRadius: "6px", padding: "7px 12px", background: "var(--section-alt-bg,#fafafa)" }}>
                <IconSearch />
                <input className="dashboard-order-search" type="text" placeholder="Search orders…"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="dashboard-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                {["Delivered", "Shipped", "Pending", "Processing", "Cancelled"].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="dashboard-table">
            <thead>
              <tr>
                {["Order ID", "Customer", "Platform", "Product", "Amount", "Status", "Date"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>{order.customer}</td>
                  <td><span className={platformClass(order.platform)}>{order.platform}</span></td>
                  <td>
                    <button className="dashboard-product-link" onClick={() => handleProductLink(order.product)} title="View in Products">
                      {order.product}&nbsp;<IconExternalLink />
                    </button>
                  </td>
                  <td className="amount">₱{Number(order.amount).toLocaleString()}</td>
                  <td><span className={statusClass(order.status)}>{order.status}</span></td>
                  <td className="date-cell">{order.date}</td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="empty-row">No orders match your filters.</td></tr>
              )}
            </tbody>
          </table>

          <div className="dashboard-pagination">
            <span>
              Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * ORDERS_PER_PAGE + 1}–
              {Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button key={pg} className={`dashboard-page-btn${currentPage === pg ? " active" : ""}`}
                  onClick={() => setCurrentPage(pg)}>{pg}</button>
              ))}
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
