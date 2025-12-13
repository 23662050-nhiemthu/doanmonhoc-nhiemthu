import React, { useState } from "react";
// @ts-ignore
import { useCart } from "./CartContext";
// @ts-ignore
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  // Lấy dữ liệu từ Context của bạn
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    setLoading(true);

    try {
      // 1. Gửi đơn hàng lên Supabase
      const { error } = await supabase.from("orders").insert([
        {
          customer_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          total_price: totalPrice,
          order_details: cartItems, // Lưu nguyên mảng cartItems (bao gồm product và quantity)
          status: "pending",
        },
      ]);

      if (error) throw error;

      // 2. Thành công
      alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
      clearCart(); // Xóa sạch giỏ hàng trong Context
      navigate("/"); // Quay về trang chủ
    } catch (err: any) {
      alert("Lỗi đặt hàng: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ padding: "20px", maxWidth: "1000px" }}
    >
      <h2 className="text-center mb-4">Thanh Toán Đơn Hàng</h2>

      <div
        className="row"
        style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}
      >
        {/* CỘT TRÁI: Form nhập thông tin */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div className="card p-4 shadow-sm">
            <h4 className="mb-3">Thông tin giao hàng</h4>
            <form onSubmit={handleOrder}>
              <div className="mb-3">
                <label className="form-label">Họ và tên người nhận</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px",
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  required
                  placeholder="Ví dụ: 0988xxxxxx"
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px",
                  }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Địa chỉ chi tiết</label>
                <textarea
                  className="form-control"
                  name="address"
                  required
                  placeholder="Số nhà, tên đường, phường/xã..."
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    height: "100px",
                    marginBottom: "15px",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn w-100"
                style={{
                  padding: "12px",
                  backgroundColor: "#d70018", // Màu đỏ CellphoneS
                  color: "white",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                {loading ? "Đang xử lý..." : "XÁC NHẬN ĐẶT HÀNG"}
              </button>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: Kiểm tra lại đơn hàng */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div
            className="card p-4 shadow-sm"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <h4 className="mb-3">
              Đơn hàng của bạn ({cartItems.length} sản phẩm)
            </h4>
            <hr />

            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {cartItems.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    borderBottom: "1px dashed #ddd",
                    paddingBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* Hiển thị ảnh nhỏ nếu có */}
                    <img
                      src={
                        item.product.image.startsWith("http")
                          ? item.product.image
                          : `https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img/${item.product.image}`
                      }
                      alt="img"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                      onError={(e: any) => (e.target.style.display = "none")}
                    />
                    <div>
                      {/* ✅ Lấy tên từ item.product.title hoặc name */}
                      <div style={{ fontWeight: "bold" }}>
                        {item.product.title || item.product.name}
                      </div>
                      <div style={{ fontSize: "14px", color: "#666" }}>
                        Số lượng: x{item.quantity}
                      </div>
                    </div>
                  </div>

                  <div style={{ color: "#d70018", fontWeight: "bold" }}>
                    {/* ✅ Tính tiền: giá * số lượng */}
                    {(item.product.price * item.quantity).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    đ
                  </div>
                </div>
              ))}
            </div>

            <hr />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              <span>Tổng thanh toán:</span>
              <span style={{ color: "#d70018" }}>
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
