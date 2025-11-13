import React from "react";

const About = () => {
  return (
    <div className="container py-5">
      {/* Tiêu đề */}
      <h2 className="text-center mb-4"> Giới thiệu về chúng tôi</h2>

      {/* Nội dung giới thiệu */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <p>
            Chào mừng bạn đến với <strong>Cửa hàng </strong> – nơi cung cấp sản
            phẩm, phụ kiện và tài nguyên học tập tiện lợi cho mọi đối tượng.
          </p>
          <p>
            Chúng tôi cam kết mang đến trải nghiệm mua sắm trực tuyến dễ dàng,
            nhanh chóng và thân thiện. Bạn có thể duyệt các sản phẩm, tìm hiểu
            các chương trình ưu đãi, hoặc tham khảo các bài viết hữu ích.
          </p>
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <h4 className="mb-3">Thông tin liên hệ</h4>
      <ul className="list-group mb-4">
        <li className="list-group-item">
          <strong>Email:</strong>{" "}
          <a href="mailto:trannhiemthuuu110@kthcm.edu.vn">
            trannhiemthuuu110@kthcm.edu.vn
          </a>
        </li>
        <li className="list-group-item">
          <strong>Số điện thoại:</strong>{" "}
          <a href="tel:+84901234567">+84 79 234 567</a>
        </li>
        <li className="list-group-item">
          <strong>Facebook:</strong>{" "}
          <a href="/" target="_blank" rel="noreferrer">
            facebook.com/truonghoc
          </a>
        </li>
      </ul>

      {/* Mạng xã hội */}
      <h4 className="mb-3">🌐 Kết nối với chúng tôi</h4>
      <div className="d-flex gap-3">
        <a
          href="https://facebook.com/caodanghce"
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
        >
          Facebook
        </a>
        <a
          href="https://instagram.com/caodanghce"
          target="_blank"
          rel="noreferrer"
          className="btn btn-danger"
        >
          Instagram
        </a>
        <a
          href="https://twitter.com/caodanghce"
          target="_blank"
          rel="noreferrer"
          className="btn btn-info"
        >
          Twitter
        </a>
      </div>
    </div>
  );
};

export default About;
