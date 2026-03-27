# BanMayTinh — React Frontend

Kết nối **ASP.NET Core API** (SQL Server). Cổng dev: **3000**. Proxy `/api` → `https://localhost:7217` (sửa trong `vite.config.js` nếu API khác cổng).

## Chạy nhanh

```bash
cd BanMayTinh-React
npm install
npm run dev
```

1. Bật backend .NET (HTTPS, ví dụ `https://localhost:7217`).
2. Mở `http://localhost:3000`.

## Cấu trúc thư mục (chuẩn mở rộng)

```
src/
├── api/                 # Gọi API theo controller
│   ├── axiosClient.js   # Base URL + interceptor JWT
│   ├── authApi.js
│   ├── productApi.js
│   ├── categoryApi.js
│   ├── brandApi.js
│   ├── orderApi.js
│   └── userApi.js
├── components/
│   ├── layout/          # MainLayout, AdminLayout
│   ├── product/       # ProductCard, ...
│   └── routing/       # PrivateRoute
├── context/
│   └── AuthContext.jsx  # login/logout, user, token
├── pages/               # Mỗi route ~ 1 page
│   ├── Home.jsx
│   ├── ProductList.jsx + ProductList.js (re-export)
│   ├── ProductDetail.jsx
│   ├── Login.jsx
│   ├── Cart.jsx
│   ├── Orders.jsx
│   ├── NewsPage.jsx
│   └── admin/
├── App.js               # React Router
├── index.js             # Entry + AuthProvider + BrowserRouter
└── index.css            # Tailwind
```

## Đăng nhập & phân quyền

1. `POST /api/Auth/login` → response có `token`, `role` (`Admin` | `Customer`).
2. **AuthContext** lưu `accessToken` + object `user` (có `role`) vào `localStorage`.
3. **axiosClient** gắn header `Authorization: Bearer <token>` mọi request.
4. **PrivateRoute** (`allowedRoles={['Admin']}`): chưa đăng nhập → `/dang-nhap`; sai role → `/`.

Admin: vào `/admin` sau khi đăng nhập tài khoản **Role = Admin**.

## Backend cần bổ sung (theo yêu cầu đồ án)

| Tính năng | Ghi chú |
|-----------|---------|
| Comment / Rating sản phẩm | Bảng + API CRUD |
| Tin tức / Banner | Bảng + API, React map vào `NewsPage` |
| Khuyến mãi theo thời gian | Bảng Promotion + áp dụng giá |
| Đơn hàng khách | `GET /api/Orders/me`, hủy/sửa khi `Pending` |
| Upload ảnh | Storage (local/Azure) + URL |
| POS / Kho / RBAC nhân viên | Role `Staff`, `Warehouse`, API nhập xuất kho, báo cáo |

## Tái sử dụng HTML/CSS cũ

Mở từng file trong `BanMayTinh_FrontEnd/*.html`, copy nội dung trong `<body>` vào `return (...)` của component tương ứng; class có thể giữ hoặc chuyển dần sang Tailwind.
