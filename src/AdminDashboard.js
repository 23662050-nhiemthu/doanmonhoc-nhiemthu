import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">👋 Xin chào, Quản trị viên!</h2>

      <div className="row justify-content-center">
        {/* Thẻ Quản lý Sản phẩm */}
        <div className="col-md-5 mb-4">
          <div
            className="card shadow p-4 text-center"
            style={{ cursor: "pointer", borderLeft: "5px solid #28a745" }}
            onClick={() => navigate("/admin/products")}
          >
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>📦</div>
            <h3>Quản lý Sản phẩm</h3>
            <p className="text-muted">Thêm, sửa, xóa các sản phẩm trong kho.</p>
            <button className="btn btn-success mt-2">Truy cập ngay</button>
          </div>
        </div>

        {/* Thẻ Quản lý Người dùng */}
        <div className="col-md-5 mb-4">
          <div
            className="card shadow p-4 text-center"
            style={{ cursor: "pointer", borderLeft: "5px solid #007bff" }}
            onClick={() => navigate("/admin/user")}
          >
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>👥</div>
            <h3>Quản lý Người dùng</h3>
            <p className="text-muted">
              Xem danh sách, xóa tài khoản thành viên.
            </p>
            <button className="btn btn-primary mt-2">Truy cập ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
