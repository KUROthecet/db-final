
# Pane e Amore Management System 🍞🍰

Hệ thống quản lý tiệm bánh ngọt toàn diện (Bakery Management System), bao gồm đặt hàng trực tuyến cho khách hàng, quản lý đơn hàng cho nhân viên và dashboard quản trị doanh thu/nhân sự cho quản lý.

Dự án được xây dựng theo kiến trúc Monorepo:
- **Frontend:** React + TypeScript + Vite + TailwindCSS.
- **Backend:** Node.js + Express + PostgreSQL.

---

## 📋 Yêu cầu hệ thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

1.  **Node.js** (Phiên bản v16 trở lên).
2.  **PostgreSQL** (Phiên bản v12 trở lên) - Cơ sở dữ liệu chính.
3.  **Git**.

---

## 🛠️ Cài đặt & Cấu hình (Installation)

### 1. Clone dự án

```bash
git clone <your-repo-url>
cd pane-e-amore-monorepo
```

### 2. Cài đặt thư viện (Dependencies)

Bạn có thể cài đặt toàn bộ thư viện cho cả Frontend và Backend bằng một lệnh từ thư mục gốc:

```bash
npm install
npm run install:all
```

*Hoặc cài thủ công từng folder:*
```bash
cd Frontend && npm install
cd ../Backend && npm install
```

---

## 🗄️ Cấu hình Database (Quan trọng)

### 1. Tạo Database
Mở công cụ quản lý PostgreSQL (pgAdmin, DBeaver, hoặc Terminal) và tạo một database mới:

```sql
CREATE DATABASE bakery_db;
```

### 2. Chạy Script khởi tạo bảng
Chạy toàn bộ nội dung trong file `database.sql` (nằm ở thư mục gốc) vào database `bakery_db` vừa tạo để cấu trúc bảng và dữ liệu mẫu.

---

## ⚙️ Cấu hình Biến môi trường (.env)

### Backend
Tạo file `Backend/.env` và điền thông tin cấu hình sau (thay đổi `DB_PASSWORD` thành mật khẩu PostgreSQL của bạn):

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Database Config
DB_USER=postgres
DB_HOST=localhost
DB_NAME=bakery_db
DB_PASSWORD=your_password_here
DB_PORT=5432

# JWT Secret (Bảo mật)
JWT_SECRET=pane_e_amore_secret_key_2024

# Cloudinary (Dùng để upload ảnh - Optional nếu chỉ chạy test)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🚀 Cách chạy dự án (Run Project)

Bạn cần mở **2 Terminal** riêng biệt tại thư mục gốc của dự án:

### Terminal 1: Chạy Backend (Server API)
```bash
npm run backend
```
*Server sẽ chạy tại: `http://localhost:5000`*

### Terminal 2: Chạy Frontend (Client App)
```bash
npm run frontend
```
*App sẽ chạy tại: `http://localhost:5173`*

---

## 👤 Tài khoản Demo (Default Accounts)

Sử dụng các tài khoản sau để kiểm thử các quyền hạn khác nhau (Mật khẩu mặc định là `123` cho tất cả):

| Vai trò | Email | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **Quản lý (Admin)** | `admin@bakery.com` | `123` | Xem báo cáo doanh thu, quản lý nhân sự, quản lý sản phẩm. |
| **Nhân viên (Staff)** | `staff@bakery.com` | `123` | Xử lý đơn hàng (Pending -> Confirm -> Ship), quản lý kho, POS. |
| **Khách hàng** | `client@bakery.com` | `123` | Xem menu, đặt hàng, theo dõi lịch sử đơn hàng. |

---

## 📂 Cấu trúc dự án

```
pane-e-amore/
├── Backend/                # Server Side
│   ├── config/             # Kết nối DB, Cloudinary
│   ├── controller/         # Logic xử lý (Auth, Order, Product...)
│   ├── middleware/         # Auth JWT, Upload file
│   ├── model/              # Tương tác trực tiếp với SQL
│   ├── routes/             # Định nghĩa API endpoints
│   └── server.js           # Entry point
│
├── Frontend/               # Client Side
│   ├── src/
│   │   ├── api/            # Cấu hình Axios
│   │   ├── components/     # UI Components (Navbar, Cart...)
│   │   ├── features/       # Services gọi API (Auth, Order...)
│   │   ├── pages/          # Các trang màn hình chính
│   │   ├── store/          # Context API (AuthContext, CartContext)
│   │   └── types/          # TypeScript Interfaces
│   └── vite.config.ts
│
├── database.sql            # Script khởi tạo DB
├── package.json            # Quản lý script chạy chung
```

---

## ❗ Các lỗi thường gặp (Troubleshooting)

1.  **Lỗi kết nối Database (`Connection refused`)**:
    *   Kiểm tra xem PostgreSQL service đã chạy chưa.
    *   Kiểm tra kỹ file `Backend/.env` xem `DB_PASSWORD` và `DB_PORT` đã đúng chưa.

2.  **Lỗi CORS khi login**:
    *   Đảm bảo Frontend chạy đúng port `5173`. Nếu Vite tự nhảy sang `5174`, hãy sửa lại `CLIENT_URL` trong `Backend/.env`.

3.  **Lỗi `relation "..." does not exist`**:
    *   Bạn chưa chạy script `database.sql` để tạo bảng.

---

## ✨ Tính năng chính

*   **Authentication:** Đăng nhập phân quyền (JWT), bảo vệ route.
*   **Customer:** Xem menu, lọc sản phẩm, thêm vào giỏ hàng, thanh toán (COD/QR), theo dõi trạng thái đơn hàng realtime.
*   **Employee:** Dashboard quản lý trạng thái đơn hàng (Quy trình chuẩn: Pending -> Confirmed -> Delivering -> Completed), quản lý kho hàng.
*   **Admin:** Biểu đồ doanh thu (Recharts), quản lý nhân viên (CRUD), thêm sửa xóa sản phẩm.

Developed by **Pane e Amore Team**.
