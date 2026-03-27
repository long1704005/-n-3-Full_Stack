import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../api/productApi';

const CART_KEY = 'banmaytinh_cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    productApi
      .getById(id)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  function addToCart() {
    if (!product) return;
    const cart = loadCart();
    const i = cart.findIndex((x) => x.productId === product.id);
    if (i >= 0) cart[i].quantity += qty;
    else
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl || product.imageUrl,
        quantity: qty,
      });
    saveCart(cart);
    navigate('/gio-hang');
  }

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!product)
    return <div className="p-8 text-center text-red-600">Không tìm thấy sản phẩm.</div>;

  const img =
    product.thumbnailUrl ||
    product.imageUrl ||
    'https://placehold.co/600x400/e5e7eb/6b7280?text=PC';

  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;
  const percent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = useMemo(() => [img, img, img, img], [img]);

  return (
    <section className="app__container app__container--details">
      <div className="grid">
        <div className="grid__row">
          <div className="grid--full-width mt-16">
            <div className="page-product__breadcrumb">
              <Link className="breadcrumb-link" to="/">
                BanMayTinh
              </Link>
              <i className="breadcrumb-icon fa-solid fa-angle-right"></i>
              <Link className="breadcrumb-link" to="/san-pham">
                Sản phẩm
              </Link>
              <i className="breadcrumb-icon fa-solid fa-angle-right"></i>
              <span className="breadcrumb-text">{product.name}</span>
            </div>
          </div>

          <div className="grid--full-width flex mt-16 card">
            <div className="grid__column-5">
              <div className="content__product-left flex flex-column">
                <div className="product__img-large">
                  <img className="img-main" src={images[activeImg]} alt={product.name} />
                </div>
                <div className="product__img-small flex">
                  {images.map((src, idx) => (
                    <div
                      key={idx}
                      className={`wrap__img-small ${idx === activeImg ? 'active' : ''}`}
                      onClick={() => setActiveImg(idx)}
                    >
                      <img className="img-small" src={src} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid__column-7">
              <div className="content__product-right">
                <div className="product__title">
                  <div className="products__favor">Yêu thích</div>
                  <span>{product.name}</span>
                </div>

                <div className="products__price flex">
                  {hasDiscount && (
                    <div className="products__price-old">
                      {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}₫
                    </div>
                  )}
                  <div className="products__price-current">
                    {new Intl.NumberFormat('vi-VN').format(product.price)}₫
                  </div>
                  {hasDiscount && <div className="products__percent">-{percent}%</div>}
                </div>

                <div className="flex flex-column pl-pr-20 mt-16">
                  <div className="flex mb-25">
                    <h3 className="left-details-title">Loại sản phẩm</h3>
                    <span className="left-details-title text-color">
                      {product.category?.name || '—'}
                    </span>
                  </div>
                  <div className="flex mb-25">
                    <h3 className="left-details-title">Thương hiệu</h3>
                    <span className="left-details-title text-color">
                      {product.brand?.name || '—'}
                    </span>
                  </div>

                  <div className="quantity-detail flex mb-25">
                    <h3 className="left-details-title">Số lượng</h3>
                    <div className="flex bg-white">
                      <button className="decrease" type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                        -
                      </button>
                      <input
                        className="input-quantity-detail"
                        type="text"
                        value={qty}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          if (!Number.isFinite(n)) return;
                          setQty(Math.max(1, Math.floor(n)));
                        }}
                      />
                      <button className="increase" type="button" onClick={() => setQty((q) => q + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 15 }}>
                  <div className="btn-group-detail pl-20">
                    <button type="button" className="btn add-to-cart mr-16" onClick={addToCart}>
                      <i className="mr-8 fa-solid fa-cart-plus"></i>
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                    <button type="button" className="btn buy" onClick={() => navigate('/gio-hang')}>
                      Mua ngay
                    </button>
                  </div>
                </div>

                <p style={{ marginTop: 20, fontSize: 12, color: '#999' }}>
                  Comment/Rating sẽ hiển thị tại đây khi bật UI (API đã có `/api/Comments`). 
                </p>
              </div>
            </div>
          </div>

          <div className="grid--full-width mt-16 mb-16 bg-white card">
            <div className="page-detail__product">
              <section className="wrap-infor-detail">
                <h2 className="title-detail__product">Mô tả sản phẩm</h2>
                <div className="mt-30-ml-mr-mb-15">
                  <div className="wrap-desc-detail">
                    <p className="m-0">{product.description || product.shortDescription || '—'}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
