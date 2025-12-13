import "./styles.css";

// @ts-ignore
import Layout from "./Layout";
// @ts-ignore
import Trang1 from "./Trang1";
// @ts-ignore
import Chitietsanpham from "./Chitietsanpham";
// @ts-ignore
import Trang2 from "./Trang2";
// @ts-ignore
import ProductDetail from "./ProductDetail";
// @ts-ignore
import ListProducts_SP from "./ListProducts_SP";

import { BrowserRouter, Routes, Route } from "react-router-dom";

//@ts-ignore
import LoginPage from "./LoginPage";
//@ts-ignore
import LogoutPage from "./LogoutPage";
//@ts-ignore
import RegisterPage from "./RegisterPage";
//@ts-ignore
import ProtectedRoute from "./ProtectedRoute";

// --- CÁC TRANG ADMIN ---
//@ts-ignore
import AdminDashboard from "./AdminDashboard"; // Trang chủ Admin
//@ts-ignore
import ListProducts_SP_Admin from "./ListProducts_SP_Admin"; // Quản lý Sản phẩm
//@ts-ignore
import AdminEditProduct from "./AdminEditProduct"; // Thêm/Sửa Sản phẩm
// @ts-ignore
import UserManagement from "./UserManagement"; // Quản lý User
// @ts-ignore
import AdminEditUser from "./AdminEditUser"; // Sửa User
// @ts-ignore
import OrderManagement from "./OrderManagement"; // ✅ MỚI: Quản lý Đơn hàng

import ChatPage from "./ChatPage";
import { CartProvider } from "./CartContext";
import CartPage from "./CartPage";
// @ts-ignore
import CheckoutPage from "./CheckoutPage";

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* --- KHU VỰC KHÁCH HÀNG --- */}
            <Route index element={<ListProducts_SP />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="trang1" element={<Trang1 />} />
            <Route path="trang2" element={<Trang2 />} />
            <Route path="sanpham/:id" element={<Chitietsanpham />} />
            <Route path="detail/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- KHU VỰC ADMIN (Đã được bảo vệ) --- */}

            {/* 1. Trang chủ Admin (Dashboard) */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 2. Quản lý Sản phẩm */}
            <Route
              path="admin/products"
              element={
                <ProtectedRoute>
                  <ListProducts_SP_Admin />
                </ProtectedRoute>
              }
            />
            {/* Thêm/Sửa Sản phẩm */}
            <Route
              path="admin/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminEditProduct />
                </ProtectedRoute>
              }
            />

            {/* 3. Quản lý Người dùng */}
            <Route
              path="admin/user"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            {/* Sửa Người dùng */}
            <Route
              path="admin/user/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminEditUser />
                </ProtectedRoute>
              }
            />

            {/* ✅ 4. Quản lý Đơn hàng (MỚI) */}
            <Route
              path="admin/orders"
              element={
                <ProtectedRoute>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
