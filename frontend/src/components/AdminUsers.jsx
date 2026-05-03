import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useToast } from "./Toast";
import "../styles/AdminUsers.css";

import { IconX, IconPlus, IconEdit, IconTrash } from "./Icons";

const EMPTY_FORM = { email: "", username: "", password: "", role: "USER" };

export default function AdminUsers() {
  const toast = useToast();

  const [users, setUsers]                     = useState([]);
  const [formData, setFormData]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]           = useState({});
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser]       = useState(null);
  const [search, setSearch]                   = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to fetch users:", err));
  };

  const validate = () => {
    const errors = {};
    if (!formData.email)    errors.email    = "Email is required.";
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  const handleAdd = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(newUser => {
        setUsers([...users, newUser]);
        setShowAddModal(false);
        setFormData(EMPTY_FORM);
        toast.success("User added successfully!");
      })
      .catch(() => toast.error("Failed to add user."));
  };

  const handleEdit = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    fetch(`http://localhost:8080/api/users/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(updated => {
        setUsers(users.map(u => u.id === updated.id ? updated : u));
        setShowEditModal(false);
        toast.success("User updated successfully!");
      })
      .catch(() => toast.error("Failed to update user."));
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/users/${selectedUser.id}`, { method: "DELETE" })
      .then(() => {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        toast.success("User deleted successfully!");
      })
      .catch(() => toast.error("Failed to delete user."));
  };

  const openAdd = () => { setFormData(EMPTY_FORM); setFormErrors({}); setShowAddModal(true); };
  const openEdit = (user) => {
    setSelectedUser(user);
    setFormData({ email: user.email, username: user.username, password: user.password, role: user.role });
    setFormErrors({});
    setShowEditModal(true);
  };
  const openDelete = (user) => { setSelectedUser(user); setShowDeleteModal(true); };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const formFields = (
    <>
      <div className="admin-users-form-group">
        <label className="admin-users-form-label">Email</label>
        <input className={`admin-users-form-input${formErrors.email ? " admin-users-form-input--error" : ""}`}
          value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" />
        {formErrors.email && <p className="admin-users-error-text">{formErrors.email}</p>}
      </div>
      <div className="admin-users-form-group">
        <label className="admin-users-form-label">Username</label>
        <input className={`admin-users-form-input${formErrors.username ? " admin-users-form-input--error" : ""}`}
          value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Enter username" />
        {formErrors.username && <p className="admin-users-error-text">{formErrors.username}</p>}
      </div>
      <div className="admin-users-form-group">
        <label className="admin-users-form-label">Password</label>
        <input className={`admin-users-form-input${formErrors.password ? " admin-users-form-input--error" : ""}`}
          value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" />
        {formErrors.password && <p className="admin-users-error-text">{formErrors.password}</p>}
      </div>
      <div className="admin-users-form-group">
        <label className="admin-users-form-label">Role</label>
        <select className="admin-users-form-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="admin-users-page">
      <Navbar activePage="/admin/users" />
      <div className="admin-users-main">
        <h2 className="admin-users-title">User Management</h2>
        <p className="admin-users-sub">Add, edit, and delete user accounts. Manage admin and regular users.</p>
        <div className="admin-users-card">
          <div className="admin-users-top-row">
            <input className="admin-users-search" placeholder="Search by username, email, or role..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="admin-users-add-btn" onClick={openAdd}><IconPlus /> Add User</button>
          </div>
          <table className="admin-users-table">
            <thead>
              <tr>{["ID", "Username", "Email", "Role", "Actions"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="user-id">{user.id}</td>
                  <td className="user-username">{user.username}</td>
                  <td>{user.email}</td>
                  <td><span className={`admin-users-badge admin-users-badge--${user.role.toLowerCase()}`}>{user.role}</span></td>
                  <td>
                    <button className="admin-users-action-btn admin-users-action-btn--edit" onClick={() => openEdit(user)}><IconEdit /> Edit</button>
                    <button className="admin-users-action-btn admin-users-action-btn--delete" onClick={() => openDelete(user)}><IconTrash /> Delete</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="empty-row">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="admin-users-overlay">
          <div className="admin-users-modal">
            <button className="admin-users-modal__close" onClick={() => setShowAddModal(false)}><IconX /></button>
            <p className="admin-users-modal__title">Add New User</p>
            {formFields}
            <div className="admin-users-modal__buttons">
              <button className="admin-users-modal__cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="admin-users-modal__confirm" onClick={handleAdd}>Add User</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="admin-users-overlay">
          <div className="admin-users-modal">
            <button className="admin-users-modal__close" onClick={() => setShowEditModal(false)}><IconX /></button>
            <p className="admin-users-modal__title">Edit User — {selectedUser?.username}</p>
            {formFields}
            <div className="admin-users-modal__buttons">
              <button className="admin-users-modal__cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="admin-users-modal__confirm" onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedUser && (
        <div className="admin-users-overlay">
          <div className="admin-users-modal">
            <button className="admin-users-modal__close" onClick={() => setShowDeleteModal(false)}><IconX /></button>
            <p className="admin-users-modal__title">Delete User</p>
            <p className="admin-users-modal__desc">
              Are you sure you want to delete user <strong>{selectedUser.username}</strong>? This action cannot be undone.
            </p>
            <div className="admin-users-modal__buttons">
              <button className="admin-users-modal__cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="admin-users-modal__confirm admin-users-modal__confirm--danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
