import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from '../components/LandingPage';
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import About from "./About";
import Contact from "./Contact";
import Products from "./Products";
import OrderCRUD     from "./Ordercrud";
import ExportOrders  from "./Exportorders";
import SellerProfile from "./Sellerprofile";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders"  element={<OrderCRUD />} />
        <Route path="/export"  element={<ExportOrders />} />
        <Route path="/profile" element={<SellerProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}