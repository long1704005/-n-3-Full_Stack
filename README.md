# BanMayTinh React Frontend

Frontend ReactJS cho hệ thống bán máy tính, kết nối ASP.NET Core API + SQL Server.

## 1) Yêu cầu môi trường

- Node.js LTS (khuyên dùng 18+ hoặc 20+)
- npm (đi kèm Node.js)
- Backend ASP.NET Core đang chạy HTTPS (ví dụ `https://localhost:7217`)

Kiểm tra nhanh:

```bash
node -v
npm -v
```

## 2) Chạy frontend (khuyên dùng)

```bash
cd BanMayTinh-React
npm install
npm run dev
```

Mở trình duyệt:

- [http://localhost:3000](http://localhost:3000)

## 3) Chạy backend cùng frontend

1. Chạy backend trong Visual Studio (profile `https`).
2. Đảm bảo Swagger mở được (ví dụ `https://localhost:7217/swagger`).
3. Chạy frontend `npm run dev`.
4. Truy cập `http://localhost:3000`.

`vite.config.js` đang proxy `/api` sang backend. Nếu backend đổi cổng, sửa trong `vite.config.js`.

## 4) Về Go Live (đọc kỹ)

`Go Live` là static server, **không chạy trực tiếp source React/Vite**.

Nếu vẫn muốn dùng Go Live thì làm đúng quy trình:

1. Build trước:

```bash
npm run build
```

2. Mở thư mục `dist` trong VS Code.
3. Bấm **Go Live** tại `dist/index.html`.

Lưu ý: dự án đã dùng `HashRouter` để route hoạt động tốt hơn khi chạy static.

## 5) Cấu trúc thư mục chính

```text
src/
├── api/
│   ├── axiosClient.js
│   ├── authApi.js
│   ├── productApi.js
│   ├── categoryApi.js
│   ├── brandApi.js
│   ├── orderApi.js
│   ├── userApi.js
│   └── commentApi.js
├── components/
│   ├── layout/
│   ├── product/
│   └── routing/
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── ProductList.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Login.jsx
│   ├── GioiThieu.jsx
│   ├── LienHe.jsx
│   └── admin/
├── legacy-css/
│   ├── base_clean.css
│   ├── main.css
│   ├── home.css
│   ├── details.css
│   ├── cart.css
│   ├── gthieu.css
│   └── lienhe.css
├── App.jsx
├── index.jsx
└── index.css
```

## 6) Đăng nhập và phân quyền

1. Gọi `POST /api/Auth/login`.
2. Lưu `token` + `user` vào `localStorage`.
3. `axiosClient` tự gắn `Authorization: Bearer <token>`.
4. `PrivateRoute` chặn route admin nếu chưa đăng nhập hoặc sai role.

## 7) Các route đang dùng

- `/` Trang chủ
- `/san-pham`
- `/san-pham/:id`
- `/gio-hang`
- `/dang-nhap`
- `/gioi-thieu`
- `/lien-he`
- `/admin` (cần role `Admin`)

## 8) Lỗi thường gặp và cách xử lý

### Lỗi `npm is not recognized`

- Cài Node.js LTS.
- Đóng/mở lại terminal.
- Dùng terminal CMD nếu PowerShell chưa nhận PATH.

### Lỗi PostCSS `Unknown word`

- Nguyên nhân: CSS legacy bị ký tự lạ.
- Dự án đã chuyển sang `base_clean.css` để tránh lỗi này.
- Nếu còn lỗi, kiểm tra file được báo trong console và xóa ký tự lạ đầu dòng.

### Bấm Go Live bị trắng trang

- Bạn đang Go Live sai thư mục source.
- Phải `npm run build` rồi Go Live trong thư mục `dist`.

### API không lên dữ liệu

- Kiểm tra backend đang chạy.
- Kiểm tra `vite.config.js` proxy đúng cổng backend.
- Kiểm tra CORS trong backend cho `http://localhost:3000`.

## 9) Ghi chú quan trọng

- Để chạy ổn định nhất: luôn dùng `npm run dev`.
- Go Live chỉ dùng khi demo static sau build.
- Không mở trực tiếp file HTML trong `BanMayTinh_FrontEnd` để test React.
