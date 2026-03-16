# Product Management System

Đây là một dự án hệ thống quản lý sản phẩm (Product Management) được xây dựng trên nền tảng Node.js. Dự án bao gồm cả phần quản trị (Admin) và giao diện người dùng (Client), cung cấp các tính năng quản lý sản phẩm, đơn hàng, người dùng, phân quyền, và bao gồm tính năng chat theo thời gian thực.

## Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (với thư viện `mongoose`)
- **Template Engine**: Pug
- **Real-time**: Socket.IO (hỗ trợ tính năng chat)
- **Upload File**: Multer, Cloudinary (Lưu trữ hình ảnh/media)
- **Authentication/Session**: express-session, cookie-parser
- **Text Editor**: TinyMCE
- **Các thư viện khác**:
  - `bcrypt` / `md5` để mã hóa mật khẩu
  - `dotenv` để quản lý biến môi trường
  - `moment` để xử lý thời gian
  - `nodemailer` để gửi email (ví dụ: quên mật khẩu)
  - `express-flash` để hiển thị thông báo flash

## Cấu trúc thư mục

```text
product-management-test/
├── config/           # Cấu hình hệ thống (Database, System constants)
├── controllers/      # Chứa logic xử lý của các chức năng (Admin & Client)
├── helpers/          # Các hàm hỗ trợ dùng chung (Pagination, Upload, v.v.)
├── middlewares/      # Các middleware (Xác thực, Phân quyền, Upload, v.v.)
├── models/           # Định nghĩa các Schema của MongoDB (Mongoose models)
├── public/           # Các script, css và hình ảnh tĩnh (Client & Admin)
├── routes/           # Định nghĩa các endpoint API/Web (phân chia theo Admin/Client)
├── sockets/          # Logic xử lý các sự kiện Socket.IO (Chat báo cáo trạng thái)
├── validates/        # Validation dữ liệu đầu vào (Form validation)
├── views/            # Giao diện ứng dụng (Pug templates cho Admin và Client)
├── index.js          # File khởi chạy ứng dụng (Entry point)
├── package.json      # File quản lý thông tin dự án và dependencies
└── .env              # File cấu hình biến môi trường
```

## Yêu cầu hệ thống

- Node.js (phiên bản khuyến nghị >= 16.x)
- MongoDB server

## Hướng dẫn cài đặt và khởi chạy chạy

**1. Clone/Tải dự án về máy**

**2. Cài đặt các thư viện (dependencies)**
Mở terminal/command prompt tại thư mục gốc của dự án và chạy lệnh:
```bash
npm install
```

**3. Cài đặt biến môi trường**
Cần thiết lập file cấu hình môi trường dựa trên file `.env`. Nếu dự án chưa có, tạo file `.env` ở thư mục gốc và cung cấp các thông tin cấu hình cần thiết như:
```env
PORT=3000
MONGODB_URL=<URL_kết_nối_tới_MongoDB_của_bạn>
# Các biến cấu hình khác như Cloudinary (CLOUD_NAME, API_KEY, API_SECRET), phiên làm việc session, email SMTP, v.v.
...
```

**4. Khởi chạy dự án**
Chạy lệnh sau để khởi động dự án ở chế độ phát triển (sử dụng nodemon):
```bash
npm start
```

Dự án sẽ chạy tại `http://localhost:<PORT>` (ví dụ: http://localhost:3000).

## Các tính năng chính
- **Client**: Xem danh sách sản phẩm, chi tiết, vỏ hàng, thanh toán, tài khoản người dùng, quên mật khẩu, trò chuyện trực tuyến (Chat).
- **Admin**: Dashboard, quản lý danh sách sản phẩm, quản lý danh mục, quản lý đơn hàng, quản lý bài viết, phân quyền và nhóm quyền, quản lý tài khoản admin.

## Tài khoản Admin (Mặc định)
Để đăng nhập vào trang quản trị (Admin), bạn có thể sử dụng tài khoản sau:
- **Email**: `nminhz0807@gmail.com`
- **Mật khẩu**: `123456`
