import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // Giữ lại import Supabase

// Đổi tên component cho phù hợp
const Trang2 = () => {
  // Đổi tên state từ products thành employees
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- HÀM XỬ LÝ ẢNH (Giống code gốc của bạn) ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/300x300?text=Employee+Image"; // Ảnh placeholder mặc định

    // ⚠️ Đảm bảo URL này khớp với cài đặt Supabase của bạn và tên bucket
    // Tôi giả định bạn vẫn dùng bucket 'img'
    const BASE_URL =
      "https://gietauwhxqhqfhuhleto.supabase.co/storage/v1/object/public/img";
    if (imagePath.startsWith("http")) return imagePath;

    return `${BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        // Lấy danh sách nhân viên được vinh danh
        const { data, error } = await supabase
          .from("employees") // ⚠️ QUAN TRỌNG: Thay bằng tên bảng nhân viên của bạn (ví dụ: 'employees')
          .select("id, name, title, department, achievements, image") // Chọn các cột cần thiết
          .eq("is_honored", true) // ⚠️ Lọc: Chỉ lấy những người được vinh danh (Giả định có cột 'is_honored' = true)
          .limit(6); // Giới hạn số lượng hiển thị (ví dụ 4 người)

        if (error) throw error;

        // Nếu không có dữ liệu, có thể dùng dữ liệu giả để dễ thiết kế
        if (data.length === 0) {
          console.warn("Chưa có nhân viên nào được vinh danh trong DB.");
          // Tùy chọn: Dữ liệu giả nếu DB trống
        }
        setEmployees(data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu nhân viên:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        backgroundColor: "#e6f7ff", // Nền màu xanh nhạt
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#0050b3", marginBottom: "10px" }}>
        ✨ VINH DANH NHÂN VIÊN CỦA THÁNG ✨
      </h1>
      <p style={{ color: "#40a9ff", fontSize: "1.2em", marginBottom: "40px" }}>
        Ghi nhận và tri ân những cống hiến xuất sắc
      </p>

      {loading ? (
        <p style={{ fontSize: "1.2em" }}>Đang tải danh sách vinh danh...</p>
      ) : employees.length === 0 ? (
        <p style={{ fontSize: "1.2em", color: "#666" }}>
          Tháng này chưa có nhân viên được vinh danh chính thức.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            // Bố cục tối đa 4 cột
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
            paddingTop: "20px",
          }}
        >
          {employees.map((e, index) => (
            <div
              key={e.id}
              style={{
                border: "2px solid #ffc53d", // Viền vàng nổi bật
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#fff",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                position: "relative",
                overflow: "hidden",
                // Hiệu ứng nhẹ khi hover
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              {/* Vòng nguyệt quế/Huy hiệu vinh danh */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  backgroundColor: "#faad14", // Màu vàng đồng
                  color: "white",
                  padding: "5px 15px",
                  borderBottomLeftRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                }}
              >
                {`Hạng ${index + 1}`}
              </div>

              {/* Ảnh nhân viên */}
              <img
                src={getImageUrl(e.image)}
                alt={e.name}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%", // Ảnh tròn
                  objectFit: "cover",
                  border: "4px solid #40a9ff", // Viền ảnh màu xanh
                  marginBottom: "15px",
                  marginTop: "10px",
                }}
                onError={(err) =>
                  (err.target.src = "https://placehold.co/300x300?text=Error")
                }
              />

              <h3
                style={{
                  color: "#0050b3",
                  margin: "10px 0 5px",
                  fontSize: "1.5em",
                }}
              >
                **{e.name}**
              </h3>
              <p style={{ color: "#1890ff", fontWeight: "600" }}>
                {e.title} - {e.department}
              </p>

              <div
                style={{
                  textAlign: "left",
                  marginTop: "20px",
                  borderTop: "1px dashed #e6f7ff",
                  paddingTop: "15px",
                }}
              >
                <h4
                  style={{
                    color: "#595959",
                    fontSize: "1em",
                    marginBottom: "8px",
                  }}
                >
                  🌟 Thành tích nổi bật:
                </h4>
                {/* Giả định 'achievements' là một chuỗi mô tả */}
                <p
                  style={{
                    fontSize: "0.95em",
                    color: "#333",
                    lineHeight: "1.4",
                  }}
                >
                  {e.achievements ||
                    "Đã đạt được mục tiêu KPI tháng 11, cải thiện quy trình làm việc."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trang2;
