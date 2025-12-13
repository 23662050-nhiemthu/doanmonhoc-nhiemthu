import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext";

const ListProducts_SP = () => {
  const [listProduct, setListProduct] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const BASE_URL =
      "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img";
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
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div>
              {" "}
              {/* Bọc phần nội dung trên */}
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
                  src={getImageUrl(p.image)}
                  alt={p.name || p.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/600x400?text=Error")
                  }
                />
              </div>
              <h4 style={{ margin: "10px 0 5px", fontSize: "1rem" }}>
                {p.title || p.name}
              </h4>
              <p style={{ color: "#e63946", fontWeight: "bold", margin: "0" }}>
                ${p.price}
              </p>
              <small
                style={{
                  color: "#555",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                ⭐ {p.rating_rate} | ({p.rating_count} đánh giá)
              </small>
            </div>

            {/* ✅ 4. Thêm lại nút Mua Hàng */}
            <button
              onClick={(e) => handleAddToCart(e, p)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px", // Cùng padding với nút Mua Hàng
                backgroundColor: "#d70018", // Màu nền giống nút Mua Hàng
                color: "white", // Chữ màu trắng
                border: "none", // Không có viền
                borderRadius: "5px", // Góc bo tròn giống nút Mua Hàng
                cursor: "pointer", // Con trỏ dạng tay khi hover
                fontWeight: "bold", // Chữ đậm
              }}
            >
              🛒 Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProducts_SP;
