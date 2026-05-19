import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useToast } from "./Toast";
import "../styles/Platforms.css";
import API_BASE from "../Config";

const PLATFORM_ICONS = {
  Shopee: "🛒",
  Lazada: "🏪",
  "TikTok Shop": "🎵",
};

const STATUS_OPTIONS = ["Active", "Inactive", "Pending"];

const EMPTY_FORM = { name: "", url: "", status: "Active", description: "" };

export default function Platforms() {
  const toast = useToast();

  const [platforms, setPlatforms]         = useState([]);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [editPlatform, setEditPlatform]   = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete]           = useState(null);
  const [formErrors, setFormErrors]       = useState({});
  const [search, setSearch]               = useState("");
  const [filterStatus, setFilterStatus]   = useState("All");

  const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const userId = currentUser.id;

  useEffect(() => {
    fetchPlatforms();
  }, [userId]);

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) setFormErrors({});
  }, [form]);

  const fetchPlatforms = () => {
    const params = userId ? `?userId=${userId}` : "";
    fetch(`${API_BASE}/api/platforms${params}`)
      .then(res => res.json())
      .then(data => setPlatforms(data))
      .catch(err => console.error("Failed to fetch platforms:", err));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Platform name is required.";
    if (!form.url.trim())  errors.url  = "Platform URL is required.";
    else if (!/^https?:\/\/.+/.test(form.url.trim())) errors.url = "Enter a valid URL (start with http:// or https://).";
    return errors;
  };

  const isDuplicate = (ignoreId = null) => {
    const nameLower = form.name.trim().toLowerCase();
    return platforms.some(p =>
      p.id !== ignoreId &&
      p.name.trim().toLowerCase() === nameLower
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    if (editPlatform !== null) {
      // Editing — check duplicate ignoring self
      if (isDuplicate(editPlatform.id)) {
        toast.error(`A platform named "${form.name}" already exists.`);
        return;
      }
      fetch(`${API_BASE}/api/platforms/${editPlatform.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), url: form.url.trim(), userId }),
      })
        .then(res => {
          if (!res.ok) return res.json().then(e => Promise.reject(e));
          return res.json();
        })
        .then(updated => {
          setPlatforms(platforms.map(p => p.id === updated.id ? updated : p));
          setEditPlatform(null);
          setForm(EMPTY_FORM);
          toast.success("Platform updated successfully!");
        })
        .catch(err => toast.error(err?.message || "Failed to update platform."));
    } else {
      // Adding — check duplicate
      if (isDuplicate()) {
        toast.error(`A platform named "${form.name}" already exists.`);
        return;
      }
      fetch(`${API_BASE}/api/platforms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), url: form.url.trim(), userId }),
      })
        .then(res => {
          if (!res.ok) return res.json().then(e => Promise.reject(e));
          return res.json();
        })
        .then(newPlatform => {
          setPlatforms([newPlatform, ...platforms]);
          setForm(EMPTY_FORM);
          toast.success("Platform added successfully!");
        })
        .catch(err => toast.error(err?.message || "Failed to add platform."));
    }
  };

  const handleEdit = (platform) => {
    setEditPlatform(platform);
    setForm({ name: platform.name, url: platform.url, status: platform.status, description: platform.description || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditPlatform(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const confirmDelete = (platform) => {
    setToDelete(platform);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    fetch(`${API_BASE}/api/platforms/${toDelete.id}`, { method: "DELETE" })
      .then(() => {
        setPlatforms(platforms.filter(p => p.id !== toDelete.id));
        if (editPlatform?.id === toDelete.id) handleCancel();
        toast.error(`"${toDelete.name}" removed.`);
        setShowDeleteModal(false);
        setToDelete(null);
      })
      .catch(() => toast.error("Failed to delete platform."));
  };

  const filteredPlatforms = platforms.filter(p => {
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getIcon = (name) => PLATFORM_ICONS[name] || "🌐";

  return (
    <div className="platforms-page">
      <Navbar activePage="/platforms" />

      <div className="platforms-main">
        <div className="platforms-header">
          <h2 className="platforms-header__title">Platform Management</h2>
          <p className="platforms-header__sub">Manage your connected e-commerce platforms.</p>
        </div>

        <div className="platforms-grid">
          {/* ── Form card ── */}
          <div className="platforms-form-card">
            <p className="platforms-card-title">
              {editPlatform !== null ? "✏️ Edit Platform" : "➕ Add Platform"}
            </p>

            <form onSubmit={handleSubmit}>
              <label className="platforms-label">Platform Name *</label>
              <input
                name="name"
                className={`platforms-input${formErrors.name ? " platforms-input--error" : ""}`}
                placeholder="e.g. Shopee, Lazada…"
                value={form.name}
                onChange={handleChange}
              />
              {formErrors.name && <p className="platforms-error">{formErrors.name}</p>}

              <label className="platforms-label">Platform URL *</label>
              <input
                name="url"
                className={`platforms-input${formErrors.url ? " platforms-input--error" : ""}`}
                placeholder="https://www.shopee.ph"
                value={form.url}
                onChange={handleChange}
              />
              {formErrors.url && <p className="platforms-error">{formErrors.url}</p>}

              <label className="platforms-label">Status</label>
              <select name="status" className="platforms-input" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>

              <label className="platforms-label">Description</label>
              <textarea
                name="description"
                className="platforms-input platforms-textarea"
                placeholder="Brief description of this platform…"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />

              <div className="platforms-btn-row">
                {editPlatform !== null && (
                  <button type="button" className="platforms-btn platforms-btn--cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="platforms-btn platforms-btn--submit">
                  {editPlatform !== null ? "Save Changes" : "Add Platform"}
                </button>
              </div>
            </form>
          </div>

          {/* ── List card ── */}
          <div className="platforms-list-card">
            <div className="platforms-list-header">
              <p className="platforms-card-title" style={{ margin: 0 }}>Platforms</p>
              <span className="platforms-count">{filteredPlatforms.length} platform{filteredPlatforms.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="platforms-filter-bar">
              <input
                className="platforms-input platforms-search"
                placeholder="Search platforms…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="platforms-input platforms-filter-select"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                {["All", ...STATUS_OPTIONS].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {filteredPlatforms.length === 0 ? (
              <p className="platforms-empty">No platforms found.</p>
            ) : (
              filteredPlatforms.map(p => (
                <div
                  key={p.id}
                  className={`platforms-item${editPlatform?.id === p.id ? " platforms-item--editing" : ""}`}
                >
                  <div className="platforms-item__icon">{getIcon(p.name)}</div>
                  <div className="platforms-item__body">
                    <p className="platforms-item__name">{p.name}</p>
                    {p.description && <p className="platforms-item__desc">{p.description}</p>}
                    <a href={p.url} target="_blank" rel="noreferrer" className="platforms-item__url">{p.url}</a>
                  </div>
                  <div className="platforms-item__right">
                    <span className={`platforms-status platforms-status--${p.status.toLowerCase()}`}>{p.status}</span>
                    <div className="platforms-item__btns">
                      <button className="platforms-action-btn platforms-action-btn--edit" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="platforms-action-btn platforms-action-btn--del" onClick={() => confirmDelete(p)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="platforms-modal-overlay">
          <div className="platforms-modal">
            <p className="platforms-modal__title">Delete Platform</p>
            <p className="platforms-modal__body">
              Are you sure you want to delete <strong>"{toDelete?.name}"</strong>? This action cannot be undone.
            </p>
            <div className="platforms-modal__btns">
              <button className="platforms-btn platforms-btn--cancel" onClick={() => { setShowDeleteModal(false); setToDelete(null); }}>
                Cancel
              </button>
              <button className="platforms-btn platforms-btn--delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
