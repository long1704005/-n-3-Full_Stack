export default function NewsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Tin tức</h1>
      <p className="text-gray-600">
        Phần tin tức chi tiết + banner marketing cần bảng <code>Banners</code>, <code>News</code> và API
        tương ứng trên backend. Sau khi có API, map vào trang này và route{' '}
        <code>/tin-tuc/:slug</code>.
      </p>
    </div>
  );
}
