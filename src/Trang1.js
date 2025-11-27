import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext"; // ✅ 1. Import Context để mua hàng

const Trang1 = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ 2. Lấy hàm thêm vào giỏ

  // --- HÀM XỬ LÝ ẢNH (Giống trang chủ) ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;

    // ⚠️ Đảm bảo tên bucket là 'img' hay 'products' đúng với Supabase của bạn
    const BASE_URL = "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img"; 
    return `${BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          // ⚠️ QUAN TRỌNG: Chỉ lấy sản phẩm có category là 'accessories'
          // Bạn nhớ vào Database sửa cột category của sạc, ốp lưng thành 'accessories' nhé
          .eq("category", "accessories"); 

        if (error) throw error;
        setProducts(data);
      } catch (err) {
        console.error("Lỗi lấy phụ kiện:", err.message);
      }
    };
    fetchAccessories();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    alert(`Đã thêm "${product.title || product.name}" vào giỏ!`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 className="text-center mb-4">🔌 Phụ kiện chính hãng</h2>
      
      {products.length === 0 ? (
        <p style={{ textAlign: "center" }}>Đang tải hoặc chưa có phụ kiện nào...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/detail/${p.id}`)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <img
                  src={getImageUrl(p.image)}
                  alt={p.title}
                  style={{ height: "140px", width: "100%", objectFit: "contain" }}
                  onError={(e) => e.target.src = "https://placehold.co/600x400?text=Error"}
                />
                <h4 style={{ fontSize: "16px", margin: "10px 0", height: "40px", overflow: "hidden" }}>
                    {p.title || p.name}
                </h4>
                <p style={{ color: "red", fontWeight: "bold" }}>${p.price}</p>
              </div>

              {/* Nút mua hàng */}
              <button
                onClick={(e) => handleAddToCart(e, p)}
                style={{
                  marginTop: "5px",
                  padding: "8px",
                  background: "#d70018",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                + Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trang1;