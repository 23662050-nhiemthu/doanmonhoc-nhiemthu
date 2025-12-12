import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== "new";
  const [uploading, setUploading] = useState(false); // Trạng thái đang tải ảnh

  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    category: "accessories",
    rating_rate: 5,
    rating_count: 0,
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    const BASE_URL =
      "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img";
    return `${BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    if (isEditMode) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) console.error("Lỗi:", error);
    else setProduct(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // --- HÀM UPLOAD ẢNH MỚI ---
  const handleUploadImage = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // 1. Tạo tên file không trùng (dùng thời gian hiện tại)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload lên Supabase Storage (Bucket 'img')
      const { error: uploadError } = await supabase.storage
        .from("img")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Upload xong thì lưu tên file vào state để chuẩn bị lưu vào DB
      setProduct({ ...product, image: fileName });
      alert("Đã upload ảnh thành công!");
    } catch (error) {
      alert("Lỗi upload ảnh: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const { error } = await supabase
          .from("products")
          .update(product)
          .eq("id", id);
        if (error) throw error;
        alert("Cập nhật thành công!");
      } else {
        const { id: _, ...newProduct } = product;
        const { error } = await supabase.from("products").insert([newProduct]);
        if (error) throw error;
        alert("Thêm mới thành công!");
      }
      navigate("/admin/products");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "600px", padding: "20px" }}
    >
      <h2 className="text-center mb-4">
        {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={product.title || product.name || ""}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giá (VNĐ)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        {/* --- KHU VỰC UPLOAD ẢNH (MỚI) --- */}
        <div className="mb-3">
          <label className="form-label">Hình ảnh sản phẩm</label>

          {/* Input chọn file */}
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            disabled={uploading}
            style={{ marginBottom: "10px", display: "block" }}
          />
          {uploading && <p style={{ color: "blue" }}>Đang tải ảnh lên...</p>}

          {/* Input ẩn lưu tên file (để debug nếu cần) */}
          <input
            type="text"
            className="form-control"
            name="image"
            value={product.image}
            readOnly
            placeholder="Tên file ảnh sẽ hiện ở đây..."
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              backgroundColor: "#e9ecef",
            }}
          />

          {/* Xem trước ảnh */}
          {product.image && (
            <div
              style={{
                marginTop: "10px",
                textAlign: "center",
                border: "1px dashed #ccc",
                padding: "10px",
              }}
            >
              <img
                src={getImageUrl(product.image)}
                alt="Preview"
                style={{ maxHeight: "150px", objectFit: "contain" }}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
          >
            <option value="accessories">Phụ kiện</option>
            <option value="phone">Điện thoại</option>
            <option value="laptop">Laptop</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "10px",
            width: "100%",
            border: "none",
            cursor: "pointer",
          }}
          disabled={uploading}
        >
          {uploading
            ? "Đang xử lý..."
            : isEditMode
            ? "Lưu thay đổi"
            : "Thêm mới"}
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
