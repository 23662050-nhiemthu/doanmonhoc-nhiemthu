import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Lấy danh sách đơn hàng ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }); // Mới nhất lên đầu

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Lỗi:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. Cập nhật trạng thái đơn (Ví dụ: Chuyển sang "Đã giao") ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      alert("Cập nhật trạng thái thành công!");
      fetchOrders(); // Load lại để thấy màu thay đổi
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // --- 3. Xóa đơn hàng ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa đơn hàng này?")) {
      try {
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (error) throw error;
        alert("Đã xóa đơn hàng!");
        fetchOrders();
      } catch (err) {
        alert("Lỗi xóa: " + err.message);
      }
    }
  };

  // --- Hàm chọn màu cho trạng thái ---
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning"; // Màu vàng
      case "shipping":
        return "bg-primary"; // Màu xanh dương
      case "completed":
        return "bg-success"; // Màu xanh lá
      case "cancelled":
        return "bg-danger"; // Màu đỏ
      default:
        return "bg-secondary";
    }
  };

  // --- Hàm dịch trạng thái sang Tiếng Việt ---
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) return <div className="p-4">⏳ Đang tải đơn hàng...</div>;

  return (
    <div className="container mt-5" style={{ padding: "20px" }}>
      <h2 className="mb-4">📦 Quản lý Đơn hàng</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead style={{ background: "#f8f9fa" }}>
            <tr>
              <th>ID</th>
              <th style={{ width: "200px" }}>Khách hàng</th>
              <th>Chi tiết sản phẩm (JSON)</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>

                  {/* Cột thông tin khách */}
                  <td>
                    <strong>{order.customer_name}</strong>
                    <br />
                    <small>{order.phone}</small>
                    <br />
                    <small className="text-muted">{order.address}</small>
                  </td>

                  {/* Cột Chi tiết sản phẩm (Lấy từ JSON) */}
                  <td>
                    <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                      {order.order_details &&
                        order.order_details.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: "13px",
                              borderBottom: "1px dashed #eee",
                              padding: "4px 0",
                            }}
                          >
                            • {item.product.title || item.product.name}
                            <span style={{ fontWeight: "bold", color: "red" }}>
                              {" "}
                              (x{item.quantity})
                            </span>
                          </div>
                        ))}
                    </div>
                  </td>

                  <td style={{ fontWeight: "bold", color: "#d70018" }}>
                    {Number(order.total_price).toLocaleString("vi-VN")} đ
                  </td>

                  {/* Cột Trạng thái (Dropdown chọn nhanh) */}
                  <td>
                    <select
                      className={`form-select form-select-sm text-white ${getStatusColor(
                        order.status
                      )}`}
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value)
                      }
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      <option value="pending" style={{ color: "black" }}>
                        ⏳ Chờ xử lý
                      </option>
                      <option value="shipping" style={{ color: "black" }}>
                        🚚 Đang giao
                      </option>
                      <option value="completed" style={{ color: "black" }}>
                        ✅ Hoàn thành
                      </option>
                      <option value="cancelled" style={{ color: "black" }}>
                        ❌ Đã hủy
                      </option>
                    </select>
                  </td>

                  <td>
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      🗑️ Xóa
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

export default OrderManagement;
