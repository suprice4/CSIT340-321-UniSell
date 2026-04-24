import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage   from "./components/LandingPage";
import Login         from "./components/Login";
import Register      from "./components/Register";
import Dashboard     from "./components/Dashboard";
import About         from "./components/About";
import Contact       from "./components/Contact";
import Products      from "./components/Products";
import OrderCRUD     from "./components/Ordercrud";
import ExportOrders  from "./components/Exportorders";
import SellerProfile from "./components/Sellerprofile";

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Wraps any route that requires login.
// If isLoggedIn is false in localStorage, redirect to /login automatically.

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — anyone can access these */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/home"     element={<LandingPage />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />

        {/* Protected routes — must be logged in */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products"  element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/orders"    element={<ProtectedRoute><OrderCRUD /></ProtectedRoute>} />
        <Route path="/export"    element={<ProtectedRoute><ExportOrders /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><SellerProfile /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
