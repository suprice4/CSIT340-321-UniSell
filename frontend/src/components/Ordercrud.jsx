import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useToast } from "./Toast";
import "../styles/Ordercrud.css";

import { IconPlus, IconEdit, IconTrash, IconEye, IconX, IconSearch } from "./Icons";

const EMPTY_FORM = { customer: "", platform: "Shopee", product: "", amount: "", status: "Pending", date: "" };
const ITEMS_PER_PAGE = 5;

const STATUS_SLUG = { Delivered: "delivered", Shipped: "shipped", Pending: "pending", Processing: "processing", Cancelled: "cancelled" };
const PLATFORM_SLUG = { Shopee: "shopee", Lazada: "lazada", "TikTok Shop": "tiktok" };

export default function OrderCRUD() {
  const navigate = useNavigate();

  const [orders, setOrders]               = useState([]);
  const [search, setSearch]               = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterStatus, setFilterStatus]   = useState("All");
  const [currentPage, setCurrentPage]     = useState(1);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData]           = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]       = useState({});
  const toast                             = useToast();

  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then(res => res.json()).then(data => setOrders(data))
      .catch(err => console.error("Failed to fetch orders:", err));
  }, []);

  useEffect(() => { setCurrentPage(1); }, [search, filterPlatform, filterStatus]);
  useEffect(() => { if (Object.keys(formErrors).length > 0) setFormErrors({}); }, [formData]);

  const filteredOrders = orders.filter((order) => {
    const matchesPlatform = filterPlatform === "All" || order.platform === filterPlatform;
    const matchesStatus   = filterStatus   === "All" || order.status   === filterStatus;
    const matchesSearch   =
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      String(order.id).toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const totalPages      = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE
  );

  const validate = () => {
    const errors = {};
    if (!formData.customer) errors.customer = "Customer name is required.";
    if (!formData.product)  errors.product  = "Product is required.";
    if (!formData.amount)   errors.amount   = "Amount is required.";
    else if (isNaN(formData.amount)) errors.amount = "Amount must be a number.";
    if (!formData.date)     errors.date     = "Date is required.";
    return errors;
  };

  const handleAdd = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    fetch("http://localhost:8080/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
    }).then(res => res.json()).then(newOrder => {
      setOrders([newOrder, ...orders]); setShowAddModal(false); setFormData(EMPTY_FORM);
      toast.success("Order added successfully!");
    });
  };

  const handleEdit = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    fetch(`http://localhost:8080/api/orders/${selectedOrder.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
    }).then(res => res.json()).then(updated => {
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      setShowEditModal(false); toast.success("Order updated successfully!");
    });
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/orders/${selectedOrder.id}`, { method: "DELETE" })
      .then(() => {
        setOrders(orders.filter(o => o.id !== selectedOrder.id));
        setShowDeleteModal(false); toast.success("Order deleted successfully!");
      });
  };

  const openView   = (order) => { setSelectedOrder(order); setShowViewModal(true); };
  const openEdit   = (order) => { setSelectedOrder(order); setFormData({ ...order }); setShowEditModal(true); };
  const openDelete = (order) => { setSelectedOrder(order); setShowDeleteModal(true); };
  const openAdd    = ()      => { setFormData(EMPTY_FORM); setFormErrors({}); setShowAddModal(true); };

  const formFields = (
    <>
      <div className="ordercrud-form-group">
        <label className="ordercrud-form-label">Customer Name</label>
        <input className={`ordercrud-form-input${formErrors.customer ? " ordercrud-form-input--error" : ""}`}
          value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} placeholder="Enter customer name" />
        {formErrors.customer && <p className="ordercrud-error-text">{formErrors.customer}</p>}
      </div>
      <div className="ordercrud-form-group">
        <label className="ordercrud-form-label">Platform</label>
        <select className="ordercrud-form-input" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })}>
          <option value="Shopee">Shopee</option>
          <option value="Lazada">Lazada</option>
          <option value="TikTok Shop">TikTok Shop</option>
        </select>
      </div>
      <div className="ordercrud-form-group">
        <label className="ordercrud-form-label">Product</label>
        <input className={`ordercrud-form-input${formErrors.product ? " ordercrud-form-input--error" : ""}`}
          value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} placeholder="Enter product name" />
        {formErrors.product && <p className="ordercrud-error-text">{formErrors.product}</p>}
      </div>
      <div className="ordercrud-form-group">
        <label className="ordercrud-form-label">Amount (₱)</label>
        <input className={`ordercrud-form-input${formErrors.amount ? " ordercrud-form-input--error" : ""}`}
          value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Enter amount" />
        {formErrors.amount && <p className="ordercrud-error-text">{formErrors.amount}</p>}
      </div>
      <div className="ordercrud-form-group">
        <label className="ordercrud-form-label">Status</label>
        <select className="ordercrud-form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>
      <div className="ordercrud-form-group">
        <label className="ordercrud-form-label">Date</label>
        <input type="date" className={`ordercrud-form-input${formErrors.date ? " ordercrud-form-input--error" : ""}`}
          value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        {formErrors.date && <p className="ordercrud-error-text">{formErrors.date}</p>}
      </div>
    </>
  );

  return (
    <div className="ordercrud-page">
      <Navbar activePage="/orders" />
      <div className="ordercrud-main">
        <h2 className="ordercrud-page-title">Order Management</h2>
        <p className="ordercrud-page-sub">
          Add, view, edit, and delete orders across all platforms.{" "}
          <button className="ordercrud-text-link" onClick={() => navigate("/export")}>Export to CSV →</button>
        </p>

        <div className="ordercrud-card">
          <div className="ordercrud-top-row">
            <div className="ordercrud-filter-row">
              <div className="ordercrud-search-wrap">
                <IconSearch />
                <input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="ordercrud-select" value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
                <option value="All">All Platforms</option>
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
                <option value="TikTok Shop">TikTok Shop</option>
              </select>
              <select className="ordercrud-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <button className="ordercrud-add-btn" onClick={openAdd}><IconPlus /> Add Order</button>
          </div>

          <table className="ordercrud-table">
            <thead>
              <tr>
                {["Order ID", "Customer", "Platform", "Product", "Amount", "Status", "Date", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.id}</td>
                  <td>{order.customer}</td>
                  <td><span className={`ordercrud-badge ordercrud-badge--${PLATFORM_SLUG[order.platform]}`}>{order.platform}</span></td>
                  <td>{order.product}</td>
                  <td className="amount">₱{Number(order.amount).toLocaleString()}</td>
                  <td><span className={`ordercrud-badge ordercrud-badge--${STATUS_SLUG[order.status]}`}>{order.status}</span></td>
                  <td className="date-cell">{order.date}</td>
                  <td>
                    <button className="ordercrud-action-btn ordercrud-action-btn--view" onClick={() => openView(order)}><IconEye /> View</button>
                    <button className="ordercrud-action-btn ordercrud-action-btn--edit" onClick={() => openEdit(order)}><IconEdit /> Edit</button>
                    <button className="ordercrud-action-btn ordercrud-action-btn--delete" onClick={() => openDelete(order)}><IconTrash /> Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="empty-row">No orders found.</td></tr>
              )}
            </tbody>
          </table>

          <div className="ordercrud-pagination">
            <span>
              Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} className={`ordercrud-page-btn${currentPage === page ? " active" : ""}`}
                  onClick={() => setCurrentPage(page)}>{page}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="ordercrud-overlay">
          <div className="ordercrud-modal">
            <button className="ordercrud-modal__close" onClick={() => setShowAddModal(false)}><IconX /></button>
            <p className="ordercrud-modal__title">Add New Order</p>
            {formFields}
            <div className="ordercrud-modal__buttons">
              <button className="ordercrud-modal__cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="ordercrud-modal__confirm" onClick={handleAdd}>Add Order</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="ordercrud-overlay">
          <div className="ordercrud-modal">
            <button className="ordercrud-modal__close" onClick={() => setShowEditModal(false)}><IconX /></button>
            <p className="ordercrud-modal__title">Edit Order — #{selectedOrder?.id}</p>
            {formFields}
            <div className="ordercrud-modal__buttons">
              <button className="ordercrud-modal__cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="ordercrud-modal__confirm" onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedOrder && (
        <div className="ordercrud-overlay">
          <div className="ordercrud-modal">
            <button className="ordercrud-modal__close" onClick={() => setShowViewModal(false)}><IconX /></button>
            <p className="ordercrud-modal__title">Order Details</p>
            {[
              { label: "Order ID",  value: `#${selectedOrder.id}` },
              { label: "Customer",  value: selectedOrder.customer },
              { label: "Platform",  value: selectedOrder.platform },
              { label: "Product",   value: selectedOrder.product },
              { label: "Amount",    value: `₱${Number(selectedOrder.amount).toLocaleString()}` },
              { label: "Status",    value: selectedOrder.status },
              { label: "Date",      value: selectedOrder.date },
            ].map((row) => (
              <div key={row.label} className="ordercrud-view-row">
                <span className="ordercrud-view-row__label">{row.label}</span>
                <span className="ordercrud-view-row__value">{row.value}</span>
              </div>
            ))}
            <div className="ordercrud-modal__buttons">
              <button className="ordercrud-modal__cancel" onClick={() => setShowViewModal(false)}>Close</button>
              <button className="ordercrud-modal__confirm" onClick={() => { setShowViewModal(false); openEdit(selectedOrder); }}>Edit This Order</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedOrder && (
        <div className="ordercrud-overlay">
          <div className="ordercrud-modal">
            <button className="ordercrud-modal__close" onClick={() => setShowDeleteModal(false)}><IconX /></button>
            <p className="ordercrud-modal__title">Delete Order</p>
            <p className="ordercrud-modal__desc">
              Are you sure you want to delete order <strong>#{selectedOrder.id}</strong> from <strong>{selectedOrder.customer}</strong>? This action cannot be undone.
            </p>
            <div className="ordercrud-modal__buttons">
              <button className="ordercrud-modal__cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="ordercrud-modal__confirm ordercrud-modal__confirm--danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
