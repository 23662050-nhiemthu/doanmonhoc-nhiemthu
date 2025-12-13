import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    fullname: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setUserData(data);
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Chỉ cho sửa Fullname, Email và Role (Username thường không cho sửa)
    const { error } = await supabase
      .from("user")
      .update({
        fullname: userData.fullname,
        email: userData.email,
        role: userData.role,
      })
      .eq("id", id);

    if (error) alert("Lỗi: " + error.message);
    else {
      alert("Cập nhật thành công!");
      navigate("/admin/user");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2>Cập nhật tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username (Không thể sửa)</label>
          <input className="form-control" value={userData.username} disabled />
        </div>
        <div className="mb-3">
          <label>Họ và tên</label>
          <input
            className="form-control"
            name="fullname"
            value={userData.fullname || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Quyền hạn</label>
          <select
            className="form-control"
            name="role"
            value={userData.role || "user"}
            onChange={handleChange}
          >
            <option value="user">User (Khách hàng)</option>
            <option value="admin">Admin (Quản trị)</option>
          </select>
        </div>
        <button className="btn btn-primary w-100">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default AdminEditUser;
