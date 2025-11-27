import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext"; // ✅ 1. Import lại Context giỏ hàng

const ListProducts_SP = () => {
  const [listProduct, setListProduct] = useState([]);
  const navigate = useNavigate();
  
  // ✅ 2. Lấy hàm addToCart
  const { addToCart } = useCart();

  // ✅ 3. Hàm xử lý ảnh thông minh (Quan trọng)
  const getImageUrl = (imagePath) => {
    // Nếu dữ liệu trống -> Trả về ảnh rỗng
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";

    // Nếu dữ liệu là link online (bắt đầu bằng http) -> Giữ nguyên
    if (imagePath.startsWith("http")) return imagePath;

    // Nếu chỉ là tên file -> Ghép với link Supabase
    // ⚠️ LƯU Ý: Kiểm tra kỹ tên bucket trong Storage của bạn là 'img' hay 'products'
    // Ở đây tôi để là 'products' theo thói quen, nếu bucket bạn tên là 'img' thì sửa lại nhé.
    const BASE_URL = "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img"; 
    return `${BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;
        setListProduct(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err.message);
      }
    };
    fetchProducts();
  }, []);

  // Hàm xử lý thêm vào giỏ
  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Chặn việc click nhầm sang trang chi tiết
    addToCart(product);
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách sản phẩm</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {listProduct.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/detail/${p.id}`)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "12px",
              textAlign: "center",
              cursor: "pointer",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease",
              display: "flex",        // Flex để căn chỉnh nút xuống đáy
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div> {/* Bọc phần nội dung trên */}
                <div
                style={{
                    width: "100%",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                }}
                >
                <img
                    // ✅ Gọi hàm getImageUrl thay vì nối chuỗi cứng
                    src={getImageUrl(p.image)}
                    alt={p.name || p.title}
                    style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    }}
                    onError={(e) => e.target.src = "https://placehold.co/600x400?text=Error"}
                />
                </div>

                <h4 style={{ margin: "10px 0 5px", fontSize: "1rem" }}>
                {p.title || p.name}
                </h4>
                <p style={{ color: "#e63946", fontWeight: "bold", margin: "0" }}>
                ${p.price}
                </p>
                <small style={{ color: "#555", display: "block", marginBottom: "10px" }}>
                ⭐ {p.rating_rate} | ({p.rating_count} đánh giá)
                </small>
            </div>

            {/* ✅ 4. Thêm lại nút Mua Hàng */}
            <button
              onClick={(e) => handleAddToCart(e, p)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px",
                backgroundColor: "#d70018",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🛒 Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProducts_SP;