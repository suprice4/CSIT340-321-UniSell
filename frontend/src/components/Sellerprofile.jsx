import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useToast } from "./Toast";
import "../styles/Sellerprofile.css";

import { IconUser, IconEdit, IconSave, IconLock, IconEyeToggle, IconCheck } from "./Icons";



const INITIAL_PASSWORD = { current: "", newPass: "", confirm: "" };

const PLATFORM_COLORS = {
  Shopee:        { color: "#ee4d2d", bg: "#fff1ee" },
  Lazada:        { color: "#0f146b", bg: "#eef0ff" },
  "TikTok Shop": { color: "#010101", bg: "#f3f3f3" },
};


export default function SellerProfile() {
  const EMPTY_PROFILE = {
    firstName: "", lastName: "", email: "", username: "",
    phone: "", storeName: "", address: "", bio: "",
    platforms: ["Shopee", "Lazada", "TikTok Shop"],
  };

  const [profile, setProfile]         = useState(EMPTY_PROFILE);
  const [editProfile, setEditProfile] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing]         = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwords, setPasswords]         = useState(INITIAL_PASSWORD);
  const [passErrors, setPassErrors]       = useState({});
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [activeTab, setActiveTab]         = useState("profile");
  const toast                 = useToast();
  const [loading, setLoading] = useState(true);



  // Clear profile errors on change
  useEffect(() => {
    if (Object.keys(profileErrors).length > 0) setProfileErrors({});
  }, [editProfile]);

  useEffect(() => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return;

  fetch(`http://localhost:8080/api/users`)
    .then(res => res.json())
    .then(users => {
      const found = users.find(u => u.email === loggedInUser.email);
      if (found) {
        const mapped = {
          firstName: found.username,
          lastName:  "",
          email:     found.email,
          username:  found.username,
          phone:     "",
          storeName: "E-Commerce Market Place",
          address:   "",
          bio:       "",
          platforms: ["Shopee", "Lazada", "TikTok Shop"],
        };
        setProfile(mapped);
        setEditProfile(mapped);
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);


  useEffect(() => {
    if (Object.keys(passErrors).length > 0) setPassErrors({});
  }, [passwords]);


  const validateProfile = () => {
    const errors = {};
    if (!editProfile.email)     errors.email     = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(editProfile.email)) errors.email = "Enter a valid email.";
    if (!editProfile.username)  errors.username  = "Username is required.";
    if (!editProfile.storeName) errors.storeName = "Store name is required.";
    return errors;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwords.current) errors.current = "Current password is required.";
    if (!passwords.newPass) errors.newPass = "New password is required.";
    else if (passwords.newPass.length < 6) errors.newPass = "Password must be at least 6 characters.";
    if (!passwords.confirm) errors.confirm = "Please confirm your new password.";
    else if (passwords.newPass !== passwords.confirm) errors.confirm = "Passwords do not match.";
    return errors;
  };


  const handleSaveProfile = () => {
  const errors = validateProfile();
  if (Object.keys(errors).length > 0) { setProfileErrors(errors); return; }

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  fetch(`http://localhost:8080/api/users`)
    .then(res => res.json())
    .then(users => {
      const found = users.find(u => u.email === loggedInUser.email);
      if (!found) return;
      return fetch(`http://localhost:8080/api/users/${found.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    editProfile.email,
          username: editProfile.username,
          password: found.password,
          role:     found.role,
        }),
      });
    })
    .then(() => {
      setProfile(editProfile);
      setIsEditing(false);
      localStorage.setItem("loggedInUser", JSON.stringify({
        email:    editProfile.email,
        username: editProfile.username,
      }));
      toast.success("Profile updated successfully!");
    })
    .catch(() => toast.error("Failed to update profile."));
};

  const handleCancelEdit = () => {
    setEditProfile(profile);
    setIsEditing(false);
    setProfileErrors({});
  };

  const handleSavePassword = () => {
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) { setPassErrors(errors); return; }
    setPasswords(INITIAL_PASSWORD);
    toast.success("Password changed successfully!");
  };

  const togglePlatform = (platform) => {
    const current = editProfile.platforms;
    setEditProfile({
      ...editProfile,
      platforms: current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform],
    });
  };

  // ── Styles ────────────────────────────────────────────────────────────────

  const s = {
    page:          { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },
    main:          { padding: "32px 40px", maxWidth: "900px", margin: "0 auto" },
    pageTitle:     { fontSize: "22px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "4px" },
    pageSub:       { fontSize: "14px", color: "var(--text-muted, #777)", marginBottom: "24px" },
    profileHeader: { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "10px", padding: "24px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" },
    avatar:        { width: "80px", height: "80px", background: "#e85d04", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    profileName:   { fontSize: "20px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "4px" },
    profileRole:   { fontSize: "13px", color: "var(--text-muted, #888)", marginBottom: "8px" },
    platformTags:  { display: "flex", gap: "8px", flexWrap: "wrap" },
    platTag:       (color, bg) => ({ fontSize: "11px", fontWeight: "600", color, background: bg, padding: "3px 10px", borderRadius: "12px" }),
    tabs:          { display: "flex", gap: "4px", background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "10px", padding: "6px", marginBottom: "20px" },
    tab:           (active) => ({ flex: 1, padding: "10px", border: "none", borderRadius: "7px", background: active ? "#e85d04" : "transparent", color: active ? "white" : "#555", fontWeight: active ? "700" : "500", fontSize: "14px", cursor: "pointer" }),
    card:          { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "10px", padding: "24px", marginBottom: "20px" },
    cardHeader:    { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border-color, #f0f0f0)" },
    cardTitle:     { fontSize: "16px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", margin: 0 },
    grid2:         { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    formGroup:     { marginBottom: "16px" },
    label:         { display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--text-primary, #333)" },
    input:         (err) => ({ width: "100%", padding: "9px 12px", border: `1px solid var(--border-color, ${err ? "#e53e3e" : "#ddd"}`, borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #333)", outline: "none", boxSizing: "border-box", background: "var(--section-alt-bg, #fafafa)" }),
    textarea:      { width: "100%", padding: "9px 12px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #333)", outline: "none", boxSizing: "border-box", background: "var(--section-alt-bg, #fafafa)", height: "80px", resize: "vertical" },
    errorText:     { fontSize: "12px", color: "#e53e3e", marginTop: "4px" },
    passWrapper:   (err) => ({ display: "flex", alignItems: "center", gap: "8px", border: `1px solid var(--border-color, ${err ? "#e53e3e" : "#ddd"}`, borderRadius: "6px", padding: "9px 12px", background: "var(--section-alt-bg, #fafafa)" }),
    passInput:     { border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "var(--text-primary, #333)" },
    platGrid:      { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
    platCheck:     (selected) => ({ border: `2px solid ${selected ? "#e85d04" : "#ddd"}`, borderRadius: "8px", padding: "12px", cursor: "pointer", background: selected ? "#fff5f0" : "#fafafa", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: selected ? "600" : "400", color: selected ? "#e85d04" : "#555" }),
    btnRow:        { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" },
    cancelBtn:     { padding: "9px 20px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", background: "var(--card-bg, #fff)", color: "var(--text-muted, #555)", cursor: "pointer", fontSize: "14px" },
    saveBtn:       { display: "flex", alignItems: "center", gap: "6px", padding: "9px 20px", border: "none", borderRadius: "6px", background: "#e85d04", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
    editBtn:       { display: "flex", alignItems: "center", gap: "6px", padding: "9px 20px", border: "1px solid #e85d04", borderRadius: "6px", background: "transparent", color: "#e85d04", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
    infoGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" },
    infoRow:       { padding: "12px 0", borderBottom: "1px solid var(--border-color, #f7f7f7)" },
    infoLabel:     { fontSize: "12px", color: "var(--text-muted, #aaa)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" },
    infoValue:     { fontSize: "14px", color: "var(--text-primary, #333)", fontWeight: "500" },
    toast:         { position: "fixed", bottom: "24px", right: "24px", background: "#276749", color: "white", padding: "12px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", zIndex: 300, display: "flex", alignItems: "center", gap: "8px" },
  };

  return (
    <div style={s.page}>

      {/* ── SHARED NAVBAR — no active page since profile isn't in nav ── */}
      <Navbar activePage="/profile" />

      {/* MAIN */}
      <div style={s.main}>
        <h2 style={s.pageTitle}>Seller Profile</h2>
        <p style={s.pageSub}>View and manage your account information and store settings.</p>

        {/* Profile Header Card */}
        <div style={s.profileHeader}>
          <div style={s.avatar}><IconUser /></div>
          <div className="profile-bio-wrap">
            <p style={s.profileName}>{profile.firstName} {profile.lastName}</p>
            <p style={s.profileRole}>@{profile.username} · {profile.storeName}</p>
            <div style={s.platformTags}>
              {profile.platforms.map((p) => (
                <span key={p} style={s.platTag(PLATFORM_COLORS[p]?.color, PLATFORM_COLORS[p]?.bg)}>{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          <button style={s.tab(activeTab === "profile")}   onClick={() => setActiveTab("profile")}>Profile Information</button>
          <button style={s.tab(activeTab === "password")}  onClick={() => setActiveTab("password")}>Change Password</button>
          <button style={s.tab(activeTab === "platforms")} onClick={() => setActiveTab("platforms")}>Platform Settings</button>
        </div>

        {/* ── TAB: Profile Information ── */}
        {activeTab === "profile" && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <p style={s.cardTitle}>Personal Information</p>
              {!isEditing && (
                <button style={s.editBtn} onClick={() => setIsEditing(true)}>
                  <IconEdit /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <>
                <div style={s.grid2}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Email</label>
                    <input style={s.input(!!profileErrors.email)} value={editProfile.email} onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })} placeholder="Email address" />
                    {profileErrors.email && <p style={s.errorText}>{profileErrors.email}</p>}
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Username</label>
                    <input style={s.input(!!profileErrors.username)} value={editProfile.username} onChange={(e) => setEditProfile({ ...editProfile, username: e.target.value })} placeholder="Username" />
                    {profileErrors.username && <p style={s.errorText}>{profileErrors.username}</p>}
                  </div>
                </div>
                <div style={s.grid2}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Phone Number</label>
                    <input style={s.input(false)} value={editProfile.phone} onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })} placeholder="Phone number" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Store Name</label>
                    <input style={s.input(!!profileErrors.storeName)} value={editProfile.storeName} onChange={(e) => setEditProfile({ ...editProfile, storeName: e.target.value })} placeholder="Store name" />
                    {profileErrors.storeName && <p style={s.errorText}>{profileErrors.storeName}</p>}
                  </div>
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Address</label>
                  <input style={s.input(false)} value={editProfile.address} onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })} placeholder="Address" />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Bio</label>
                  <textarea style={s.textarea} value={editProfile.bio} onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} placeholder="Tell us about your store..." />
                </div>
                <div style={s.btnRow}>
                  <button style={s.cancelBtn} onClick={handleCancelEdit}>Cancel</button>
                  <button style={s.saveBtn} onClick={handleSaveProfile}><IconSave /> Save Changes</button>
                </div>
              </>
            ) : (
              <div style={s.infoGrid}>
                {[
                  { label: "First Name",  value: profile.firstName },
                  { label: "Last Name",   value: profile.lastName  },
                  { label: "Email",       value: profile.email     },
                  { label: "Username",    value: `@${profile.username}` },
                  { label: "Phone",       value: profile.phone     },
                  { label: "Store Name",  value: profile.storeName },
                  { label: "Address",     value: profile.address   },
                  { label: "Bio",         value: profile.bio       },
                ].map((item) => (
                  <div key={item.label} style={s.infoRow}>
                    <p style={s.infoLabel}>{item.label}</p>
                    <p style={s.infoValue}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Change Password ── */}
        {activeTab === "password" && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <p style={s.cardTitle}>Change Password</p>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Current Password</label>
              <div style={s.passWrapper(!!passErrors.current)}>
                <IconLock />
                <input type={showCurrent ? "text" : "password"} style={s.passInput} placeholder="Enter current password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                <span onClick={() => setShowCurrent((p) => !p)}><IconEyeToggle show={showCurrent} /></span>
              </div>
              {passErrors.current && <p style={s.errorText}>{passErrors.current}</p>}
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>New Password</label>
              <div style={s.passWrapper(!!passErrors.newPass)}>
                <IconLock />
                <input type={showNew ? "text" : "password"} style={s.passInput} placeholder="Enter new password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
                <span onClick={() => setShowNew((p) => !p)}><IconEyeToggle show={showNew} /></span>
              </div>
              {passErrors.newPass && <p style={s.errorText}>{passErrors.newPass}</p>}
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Confirm New Password</label>
              <div style={s.passWrapper(!!passErrors.confirm)}>
                <IconLock />
                <input type={showConfirm ? "text" : "password"} style={s.passInput} placeholder="Confirm new password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                <span onClick={() => setShowConfirm((p) => !p)}><IconEyeToggle show={showConfirm} /></span>
              </div>
              {passErrors.confirm && <p style={s.errorText}>{passErrors.confirm}</p>}
            </div>
            <div style={s.btnRow}>
              <button style={s.cancelBtn} onClick={() => { setPasswords(INITIAL_PASSWORD); setPassErrors({}); }}>Clear</button>
              <button style={s.saveBtn} onClick={handleSavePassword}><IconSave /> Update Password</button>
            </div>
          </div>
        )}

        {/* ── TAB: Platform Settings ── */}
        {activeTab === "platforms" && (
          <div style={s.card}>
            <div style={s.cardHeader}>
              <p style={s.cardTitle}>Connected Platforms</p>
            </div>
            <p className="profile-platform-info">Select which platforms your store is connected to.</p>
            <div style={s.platGrid}>
              {["Shopee", "Lazada", "TikTok Shop"].map((platform) => {
                const selected = editProfile.platforms.includes(platform);
                return (
                  <div key={platform} style={s.platCheck(selected)} onClick={() => togglePlatform(platform)}>
                    {selected && <IconCheck />}
                    <span>{platform}</span>
                  </div>
                );
              })}
            </div>
            <div style={s.btnRow}>
              <button style={s.saveBtn} onClick={() => {
                setProfile({ ...profile, platforms: editProfile.platforms });
                toast.success("Platform settings saved!");
              }}>
                <IconSave /> Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      {/* ── SHARED FOOTER ── */}
      <Footer />

    </div>
  );
}