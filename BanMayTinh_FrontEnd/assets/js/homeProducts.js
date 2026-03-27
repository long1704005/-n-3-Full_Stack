// Hàm render sản phẩm cho trang home
function renderHomeProducts() {
    // Kiểm tra container có tồn tại không
    const newestContainer = document.getElementById('newest-products');
    const bestsellerContainer = document.getElementById('bestseller-products');
    
    if (!newestContainer || !bestsellerContainer) {
        console.log('Container chưa sẵn sàng, thử lại sau...');
        setTimeout(() => {
            renderHomeProducts();
        }, 300);
        return;
    }
    
    // Lấy sản phẩm từ localStorage hoặc từ mảng products
    let allProducts = JSON.parse(localStorage.getItem('productAll')) || [];
    
    // Nếu không có trong localStorage, lấy từ mảng products từ constsp.js
    if (allProducts.length === 0) {
        if (typeof products !== 'undefined' && products && products.length > 0) {
            allProducts = products.map(product => {
                let imageUrl = product.image || product.avatar || '';
                if (imageUrl && imageUrl.startsWith('//')) {
                    imageUrl = 'https:' + imageUrl;
                }
                if (!imageUrl || imageUrl.trim() === '') {
                    imageUrl = './assets/img/product/14700KF.jpg';
                }
                // Giữ nguyên tất cả thông tin từ product, chỉ xử lý image
                return {
                    ...product, // Giữ tất cả thuộc tính gốc
                    avatar: imageUrl,
                    image: imageUrl,
                    discount: product.discount ? product.discount.replace('%', '').replace('%', '') : '0'
                };
            });
            // Lưu vào localStorage để dùng sau
            localStorage.setItem('productAll', JSON.stringify(allProducts));
        } else {
            // Nếu vẫn không có, thử lại sau một chút
            setTimeout(() => {
                renderHomeProducts();
            }, 500);
            return;
        }
    }
    
    // Nếu vẫn không có sản phẩm, không render
    if (allProducts.length === 0) {
        console.log('Không có sản phẩm để hiển thị');
        return;
    }
    
    // Sản phẩm mới nhất: lấy 10 sản phẩm cuối cùng (giả sử là mới nhất)
    const newestProducts = allProducts.slice(-10).reverse();
    if (newestProducts.length > 0) {
        renderProductSection('newest-products', newestProducts);
    } else {
        // Nếu không đủ 10, lấy tất cả
        renderProductSection('newest-products', allProducts.slice().reverse());
    }
    
    // Sản phẩm bán chạy: lấy 10 sản phẩm có discount cao nhất
    const bestsellerProducts = [...allProducts]
        .sort((a, b) => {
            const discountA = parseFloat(a.discount || 0);
            const discountB = parseFloat(b.discount || 0);
            return discountB - discountA;
        })
        .slice(0, 10);
    if (bestsellerProducts.length > 0) {
        renderProductSection('bestseller-products', bestsellerProducts);
    } else {
        // Nếu không có, lấy 10 sản phẩm đầu tiên
        renderProductSection('bestseller-products', allProducts.slice(0, 10));
    }
}

// Hàm render sản phẩm vào một section
function renderProductSection(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const defaultImage = './assets/img/product/14700KF.jpg';
    
    products.forEach(product => {
        // Xử lý URL hình ảnh
        let imageUrl = product.avatar || product.image || '';
        if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'undefined' || imageUrl === 'null') {
            imageUrl = defaultImage;
        }
        if (imageUrl && imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
        }
        
        const safeImageUrl = imageUrl.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const discount = product.discount || '0';
        const discountPercent = discount.replace('%', '');
        
        const productHTML = `
            <div class="grid__column-2-4">
                <div class="card-products home">
                    <div class="p-img">
                        <a href="./productdetails.html" onclick="saveProductDetails('${product.id}')">
                            <div class="card-products__img" style="background-image: url('${safeImageUrl}');"></div>
                            <div class="card-products__favorite">
                                <span class="card-products__favorite-text">Yêu thích</span>
                            </div>
                            ${discountPercent && discountPercent !== '0' ? `
                            <div class="card-products__sale">
                                <span class="card-products__sale-percent">${discountPercent}%</span>
                                <span class="card-products__sale-label">GIẢM</span>
                            </div>
                            ` : ''}
                        </a>
                    </div>
                    <div class="card-products__content">
                        <h4 class="card-products__name">${product.name || 'Chưa có tên'}</h4>
                        <div class="card-products__price">
                            <span class="card-products__price-old">${product.oldPrice || '0'}₫</span>
                            <span class="card-products__price-current">${product.currentPrice || '0'}₫</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productHTML);
        
        // Xử lý lỗi hình ảnh
        const cardElement = container.lastElementChild;
        if (cardElement) {
            const imgDiv = cardElement.querySelector('.card-products__img');
            if (imgDiv) {
                const testImg = new Image();
                testImg.onerror = function() {
                    imgDiv.style.backgroundImage = `url('${defaultImage}')`;
                };
                testImg.src = imageUrl;
            }
        }
    });
}

// Hàm khởi tạo với retry logic
function initHomeProducts() {
    let retryCount = 0;
    const maxRetries = 10;
    
    function tryRender() {
        // Kiểm tra xem products đã có chưa hoặc localStorage có dữ liệu chưa
        const hasProducts = typeof products !== 'undefined' && products && products.length > 0;
        const hasLocalStorage = JSON.parse(localStorage.getItem('productAll') || '[]').length > 0;
        const containersExist = document.getElementById('newest-products') && document.getElementById('bestseller-products');
        
        if ((hasProducts || hasLocalStorage) && containersExist) {
            renderHomeProducts();
        } else if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(tryRender, 300);
        } else {
            console.log('Không thể load sản phẩm sau nhiều lần thử');
        }
    }
    
    // Bắt đầu thử render
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(tryRender, 500);
        });
    } else {
        setTimeout(tryRender, 500);
    }
    
    // Thử lại sau khi window load xong
    window.addEventListener('load', function() {
        setTimeout(tryRender, 300);
    });
}

// Khởi tạo
initHomeProducts();

// Export hàm để có thể gọi từ bên ngoài
window.renderHomeProducts = renderHomeProducts;

// Thử render lại sau 1 giây (fallback)
setTimeout(() => {
    if (document.getElementById('newest-products') && document.getElementById('newest-products').innerHTML.trim() === '') {
        renderHomeProducts();
    }
}, 1000);

