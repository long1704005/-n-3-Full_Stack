import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    const r = await login(userNameOrEmail, password);
    if (r.ok) {
      navigate(from.startsWith('/dang-nhap') ? '/' : from, { replace: true });
    } else {
      setErr(r.error || 'Đăng nhập thất bại');
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-4">
        {err && <p className="text-sm text-red-600">{err}</p>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email / Tên đăng nhập</label>
          <input
            type="text"
            required
            value={userNameOrEmail}
            onChange={(e) => setUserNameOrEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-brand text-white rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <p className="text-sm text-center text-gray-500">
          <Link to="/" className="text-brand">
            Về trang chủ
          </Link>
        </p>
      </form>
    </div>
  );
}
