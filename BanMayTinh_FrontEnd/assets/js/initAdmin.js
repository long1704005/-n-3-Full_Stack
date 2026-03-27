// Script khởi tạo tài khoản Admin mẫu (chỉ chạy một lần)
function initAdminAccount() {
    // Kiểm tra xem đã có users trong localStorage chưa
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kiểm tra xem đã có tài khoản Admin chưa
    const hasAdmin = users.some(user => user.role === 'Admin');
    
    // Nếu chưa có Admin, tạo tài khoản Admin mẫu
    if (!hasAdmin) {
        const adminUser = {
            id: crypto.randomUUID(),
            username: 'admin',
            fullname: 'Quản trị viên',
            email: 'admin@ttgshop.com',
            phone: '0963 541 319',
            password: 'admin123', // Mật khẩu mặc định - nên đổi sau khi đăng nhập
            role: 'Admin',
            avatar: './assets/img/user/userdefault.webp'
        };
        
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('Đã tạo tài khoản Admin mẫu:');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Email: admin@ttgshop.com');
    }
}

// Chạy khi trang được tải
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminAccount);
} else {
    initAdminAccount();
}

