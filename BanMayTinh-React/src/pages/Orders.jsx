import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';

export default function Orders() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isAdmin) {
      setErr('Khách hàng: theo dõi đơn cần API GET /api/Orders/me (chưa có). Admin đăng nhập để xem tất cả đơn.');
      return;
    }
    orderApi
      .getAll()
      .then((res) => setOrders(res.data || []))
      .catch(() => setErr('Không tải được đơn hàng.'));
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated)
    return <p className="p-8 text-center">Đăng nhập để xem đơn.</p>;

  if (!isAdmin)
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-amber-800 bg-amber-50 p-4 rounded-lg">{err}</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng (Admin)</h1>
      {err && <p className="text-red-600 mb-4">{err}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Khách</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-right">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.phone}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3 text-right">
                  {new Intl.NumberFormat('vi-VN').format(o.totalAmount)} ₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
