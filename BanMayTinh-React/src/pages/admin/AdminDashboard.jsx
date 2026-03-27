import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản trị</h1>
      <p className="text-gray-600 mb-6">
        Thống kê, khuyến mãi, banner, tin tức, POS/Kho — mở rộng theo API backend.
      </p>
      <Link
        to="/admin/san-pham"
        className="inline-block px-4 py-2 bg-brand text-white rounded-lg"
      >
        Quản lý sản phẩm
      </Link>
    </div>
  );
}
