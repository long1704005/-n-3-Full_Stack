import { Link } from 'react-router-dom';

function formatPrice(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('vi-VN').format(n) + '₫';
}

export default function ProductCard({ product, variant }) {
  const img =
    product.thumbnailUrl ||
    product.imageUrl ||
    'https://placehold.co/600x600/e5e7eb/6b7280?text=PC';

  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;
  const discountPercent =
    hasDiscount && product.originalPrice
      ? Math.max(1, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100))
      : null;

  const rootClass = variant === 'home' ? 'card-products home' : 'card-products';

  return (
    <div className="grid__column-2-4">
      <div className={rootClass}>
        <div className="p-img">
          <Link to={`/san-pham/${product.id}`} className="product-link">
            <div
              className="card-products__img"
              style={{ backgroundImage: `url(${img})` }}
              aria-label={product.name}
            ></div>

            {(product.isFeatured || product.isBestSeller) && (
              <div className="card-products__favorite">
                <span className="card-products__favorite-text">Yêu thích</span>
              </div>
            )}

            {discountPercent && (
              <div className="card-products__sale">
                <span className="card-products__sale-percent">{discountPercent}%</span>
                <span className="card-products__sale-label">GIẢM</span>
              </div>
            )}
          </Link>
        </div>

        <div className="card-products__content">
          <h4 className="card-products__name">{product.name}</h4>
          <div className="card-products__price">
            {hasDiscount && (
              <span className="card-products__price-old">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="card-products__price-current">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
