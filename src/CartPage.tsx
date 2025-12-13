// src/CartPage.tsx
import React from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
const BASE_URL =
  "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://placehold.co/50x50?text=No+Image";
  // Kiểm tra nếu imagePath đã là URL đầy đủ (ví dụ: từ API bên ngoài)
  if (imagePath.startsWith("http")) return imagePath;

  return `${BASE_URL}/${imagePath}`;
};

export default function CartPage() {
  const {
    cartItems,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const navigate = useNavigate();

  // --- TRƯỜNG HỢP GIỎ HÀNG TRỐNG ---
  if (cartItems.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h3 style={{ marginBottom: 20 }}>Giỏ hàng trống!</h3>
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
        <thead>{/* ... (phần head giữ nguyên) ... */}</thead>
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
                  // ✅ ĐÃ SỬA: SỬ DỤNG HÀM getImageUrl
                  src={getImageUrl(item.product.image)}
                  width={50}
                  height={50}
                  style={{ objectFit: "contain" }}
                  alt={item.product.title || "Sản phẩm"} // Thêm alt text
                  // Thêm xử lý lỗi nếu ảnh không tải được
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/50x50?text=Error";
                  }}
                />
                <span style={{ fontWeight: 500 }}>{item.product.title}</span>
              </td>
              {/* ... (các cột còn lại giữ nguyên) ... */}
              <td style={{ textAlign: "center" }}>${item.product.price}</td>
              <td style={{ textAlign: "center" }}>
                {/* ... (Nút tăng giảm số lượng giữ nguyên) ... */}
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

      {/* ✅ KHU VỰC ĐIỀU HƯỚNG & THANH TOÁN */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 30,
          paddingTop: 20,
          borderTop: "1px solid #eee",
        }}
      >
        <button onClick={() => navigate("/")} style={styles.secondaryButton}>
          ⬅ Tiếp tục mua hàng
        </button>

        <div style={{ textAlign: "right" }}>
          <h3 style={{ marginBottom: 15 }}>
            Tổng cộng:{" "}
            <span style={{ color: "#d32f2f", fontSize: "1.2em" }}>
              ${totalPrice.toFixed(2)}
            </span>
          </h3>
          <button
            onClick={() => navigate("/checkout")} // ✅ Thêm dòng này để chuyển sang trang Thanh toán
            style={styles.primaryButton}
          >
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
}

// --- CSS Inline Object ---
const styles = {
  // ... (Giữ nguyên phần styles của bạn)
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
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
};
