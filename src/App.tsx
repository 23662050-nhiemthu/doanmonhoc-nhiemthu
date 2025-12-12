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

//@ts-ignore
import AdminEditProduct from "./AdminEditProduct";

import ChatPage from "./ChatPage";
import { CartProvider } from "./CartContext";
import CartPage from "./CartPage";

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ListProducts_SP />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="trang1" element={<Trang1 />} />
            <Route path="trang2" element={<Trang2 />} />
            <Route path="sanpham/:id" element={<Chitietsanpham />} />
            <Route path="detail/:id" element={<ProductDetail />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="logout" element={<LogoutPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* KHU VỰC ADMIN */}
            <Route
              path="admin/products"
              element={
                <ProtectedRoute>
                  <ListProducts_SP_Admin />
                </ProtectedRoute>
              }
            />

            {/* ✅ MỚI: Route cho trang Thêm/Sửa (nằm trong ProtectedRoute luôn để bảo mật) */}
            <Route
              path="admin/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminEditProduct />
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
