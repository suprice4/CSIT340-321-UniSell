import { useState, useEffect } from "react";


export default function OrderFilters({ onFilterChange, filters }) {
  const [search, setSearch]     = useState(filters?.search   || "");
  const [platform, setPlatform] = useState(filters?.platform || "All");
  const [status, setStatus]     = useState(filters?.status   || "All");

  useEffect(() => {
    onFilterChange({ search, platform, status });
  }, [search, platform, status]);

  const st = {
    wrapper: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    searchInput: {
      fontSize: "13px",
      padding: "7px 12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      background: "#fafafa",
      color: "#444",
      outline: "none",
      width: "200px",
    },
    select: {
      fontSize: "13px",
      padding: "7px 12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      background: "#fafafa",
      color: "#444",
      outline: "none",
      cursor: "pointer",
    },
    clearBtn: {
      fontSize: "12px",
      padding: "7px 12px",
      border: "1px solid #e85d04",
      borderRadius: "6px",
      background: "transparent",
      color: "#e85d04",
      cursor: "pointer",
      fontWeight: "600",
    },
  };

  const handleClear = () => {
    setSearch("");
    setPlatform("All");
    setStatus("All");
  };

  const hasActiveFilters = search !== "" || platform !== "All" || status !== "All";

  return (
    <div style={st.wrapper}>
      <input
        type="text"
        placeholder="Search orders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={st.searchInput}
      />

      <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={st.select}>
        <option value="All">All Platforms</option>
        <option value="Shopee">Shopee</option>
        <option value="Lazada">Lazada</option>
        <option value="TikTok Shop">TikTok Shop</option>
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)} style={st.select}>
        <option value="All">All Status</option>
        <option value="Delivered">Delivered</option>
        <option value="Shipped">Shipped</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {hasActiveFilters && (
        <button style={st.clearBtn} onClick={handleClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
}