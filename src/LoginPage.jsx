import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import anhlogo1 from "./assets/images/login.png";
import "./assets/css/Login.css";
import { supabase } from "./supabaseClient";

// 1. CHUYỂN HÀM HASH RA NGOÀI (TỐI ƯU HÓA)
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("❌ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);

    try {
      // 2. TẠO HASH TỪ MẬT KHẨU NHẬP VÀO
      const hashInput = await sha256(password);

      // 3. TRUY VẤN SUPABASE - ĐÃ XÓA TRUY VẤN tbl_roles để tránh lỗi
      const { data: userData, error } = await supabase
        .from("user")
        .select(`id, username, password_hash, fullname, email`)
        .eq("username", username)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 là lỗi không tìm thấy (No rows returned)
        // Xử lý lỗi truy vấn database nghiêm trọng hơn
        throw new Error(error.message || "Lỗi khi truy vấn database!");
      }

      // 4. KIỂM TRA TỒN TẠI VÀ MẬT KHẨU
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

      // 5. ĐĂNG NHẬP THÀNH CÔNG VÀ LƯU THÔNG TIN
      // Dùng 'admin' nếu username là 'admin', còn lại mặc định là 'user'
      const role = userData.username === "admin" ? "admin" : "user";

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id,
          username: userData.username,
          fullname: userData.fullname,
          role,
        })
      );

      alert(`✅ Đăng nhập thành công! Xin chào ${userData.fullname}`);
      navigate("/");
      window.location.reload(); // Reload Layout để cập nhật trạng thái Đăng nhập
    } catch (err) {
      console.error(err);
      alert(
        `⚠️ Lỗi hệ thống khi đăng nhập: ${
          err.message || "Vui lòng kiểm tra console."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card shadow">
        {/* Đảm bảo đường dẫn ảnh: login.png phải nằm trong assets/images/ */}
        <img src={anhlogo1} alt="Logo" className="login-logo" />

        <h2 className="login-title">Đăng nhập</h2>
        <p className="login-subtitle">Nhập thông tin tài khoản của bạn</p>

        <form onSubmit={handleLogin} className="login-form">
          {/* ... Phần nhập liệu giữ nguyên ... */}
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
