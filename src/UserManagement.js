import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom"; // 👈 1. Import thêm cái này

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 👈 2. Khai báo hàm chuyển trang

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Lỗi:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Chắc chắn xóa user này?")) {
      const { error } = await supabase.from("user").delete().eq("id", id);
      if (error) alert("Lỗi xóa: " + error.message);
      else {
        alert("Đã xóa!");
        fetchUsers();
      }
    }
  };

  if (loading) return <div className="p-4">⏳ Đang tải danh sách...</div>;

  return (
    <div className="container mt-5" style={{ padding: "20px" }}>
      <h2 className="mb-4">👥 Danh sách Tài khoản</h2>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Quyền (Role)</th> {/* Thêm cột Role cho rõ */}
              <th style={{ width: "180px", textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có dữ liệu user.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td style={{ fontWeight: "bold", color: "blue" }}>
                    {u.username}
                  </td>
                  <td>{u.fullname}</td>
                  <td>{u.email}</td>
                  <td>
                    {/* Hiển thị badge màu cho đẹp */}
                    <span
                      className={`badge ${
                        u.role === "admin" ? "bg-danger" : "bg-success"
                      }`}
                      style={{
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "4px",
                      }}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {/* 👇 NÚT SỬA MỚI THÊM 👇 */}
                    <button
                      onClick={() => navigate(`/admin/user/edit/${u.id}`)}
                      className="btn btn-warning btn-sm"
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#ffc107",
                        border: "none",
                      }}
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
                      className="btn btn-danger btn-sm"
                      style={{
                        backgroundColor: "#dc3545",
                        border: "none",
                        color: "white",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
