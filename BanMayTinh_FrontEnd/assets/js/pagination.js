// Biến toàn cục để lưu trữ sản phẩm và trạng thái phân trang
let allProducts = [];
let currentPage = 1;
let itemsPerPage = 10; // Số sản phẩm mỗi trang
let currentFilteredProducts = [];

// Hàm khởi tạo phân trang
function initPagination() {
    // Lấy sản phẩm từ localStorage
    allProducts = JSON.parse(localStorage.getItem('productAll')) || [];
    
    // Đảm bảo tất cả sản phẩm trong localStorage đều có hình ảnh hợp lệ
    const defaultImage = './assets/img/product/14700KF.jpg';
    let hasUpdated = false;
    allProducts = allProducts.map(product => {
        // Kiểm tra và sửa hình ảnh nếu thiếu hoặc không hợp lệ
        const originalAvatar = product.avatar;
        if (!product.avatar || product.avatar.trim() === '' || 
            product.avatar === './assets/img/product/default.jpeg' || 
            product.avatar === 'undefined' || 
            product.avatar === 'null' ||
            product.avatar === null ||
            product.avatar === undefined) {
            product.avatar = defaultImage;
            hasUpdated = true;
        }
        // Xử lý URL bắt đầu bằng //
        if (product.avatar && product.avatar.startsWith('//')) {
            product.avatar = 'https:' + product.avatar;
            if (originalAvatar !== product.avatar) hasUpdated = true;
        }
        // Đảm bảo có thuộc tính image nếu chưa có
        if (!product.image) {
            product.image = product.avatar;
            hasUpdated = true;
        }
        return product;
    });
    
    // Lưu lại localStorage nếu có thay đổi
    if (hasUpdated) {
        localStorage.setItem('productAll', JSON.stringify(allProducts));
    }
    
    // Luôn ưu tiên sử dụng mảng products từ product.js nếu có
    if (typeof products !== 'undefined' && products.length > 0) {
        // Chuyển đổi từ mảng products sang định dạng localStorage
        const defaultImage = './assets/img/product/14700KF.jpg';
        const productsFromArray = products.map(product => {
            // Xử lý URL hình ảnh: nếu bắt đầu bằng // thì thêm https:
            let imageUrl = product.image || '';
            
            // Nếu không có hình ảnh, sử dụng hình mặc định từ thư mục
            if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'undefined' || imageUrl === 'null') {
                imageUrl = defaultImage;
            }
            
            // Xử lý URL bắt đầu bằng //
            if (imageUrl && imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            }
            
            return {
                id: product.id,
                name: product.name,
                avatar: imageUrl,
                image: imageUrl, // Đảm bảo cả image và avatar đều có giá trị
                oldPrice: product.oldPrice,
                currentPrice: product.currentPrice,
                discount: product.discount ? product.discount.replace('%', '').replace('%', '') : '0',
                type: product.type,
                cateP: product.type,
                desc: product.description || ''
            };
        });
        
        // Kết hợp sản phẩm từ localStorage và từ mảng products (tránh trùng lặp theo ID)
        const existingIds = new Set(allProducts.map(p => String(p.id)));
        const newProducts = productsFromArray.filter(p => !existingIds.has(String(p.id)));
        
        // Nếu localStorage trống hoặc ít sản phẩm, ưu tiên dùng từ mảng products
        if (allProducts.length === 0 || allProducts.length < productsFromArray.length) {
            allProducts = [...productsFromArray];
        } else {
            allProducts = [...allProducts, ...newProducts];
        }
        
        // Lưu vào localStorage
        localStorage.setItem('productAll', JSON.stringify(allProducts));
    }
    
    currentFilteredProducts = [...allProducts];
    
    // Render sản phẩm và phân trang
    renderPagination();
    displayProductsWithPagination(currentPage);
}

// Hàm hiển thị sản phẩm với phân trang
function displayProductsWithPagination(page) {
    currentPage = page;
    const productContainer = document.querySelector('.home-product .grid__row');
    if (!productContainer) return;
    
    productContainer.innerHTML = '';
    
    // Tính toán chỉ số bắt đầu và kết thúc
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = currentFilteredProducts.slice(startIndex, endIndex);
    
    // Hiển thị sản phẩm
    productsToShow.forEach(product => {
        // Xử lý URL hình ảnh: nếu bắt đầu bằng // thì thêm https:
        let imageUrl = product.avatar || product.image || '';
        
        // Hình ảnh mặc định
        const defaultImage = './assets/img/product/14700KF.jpg';
        
        // Nếu không có hình ảnh hoặc URL không hợp lệ, sử dụng hình mặc định
        if (!imageUrl || imageUrl.trim() === '' || imageUrl === './assets/img/product/default.jpeg' || imageUrl === 'undefined' || imageUrl === 'null') {
            imageUrl = defaultImage;
        }
        
        // Xử lý URL bắt đầu bằng //
        if (imageUrl && imageUrl.startsWith('//')) {
            imageUrl = 'https:' + imageUrl;
        }
        
        // Đảm bảo URL được đặt trong dấu ngoặc kép
        const safeImageUrl = imageUrl.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        const productHTML = `
            <div class="grid__column-2-4">
                <div class="card-products">
                    <div class="p-img">
                        <a href="productdetails.html" class="product-link" onclick="saveProductDetails('${product.id}')">
                            <div class="card-products__img" data-img-src="${safeImageUrl}" style="background-image: url('${safeImageUrl}');"></div>
                            <div class="card-products__favorite">
                                <span class="card-products__favorite-text">Yêu thích</span>
                            </div>
                            ${product.discount ? `
                            <div class="card-products__sale">
                                <span class="card-products__sale-percent">${product.discount}%</span>
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
        productContainer.insertAdjacentHTML('beforeend', productHTML);
        
        // Thêm xử lý lỗi cho hình ảnh bằng cách tạo một img ẩn để kiểm tra
        const cardElement = productContainer.lastElementChild;
        if (cardElement) {
            const imgDiv = cardElement.querySelector('.card-products__img');
            if (imgDiv) {
                // Tạo một img ẩn để kiểm tra hình ảnh có tải được không
                const testImg = new Image();
                testImg.onerror = function() {
                    // Nếu hình ảnh không tải được, thay thế bằng hình mặc định
                    imgDiv.style.backgroundImage = `url('${defaultImage}')`;
                    imgDiv.setAttribute('data-img-src', defaultImage);
                };
                testImg.onload = function() {
                    // Hình ảnh tải thành công, không cần làm gì
                };
                testImg.src = imageUrl;
            }
        }
    });
    
    // Cập nhật phân trang
    renderPagination();
    
    // Scroll lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hàm render phân trang
function renderPagination() {
    const totalProducts = currentFilteredProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    
    if (totalPages <= 1) {
        // Nếu chỉ có 1 trang hoặc không có sản phẩm, ẩn phân trang
        const paginationElement = document.querySelector('.pagination');
        if (paginationElement) {
            paginationElement.style.display = 'none';
        }
        return;
    }
    
    const paginationElement = document.querySelector('.pagination');
    if (!paginationElement) return;
    
    paginationElement.style.display = 'flex';
    
    // Xóa nội dung cũ
    paginationElement.innerHTML = '';
    
    // Nút Previous
    const prevLi = document.createElement('li');
    prevLi.className = 'pagination-item';
    if (currentPage === 1) {
        prevLi.classList.add('pagination-item--disabled');
    }
    prevLi.innerHTML = `
        <a href="#" class="pagination-item__link" data-page="${currentPage - 1}">
            <i class="pagination-item__icon fas fa-angle-left"></i>
        </a>
    `;
    if (currentPage > 1) {
        prevLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            displayProductsWithPagination(currentPage - 1);
        });
    } else {
        prevLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
        });
    }
    paginationElement.appendChild(prevLi);
    
    // Tính toán các số trang cần hiển thị
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Nếu ở đầu, hiển thị thêm các trang sau
    if (currentPage <= 3) {
        endPage = Math.min(5, totalPages);
    }
    
    // Nếu ở cuối, hiển thị thêm các trang trước
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }
    
    // Hiển thị trang đầu nếu không phải trang 1
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.className = 'pagination-item';
        firstLi.innerHTML = `<a href="#" class="pagination-item__link" data-page="1">1</a>`;
        firstLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            displayProductsWithPagination(1);
        });
        paginationElement.appendChild(firstLi);
        
        if (startPage > 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'pagination-item';
            ellipsisLi.innerHTML = `<a href="#" class="pagination-item__link">...</a>`;
            ellipsisLi.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
            });
            paginationElement.appendChild(ellipsisLi);
        }
    }
    
    // Hiển thị các số trang
    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = 'pagination-item';
        if (i === currentPage) {
            li.classList.add('pagination-item--active');
        }
        li.innerHTML = `<a href="#" class="pagination-item__link" data-page="${i}">${i}</a>`;
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            displayProductsWithPagination(i);
        });
        paginationElement.appendChild(li);
    }
    
    // Hiển thị dấu ... nếu cần
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'pagination-item';
            ellipsisLi.innerHTML = `<a href="#" class="pagination-item__link">...</a>`;
            ellipsisLi.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
            });
            paginationElement.appendChild(ellipsisLi);
        }
        
        // Hiển thị trang cuối
        const lastLi = document.createElement('li');
        lastLi.className = 'pagination-item';
        lastLi.innerHTML = `<a href="#" class="pagination-item__link" data-page="${totalPages}">${totalPages}</a>`;
        lastLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            displayProductsWithPagination(totalPages);
        });
        paginationElement.appendChild(lastLi);
    }
    
    // Nút Next
    const nextLi = document.createElement('li');
    nextLi.className = 'pagination-item';
    if (currentPage === totalPages) {
        nextLi.classList.add('pagination-item--disabled');
    }
    nextLi.innerHTML = `
        <a href="#" class="pagination-item__link" data-page="${currentPage + 1}">
            <i class="pagination-item__icon fas fa-angle-right"></i>
        </a>
    `;
    if (currentPage < totalPages) {
        nextLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            displayProductsWithPagination(currentPage + 1);
        });
    } else {
        nextLi.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
        });
    }
    paginationElement.appendChild(nextLi);
    
    // Cập nhật số trang hiện tại ở filter
    updatePageInfo(currentPage, totalPages);
}

// Hàm cập nhật thông tin trang
function updatePageInfo(page, totalPages) {
    const pageInfoElement = document.querySelector('.home-filter__page-curent');
    if (pageInfoElement) {
        pageInfoElement.textContent = page;
        const parentElement = pageInfoElement.parentElement;
        if (parentElement) {
            parentElement.innerHTML = `<span class="home-filter__page-curent">${page}</span>/${totalPages}`;
        }
    }
}

// Hàm lọc sản phẩm với phân trang
function filterProductsWithPagination(category) {
    if (!category || category === 'all') {
        currentFilteredProducts = [...allProducts];
    } else {
        currentFilteredProducts = allProducts.filter(product => {
            const productCategory = product.cateP || product.type || '';
            return productCategory.toLowerCase().includes(category.toLowerCase());
        });
    }
    
    // Reset về trang 1 khi lọc
    currentPage = 1;
    displayProductsWithPagination(1);
}

// Export hàm và biến để có thể gọi từ file khác
window.filterProductsWithPagination = filterProductsWithPagination;
window.displayProductsWithPagination = displayProductsWithPagination;
window.initPagination = initPagination;

// Export biến để có thể truy cập từ bên ngoài
Object.defineProperty(window, 'allProducts', {
    get: function() { return allProducts; },
    set: function(value) { allProducts = value; }
});

Object.defineProperty(window, 'currentFilteredProducts', {
    get: function() { return currentFilteredProducts; },
    set: function(value) { currentFilteredProducts = value; }
});

Object.defineProperty(window, 'currentPage', {
    get: function() { return currentPage; },
    set: function(value) { currentPage = value; }
});

// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để đảm bảo product.js đã load xong
    setTimeout(() => {
        initPagination();
    }, 100);
});

// Lắng nghe sự kiện khi localStorage thay đổi (nếu có sản phẩm mới được thêm)
window.addEventListener('storage', function(e) {
    if (e.key === 'productAll') {
        allProducts = JSON.parse(e.newValue) || [];
        currentFilteredProducts = [...allProducts];
        currentPage = 1;
        displayProductsWithPagination(1);
    }
});

