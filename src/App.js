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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/home"     element={<LandingPage />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders"   element={<OrderCRUD />} />
        <Route path="/export"   element={<ExportOrders />} />
        <Route path="/profile"  element={<SellerProfile />} />
        <Route path="*"         element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
