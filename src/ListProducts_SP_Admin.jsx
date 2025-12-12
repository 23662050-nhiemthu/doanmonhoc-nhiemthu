import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

const ListProducts_SP_Admin = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // --- 1. Hàm lấy link ảnh từ Supabase ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/100x100?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath; // Nếu là link ảnh mạng
    // Link bucket 'img' của bạn
    const BASE_URL =
      "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img";
    return `${BASE_URL}/${imagePath}`;
  };

  // --- 2. Hàm tải danh sách sản phẩm ---
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products") // Tên bảng của bạn
      .select("*")
      .order("id", { ascending: true }); // Sắp xếp theo ID tăng dần

    if (error) console.error("Lỗi tải dữ liệu:", error.message);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 3. Hàm Xóa (Quan trọng) ---
  const handleDelete = async (id) => {
    // Hỏi xác nhận trước khi xóa để tránh lỡ tay
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        alert("Lỗi khi xóa: " + error.message);
      } else {
        alert("Đã xóa sản phẩm thành công!");
        fetchProducts(); // Tải lại danh sách ngay lập tức để thấy thay đổi
      }
    }
  };

  return (
    <div className="container mt-4" style={{ padding: "20px" }}>
      {/* Header và nút Thêm mới */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý sản phẩm (Admin)</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/edit/new")} // Chuyển sang trang thêm mới
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Thêm mới
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="table-responsive">
        <table
          className="table table-bordered"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              <th style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                Hình ảnh
              </th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                Tên
              </th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                Giá
              </th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                Đánh giá
              </th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-3">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  {/* Cột Hình ảnh */}
                  <td
                    style={{
                      width: "100px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.title}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  </td>

                  {/* Cột Tên */}
                  <td
                    style={{
                      border: "1px solid #dee2e6",
                      verticalAlign: "middle",
                    }}
                  >
                    {p.title || p.name}
                  </td>

                  {/* Cột Giá */}
                  <td
                    style={{
                      border: "1px solid #dee2e6",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      color: "#d70018",
                    }}
                  >
                    {Number(p.price).toLocaleString("vi-VN")} đ
                  </td>

                  {/* Cột Đánh giá */}
                  <td
                    style={{
                      border: "1px solid #dee2e6",
                      verticalAlign: "middle",
                    }}
                  >
                    ⭐ {p.rating_rate || 5} ({p.rating_count || 100})
                  </td>

                  {/* Cột Thao tác: Sửa & Xóa */}
                  <td
                    style={{
                      border: "1px solid #dee2e6",
                      verticalAlign: "middle",
                      width: "160px",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/admin/edit/${p.id}`)} // Chuyển sang trang Sửa với ID
                      style={{
                        backgroundColor: "#ffc107",
                        border: "none",
                        padding: "6px 12px",
                        marginRight: "8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)} // Gọi hàm xóa
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
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

export default ListProducts_SP_Admin;
