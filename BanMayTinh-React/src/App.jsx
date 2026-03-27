import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import PrivateRoute from './components/routing/PrivateRoute';

import Home from './pages/Home';
import ProductList from './pages/ProductList.js';
import ProductDetail from './pages/ProductDetail';
import GioiThieu from './pages/GioiThieu';
import LienHe from './pages/LienHe';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import NewsPage from './pages/NewsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';

/**
 * Public: khách vãng lai
 * Private (Admin): cần JWT + Role = Admin
 * Private (Staff): mở rộng sau — POS/Kho (backend cần thêm role & API)
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="san-pham" element={<ProductList />} />
        <Route path="san-pham/:id" element={<ProductDetail />} />
        <Route path="gioi-thieu" element={<GioiThieu />} />
        <Route path="lien-he" element={<LienHe />} />
        <Route path="tin-tuc" element={<NewsPage />} />
        <Route path="tin-tuc/:slug" element={<NewsPage />} />
        <Route path="gio-hang" element={<Cart />} />
        <Route path="don-hang" element={<Orders />} />
        <Route path="dang-nhap" element={<Login />} />
      </Route>

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="san-pham" element={<AdminProducts />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

