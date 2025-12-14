import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import anhlogo1 from "./assets/images/login.png";
import "./assets/css/Login.css";
import { supabase } from "./supabaseClient";

// 1. HÀM HASH (GIỮ NGUYÊN)
const sha256 = async (text) => {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate(); // Không cần dùng navigate nữa vì ta dùng window.location

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("❌ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);

    try {
      const hashInput = await sha256(password);

      const { data: userData, error } = await supabase
        .from("user")
        .select(`id, username, password_hash, fullname, email, role`)
        .eq("username", username)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error(error.message || "Lỗi khi truy vấn database!");
      }

      if (!userData) {
        alert("❌ Tên đăng nhập không tồn tại!");
        setLoading(false);
        return;
      }

      if (hashInput !== userData.password_hash) {
        alert("❌ Mật khẩu không đúng!");
        setLoading(false);
        return;
      }

      const role = userData.role || "customer";

      const userInfo = {
        id: userData.id,
        username: userData.username,
        fullname: userData.fullname,
        role: role,
      };

      // Lưu cả 2 key cho chắc chắn
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("user_token", JSON.stringify(userInfo));

      alert(`✅ Đăng nhập thành công! Xin chào ${userData.fullname}`);
      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert(`⚠️ Lỗi hệ thống: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- ICON SVG ---
  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
  const EyeOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <div className="login-wrapper">
      <div className="login-card shadow">
        <img src={anhlogo1} alt="Logo" className="login-logo" />

        <h2 className="login-title">Đăng nhập</h2>
        <p className="login-subtitle">Nhập thông tin tài khoản của bạn</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "⏳ Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="register-link">
          Bạn chưa có tài khoản? <a href="/register">Tạo tài khoản mới</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
