import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Products.css";

const CATEGORIES = ["All", "Electronics", "Clothing", "Shoes", "Accessories"];

const SAMPLE_PRODUCTS = [
  { name: "iPhone 13",    price: 45000, category: "Electronics" },
  { name: "Nike Air Max", price: 5500,  category: "Shoes" },
  { name: "T-Shirt",      price: 300,   category: "Clothing" },
];

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm]         = useState({ name: "", price: "", category: "Electronics" });
  const [editIndex, setEditIndex]       = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products"));
    setProducts(!data || data.length === 0 ? SAMPLE_PRODUCTS : data);
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    const newProduct = { ...form, price: Number(form.price), createdAt: Date.now() };
    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = newProduct;
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts([newProduct, ...products]);
    }
    setForm({ name: "", price: "", category: "Electronics" });
  };

  const handleEdit   = (i) => { setForm(products[i]); setEditIndex(i); };
  const handleDelete = (i) => setProducts(products.filter((_, idx) => idx !== i));

  const filteredProducts = products.filter((p) => {
    const matchCategory = filterCategory === "All" || p.category === filterCategory;
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="products-container" style={{ padding: 0, background: "#f7f7f7" }}>
      <Navbar activePage="/products" />

      <div style={{ padding: "32px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <div className="products-grid">
          {/* LEFT — Add/Edit form */}
          <div className="products-card">
            <div className="products-card__title">
              {editIndex !== null ? "Update Product" : "Add Product"}
            </div>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="products-input" />
              <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="products-input" />
              <select name="category" value={form.category} onChange={handleChange} className="products-input">
                {CATEGORIES.slice(1).map((cat) => <option key={cat}>{cat}</option>)}
              </select>
              <button className="products-submit-btn">
                {editIndex !== null ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>

          {/* RIGHT — Product list */}
          <div className="products-card">
            <div className="products-card__title">Product List</div>
            <div className="products-filter-bar">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="products-input">
                {CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
              </select>
              <input placeholder="Search product..." value={search} onChange={(e) => setSearch(e.target.value)} className="products-input" />
            </div>

            {filteredProducts.length === 0 ? (
              <p className="products-empty">No matching products</p>
            ) : (
              filteredProducts.map((p, i) => (
                <div key={i} className="product-item">
                  <strong>{p.name}</strong><br />
                  <small>{p.category}</small><br />
                  ₱{p.price}
                  <div className="product-item__actions">
                    <button className="product-item__edit-btn"   onClick={() => handleEdit(i)}>Edit</button>
                    <button className="product-item__delete-btn" onClick={() => handleDelete(i)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
