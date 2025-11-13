import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "./assets/images/cellphones-logo.png";
import "./assets/css/layout.css";

const Layout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
          <a href="/">
            <img src={logo} alt="Logo" className="header-logo" />
          </a>
        </div>

        <nav className="header-nav">
          <a href="/">Trang chủ</a>
          <a href="/trang1">Phụ Kiện</a>
          {user?.role === "admin" && <a href="/admin/products">Quản trị</a>}
          <a href="/trang2">Trang Sinh Viên</a>
          <a href="/About">Giới Thiệu</a>
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
            <a href="/login" className="login-btn">
              Đăng nhập
            </a>
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
