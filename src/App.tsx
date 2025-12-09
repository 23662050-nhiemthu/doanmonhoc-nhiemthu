import "./styles.css";
// @ts-ignore
import Home from "./Home";
// @ts-ignore
import Layout from "./Layout";
// @ts-ignore
import Trang1 from "./Trang1";
// @ts-ignore
import Chitietsanpham from "./Chitietsanpham";
// @ts-ignore
import Trang2 from "./Trang2";
// @ts-ignore
import ListProducts from "./ListProducts";
// @ts-ignore
import ProductDetail from "./ProductDetail";
// @ts-ignore
import ListProducts_SP from "./ListProducts_SP";
// @ts-ignore
import About from "./About";

import { BrowserRouter, Routes, Route } from "react-router-dom";

//@ts-ignore
import LoginPage from "./LoginPage";
//@ts-ignore
import LogoutPage from "./LogoutPage";
//@ts-ignore
import RegisterPage from "./RegisterPage";
//@ts-ignore
import ProtectedRoute from "./ProtectedRoute";
//@ts-ignore
import ListProducts_SP_Admin from "./ListProducts_SP_Admin";

import ChatPage from "./ChatPage"; // ✅ Import trang Chat

// --- IMPORT MỚI CHO GIỎ HÀNG ---
import { CartProvider } from "./CartContext"; // Context vừa sửa ở Bước 1
import CartPage from "./CartPage"; // Trang hiển thị giỏ hàng (Xem bước 3)

const App = () => {
  //return <Layout />;
  return (
    // ✅ 1. Bọc Provider ở ngoài cùng để state giỏ hàng sống toàn app
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ✅ Layout chung cho toàn bộ hệ thống */}
          <Route path="/" element={<Layout />}>
            {/* Trang chính (cho người dùng vãng lai) */}
            <Route index element={<ListProducts_SP />} />

            {/* ✅ 2. Thêm Route cho Giỏ Hàng */}
            <Route path="cart" element={<CartPage />} />
            <Route path="chat" element={<ChatPage />} />

            <Route path="trang1" element={<Trang1 />} />
            <Route path="trang2" element={<Trang2 />} />
            <Route path="sanpham/:id" element={<Chitietsanpham />} />
            <Route path="detail/:id" element={<ProductDetail />} />
            <Route path="About" element={<About />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="admin/products"
              element={
                <ProtectedRoute>
                  <ListProducts_SP_Admin />
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
