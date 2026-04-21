import { useState, useEffect } from "react";
import "../styles/Recentorders.css";
import OrderFilters from "./OrderFilters.jsx";
import OrderRow from "./OrderRow";
import Pagination from "./Pagination";


const ORDERS_DATA = [
  { id: "#ORD-1041", customer: "Maria Santos",   platform: "Shopee",      product: "Wireless Earbuds",    amount: "₱850",   status: "Delivered",  date: "Mar 27, 2026" },
  { id: "#ORD-1040", customer: "Juan dela Cruz", platform: "Lazada",      product: "Phone Case Set",      amount: "₱320",   status: "Shipped",    date: "Mar 27, 2026" },
  { id: "#ORD-1039", customer: "Ana Reyes",      platform: "TikTok Shop", product: "LED Desk Lamp",       amount: "₱650",   status: "Pending",    date: "Mar 26, 2026" },
  { id: "#ORD-1038", customer: "Carlo Mendoza",  platform: "Shopee",      product: "USB-C Hub",           amount: "₱1,200", status: "Delivered",  date: "Mar 26, 2026" },
  { id: "#ORD-1037", customer: "Lea Villanueva", platform: "Lazada",      product: "Laptop Stand",        amount: "₱980",   status: "Processing", date: "Mar 25, 2026" },
  { id: "#ORD-1036", customer: "Ryan Torres",    platform: "TikTok Shop", product: "Mechanical Keyboard", amount: "₱2,100", status: "Delivered",  date: "Mar 25, 2026" },
  { id: "#ORD-1035", customer: "Sofia Lim",      platform: "Shopee",      product: "Ring Light",          amount: "₱750",   status: "Shipped",    date: "Mar 24, 2026" },
  { id: "#ORD-1034", customer: "Marco Aquino",   platform: "Lazada",      product: "Gaming Mouse",        amount: "₱1,450", status: "Cancelled",  date: "Mar 24, 2026" },
];

const ITEMS_PER_PAGE = 5;



export default function RecentOrders() {
  const [filters, setFilters]       = useState({ search: "", platform: "All", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState(ORDERS_DATA);


  useEffect(() => {
    const result = ORDERS_DATA.filter((order) => {
      const matchesPlatform = filters.platform === "All" || order.platform === filters.platform;
      const matchesStatus   = filters.status   === "All" || order.status   === filters.status;
      const matchesSearch   =
        order.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.product.toLowerCase().includes(filters.search.toLowerCase());
      return matchesPlatform && matchesStatus && matchesSearch;
    });
    setFilteredOrders(result);
  }, [filters]);


  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages      = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const st = {
    card: {
      background: "var(--card-bg, #fff)",
      border: "1px solid var(--border-color, #e0e0e0)",
      borderRadius: "10px",
      padding: "20px",
    },
    cardTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
      flexWrap: "wrap",
      gap: "12px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: "var(--text-primary, #222)",
      margin: 0,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px",
    },
    th: {
      padding: "10px 14px",
      textAlign: "left",
      fontWeight: "600",
      color: "var(--text-muted, #888)",
      borderBottom: "1px solid var(--border-color, #f0f0f0)",
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    emptyRow: {
      textAlign: "center",
      padding: "32px",
      color: "var(--text-muted, #aaa)",
      fontSize: "14px",
    },
  };

  return (
    <div style={st.card}>

      <div style={st.cardTop}>
        <p style={st.sectionTitle}>Recent Orders</p>

        <OrderFilters
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />
      </div>

      <table style={st.table}>
        <thead>
          <tr>
            {["Order ID", "Customer", "Platform", "Product", "Amount", "Status", "Date"].map((h) => (
              <th key={h} style={st.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.length > 0 ? (
            paginatedOrders.map((order) => (

              <OrderRow key={order.id} order={order} />
            ))
          ) : (
            <tr>
              <td colSpan={7} style={st.emptyRow}>No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredOrders.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={(page) => setCurrentPage(page)}
      />

    </div>
  );
}