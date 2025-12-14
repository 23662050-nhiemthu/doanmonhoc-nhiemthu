import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import logo from "./assets/images/cellphones-logo.png";
import "./assets/css/layout.css";

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems } = useCart();

  // Tính tổng số lượng (Chỉ dùng cho khách)
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user_token");
    setUser(null);
    alert("Đã đăng xuất!");
    window.location.href = "/login";
  };

  return (
    <div className="modern-layout">
      {/* --- HEADER --- */}
      <header className="modern-header glass">
        <div className="header-left">
          {/* Logo vẫn giữ để nhìn cho đẹp, nhưng bấm vào vẫn về trang chủ */}
          <Link to="/">
            <img src={logo} alt="Logo" className="header-logo" />
          </Link>
        </div>

        <nav className="header-nav">
          {/* 🔴 LOGIC CỰC KỲ NGHIÊM NGẶT TẠI ĐÂY */}

          {user && user.role === "admin" ? (
            /* =========================================
                TRƯỜNG HỢP 1: LÀ ADMIN
                => CHỈ HIỆN DUY NHẤT 1 NÚT QUẢN TRỊ
             ========================================= */
            <Link
              to="/admin/dashboard"
              style={{
                color: "#d70018",
                fontWeight: "bold",
                fontSize: "16px",
                textTransform: "uppercase",
                borderBottom: "2px solid #d70018",
                paddingBottom: "5px",
              }}
            >
              ⚙️ HỆ THỐNG QUẢN TRỊ
            </Link>
          ) : (
            /* =========================================
                TRƯỜNG HỢP 2: LÀ KHÁCH HÀNG (HOẶC CHƯA LOGIN)
                => HIỆN ĐẦY ĐỦ MENU MUA SẮM
             ========================================= */
            <>
              <Link to="/">Trang chủ</Link>
              <Link to="/trang1">Phụ Kiện</Link>
              <Link to="/trang2">Nhân Viên</Link>
              <Link to="/chat">Chat AI</Link>

              {/* Giỏ hàng chỉ dành cho khách */}
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
            </>
          )}
        </nav>

        <div className="header-right">
          {user ? (
            <div className="user-info">
              <span className="user-name">
                {user.role === "admin"
                  ? "👑 Quản Trị Viên"
                  : `👤 ${user.fullname || user.username}`}
              </span>
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
        <div className="footer-container">
          <div className="footer-column">
            <h3>Hệ thống CellphoneS (Fake)</h3>
            <p>📍 Địa chỉ: 33 Vĩnh Viễn, TP.HCM</p>
          </div>
          <div className="footer-column map-column">{/* Map giữ nguyên */}</div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 | Dự án của Trần Nhiệm Thu</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
