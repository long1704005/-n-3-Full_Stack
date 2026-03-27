// Script khởi tạo dữ liệu mẫu cho thống kê
function initSampleData() {
    // Kiểm tra xem đã có dữ liệu mẫu chưa
    const hasSampleData = localStorage.getItem('sampleDataInitialized');
    
    if (hasSampleData === 'true') {
        console.log('Dữ liệu mẫu đã được khởi tạo trước đó.');
        return;
    }

    // Tạo dữ liệu đơn hàng mẫu
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Thêm đơn hàng mẫu nếu chưa có
    if (orders.length < 20) {
        const sampleOrders = [
            {
                id: 'DH001',
                customer: 'Nguyễn Văn A',
                date: new Date(2024, 11, 15).toISOString().split('T')[0],
                total: 32680000,
                status: 'completed'
            },
            {
                id: 'DH002',
                customer: 'Trần Thị B',
                date: new Date(2024, 11, 16).toISOString().split('T')[0],
                total: 9990000,
                status: 'processing'
            },
            {
                id: 'DH003',
                customer: 'Lê Văn C',
                date: new Date(2024, 11, 17).toISOString().split('T')[0],
                total: 15990000,
                status: 'shipped'
            },
            {
                id: 'DH004',
                customer: 'Phạm Thị D',
                date: new Date(2024, 11, 18).toISOString().split('T')[0],
                total: 22990000,
                status: 'completed'
            },
            {
                id: 'DH005',
                customer: 'Hoàng Văn E',
                date: new Date(2024, 11, 19).toISOString().split('T')[0],
                total: 18990000,
                status: 'processing'
            },
            {
                id: 'DH006',
                customer: 'Vũ Thị F',
                date: new Date(2024, 11, 20).toISOString().split('T')[0],
                total: 27990000,
                status: 'completed'
            },
            {
                id: 'DH007',
                customer: 'Đặng Văn G',
                date: new Date(2024, 11, 21).toISOString().split('T')[0],
                total: 11990000,
                status: 'shipped'
            },
            {
                id: 'DH008',
                customer: 'Bùi Thị H',
                date: new Date(2024, 11, 22).toISOString().split('T')[0],
                total: 34990000,
                status: 'completed'
            },
            {
                id: 'DH009',
                customer: 'Đỗ Văn I',
                date: new Date(2024, 11, 23).toISOString().split('T')[0],
                total: 8990000,
                status: 'processing'
            },
            {
                id: 'DH010',
                customer: 'Ngô Thị K',
                date: new Date(2024, 11, 24).toISOString().split('T')[0],
                total: 25990000,
                status: 'completed'
            },
            {
                id: 'DH011',
                customer: 'Lý Văn L',
                date: new Date(2024, 11, 10).toISOString().split('T')[0],
                total: 38990000,
                status: 'completed'
            },
            {
                id: 'DH012',
                customer: 'Võ Thị M',
                date: new Date(2024, 11, 11).toISOString().split('T')[0],
                total: 14990000,
                status: 'shipped'
            },
            {
                id: 'DH013',
                customer: 'Đinh Văn N',
                date: new Date(2024, 11, 12).toISOString().split('T')[0],
                total: 21990000,
                status: 'completed'
            },
            {
                id: 'DH014',
                customer: 'Trương Thị O',
                date: new Date(2024, 11, 13).toISOString().split('T')[0],
                total: 16990000,
                status: 'processing'
            },
            {
                id: 'DH015',
                customer: 'Nguyễn Văn P',
                date: new Date(2024, 11, 14).toISOString().split('T')[0],
                total: 29990000,
                status: 'completed'
            },
            {
                id: 'DH016',
                customer: 'Trần Thị Q',
                date: new Date(2024, 11, 25).toISOString().split('T')[0],
                total: 10990000,
                status: 'shipped'
            },
            {
                id: 'DH017',
                customer: 'Lê Văn R',
                date: new Date(2024, 11, 26).toISOString().split('T')[0],
                total: 17990000,
                status: 'processing'
            },
            {
                id: 'DH018',
                customer: 'Phạm Thị S',
                date: new Date(2024, 11, 27).toISOString().split('T')[0],
                total: 23990000,
                status: 'completed'
            },
            {
                id: 'DH019',
                customer: 'Hoàng Văn T',
                date: new Date(2024, 11, 28).toISOString().split('T')[0],
                total: 31990000,
                status: 'completed'
            },
            {
                id: 'DH020',
                customer: 'Vũ Thị U',
                date: new Date(2024, 11, 29).toISOString().split('T')[0],
                total: 12990000,
                status: 'shipped'
            }
        ];
        
        // Chỉ thêm các đơn hàng chưa tồn tại
        sampleOrders.forEach(order => {
            if (!orders.find(o => o.id === order.id)) {
                orders.push(order);
            }
        });
        
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Tạo người dùng mẫu
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.length < 10) {
        const sampleUsers = [
            {
                id: crypto.randomUUID(),
                username: 'user1',
                fullname: 'Nguyễn Văn A',
                email: 'user1@example.com',
                phone: '0912345678',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            },
            {
                id: crypto.randomUUID(),
                username: 'user2',
                fullname: 'Trần Thị B',
                email: 'user2@example.com',
                phone: '0923456789',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            },
            {
                id: crypto.randomUUID(),
                username: 'user3',
                fullname: 'Lê Văn C',
                email: 'user3@example.com',
                phone: '0934567890',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            },
            {
                id: crypto.randomUUID(),
                username: 'user4',
                fullname: 'Phạm Thị D',
                email: 'user4@example.com',
                phone: '0945678901',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            },
            {
                id: crypto.randomUUID(),
                username: 'user5',
                fullname: 'Hoàng Văn E',
                email: 'user5@example.com',
                phone: '0956789012',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            },
            {
                id: crypto.randomUUID(),
                username: 'user6',
                fullname: 'Vũ Thị F',
                email: 'user6@example.com',
                phone: '0967890123',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            },
            {
                id: crypto.randomUUID(),
                username: 'user7',
                fullname: 'Đặng Văn G',
                email: 'user7@example.com',
                phone: '0978901234',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            },
            {
                id: crypto.randomUUID(),
                username: 'user8',
                fullname: 'Bùi Thị H',
                email: 'user8@example.com',
                phone: '0989012345',
                password: '123456',
                role: 'User',
                avatar: './assets/img/user/userdefault.webp'
            }
        ];
        
        sampleUsers.forEach(user => {
            if (!users.find(u => u.username === user.username)) {
                users.push(user);
            }
        });
        
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Tạo danh mục mẫu
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    
    if (categories.length < 5) {
        const sampleCategories = [
            {
                id: crypto.randomUUID(),
                catename: 'PC Gaming'
            },
            {
                id: crypto.randomUUID(),
                catename: 'PC Văn Phòng'
            },
            {
                id: crypto.randomUUID(),
                catename: 'Linh kiện'
            },
            {
                id: crypto.randomUUID(),
                catename: 'Màn hình'
            },
            {
                id: crypto.randomUUID(),
                catename: 'Gaming Gear'
            }
        ];
        
        sampleCategories.forEach(category => {
            if (!categories.find(c => c.catename === category.catename)) {
                categories.push(category);
            }
        });
        
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    // Tạo thương hiệu mẫu
    let brands = JSON.parse(localStorage.getItem('brands')) || [];
    
    if (brands.length < 6) {
        const sampleBrands = [
            {
                id: crypto.randomUUID(),
                brandname: 'Intel'
            },
            {
                id: crypto.randomUUID(),
                brandname: 'AMD'
            },
            {
                id: crypto.randomUUID(),
                brandname: 'NVIDIA'
            },
            {
                id: crypto.randomUUID(),
                brandname: 'ASUS'
            },
            {
                id: crypto.randomUUID(),
                brandname: 'MSI'
            },
            {
                id: crypto.randomUUID(),
                brandname: 'Gigabyte'
            }
        ];
        
        sampleBrands.forEach(brand => {
            if (!brands.find(b => b.brandname === brand.brandname)) {
                brands.push(brand);
            }
        });
        
        localStorage.setItem('brands', JSON.stringify(brands));
    }

    // Khởi tạo sản phẩm nếu chưa có
    let productAll = JSON.parse(localStorage.getItem('productAll')) || [];
    if (productAll.length === 0) {
        // Load script initProducts nếu có
        if (typeof initProducts === 'function') {
            initProducts();
        }
    }

    // Đánh dấu đã khởi tạo dữ liệu mẫu
    localStorage.setItem('sampleDataInitialized', 'true');
    console.log('Đã khởi tạo dữ liệu mẫu cho thống kê.');
}

// Chạy khi trang được tải
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSampleData);
} else {
    initSampleData();
}

