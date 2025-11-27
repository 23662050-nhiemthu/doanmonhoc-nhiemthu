// src/CartPage.tsx
import React from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate

export default function CartPage() {
  const {
    cartItems,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const navigate = useNavigate(); // ✅ 2. Khởi tạo navigate

  // --- TRƯỜNG HỢP GIỎ HÀNG TRỐNG ---
  if (cartItems.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h3 style={{ marginBottom: 20 }}>Giỏ hàng trống!</h3>
        {/* ✅ Nút quay lại khi giỏ trống */}
        <button onClick={() => navigate("/")} style={styles.secondaryButton}>
          ⬅ Quay lại mua sắm
        </button>
      </div>
    );

  // --- TRƯỜNG HỢP CÓ SẢN PHẨM ---
  return (
    <div style={{ padding: 20 }}>
      <h2>Giỏ hàng của bạn ({cartItems.length} sản phẩm)</h2>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
        border={1}
      >
        <thead>
          <tr style={{ backgroundColor: "#f9f9f9" }}>
            <th style={{ padding: 10 }}>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product.id}>
              <td
                style={{
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <img
                  src={item.product.image}
                  width={50}
                  height={50}
                  style={{ objectFit: "contain" }}
                  alt=""
                />
                <span style={{ fontWeight: 500 }}>{item.product.title}</span>
              </td>
              <td style={{ textAlign: "center" }}>${item.product.price}</td>
              <td style={{ textAlign: "center" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span style={{ minWidth: 20, textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>
              </td>
              <td
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                ${(item.product.price * item.quantity).toFixed(2)}
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{
                    color: "red",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  title="Xóa sản phẩm"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ KHU VỰC ĐIỀU HƯỚNG & THANH TOÁN (FLEXBOX) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Đẩy 2 bên xa nhau
          alignItems: "flex-end", // Căn đáy
          marginTop: 30,
          paddingTop: 20,
          borderTop: "1px solid #eee",
        }}
      >
        {/* Nút Trở về (Bên trái) */}
        <button onClick={() => navigate("/")} style={styles.secondaryButton}>
          ⬅ Tiếp tục mua hàng
        </button>

        {/* Tổng tiền & Thanh toán (Bên phải) */}
        <div style={{ textAlign: "right" }}>
          <h3 style={{ marginBottom: 15 }}>
            Tổng cộng:{" "}
            <span style={{ color: "#d32f2f", fontSize: "1.2em" }}>
              ${totalPrice.toFixed(2)}
            </span>
          </h3>
          <button style={styles.primaryButton}>Thanh toán ngay</button>
        </div>
      </div>
    </div>
  );
}

// --- CSS Inline Object cho gọn code ---
const styles = {
  qtyBtn: {
    width: 25,
    height: 25,
    cursor: "pointer",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: 4,
  },
  secondaryButton: {
    padding: "10px 20px",
    background: "white",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  primaryButton: {
    padding: "12px 24px",
    background: "#28a745", // Màu xanh lá chuẩn
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
};
