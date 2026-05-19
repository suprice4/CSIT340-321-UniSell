import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import LandingPage   from "./components/LandingPage";
import Login         from "./components/Login";
import Register      from "./components/Register";
import Dashboard     from "./components/Dashboard";
import About         from "./components/About";
import Contact       from "./components/Contact";
import Products      from "./components/Products";
import Platforms     from "./components/Platforms";
import OrderCRUD     from "./components/Ordercrud";
import ExportOrders  from "./components/Exportorders";
import SellerProfile from "./components/Sellerprofile";
import AdminUsers    from "./components/AdminUsers";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/home"     element={<LandingPage />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products"    element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/platforms"   element={<ProtectedRoute><Platforms /></ProtectedRoute>} />
          <Route path="/orders"      element={<ProtectedRoute><OrderCRUD /></ProtectedRoute>} />
          <Route path="/export"      element={<ProtectedRoute><ExportOrders /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><SellerProfile /></ProtectedRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}