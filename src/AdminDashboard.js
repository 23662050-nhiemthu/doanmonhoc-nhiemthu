import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cardStyle = {
    cursor: "pointer",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s",
    backgroundColor: "white",
    height: "100%",
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "1000px" }}>
      {" "}
      {/* Tăng width lên xíu */}
      <div className="text-center mb-5">
        <h2 style={{ color: "#333", fontWeight: "bold" }}>
          👋 Xin chào Quản trị viên!
        </h2>
        <p className="text-muted">Hệ thống quản lý cửa hàng CellphoneS</p>
      </div>
      <div className="row justify-content-center">
        {/* Ô 1: Quản lý Sản phẩm */}
        <div className="col-md-4 mb-4">
          <div
            style={{ ...cardStyle, borderTop: "5px solid #28a745" }}
            onClick={() => navigate("/admin/products")}
          >
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>📦</div>
            <h3>Sản Phẩm</h3>
            <p className="text-muted">Kho hàng & Giá cả</p>
          </div>
        </div>

        {/* Ô 2: Quản lý Người dùng */}
        <div className="col-md-4 mb-4">
          <div
            style={{ ...cardStyle, borderTop: "5px solid #007bff" }}
            onClick={() => navigate("/admin/user")}
          >
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>👥</div>
            <h3>Người Dùng</h3>
            <p className="text-muted">Thành viên & Tài khoản</p>
          </div>
        </div>

        {/* ✅ Ô 3: MỚI THÊM - Quản lý Đơn hàng */}
        <div className="col-md-4 mb-4">
          <div
            style={{ ...cardStyle, borderTop: "5px solid #ffc107" }} // Màu vàng
            onClick={() => navigate("/admin/orders")}
          >
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🛒</div>
            <h3>Đơn Hàng</h3>
            <p className="text-muted">Kiểm tra đơn & Giao hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
