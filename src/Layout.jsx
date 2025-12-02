import { Outlet, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import logo from "./assets/images/cellphones-logo.png";
import "./assets/css/layout.css";

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { cartItems } = useCart();

  // Tính tổng số lượng sản phẩm
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="modern-layout">
      {/* --- HEADER --- */}
      <header className="modern-header glass">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="Logo" className="header-logo" />
          </Link>
        </div>

        {/* ✅ Đưa tất cả Link vào trong nav để thẳng hàng */}
        <nav className="header-nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/trang1">Phụ Kiện</Link>
          {user?.role === "admin" && <Link to="/admin/products">Quản trị</Link>}
          <Link to="/trang2">Trang Nhân Viên</Link>
          <Link to="/About">Giới Thiệu</Link>

          {/* ✅ Sửa đường dẫn thành /chat cho khớp với App.js */}
          <Link to="/chat">Chat với AI</Link>

          {/* --- GIỎ HÀNG --- */}
          <Link
            to="/cart"
            className="cart-icon-container"
            style={{
              textDecoration: "none",
              color: "inherit",
              marginLeft: "15px",
            }}
          >
            🛒 Giỏ hàng
            {totalQuantity > 0 && (
              <span
                style={{
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  marginLeft: "5px",
                  verticalAlign: "top",
                }}
              >
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>

        <div className="header-right">
          {user ? (
            <div className="user-info">
              <span className="user-name">👤 {user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="modern-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="modern-footer">
        <p>© 2025 | Trần Nhiệm Thu</p>
      </footer>
    </div>
  );
};

export default Layout;
