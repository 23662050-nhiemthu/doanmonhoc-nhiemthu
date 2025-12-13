import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./CartContext"; // Import context giỏ hàng

const STORAGE_URL =
  "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img/";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  // Lấy hàm addToCart từ context giỏ hàng
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Lỗi:", err);
        setErrorMsg(err.message || "Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <p>⏳ Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
        <h3>⚠️ Đã xảy ra lỗi!</h3>
        <p>{errorMsg}</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Sản phẩm không tồn tại.
      </div>
    );
  }

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${STORAGE_URL}${product.image}`;

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Chặn việc click nhầm sang trang chi tiết
    addToCart(product); // Thêm sản phẩm vào giỏ
    alert("Sản phẩm đã được thêm vào giỏ hàng!"); // Thông báo cho người dùng
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Quay lại danh sách
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "30px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "1 1 300px",
            maxWidth: "400px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          <img
            src={imageUrl}
            alt={product.title}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
        </div>

        <div style={{ flex: "1 1 300px" }}>
          <h2 style={{ marginBottom: "10px" }}>{product.title}</h2>
          <p
            style={{ fontSize: "1.2rem", color: "#e63946", fontWeight: "bold" }}
          >
            ${product.price}
          </p>
          <p style={{ marginTop: "10px", color: "#555" }}>
            ⭐ {product.rating_rate} ({product.rating_count} đánh giá)
          </p>
          <p
            style={{
              marginTop: "20px",
              lineHeight: "1.6",
              color: "#333",
              textAlign: "justify",
            }}
          >
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          <button
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
            onClick={handleAddToCart} // Thêm sản phẩm vào giỏ hàng khi nhấn nút
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
