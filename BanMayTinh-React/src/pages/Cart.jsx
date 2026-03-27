import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';

const CART_KEY = 'banmaytinh_cart';
const MY_ORDERS_KEY = 'banmaytinh_my_order_ids';

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(CART_KEY) || '[]'));
    } catch {
      setItems([]);
    }
  }, []);

  function persist(next) {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  function updateQty(id, q) {
    if (q < 1) return persist(items.filter((x) => x.productId !== id));
    persist(items.map((x) => (x.productId === id ? { ...x, quantity: q } : x)));
  }

  const total = items.reduce((s, x) => s + x.price * x.quantity, 0);

  async function checkout() {
    if (!isAuthenticated) {
      navigate('/dang-nhap', { state: { from: '/gio-hang' } });
      return;
    }
    if (!items.length) return;
    if (!address.trim() || !phone.trim()) {
      setMsg('Nhập địa chỉ và số điện thoại.');
      return;
    }
    setSubmitting(true);
    setMsg('');
    try {
      const body = {
        userId: user.id,
        shippingAddress: address,
        phone,
        note: note || null,
        paymentMethod: 'COD',
        items: items.map((x) => ({
          productId: x.productId,
          quantity: x.quantity,
          discountPercent: 0,
        })),
      };
      const { data } = await orderApi.create(body);
      const ids = JSON.parse(localStorage.getItem(MY_ORDERS_KEY) || '[]');
      ids.push(data.id);
      localStorage.setItem(MY_ORDERS_KEY, JSON.stringify(ids));
      localStorage.removeItem(CART_KEY);
      setItems([]);
      setMsg(`Đặt hàng thành công! Mã đơn #${data.id}`);
    } catch (e) {
      setMsg(e.response?.data || 'Đặt hàng thất bại (kiểm tra tồn kho / đăng nhập).');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="app__container mt-header">
      <div className="grid">
        <div className="grid-row">
          <div className="grid--full-width">
            <div className="cart-table">
              {msg && (
                <p style={{ fontSize: 13, color: msg.includes('thành công') ? 'green' : '#ff523b', marginBottom: 10 }}>
                  {msg}
                </p>
              )}

              {!items.length ? (
                <div style={{ padding: 20, fontSize: 14 }}>
                  Giỏ hàng trống. <Link to="/san-pham">Mua sắm</Link>
                </div>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th className="text-center">Sản phẩm</th>
                        <th className="text-center">Đơn giá</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-center">Số tiền</th>
                        <th className="text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((x) => (
                        <tr key={x.productId}>
                          <td>
                            <div className="cart-info">
                              <img
                                src={
                                  x.thumbnailUrl ||
                                  'https://placehold.co/120x90/e5e7eb/6b7280?text=PC'
                                }
                                alt=""
                              />
                              <div>
                                <p>{x.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            {new Intl.NumberFormat('vi-VN').format(x.price)}₫
                          </td>
                          <td>
                            <div className="flex bg-default">
                              <button
                                className="decrease bg-default"
                                type="button"
                                onClick={() => updateQty(x.productId, x.quantity - 1)}
                              >
                                -
                              </button>
                              <input
                                className="input-quantity-detail bg-default"
                                type="text"
                                value={x.quantity}
                                onChange={(e) =>
                                  updateQty(x.productId, Math.max(1, Number(e.target.value) || 1))
                                }
                              />
                              <button
                                className="increase bg-default"
                                type="button"
                                onClick={() => updateQty(x.productId, x.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-center">
                            {new Intl.NumberFormat('vi-VN').format(x.price * x.quantity)}₫
                          </td>
                          <td className="text-center">
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                persist(items.filter((i) => i.productId !== x.productId));
                              }}
                            >
                              Xóa
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="total-price">
                    <table>
                      <tbody>
                        <tr>
                          <td>Số tiền</td>
                          <td>{new Intl.NumberFormat('vi-VN').format(total)}₫</td>
                        </tr>
                        <tr>
                          <td>Tổng thanh toán</td>
                          <td>{new Intl.NumberFormat('vi-VN').format(total)}₫</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="total-price mt-16">
                    <div className="space-btn">
                      <button
                        id="clear-cart"
                        className="btn-scart"
                        type="button"
                        onClick={() => {
                          localStorage.removeItem(CART_KEY);
                          setItems([]);
                        }}
                      >
                        Xóa tất cả
                      </button>
                      <button
                        id="check-out"
                        className={`btn-scart ${submitting ? 'disabled' : ''}`}
                        type="button"
                        onClick={checkout}
                        disabled={submitting}
                      >
                        Thanh toán
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 16, maxWidth: 350, marginLeft: 'auto' }}>
                    <input
                      placeholder="Địa chỉ giao hàng"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{ width: '100%', height: 34, padding: '0 10px', marginBottom: 8 }}
                    />
                    <input
                      placeholder="Số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', height: 34, padding: '0 10px', marginBottom: 8 }}
                    />
                    <input
                      placeholder="Ghi chú (tuỳ chọn)"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      style={{ width: '100%', height: 34, padding: '0 10px' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
