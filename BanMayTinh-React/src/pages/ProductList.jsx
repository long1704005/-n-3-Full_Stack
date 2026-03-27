import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import { brandApi } from '../api/brandApi';
import ProductCard from '../components/product/ProductCard';

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'new', label: 'Sản phẩm mới' },
  { key: 'bestseller', label: 'Bán chạy' },
  { key: 'promo', label: 'Khuyến mãi' },
];

/**
 * Lấy danh sách từ API /api/Products, lọc theo tab + danh mục + thương hiệu + từ khóa.
 * (Cột isNew / isBestSeller / giá KM map với backend hiện tại.)
 */
export default function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tab, setTab] = useState('all');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cRes, bRes] = await Promise.all([
          categoryApi.getAll(),
          brandApi.getAll(),
        ]);
        if (!cancelled) {
          setCategories(cRes.data || []);
          setBrands(bRes.data || []);
        }
      } catch {
        if (!cancelled) setError('Không tải được danh mục/thương hiệu.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const sp = new URLSearchParams(location.search);
    const urlKeyword = sp.get('keyword') || '';
    if (urlKeyword && urlKeyword !== keyword) setKeyword(urlKeyword);

    const params = {
      page: 1,
      pageSize: 200,
      keyword: keyword.trim() || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      brandId: brandId ? Number(brandId) : undefined,
    };
    productApi
      .getAll(params)
      .then((res) => {
        if (!cancelled) setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setError('Không tải được sản phẩm. Kiểm tra API đang chạy và proxy Vite (cổng 3000).');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [keyword, categoryId, brandId, location.search]);

  const filtered = useMemo(() => {
    let list = products;
    if (tab === 'new') list = list.filter((p) => p.isNew);
    else if (tab === 'bestseller') list = list.filter((p) => p.isBestSeller);
    else if (tab === 'promo')
      list = list.filter(
        (p) =>
          (p.originalPrice != null && p.originalPrice > p.price) || p.isFeatured
      );
    return list;
  }, [products, tab]);

  return (
    <section className="app__container mt-header">
      <div className="grid">
        <div className="grid__row grid__row-sup">
          <div className="grid__column-2">
            <nav className="container__category">
              <h3 className="container__category-heading">
                <i className="container__category-heading-icon fas fa-list"></i>
                Danh mục
              </h3>
              <ul className="category-list">
                <li className="category-item">
                  <a
                    href="#"
                    className="category-item-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setCategoryId('');
                    }}
                  >
                    Tất cả
                  </a>
                </li>
                {categories.map((c) => (
                  <li key={c.id} className="category-item">
                    <a
                      href="#"
                      className="category-item-link"
                      onClick={(e) => {
                        e.preventDefault();
                        setCategoryId(String(c.id));
                      }}
                    >
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="grid__column-10">
            <div className="home-filter">
              <span className="home-filter__label">Sắp xếp theo</span>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`home-filter__btn btn ${tab === t.key ? 'btn--primary' : ''}`}
                  onClick={() => setTab(t.key)}
                  type="button"
                >
                  {t.label}
                </button>
              ))}

              <div style={{ marginLeft: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="header__search-input"
                  style={{ height: 34, border: '1px solid #ddd', borderRadius: 2 }}
                  placeholder="Tìm theo tên..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <select
                  style={{ height: 34, border: '1px solid #ddd', borderRadius: 2 }}
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                >
                  <option value="">Thương hiệu</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p style={{ color: '#ee4d2d', fontSize: 14, marginTop: 12 }}>{error}</p>}

            <div className="home-product">
              <div className="grid__row">
                {loading ? (
                  <p style={{ padding: 20, fontSize: 14 }}>Đang tải...</p>
                ) : filtered.length === 0 ? (
                  <p style={{ padding: 20, fontSize: 14 }}>Không có sản phẩm phù hợp.</p>
                ) : (
                  filtered.map((p) => <ProductCard key={p.id} product={p} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
