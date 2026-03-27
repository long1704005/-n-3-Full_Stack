import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-56 bg-gray-900 text-white shrink-0 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Link to="/" className="text-lg font-bold text-white">
            ← Cửa hàng
          </Link>
          <p className="text-xs text-gray-400 mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="p-2 flex flex-col gap-1 flex-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? 'bg-brand' : 'hover:bg-gray-800'}`
            }
          >
            Tổng quan
          </NavLink>
          <NavLink
            to="/admin/san-pham"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? 'bg-brand' : 'hover:bg-gray-800'}`
            }
          >
            Sản phẩm
          </NavLink>
        </nav>
        <button
          type="button"
          onClick={logout}
          className="m-2 px-3 py-2 text-left text-red-300 hover:bg-gray-800 rounded"
        >
          Đăng xuất
        </button>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
