// Home page initialization - được tách từ home.html
// Đảm bảo render sản phẩm sau khi tất cả đã load
window.addEventListener('load', function() {
    setTimeout(function() {
        if (typeof renderHomeProducts === 'function') {
            renderHomeProducts();
        }
    }, 800);
});

// Thử lại sau 2 giây nếu vẫn chưa có sản phẩm
setTimeout(function() {
    const newestContainer = document.getElementById('newest-products');
    const bestsellerContainer = document.getElementById('bestseller-products');
    if (newestContainer && newestContainer.innerHTML.trim() === '') {
        if (typeof renderHomeProducts === 'function') {
            renderHomeProducts();
        }
    }
    if (bestsellerContainer && bestsellerContainer.innerHTML.trim() === '') {
        if (typeof renderHomeProducts === 'function') {
            renderHomeProducts();
        }
    }
}, 2000);

