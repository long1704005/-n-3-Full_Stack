function updateAdminPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const adminInfoElement = document.querySelector('.admin-info h1'); // Phần tử hiển thị tên Admin
    const adminAvatarElement = document.querySelector('.admin-info .img-admin'); // Ảnh đại diện Admin

    if (currentUser && currentUser.role === 'Admin') {
        // Hiển thị thông tin admin
        if (adminInfoElement) {
            adminInfoElement.textContent = currentUser.fullname;
        }
        if (adminAvatarElement) {
            adminAvatarElement.src = currentUser.avatar || './assets/img/user/userdefault.webp';
        }
    } else {
        // Nếu không phải Admin, điều hướng về trang Home
        if (!currentUser) {
            alert('Bạn chưa đăng nhập! Vui lòng đăng nhập với tài khoản Admin để truy cập trang quản lý.\n\nTài khoản Admin mẫu:\nUsername: admin\nPassword: admin123');
        } else {
            alert('Bạn không có quyền truy cập trang này!\n\nChỉ tài khoản có quyền "Admin" mới có thể truy cập trang quản lý.');
        }
        window.location.href = 'login.html';
    }
}
window.onload = function () {
    updateAdminPage(); // Cập nhật giao diện Admin
};
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'home.html';
}
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
}

