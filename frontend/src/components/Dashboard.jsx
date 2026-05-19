import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useToast } from "./Toast";
import "../styles/Dashboard.css";

import { IconTrendUp, IconRevenue, IconOrders, IconBox, IconCustomers, IconSearch, IconExternalLink, IconChart } from "./Icons";
import API_BASE from "../Config";

const PLATFORM_LINE_COLORS = {
  Shopee: "#ee4d2d", Lazada: "#0f146b", "TikTok Shop": "#888",
};
const PLATFORM_TAB_COLOR_BASE = { All: "#e85d04", Shopee: "#ee4d2d", Lazada: "#0f146b", "TikTok Shop": "#555" };
const ORDERS_PER_PAGE = 5;

function getPlatformColor(name) {
  return PLATFORM_LINE_COLORS[name] || "#888";
}
function getPlatformTabColor(name) {
  return PLATFORM_TAB_COLOR_BASE[name] || "#e85d04";
}

// Returns the last N months as short labels (e.g. "Jan", "Feb")
function getLastNMonths(n) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const result = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ label: months[d.getMonth()], year: d.getFullYear(), month: d.getMonth() });
  }
  return result;
}

// Build chart series from real order data
function buildChartSeries(orders, platformNames) {
  const monthBuckets = getLastNMonths(6);
  const series = {};
  platformNames.forEach(p => {
    series[p] = monthBuckets.map(({ year, month }) => {
      return orders
        .filter(o => {
          if (o.platform !== p) return false;
          const d = new Date(o.date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, o) => sum + Number(o.amount || 0), 0);
    });
  });
  return { series, labels: monthBuckets.map(m => m.label) };
}

function RevenueChart({ activePlatform, chartData }) {
  const [tooltip, setTooltip] = useState(null);
  const W = 680, H = 200;
  const pad = { top: 16, right: 16, bottom: 34, left: 58 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const { series, labels } = chartData;
  const showAll   = activePlatform === "All";
  const platforms = showAll ? Object.keys(series) : [activePlatform];

  let maxVal = 0;
  platforms.forEach((pl) => {
    if (!series[pl]) return;
    const m = Math.max(...series[pl]);
    if (m > maxVal) maxVal = m;
  });
  maxVal = Math.ceil((maxVal || 1) / 50000) * 50000 || 50000;

  const toX = (i) => pad.left + (i / Math.max(labels.length - 1, 1)) * cW;
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

  const seriesData = platforms
    .filter(pl => series[pl])
    .map((pl) => ({
      name: pl, color: PLATFORM_LINE_COLORS[pl] || "#888",
      pts: series[pl].map((v, i) => [toX(i), toY(v)]),
      values: series[pl],
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
                onMouseEnter={() => setTooltip({ x, y, name: s.name, val: s.values[i], month: labels[i] })}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "crosshair" }} />
            </g>
          ))
        )}
        {labels.map((m, i) => (
          <text key={m + i} x={toX(i)} y={H - 6} fontSize="11" fill="#aaa" textAnchor="middle">{m}</text>
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

// Compute month-over-month growth % for a platform
function computeGrowth(orders, platformName) {
  const now = new Date();
  const thisMonth = orders.filter(o => {
    if (o.platform !== platformName) return false;
    const d = new Date(o.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).reduce((sum, o) => sum + Number(o.amount || 0), 0);

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = orders.filter(o => {
    if (o.platform !== platformName) return false;
    const d = new Date(o.date);
    return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth();
  }).reduce((sum, o) => sum + Number(o.amount || 0), 0);

  if (lastMonth === 0) return thisMonth > 0 ? "+100%" : "N/A";
  const pct = ((thisMonth - lastMonth) / lastMonth) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

// Compute overall revenue growth vs last month
function computeOverallGrowth(orders) {
  const now = new Date();
  const thisMonth = orders.filter(o => {
    const d = new Date(o.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).reduce((sum, o) => sum + Number(o.amount || 0), 0);

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = orders.filter(o => {
    const d = new Date(o.date);
    return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth();
  }).reduce((sum, o) => sum + Number(o.amount || 0), 0);

  if (lastMonth === 0) return thisMonth > 0 ? "+100%" : null;
  const pct = ((thisMonth - lastMonth) / lastMonth) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

// Compute order count growth vs last month
function computeOrderGrowth(orders) {
  const now = new Date();
  const thisMonth = orders.filter(o => {
    const d = new Date(o.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = orders.filter(o => {
    const d = new Date(o.date);
    return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth();
  }).length;

  if (lastMonth === 0) return thisMonth > 0 ? "+100%" : null;
  const pct = ((thisMonth - lastMonth) / lastMonth) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

// Compute unique customer growth vs last month
function computeCustomerGrowth(orders) {
  const now = new Date();
  const thisMonthCustomers = new Set(orders.filter(o => {
    const d = new Date(o.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).map(o => o.customer)).size;

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthCustomers = new Set(orders.filter(o => {
    const d = new Date(o.date);
    return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth();
  }).map(o => o.customer)).size;

  if (lastMonthCustomers === 0) return thisMonthCustomers > 0 ? "+100%" : null;
  const pct = ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
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
  const [orders, setOrders]         = useState([]);
  const [products, setProducts]     = useState([]);
  const [platforms, setPlatforms]   = useState([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectStep, setConnectStep] = useState(1);
  const [connectPlatform, setConnectPlatform] = useState("Shopee");

  // Sorting state
  const [sortField, setSortField]       = useState("date");
  const [sortDir, setSortDir]           = useState("desc");
  // Amount filter
  const [amountOp, setAmountOp]         = useState("any");   // "any" | "lt" | "gt" | "eq"
  const [amountVal, setAmountVal]       = useState("");
  // Date filter
  const [dateFrom, setDateFrom]         = useState("");
  const [dateTo, setDateTo]             = useState("");
  // Filter panel open/close
  const [showFilters, setShowFilters]   = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const userId = currentUser.id;

  useEffect(() => {
    const params = userId ? `?userId=${userId}` : "";
    fetch(`${API_BASE}/api/orders${params}`)
      .then(res => res.json()).then(data => setOrders(data))
      .catch(err => console.error("Failed to fetch orders:", err));
    fetch(`${API_BASE}/api/products${params}`)
      .then(res => res.json()).then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
    fetch(`${API_BASE}/api/platforms${params}`)
      .then(res => res.json()).then(data => setPlatforms(data))
      .catch(err => console.error("Failed to fetch platforms:", err));
  }, [userId]);

  const totalRevenue  = orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const totalOrders   = orders.length;
  const totalProducts = products.length;

  // Chart data derived from real orders + real platforms from API
  const chartData = useMemo(() => {
    const platformNames = platforms.map(p => p.name);
    return buildChartSeries(orders, platformNames);
  }, [orders, platforms]);

  // Growth metrics derived from real orders
  const revenueGrowth  = useMemo(() => computeOverallGrowth(orders), [orders]);
  const orderGrowth    = useMemo(() => computeOrderGrowth(orders), [orders]);
  const customerGrowth = useMemo(() => computeCustomerGrowth(orders), [orders]);

  const getTopProduct = (platformOrders) => {
    if (!platformOrders.length) return "N/A";
    const freq = {};
    platformOrders.forEach(o => { freq[o.product] = (freq[o.product] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  };

  // Fully dynamic — only shows platforms that exist in the API
  const PLATFORM_DATA = useMemo(() => platforms.map(p => {
    const platOrders = orders.filter(o => o.platform === p.name);
    const revenue    = platOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
    return {
      name:       p.name,
      color:      getPlatformColor(p.name),
      orders:     platOrders.length,
      revenue:    `₱${revenue.toLocaleString()}`,
      growth:     computeGrowth(orders, p.name),
      topProduct: getTopProduct(platOrders),
      status:     p.status || "Active",
    };
  }), [platforms, orders]);

  const SUMMARY_CARDS = [
    { label: "Total Revenue",   value: `₱${totalRevenue.toLocaleString()}`, change: revenueGrowth,  icon: <IconRevenue />,   color: "#e85d04" },
    { label: "Total Orders",    value: totalOrders.toLocaleString(),         change: orderGrowth,    icon: <IconOrders />,    color: "#2563eb" },
    { label: "Products Sold",   value: totalProducts.toLocaleString(),       change: null,           icon: <IconBox />,       color: "#16a34a" },
    { label: "Total Customers", value: [...new Set(orders.map(o => o.customer))].length.toLocaleString(), change: customerGrowth, icon: <IconCustomers />, color: "#9333ea" },
    { label: "Active Platforms",value: platforms.length.toLocaleString(),    change: null,           icon: <IconChart />,     color: "#0891b2" },
  ];

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => { setCurrentPage(1); }, [activePlatformFilter, filterStatus, searchQuery, sortField, sortDir, amountOp, amountVal, dateFrom, dateTo]);

  const visiblePlatforms = activePlatformFilter === "All"
    ? PLATFORM_DATA
    : PLATFORM_DATA.filter((p) => p.name === activePlatformFilter);

  const filteredOrders = useMemo(() => {
    const amt = parseFloat(amountVal);
    return orders
      .filter((order) => {
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
        const orderAmt = Number(order.amount || 0);
        const matchAmount =
          amountOp === "any" ? true :
          amountOp === "lt"  ? (!isNaN(amt) && orderAmt <  amt) :
          amountOp === "gt"  ? (!isNaN(amt) && orderAmt >  amt) :
          amountOp === "eq"  ? (!isNaN(amt) && orderAmt === amt) : true;
        const matchDateFrom = !dateFrom || new Date(order.date) >= new Date(dateFrom);
        const matchDateTo   = !dateTo   || new Date(order.date) <= new Date(dateTo);
        return matchPlatform && matchStatus && matchSearch && matchAmount && matchDateFrom && matchDateTo;
      })
      .sort((a, b) => {
        let av, bv;
        if (sortField === "date")     { av = new Date(a.date);     bv = new Date(b.date); }
        else if (sortField === "amount")   { av = Number(a.amount);    bv = Number(b.amount); }
        else if (sortField === "customer") { av = a.customer.toLowerCase(); bv = b.customer.toLowerCase(); }
        else if (sortField === "platform") { av = a.platform.toLowerCase(); bv = b.platform.toLowerCase(); }
        else if (sortField === "product")  { av = a.product.toLowerCase();  bv = b.product.toLowerCase(); }
        else if (sortField === "status")   { av = a.status.toLowerCase();   bv = b.status.toLowerCase(); }
        else { av = a.id; bv = b.id; }
        if (av < bv) return sortDir === "asc" ? -1 :  1;
        if (av > bv) return sortDir === "asc" ?  1 : -1;
        return 0;
      });
  }, [orders, activePlatformFilter, filterStatus, searchQuery, amountOp, amountVal, dateFrom, dateTo, sortField, sortDir]);

  const totalPages      = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4, color: "#e85d04" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const activeFilterCount = [
    filterStatus !== "All",
    amountOp !== "any" && amountVal !== "",
    dateFrom !== "",
    dateTo !== "",
  ].filter(Boolean).length;

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

        <div className="dashboard-greeting">
          <h2 className="dashboard-greeting__title">{greeting}, {currentUser.username || "there"} 👋</h2>
          <p className="dashboard-greeting__sub">Here's what's happening across your platforms today.</p>
        </div>

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
              {card.change ? (
                <div className="dashboard-summary-card__change"><IconTrendUp />{card.change} vs last month</div>
              ) : (
                <div className="dashboard-summary-card__change" style={{ opacity: 0.5 }}>
                  {card.label === "Active Platforms" ? "Connected platforms" : "All time"}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="dashboard-chart-card" style={{ background: "var(--card-bg,#fff)", border: "1px solid var(--border-color,#e0e0e0)", borderRadius: "10px", padding: "20px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <p className="dashboard-section-title" style={{ margin: 0 }}>Revenue Trend (6 months)</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["All", ...platforms.map(p => p.name)].map((p) => (
                <button key={p}
                  className={`dashboard-chart-tab${chartPlatform === p ? " active" : ""}`}
                  style={{ padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", border: "1px solid var(--border-color,#ddd)", background: chartPlatform === p ? "#e85d04" : "var(--card-bg,#fff)", color: chartPlatform === p ? "white" : "var(--text-muted,#555)" }}
                  onClick={() => setChartPlatform(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <RevenueChart activePlatform={chartPlatform} chartData={chartData} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
          <p className="dashboard-section-title" style={{ margin: 0 }}>Platform Breakdown</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {["All", ...platforms.map(p => p.name)].map((pf) => (
              <button key={pf}
                style={{ padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", border: `2px solid ${activePlatformFilter === pf ? getPlatformTabColor(pf) : "var(--border-color,#ddd)"}`, background: activePlatformFilter === pf ? getPlatformTabColor(pf) : "var(--card-bg,#fff)", color: activePlatformFilter === pf ? "white" : "var(--text-muted,#555)" }}
                onClick={() => setActivePlatformFilter(pf)}>
                {pf}
              </button>
            ))}
            <button
              onClick={() => { setShowConnectModal(true); setConnectStep(1); }}
              style={{ padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", border: "2px solid #e85d04", background: "#e85d04", color: "white" }}>
              + Connect Platform
            </button>
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
              <div className="dashboard-platform-card__growth">
                <IconTrendUp />
                {p.growth !== "N/A" ? `${p.growth} vs last month` : "No prior month data"}
              </div>
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
              <button
                onClick={() => setShowFilters(f => !f)}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "6px", border: `1px solid ${showFilters || activeFilterCount > 0 ? "#e85d04" : "var(--border-color,#ddd)"}`, background: showFilters || activeFilterCount > 0 ? "#fff5f0" : "var(--section-alt-bg,#fafafa)", color: showFilters || activeFilterCount > 0 ? "#e85d04" : "var(--text-muted,#555)", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                ⚙ Filters {activeFilterCount > 0 && <span style={{ background: "#e85d04", color: "#fff", borderRadius: "10px", padding: "1px 7px", fontSize: "11px" }}>{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          {/* Expanded filter panel */}
          {showFilters && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", padding: "14px 0 18px", borderBottom: "1px solid var(--border-color,#eee)", marginBottom: "4px", alignItems: "flex-end" }}>

              {/* Status */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted,#888)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</label>
                <select className="dashboard-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All</option>
                  {["Delivered", "Shipped", "Pending", "Processing", "Cancelled"].map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Platform */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted,#888)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Platform</label>
                <select className="dashboard-filter-select" value={activePlatformFilter} onChange={(e) => setActivePlatformFilter(e.target.value)}>
                  <option value="All">All</option>
                  {platforms.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted,#888)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Amount</label>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <select className="dashboard-filter-select" value={amountOp} onChange={(e) => setAmountOp(e.target.value)} style={{ width: "110px" }}>
                    <option value="any">Any</option>
                    <option value="lt">Less than</option>
                    <option value="gt">Greater than</option>
                    <option value="eq">Equal to</option>
                  </select>
                  {amountOp !== "any" && (
                    <input type="number" min="0" placeholder="₱ amount"
                      value={amountVal} onChange={(e) => setAmountVal(e.target.value)}
                      style={{ width: "110px", padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--border-color,#ddd)", background: "var(--section-alt-bg,#fafafa)", color: "var(--text-primary,#222)", fontSize: "13px" }} />
                  )}
                </div>
              </div>

              {/* Date range */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted,#888)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date Range</label>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    style={{ padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--border-color,#ddd)", background: "var(--section-alt-bg,#fafafa)", color: "var(--text-primary,#222)", fontSize: "13px" }} />
                  <span style={{ color: "var(--text-muted,#aaa)", fontSize: "12px" }}>to</span>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    style={{ padding: "7px 10px", borderRadius: "6px", border: "1px solid var(--border-color,#ddd)", background: "var(--section-alt-bg,#fafafa)", color: "var(--text-primary,#222)", fontSize: "13px" }} />
                </div>
              </div>

              {/* Sort by */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted,#888)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sort By</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <select className="dashboard-filter-select" value={sortField} onChange={(e) => { setSortField(e.target.value); }} style={{ width: "130px" }}>
                    <option value="date">Date</option>
                    <option value="customer">Customer</option>
                    <option value="platform">Platform</option>
                    <option value="product">Product</option>
                    <option value="amount">Amount</option>
                    <option value="status">Status</option>
                  </select>
                  <button onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
                    title={sortDir === "asc" ? "Ascending" : "Descending"}
                    style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid var(--border-color,#ddd)", background: "var(--section-alt-bg,#fafafa)", color: "#e85d04", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                    {sortDir === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button onClick={() => { setFilterStatus("All"); setActivePlatformFilter("All"); setAmountOp("any"); setAmountVal(""); setDateFrom(""); setDateTo(""); }}
                  style={{ alignSelf: "flex-end", padding: "7px 14px", borderRadius: "6px", border: "1px solid #e85d04", background: "none", color: "#e85d04", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th onClick={() => handleSort("customer")} style={{ cursor: "pointer", userSelect: "none" }}>Customer <SortIcon field="customer" /></th>
                <th onClick={() => handleSort("platform")} style={{ cursor: "pointer", userSelect: "none" }}>Platform <SortIcon field="platform" /></th>
                <th onClick={() => handleSort("product")}  style={{ cursor: "pointer", userSelect: "none" }}>Product  <SortIcon field="product"  /></th>
                <th onClick={() => handleSort("amount")}   style={{ cursor: "pointer", userSelect: "none" }}>Amount   <SortIcon field="amount"   /></th>
                <th onClick={() => handleSort("status")}   style={{ cursor: "pointer", userSelect: "none" }}>Status   <SortIcon field="status"   /></th>
                <th onClick={() => handleSort("date")}     style={{ cursor: "pointer", userSelect: "none" }}>Date     <SortIcon field="date"     /></th>
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

      {/* ── Connect Platform Modal (placeholder) ── */}
      {showConnectModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "var(--card-bg,#fff)", borderRadius: "14px", padding: "32px", maxWidth: "460px", width: "90%", boxShadow: "0 12px 40px rgba(0,0,0,0.22)" }}>

            {/* Step indicator */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", alignItems: "center" }}>
              {[1,2,3].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: connectStep >= s ? "#e85d04" : "var(--border-color,#ddd)", color: connectStep >= s ? "white" : "var(--text-muted,#999)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>{s}</div>
                  {s < 3 && <div style={{ width: "32px", height: "2px", background: connectStep > s ? "#e85d04" : "var(--border-color,#ddd)" }} />}
                </div>
              ))}
              <span style={{ fontSize: "12px", color: "var(--text-muted,#888)", marginLeft: "8px" }}>
                {connectStep === 1 ? "Choose Platform" : connectStep === 2 ? "Authorize Access" : "Done!"}
              </span>
            </div>

            {connectStep === 1 && (<>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary,#1a1a1a)", marginBottom: "8px" }}>Connect Your Store</h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted,#777)", marginBottom: "20px" }}>Select a platform to link to your UniSell dashboard.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {[
                  { name: "Shopee",      icon: "🛒", color: "#ee4d2d", desc: "Connect via Shopee Open Platform API" },
                  { name: "Lazada",      icon: "🏪", color: "#0f146b", desc: "Connect via Lazada Open Platform API" },
                  { name: "TikTok Shop", icon: "🎵", color: "#555",    desc: "Connect via TikTok Shop Seller API" },
                ].map(pl => (
                  <div key={pl.name}
                    onClick={() => setConnectPlatform(pl.name)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "10px", border: `2px solid ${connectPlatform === pl.name ? pl.color : "var(--border-color,#e0e0e0)"}`, cursor: "pointer", background: connectPlatform === pl.name ? pl.color + "10" : "var(--section-alt-bg,#fafafa)", transition: "all 0.15s" }}>
                    <span style={{ fontSize: "24px" }}>{pl.icon}</span>
                    <div>
                      <p style={{ fontWeight: "700", color: "var(--text-primary,#1a1a1a)", fontSize: "14px", marginBottom: "2px" }}>{pl.name}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted,#888)" }}>{pl.desc}</p>
                    </div>
                    {connectPlatform === pl.name && <span style={{ marginLeft: "auto", fontSize: "18px" }}>✅</span>}
                  </div>
                ))}
              </div>
            </>)}

            {connectStep === 2 && (<>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary,#1a1a1a)", marginBottom: "8px" }}>Authorize {connectPlatform}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted,#777)", marginBottom: "20px" }}>You'll be redirected to {connectPlatform} to grant UniSell access to your store data.</p>
              <div style={{ background: "var(--section-alt-bg,#fafafa)", border: "1px solid var(--border-color,#e0e0e0)", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary,#1a1a1a)", marginBottom: "10px" }}>UniSell will request access to:</p>
                {["Read your orders and order history", "View your product listings", "Access your store revenue data"].map(item => (
                  <div key={item} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{ color: "#16a34a", fontWeight: "700", marginTop: "1px" }}>✓</span>
                    <span style={{ fontSize: "13px", color: "var(--text-muted,#555)" }}>{item}</span>
                  </div>
                ))}
                <div style={{ marginTop: "12px", padding: "10px", background: "#fefce8", border: "1px solid #fde047", borderRadius: "6px", fontSize: "12px", color: "#854d0e" }}>
                  🚧 <strong>Demo mode:</strong> This is a placeholder for the actual OAuth flow. Full integration coming soon.
                </div>
              </div>
            </>)}

            {connectStep === 3 && (<>
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary,#1a1a1a)", marginBottom: "8px" }}>{connectPlatform} Connected!</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted,#777)", marginBottom: "8px" }}>Your {connectPlatform} store has been linked to UniSell.</p>
                <div style={{ background: "#fefce8", border: "1px solid #fde047", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#854d0e", marginTop: "12px", marginBottom: "20px" }}>
                  🚧 This is a demo placeholder — actual API sync is not yet implemented.
                </div>
              </div>
            </>)}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowConnectModal(false); setConnectStep(1); }}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid var(--border-color,#ddd)", background: "none", color: "var(--text-muted,#555)", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
                {connectStep === 3 ? "Close" : "Cancel"}
              </button>
              {connectStep < 3 && (
                <button onClick={() => setConnectStep(s => s + 1)}
                  style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#e85d04", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                  {connectStep === 1 ? "Next →" : "Authorize (Demo)"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
