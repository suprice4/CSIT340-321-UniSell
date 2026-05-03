import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useToast } from "./Toast";
import "../styles/Products.css";

const CATEGORIES = ["All", "Electronics", "Clothing", "Shoes", "Accessories"];

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast    = useToast();

  const [products, setProducts]             = useState([]);
  const [form, setForm]                     = useState({ name: "", price: "", category: "Electronics" });
  const [editProduct, setEditProduct]       = useState(null); // holds the full product object being edited
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch]                 = useState("");

  // Fetch products from Spring Boot
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  // Read ?search= from URL (order-to-product link)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q) {
      setSearch(q);
      navigate("/products", { replace: true });
    }
  }, [location.search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = { name: form.name, price: Number(form.price), category: form.category };

    if (editProduct !== null) {
      // UPDATE
      fetch(`http://localhost:8080/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(updated => {
          setProducts(products.map(p => p.id === updated.id ? updated : p));
          setEditProduct(null);
          setForm({ name: "", price: "", category: "Electronics" });
          toast.success("Product updated successfully!");
        })
        .catch(() => toast.error("Failed to update product."));
    } else {
      // CREATE
      fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(res => res.json())
        .then(newProduct => {
          setProducts([newProduct, ...products]);
          setForm({ name: "", price: "", category: "Electronics" });
          toast.success("Product added successfully!");
        })
        .catch(() => toast.error("Failed to add product."));
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({ name: product.name, price: product.price, category: product.category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (product) => {
    fetch(`http://localhost:8080/api/products/${product.id}`, { method: "DELETE" })
      .then(() => {
        setProducts(products.filter(p => p.id !== product.id));
        toast.error(`"${product.name}" removed from products.`);
      })
      .catch(() => toast.error("Failed to delete product."));
  };

  const handleCancel = () => {
    setEditProduct(null);
    setForm({ name: "", price: "", category: "Electronics" });
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const s = {
    page:      { fontFamily: "'Segoe UI', sans-serif", background: "var(--page-bg, #f5f5f5)", color: "var(--text-primary, #222)", minHeight: "100vh" },
    main:      { padding: "32px 40px", maxWidth: "1100px", margin: "0 auto" },
    grid:      { display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px", alignItems: "start" },
    card:      { background: "var(--card-bg, #fff)", border: "1px solid var(--border-color, #e0e0e0)", borderRadius: "10px", padding: "24px" },
    title:     { fontSize: "16px", fontWeight: "700", color: "var(--text-primary, #1a1a1a)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border-color, #f0f0f0)" },
    label:     { display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-primary, #333)", marginBottom: "6px" },
    input:     { width: "100%", padding: "9px 12px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #333)", outline: "none", boxSizing: "border-box", background: "var(--section-alt-bg, #fafafa)", marginBottom: "14px" },
    btnRow:    { display: "flex", gap: "8px", marginTop: "4px" },
    subBtn:    { flex: 1, background: "#e85d04", color: "white", border: "none", borderRadius: "6px", padding: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
    canBtn:    { padding: "10px 16px", background: "none", border: "1px solid var(--border-color,#ddd)", borderRadius: "6px", fontSize: "14px", color: "var(--text-muted,#555)", cursor: "pointer" },
    filterBar: { display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" },
    filterSel: { flex: 1, padding: "9px 12px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #444)", background: "var(--section-alt-bg, #fafafa)", outline: "none" },
    searchBox: { flex: 2, padding: "9px 12px", border: "1px solid var(--border-color, #ddd)", borderRadius: "6px", fontSize: "14px", color: "var(--text-primary, #444)", background: "var(--section-alt-bg, #fafafa)", outline: "none" },
    empty:     { textAlign: "center", padding: "32px", color: "var(--text-muted, #aaa)", fontSize: "14px" },
    item:      { border: "1px solid var(--border-color, #eee)", borderRadius: "8px", padding: "14px 16px", marginBottom: "10px", background: "var(--section-alt-bg, #fafafa)", display: "flex", justifyContent: "space-between", alignItems: "center" },
    itemLeft:  { flex: 1 },
    itemName:  { fontSize: "14px", fontWeight: "600", color: "var(--text-primary,#222)", marginBottom: "3px" },
    itemSub:   { fontSize: "12px", color: "var(--text-muted,#888)" },
    itemPrice: { fontSize: "14px", fontWeight: "700", color: "#e85d04", margin: "0 16px" },
    itemBtns:  { display: "flex", gap: "6px" },
    editBtn:   { padding: "5px 12px", background: "#fffbf0", color: "#e85d04", border: "1px solid #e85d04", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
    delBtn:    { padding: "5px 12px", background: "#fff5f5", color: "#e53e3e", border: "1px solid #e53e3e", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  };

  return (
    <div style={s.page}>
      <Navbar activePage="/products" />

      <div style={s.main}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-primary,#1a1a1a)", marginBottom: "4px" }}>
            Product Catalog
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted,#777)" }}>
            Manage your products across all platforms.
          </p>
        </div>

        <div style={s.grid}>
          {/* ── LEFT: Add/Edit form ── */}
          <div style={s.card}>
            <p style={s.title}>{editProduct !== null ? "✏️ Edit Product" : "➕ Add Product"}</p>
            <form onSubmit={handleSubmit}>
              <label style={s.label}>Product Name *</label>
              <input name="name" placeholder="e.g. Wireless Earbuds" value={form.name}
                onChange={handleChange} style={s.input} />

              <label style={s.label}>Price (₱) *</label>
              <input name="price" type="number" min="0" placeholder="e.g. 850"
                value={form.price} onChange={handleChange} style={s.input} />

              <label style={s.label}>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={s.input}>
                {CATEGORIES.slice(1).map((cat) => <option key={cat}>{cat}</option>)}
              </select>

              <div style={s.btnRow}>
                {editProduct !== null && (
                  <button type="button" style={s.canBtn} onClick={handleCancel}>Cancel</button>
                )}
                <button type="submit" style={s.subBtn}>
                  {editProduct !== null ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>

          {/* ── RIGHT: Product list ── */}
          <div style={s.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border-color,#f0f0f0)" }}>
              <p style={{ ...s.title, marginBottom: 0, paddingBottom: 0, border: "none" }}>
                Product List
              </p>
              <span style={{ fontSize: "13px", color: "var(--text-muted,#888)" }}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div style={s.filterBar}>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={s.filterSel}>
                {CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
              <input
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={s.searchBox}
              />
            </div>

            {search && (
              <div style={{ marginBottom: "12px", fontSize: "13px", color: "var(--text-muted,#888)" }}>
                {filteredProducts.length > 0
                  ? `Showing results for "${search}"`
                  : `No products found for "${search}"`}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <p style={s.empty}>No matching products found.</p>
            ) : (
              filteredProducts.map((p) => (
                <div key={p.id} style={{
                  ...s.item,
                  background: editProduct?.id === p.id ? "#fff8f4" : "var(--section-alt-bg,#fafafa)",
                  border: editProduct?.id === p.id ? "1px solid #e85d04" : "1px solid var(--border-color,#eee)",
                }}>
                  <div style={s.itemLeft}>
                    <p style={s.itemName}>{p.name}</p>
                    <p style={s.itemSub}>{p.category}</p>
                  </div>
                  <span style={s.itemPrice}>₱{Number(p.price).toLocaleString()}</span>
                  <div style={s.itemBtns}>
                    <button style={s.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                    <button style={s.delBtn} onClick={() => handleDelete(p)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}