window.addEventListener("load", updateCartCount);

// Hàm xử lý URL ảnh
function processImageUrl(url) {
    if (!url || url.trim() === '' || url === 'undefined' || url === 'null') {
        return './assets/img/product/14700KF.jpg';
    }
    // Xử lý URL bắt đầu bằng //
    if (url.startsWith('//')) {
        url = 'https:' + url;
    }
    return url;
}

// Hàm xử lý lỗi ảnh
function handleImageError(imgElement, fallbackUrl) {
    imgElement.onerror = function() {
        this.src = fallbackUrl;
        this.onerror = null; // Tránh lặp vô hạn nếu fallback cũng lỗi
    };
}

// Lấy thông tin sản phẩm từ localStorage
const productDetails = JSON.parse(localStorage.getItem('productDetails'));
        
if (productDetails) {
    // Hiển thị thông tin sản phẩm
    document.getElementById('breadcrumb-product-name').textContent = productDetails.name;
    document.getElementById('breadcrumb-product-type').textContent = productDetails.type;
    document.getElementById('product-title').textContent = productDetails.name;
    document.getElementById('product-type').textContent = productDetails.type;
    
    // Xử lý ảnh chính
    const mainImageUrl = processImageUrl(productDetails.image || productDetails.avatar);
    const mainImageElement = document.getElementById('product-image');
    mainImageElement.src = mainImageUrl;
    handleImageError(mainImageElement, './assets/img/product/14700KF.jpg');
    
    document.getElementById('product-price-old').textContent = productDetails.oldPrice;
    document.getElementById('product-price-current').textContent = productDetails.currentPrice;
    const discountValue = productDetails.discount ? `-${productDetails.discount}` : '-0';
    document.getElementById('product-percent').textContent = discountValue;
    document.getElementById('product-brand').textContent = productDetails.brand;
    document.getElementById('product-size').textContent = productDetails.size;
    document.getElementById('product-description').textContent = productDetails.description;

    // Hiển thị ảnh nhỏ
    const smallImages = productDetails.smallImages || [];
    const defaultImage = './assets/img/product/14700KF.jpg';
    // Sử dụng ảnh chính làm fallback nếu không có ảnh nhỏ
    const mainImageFallback = mainImageUrl || defaultImage;
    
    // Xử lý ảnh nhỏ 1 - ưu tiên smallImages[0], nếu không có thì dùng ảnh chính
    const smallImage1 = document.getElementById('product-image-small-1');
    if (smallImages[0]) {
        smallImage1.src = processImageUrl(smallImages[0]);
        handleImageError(smallImage1, mainImageFallback);
    } else {
        smallImage1.src = mainImageFallback;
        handleImageError(smallImage1, defaultImage);
    }
    
    // Xử lý ảnh nhỏ 2
    const smallImage2 = document.getElementById('product-image-small-2');
    if (smallImages[1]) {
        smallImage2.src = processImageUrl(smallImages[1]);
        handleImageError(smallImage2, mainImageFallback);
    } else {
        smallImage2.src = mainImageFallback;
        handleImageError(smallImage2, defaultImage);
    }
    
    // Xử lý ảnh nhỏ 3
    const smallImage3 = document.getElementById('product-image-small-3');
    if (smallImages[2]) {
        smallImage3.src = processImageUrl(smallImages[2]);
        handleImageError(smallImage3, mainImageFallback);
    } else {
        smallImage3.src = mainImageFallback;
        handleImageError(smallImage3, defaultImage);
    }
    
    // Xử lý ảnh nhỏ 4
    const smallImage4 = document.getElementById('product-image-small-4');
    if (smallImages[3]) {
        smallImage4.src = processImageUrl(smallImages[3]);
        handleImageError(smallImage4, mainImageFallback);
    } else {
        smallImage4.src = mainImageFallback;
        handleImageError(smallImage4, defaultImage);
    }
    
    // Thêm sự kiện click vào ảnh nhỏ để đổi ảnh chính
    const wrapImgSmall1 = smallImage1.closest('.wrap__img-small');
    const wrapImgSmall2 = smallImage2.closest('.wrap__img-small');
    const wrapImgSmall3 = smallImage3.closest('.wrap__img-small');
    const wrapImgSmall4 = smallImage4.closest('.wrap__img-small');
    
    const allWrapSmall = [wrapImgSmall1, wrapImgSmall2, wrapImgSmall3, wrapImgSmall4];
    
    smallImage1.addEventListener('click', () => {
        mainImageElement.src = smallImage1.src;
        allWrapSmall.forEach(wrap => wrap.classList.remove('active'));
        wrapImgSmall1.classList.add('active');
    });
    smallImage2.addEventListener('click', () => {
        mainImageElement.src = smallImage2.src;
        allWrapSmall.forEach(wrap => wrap.classList.remove('active'));
        wrapImgSmall2.classList.add('active');
    });
    smallImage3.addEventListener('click', () => {
        mainImageElement.src = smallImage3.src;
        allWrapSmall.forEach(wrap => wrap.classList.remove('active'));
        wrapImgSmall3.classList.add('active');
    });
    smallImage4.addEventListener('click', () => {
        mainImageElement.src = smallImage4.src;
        allWrapSmall.forEach(wrap => wrap.classList.remove('active'));
        wrapImgSmall4.classList.add('active');
    });
    
    // Đánh dấu ảnh đầu tiên là active
    if (wrapImgSmall1) {
        wrapImgSmall1.classList.add('active');
    }

    // Hiển thị màu sắc
    const colorOptionsContainer = document.getElementById('product-color-options');
    productDetails.colors.forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.textContent = color;
        colorButton.classList.add('selection-or-unselected');
        colorOptionsContainer.appendChild(colorButton);
    });

    // Hiển thị phiên bản
    const versionOptionsContainer = document.getElementById('product-version-options');
    productDetails.versions.forEach(version => {
        const versionButton = document.createElement('button');
        versionButton.textContent = version;
        versionButton.classList.add('selection-or-unselected');
        versionOptionsContainer.appendChild(versionButton);
    });
}

const decreaseButton = document.getElementById('decrease');
const increaseButton = document.getElementById('increase');
const quantityInput = document.getElementById('quantity');

function decrease(){
    let currentValue = parseInt(quantityInput.value);
    if(currentValue > 1){
        quantityInput.value = currentValue - 1;
    }
}

function increase(){
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
}

function handleSelection(event, groupId) {
    const buttons = document.querySelectorAll(`#${groupId} .selection-or-unselected`);
    const clickedButton = event.target;
    if (clickedButton.classList.contains('selected')) {
        clickedButton.classList.remove('selected');
        console.log('Bỏ chọn:', clickedButton.textContent);
    } else {
        buttons.forEach(button => button.classList.remove('selected'));
        clickedButton.classList.add('selected');
        console.log('Đã chọn:', clickedButton.textContent);
    }
}

// Thêm sự kiện cho màu sắc
const colorOptionsContainer = document.getElementById('product-color-options');
colorOptionsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('selection-or-unselected')) {
        handleSelection(event, 'product-color-options');
    }
});

// Thêm sự kiện cho phiên bản
const versionOptionsContainer = document.getElementById('product-version-options');
versionOptionsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('selection-or-unselected')) {
        handleSelection(event, 'product-version-options');
    }
});

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart() {
    // Lấy thông tin sản phẩm
    const imageMain = document.getElementById('product-image').src;
    const name = document.getElementById('product-title').innerText;
    const oldPrice = document.getElementById('product-price-old').innerHTML;
    const price = document.getElementById('product-price-current').innerText;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Kiểm tra nếu đã chọn màu sắc và phiên bản
    const colorButton = document.querySelector('.sup-color-detail .selected');
    const versionButton = document.querySelector('#product-version-options .selected');
    const color = colorButton ? colorButton.innerText : '';
    const version = versionButton ? versionButton.innerText : '';

    // Kiểm tra nếu không chọn màu hoặc phiên bản
    if (!color || !version) {
        alert('Vui lòng chọn màu sắc và phiên bản sản phẩm trước khi thêm vào giỏ hàng.');
        return; // Dừng nếu chưa chọn
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(
        item => item.name === name && item.color === color && item.version === version
    );

    if (existingItemIndex > -1) {
        // Nếu đã tồn tại, tăng số lượng
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Nếu chưa, thêm mới vào giỏ hàng
        cart.push({ imageMain, name, oldPrice, price, quantity, color, version });
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Cập nhật số lượng giỏ hàng
}


// Hàm cập nhật hiển thị số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItemCount = cart.length;

    const cartCount = document.querySelector('.cart-items');
    if (cartCount) {
        cartCount.textContent = `(${cartItemCount})`;
    }
}

// Hàm xử lý "Mua ngay"
function buyNow() {
    // Hiển thị thông báo xác nhận
    if (!confirm('Bạn có chắc chắn muốn mua sản phẩm này không?')) {
        return; // Nếu người dùng chọn Cancel, dừng lại
    }
    
    // Lấy thông tin sản phẩm (tương tự như addToCart)
    const imageMain = document.getElementById('product-image').src;
    const name = document.getElementById('product-title').innerText;
    const oldPrice = document.getElementById('product-price-old').innerHTML;
    const price = document.getElementById('product-price-current').innerText;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Kiểm tra nếu đã chọn màu sắc và phiên bản
    const colorButton = document.querySelector('.sup-color-detail .selected');
    const versionButton = document.querySelector('#product-version-options .selected');
    const color = colorButton ? colorButton.innerText : '';
    const version = versionButton ? versionButton.innerText : '';

    // Kiểm tra nếu không chọn màu hoặc phiên bản
    if (!color || !version) {
        alert('Vui lòng chọn màu sắc và phiên bản sản phẩm trước khi mua.');
        return;
    }

    // Thêm sản phẩm vào giỏ hàng (hoặc thay thế giỏ hàng hiện tại)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItemIndex = cart.findIndex(
        item => item.name === name && item.color === color && item.version === version
    );

    if (existingItemIndex > -1) {
        // Nếu đã tồn tại, cập nhật số lượng
        cart[existingItemIndex].quantity = quantity;
    } else {
        // Nếu chưa, thêm mới vào giỏ hàng
        cart.push({ imageMain, name, oldPrice, price, quantity, color, version });
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Chuyển hướng sang trang giỏ hàng
    window.location.href = 'cart.html';
}

