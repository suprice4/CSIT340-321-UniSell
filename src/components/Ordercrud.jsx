import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Ordercrud.css";

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────

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

const INITIAL_ORDERS = [
  { id: "#ORD-1041", customer: "Maria Santos",   platform: "Shopee",      product: "Wireless Earbuds",    amount: "850",  status: "Delivered",  date: "2026-03-27" },
  { id: "#ORD-1040", customer: "Juan dela Cruz", platform: "Lazada",      product: "Phone Case Set",      amount: "320",  status: "Shipped",    date: "2026-03-27" },
  { id: "#ORD-1039", customer: "Ana Reyes",      platform: "TikTok Shop", product: "LED Desk Lamp",       amount: "650",  status: "Pending",    date: "2026-03-26" },
  { id: "#ORD-1038", customer: "Carlo Mendoza",  platform: "Shopee",      product: "USB-C Hub",           amount: "1200", status: "Delivered",  date: "2026-03-26" },
  { id: "#ORD-1037", customer: "Lea Villanueva", platform: "Lazada",      product: "Laptop Stand",        amount: "980",  status: "Processing", date: "2026-03-25" },
  { id: "#ORD-1036", customer: "Ryan Torres",    platform: "TikTok Shop", product: "Mechanical Keyboard", amount: "2100", status: "Delivered",  date: "2026-03-25" },
  { id: "#ORD-1035", customer: "Sofia Lim",      platform: "Shopee",      product: "Ring Light",          amount: "750",  status: "Shipped",    date: "2026-03-24" },
  { id: "#ORD-1034", customer: "Marco Aquino",   platform: "Lazada",      product: "Gaming Mouse",        amount: "1450", status: "Cancelled",  date: "2026-03-24" },
];

const EMPTY_FORM = { customer: "", platform: "Shopee", product: "", amount: "", status: "Pending", date: "" };
const ITEMS_PER_PAGE = 5;

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderCRUD() {
  const navigate = useNavigate();

  const [orders, setOrders]                   = useState(INITIAL_ORDERS);
  const [search, setSearch]                   = useState("");
  const [filterPlatform, setFilterPlatform]   = useState("All");
  const [filterStatus, setFilterStatus]       = useState("All");
  const [currentPage, setCurrentPage]         = useState(1);
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showViewModal, setShowViewModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder]     = useState(null);
  const [formData, setFormData]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]           = useState({});
  const [toast, setToast]                     = useState(null);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterPlatform, filterStatus]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Clear form errors when user types
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) setFormErrors({});
  }, [formData]);

  // ── Filter & Paginate ─────────────────────────────────────────────────────

  const filteredOrders = orders.filter((order) => {
    const matchesPlatform = filterPlatform === "All" || order.platform === filterPlatform;
    const matchesStatus   = filterStatus   === "All" || order.status   === filterStatus;
    const matchesSearch   =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const totalPages      = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const errors = {};
    if (!formData.customer) errors.customer = "Customer name is required.";
    if (!formData.product)  errors.product  = "Product is required.";
    if (!formData.amount)   errors.amount   = "Amount is required.";
    else if (isNaN(formData.amount)) errors.amount = "Amount must be a number.";
    if (!formData.date)     errors.date     = "Date is required.";
    return errors;
  };

  // ── CRUD Handlers ─────────────────────────────────────────────────────────

  const handleAdd = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const newOrder = {
      ...formData,
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setOrders([newOrder, ...orders]);
    setShowAddModal(false);
    setFormData(EMPTY_FORM);
    setToast({ msg: "Order added successfully!", type: "success" });
  };

  const handleEdit = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setOrders(orders.map((o) => o.id === selectedOrder.id ? { ...formData, id: selectedOrder.id } : o));
    setShowEditModal(false);
    setToast({ msg: "Order updated successfully!", type: "success" });
  };

  const handleDelete = () => {
    setOrders(orders.filter((o) => o.id !== selectedOrder.id));
    setShowDeleteModal(false);
    setToast({ msg: "Order deleted successfully!", type: "error" });
  };

  const openView   = (order) => { setSelectedOrder(order); setShowViewModal(true); };
  const openEdit   = (order) => { setSelectedOrder(order); setFormData({ ...order }); setShowEditModal(true); };
  const openDelete = (order) => { setSelectedOrder(order); setShowDeleteModal(true); };
  const openAdd    = ()      => { setFormData(EMPTY_FORM); setFormErrors({}); setShowAddModal(true); };

  // ── Styles ────────────────────────────────────────────────────────────────

  const s = {
    page:       { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },
    main:       { padding: "32px 40px", maxWidth: "1200px", margin: "0 auto" },
    pageTitle:  { fontSize: "22px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "4px" },
    pageSub:    { fontSize: "14px", color: "var(--text-muted, #777)", marginBottom: "24px" },
    card:       { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "10px", padding: "20px" },
    topRow:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
    filterRow:  { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
    searchWrap: { display: "flex", alignItems: "center", gap: "8px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", padding: "7px 12px", background: "var(--section-alt-bg, #fafafa)" },
    searchInput:{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "var(--text-primary, #444)", width: "180px" },
    select:     { fontSize: "13px", padding: "7px 12px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", background: "var(--section-alt-bg, #fafafa)", color: "var(--text-primary, #444)", outline: "none", cursor: "pointer" },
    addBtn:     { display: "flex", alignItems: "center", gap: "6px", background: "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
    table:      { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th:         { padding: "10px 14px", textAlign: "left", fontWeight: "600", color: "var(--text-muted, #888)", borderBottom: "1px solid var(--border-color, #f0f0f0)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" },
    td:         { padding: "12px 14px", borderBottom: "1px solid var(--border-color, #f7f7f7)", color: "var(--text-primary, #333)" },
    badge:      (bg, color) => ({ display: "inline-block", background: bg, color, padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }),
    actionBtn:  (color) => ({ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "6px", border: `1px solid var(--border-color, ${color}22`, background: color + "11", color, cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "6px" }),
    pagination: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", fontSize: "13px", color: "var(--text-muted, #888)" },
    pageBtn:    (active) => ({ padding: "5px 11px", borderRadius: "6px", border: "1px solid var(--border-color, #ddd)", background: active ? "#e85d04" : "#fff", color: active ? "#fff" : "#555", cursor: "pointer", fontSize: "13px", marginLeft: "4px" }),
    emptyRow:   { textAlign: "center", padding: "32px", color: "var(--text-muted, #aaa)", fontSize: "14px" },
    overlay:    { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
    modal:      { background: "var(--card-bg, #fff)", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "480px", position: "relative" },
    modalTitle: { fontSize: "18px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "20px" },
    closeBtn:   { position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted, #888)" },
    formGroup:  { marginBottom: "14px" },
    label:      { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-primary, #333)" },
    input:      (err) => ({ width: "100%", padding: "9px 12px", border: `1px solid var(--border-color, ${err ? "#e53e3e" : "#ddd"}`, borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #333)", outline: "none", boxSizing: "border-box", background: "var(--section-alt-bg, #fafafa)" }),
    errorText:  { fontSize: "12px", color: "#e53e3e", marginTop: "4px" },
    modalBtns:  { display: "flex", gap: "10px", marginTop: "20px", justifyContent: "flex-end" },
    cancelBtn:  { padding: "9px 20px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", background: "var(--card-bg, #fff)", color: "var(--text-muted, #555)", cursor: "pointer", fontSize: "14px" },
    confirmBtn: (color) => ({ padding: "9px 20px", border: "none", borderRadius: "6px", background: color, color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" }),
    viewRow:    { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-color, #f7f7f7)", fontSize: "14px" },
    viewLabel:  { color: "var(--text-muted, #888)" },
    viewVal:    { fontWeight: "600", color: "var(--text-primary, #222)" },
    toast:      (type) => ({ position: "fixed", bottom: "24px", right: "24px", background: type === "success" ? "#276749" : "#9b2c2c", color: "white", padding: "12px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", zIndex: 300 }),
  };

  // ── Reusable Form Fields ──────────────────────────────────────────────────

  const FormFields = () => (
    <>
      <div style={s.formGroup}>
        <label style={s.label}>Customer Name</label>
        <input style={s.input(!!formErrors.customer)} value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Enter customer name" />
        {formErrors.customer && <p style={s.errorText}>{formErrors.customer}</p>}
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Platform</label>
        <select style={s.input(false)} value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })}>
          <option value="Shopee">Shopee</option>
          <option value="Lazada">Lazada</option>
          <option value="TikTok Shop">TikTok Shop</option>
        </select>
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Product</label>
        <input style={s.input(!!formErrors.product)} value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} placeholder="Enter product name" />
        {formErrors.product && <p style={s.errorText}>{formErrors.product}</p>}
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Amount (₱)</label>
        <input style={s.input(!!formErrors.amount)} value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Enter amount" />
        {formErrors.amount && <p style={s.errorText}>{formErrors.amount}</p>}
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Status</label>
        <select style={s.input(false)} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>
      <div style={s.formGroup}>
        <label style={s.label}>Date</label>
        <input type="date" style={s.input(!!formErrors.date)} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        {formErrors.date && <p style={s.errorText}>{formErrors.date}</p>}
      </div>
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={s.page}>

      {/* ── SHARED NAVBAR — Orders is the active page ── */}
      <Navbar activePage="/orders" />

      {/* MAIN CONTENT */}
      <div style={s.main}>
        <h2 style={s.pageTitle}>Order Management</h2>
        <p style={s.pageSub}>Add, view, edit, and delete orders across all platforms.</p>

        <div style={s.card}>
          {/* Top Row: Filters + Add Button */}
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
            <button style={s.addBtn} onClick={openAdd}>
              <IconPlus /> Add Order
            </button>
          </div>

          {/* Orders Table */}
          <table style={s.table}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Platform", "Product", "Amount", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ ...s.td, fontWeight: "600", color: "#e85d04" }}>{order.id}</td>
                  <td style={s.td}>{order.customer}</td>
                  <td style={s.td}><span style={s.badge(PLATFORM_BADGE[order.platform]?.bg, PLATFORM_BADGE[order.platform]?.color)}>{order.platform}</span></td>
                  <td style={s.td}>{order.product}</td>
                  <td style={{ ...s.td, fontWeight: "600" }}>₱{Number(order.amount).toLocaleString()}</td>
                  <td style={s.td}><span style={s.badge(STATUS_COLORS[order.status]?.bg, STATUS_COLORS[order.status]?.color)}>{order.status}</span></td>
                  <td style={{ ...s.td, color: "var(--text-muted, #888)" }}>{order.date}</td>
                  <td style={s.td}>
                    <button style={s.actionBtn("#2563eb")} onClick={() => openView(order)}><IconEye /> View</button>
                    <button style={s.actionBtn("#e85d04")} onClick={() => openEdit(order)}><IconEdit /> Edit</button>
                    <button style={s.actionBtn("#e53e3e")} onClick={() => openDelete(order)}><IconTrash /> Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} style={s.emptyRow}>No orders found.</td></tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={s.pagination}>
            <span>
              Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} style={s.pageBtn(currentPage === page)} onClick={() => setCurrentPage(page)}>{page}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD MODAL ── */}
      {showAddModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <button style={s.closeBtn} onClick={() => setShowAddModal(false)}><IconX /></button>
            <p style={s.modalTitle}>Add New Order</p>
            <FormFields />
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button style={s.confirmBtn("#e85d04")} onClick={handleAdd}>Add Order</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {showEditModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <button style={s.closeBtn} onClick={() => setShowEditModal(false)}><IconX /></button>
            <p style={s.modalTitle}>Edit Order — {selectedOrder?.id}</p>
            <FormFields />
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowEditModal(false)}>Cancel</button>
              <button style={s.confirmBtn("#e85d04")} onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ── */}
      {showViewModal && selectedOrder && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <button style={s.closeBtn} onClick={() => setShowViewModal(false)}><IconX /></button>
            <p style={s.modalTitle}>Order Details</p>
            {[
              { label: "Order ID",  value: selectedOrder.id },
              { label: "Customer",  value: selectedOrder.customer },
              { label: "Platform",  value: selectedOrder.platform },
              { label: "Product",   value: selectedOrder.product },
              { label: "Amount",    value: `₱${Number(selectedOrder.amount).toLocaleString()}` },
              { label: "Status",    value: selectedOrder.status },
              { label: "Date",      value: selectedOrder.date },
            ].map((row) => (
              <div key={row.label} style={s.viewRow}>
                <span style={s.viewLabel}>{row.label}</span>
                <span style={s.viewVal}>{row.value}</span>
              </div>
            ))}
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowViewModal(false)}>Close</button>
              <button style={s.confirmBtn("#e85d04")} onClick={() => { setShowViewModal(false); openEdit(selectedOrder); }}>Edit This Order</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && selectedOrder && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <button style={s.closeBtn} onClick={() => setShowDeleteModal(false)}><IconX /></button>
            <p style={s.modalTitle}>Delete Order</p>
            <p style={{ fontSize: "14px", color: "var(--text-muted, #555)", lineHeight: "1.7" }}>
              Are you sure you want to delete order <strong>{selectedOrder.id}</strong> from <strong>{selectedOrder.customer}</strong>? This action cannot be undone.
            </p>
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button style={s.confirmBtn("#e53e3e")} onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && <div style={s.toast(toast.type)}>{toast.msg}</div>}

      {/* FOOTER */}
      {/* ── SHARED FOOTER ── */}
      <Footer />

    </div>
  );
}