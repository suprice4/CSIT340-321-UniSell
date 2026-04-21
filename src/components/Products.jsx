import { useState, useEffect } from "react";

const CATEGORIES = ["All", "Electronics", "Clothing", "Shoes", "Accessories"];

const SAMPLE_PRODUCTS = [
  { name: "iPhone 13", price: 45000, category: "Electronics" },
  { name: "Nike Air Max", price: 5500, category: "Shoes" },
  { name: "T-Shirt", price: 300, category: "Clothing" }
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Electronics"
  });
  const [editIndex, setEditIndex] = useState(null);

  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products"));
    if (!data || data.length === 0) {
      setProducts(SAMPLE_PRODUCTS);
    } else {
      setProducts(data);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price) return;

    const newProduct = {
      ...form,
      price: Number(form.price),
      createdAt: Date.now()
    };

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

  const handleEdit = (index) => {
    setForm(products[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // FILTER LOGIC
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      filterCategory === "All" || p.category === filterCategory;

    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const s = {
    container: {
      padding: "40px",
      background: "#f7f7f7",
      minHeight: "100vh"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px"
    },
    card: {
      background: "#fff",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "15px"
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px"
    },
    button: {
      width: "100%",
      padding: "10px",
      background: "#e85d04",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    },
    productItem: {
      padding: "10px 0",
      borderBottom: "1px solid #eee"
    },
    filterBar: {
      display: "flex",
      gap: "10px",
      marginBottom: "15px"
    },
    actions: { marginTop: "5px" },
    editBtn: {
      marginRight: "8px",
      background: "#2a9d8f",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer"
    },
    deleteBtn: {
      background: "#e63946",
      color: "#fff",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer"
    }
  };

  return (
    <div style={s.container}>
      <div style={s.grid}>

        {/* LEFT */}
        <div style={s.card}>
          <div style={s.title}>Add / Update Product</div>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              style={s.input}
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              style={s.input}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={s.input}
            >
              {CATEGORIES.slice(1).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <button style={s.button}>
              {editIndex !== null ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>

        {/* RIGHT */}
        <div style={s.card}>
          <div style={s.title}>Product List</div>

          {/* FILTERS */}
          <div style={s.filterBar}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={s.input}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.input}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <p>No matching products</p>
          ) : (
            filteredProducts.map((p, i) => (
              <div key={i} style={s.productItem}>
                <strong>{p.name}</strong><br />
                <small>{p.category}</small><br />
                ₱{p.price}

                <div style={s.actions}>
                  <button
                    style={s.editBtn}
                    onClick={() => handleEdit(i)}
                  >
                    Edit
                  </button>
                  <button
                    style={s.deleteBtn}
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}