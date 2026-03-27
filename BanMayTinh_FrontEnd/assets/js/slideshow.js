// Slideshow functionality - được tách từ home.html
let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slideList = document.getElementById('slideList');
const dots = document.querySelectorAll('.dot-item');
let autoSlideInterval;

// Cập nhật vị trí slide
function updateSlidePosition() {
    if (slideList) {
        slideList.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
}

// Cập nhật dot đang active
function updateActiveDot() {
    if (dots && dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }
}

// Chuyển tới slide kế tiếp
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
    updateActiveDot();
}

// Quay về slide trước
function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
    updateActiveDot();
}

// Hàm tự động chuyển slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 3000); // 3 giây mỗi lần chuyển
}

// Dừng tự động chuyển slide
function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Đặt lại thời gian chuyển sau khi người dùng tương tác
function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Khởi tạo slideshow khi DOM đã load
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ chạy nếu các phần tử tồn tại
    if (slideList && slides.length > 0 && dots.length > 0) {
        // Cập nhật trạng thái ban đầu
        updateActiveDot();
        updateSlidePosition();

        // Sự kiện cho nút Next
        const nextBtn = document.getElementById('nextSlide');
        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.preventDefault();
                nextSlide();
                resetAutoSlide();
            });
        }

        // Sự kiện cho nút Prev
        const prevBtn = document.getElementById('prevSlide');
        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.preventDefault();
                prevSlide();
                resetAutoSlide();
            });
        }

        // Sự kiện cho các dot
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                currentIndex = index;
                updateSlidePosition();
                updateActiveDot();
                resetAutoSlide();
            });
        });

        // Khởi động tự động trượt slide
        startAutoSlide();
    }
});

