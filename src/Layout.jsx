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

        <nav className="header-nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/trang1">Phụ Kiện</Link>
          {user?.role === "admin" && <Link to="/admin/products">Quản trị</Link>}
          <Link to="/trang2">Nhân Viên</Link>
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
              <span className="user-name">🦅 {user.username}</span>
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

      {/* --- FOOTER MỚI --- */}
      <footer className="modern-footer">
        <div className="footer-container">
          {/* Cột 1: Thông tin liên hệ */}
          <div className="footer-column">
            <h3>Liên Hệ</h3>
            <p>📍 Địa chỉ: 33 Vĩnh Viễn, Phường Vườn Lài, TP.HCM</p>
            <p>📧 Email: support@cellphones.com</p>
            <p>📞 Hotline: 1800.2097</p>

            <div className="social-links">
              {/* Bạn có thể thay bằng icon nếu có cài FontAwesome */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn facebook"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-btn instagram"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Cột 2: Bản đồ */}
          <div className="footer-column map-column">
            <h3>Bản Đồ</h3>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.69932291533418!3d10.773374262204593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14565e63e419!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 | Trần Nhiệm Thu - 23662050</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
