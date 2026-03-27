import { useEffect, useState } from 'react';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';

const emptyForm = {
  categoryId: '',
  brandId: null,
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  price: 0,
  originalPrice: null,
  stockQuantity: 0,
  thumbnailUrl: '',
  imageUrl: '',
  isFeatured: false,
  isNew: true,
  isBestSeller: false,
  isActive: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState('');

  function load() {
    productApi
      .getAll({ page: 1, pageSize: 100 })
      .then((r) => setProducts(r.data || []))
      .catch(() => setMsg('Không tải được sản phẩm (token Admin?).'));
  }

  useEffect(() => {
    load();
    categoryApi.getAll().then((r) => {
      const c = r.data || [];
      setCategories(c);
      if (c.length) setForm((f) => ({ ...f, categoryId: f.categoryId || c[0].id }));
    });
    brandApi.getAll().then((r) => setBrands(r.data || []));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setMsg('');
    if (!form.categoryId) {
      setMsg('Chọn danh mục.');
      return;
    }
    try {
      await productApi.create({
        ...form,
        categoryId: Number(form.categoryId),
        brandId: form.brandId ? Number(form.brandId) : null,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stockQuantity: Number(form.stockQuantity),
      });
      setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' });
      setMsg('Đã thêm sản phẩm.');
      load();
    } catch (ex) {
      setMsg(ex.response?.data?.title || 'Lỗi thêm sản phẩm.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Xóa sản phẩm?')) return;
    try {
      await productApi.remove(id);
      load();
    } catch {
      setMsg('Không xóa được.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sản phẩm (CRUD)</h1>
      {msg && <p className="mb-4 text-sm text-gray-700">{msg}</p>}

      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow border mb-10 grid md:grid-cols-2 gap-4"
      >
        <h2 className="md:col-span-2 font-semibold">Thêm sản phẩm</h2>
        <input
          placeholder="Tên"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Giá"
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="border rounded px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={form.brandId ?? ''}
          onChange={(e) => setForm({ ...form, brandId: e.target.value || null })}
          className="border rounded px-3 py-2"
        >
          <option value="">— Thương hiệu —</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Tồn kho"
          value={form.stockQuantity}
          onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          placeholder="URL ảnh (upload file cần API Storage)"
          value={form.thumbnailUrl}
          onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
          className="border rounded px-3 py-2 md:col-span-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isNew}
            onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
          />
          Sản phẩm mới
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isBestSeller}
            onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
          />
          Bán chạy
        </label>
        <button
          type="submit"
          className="md:col-span-2 py-2 bg-brand text-white rounded-lg font-medium"
        >
          Thêm
        </button>
      </form>

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center bg-white border rounded-lg px-4 py-3"
          >
            <span className="font-medium">{p.name}</span>
            <button type="button" className="text-red-600 text-sm" onClick={() => handleDelete(p.id)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
