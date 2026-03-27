// Script khởi tạo sản phẩm mẫu vào localStorage
function initProducts() {
    // Kiểm tra xem đã có sản phẩm trong localStorage chưa
    let productAll = JSON.parse(localStorage.getItem('productAll')) || [];
    
    // Nếu đã có nhiều sản phẩm, không cần thêm mẫu
    if (productAll.length >= 15) {
        console.log('Đã có đủ sản phẩm trong hệ thống.');
        return;
    }
    
    // Nếu có ít sản phẩm, thêm thêm để đủ 15 sản phẩm
    const existingIds = new Set(productAll.map(p => p.id));

    // Tạo sản phẩm mẫu
    const defaultImage = './assets/img/product/14700KF.jpg';
    const sampleProducts = [
        {
            id: 1,
            name: "PC TTG GAMING i7 14700KF - 32GB DDR5 - RTX 4060 Ti",
            type: "PC",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "35,990,000₫",
            currentPrice: "32,680,000₫",
            discount: "30",
            cateP: "PC",
            desc: "Tất cả All NEW - Bảo hành 36 tháng",
            stock: "10"
        },
        {
            id: 2,
            name: "PC FASTER GAMING 10400F - RTX 3050 6GB",
            type: "PC",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "11,990,000₫",
            currentPrice: "9,990,000₫",
            discount: "50",
            cateP: "PC",
            desc: "Tất cả All NEW - Bảo hành 36 tháng",
            stock: "15"
        },
        {
            id: 3,
            name: "PC CHƠI GAME HIỆU SUẤT CAO RTX 3060 12GB - 12400F",
            type: "PC",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "18,990,000₫",
            currentPrice: "15,280,000₫",
            discount: "50",
            cateP: "PC",
            desc: "PC Gaming hiệu suất cao với RTX 3060",
            stock: "8"
        },
        {
            id: 4,
            name: "PC VĂN PHÒNG INTEL i5 12400 - 16GB DDR4",
            type: "PC",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "12,990,000₫",
            currentPrice: "10,990,000₫",
            discount: "25",
            cateP: "PC",
            desc: "PC văn phòng hiệu năng tốt",
            stock: "20"
        },
        {
            id: 5,
            name: "PC AMD RYZEN 5 5600X - RTX 3060 Ti",
            type: "PC",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "22,990,000₫",
            currentPrice: "19,990,000₫",
            discount: "30",
            cateP: "PC",
            desc: "PC Gaming AMD Ryzen mạnh mẽ",
            stock: "12"
        },
        {
            id: 6,
            name: "Màn hình ASUS TUF Gaming VG27AQ 27 inch",
            type: "Màn hình",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "8,990,000₫",
            currentPrice: "7,490,000₫",
            discount: "20",
            cateP: "Màn hình",
            desc: "Màn hình gaming 27 inch 144Hz",
            stock: "25"
        },
        {
            id: 7,
            name: "Màn hình LG UltraGear 24GN600 24 inch",
            type: "Màn hình",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "5,990,000₫",
            currentPrice: "4,990,000₫",
            discount: "15",
            cateP: "Màn hình",
            desc: "Màn hình gaming 24 inch Full HD",
            stock: "30"
        },
        {
            id: 8,
            name: "Bàn phím cơ Logitech G Pro X",
            type: "Gaming Gear",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "3,990,000₫",
            currentPrice: "2,990,000₫",
            discount: "25",
            cateP: "Gaming Gear",
            desc: "Bàn phím cơ gaming chuyên nghiệp",
            stock: "50"
        },
        {
            id: 9,
            name: "Chuột gaming Razer DeathAdder V3",
            type: "Gaming Gear",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "2,490,000₫",
            currentPrice: "1,990,000₫",
            discount: "20",
            cateP: "Gaming Gear",
            desc: "Chuột gaming chính xác cao",
            stock: "40"
        },
        {
            id: 10,
            name: "Card đồ họa NVIDIA RTX 4060 Ti 16GB",
            type: "Linh kiện",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "15,990,000₫",
            currentPrice: "13,990,000₫",
            discount: "15",
            cateP: "Linh kiện",
            desc: "VGA RTX 4060 Ti hiệu năng cao",
            stock: "18"
        },
        {
            id: 11,
            name: "CPU Intel Core i7-13700K",
            type: "Linh kiện",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "10,990,000₫",
            currentPrice: "9,490,000₫",
            discount: "15",
            cateP: "Linh kiện",
            desc: "CPU Intel thế hệ 13 mạnh mẽ",
            stock: "22"
        },
        {
            id: 12,
            name: "RAM DDR5 Kingston 32GB (16GBx2)",
            type: "Linh kiện",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "4,990,000₫",
            currentPrice: "3,990,000₫",
            discount: "20",
            cateP: "Linh kiện",
            desc: "RAM DDR5 tốc độ cao",
            stock: "35"
        },
        {
            id: 13,
            name: "PC GAMING RTX 4070 - i7 13700K",
            type: "PC",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "42,990,000₫",
            currentPrice: "38,990,000₫",
            discount: "10",
            cateP: "PC",
            desc: "PC Gaming cao cấp RTX 4070",
            stock: "5"
        },
        {
            id: 14,
            name: "PC WORKSTATION AMD Threadripper",
            type: "PC",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "89,990,000₫",
            currentPrice: "79,990,000₫",
            discount: "12",
            cateP: "PC",
            desc: "PC Workstation chuyên nghiệp",
            stock: "3"
        },
        {
            id: 15,
            name: "Màn hình Samsung Odyssey G7 32 inch",
            type: "Màn hình",
            avatar: defaultImage,
            image: defaultImage,
            oldPrice: "12,990,000₫",
            currentPrice: "10,990,000₫",
            discount: "15",
            cateP: "Màn hình",
            desc: "Màn hình cong gaming 32 inch",
            stock: "10"
        }
    ];

    // Chỉ thêm các sản phẩm chưa tồn tại
    const newProducts = sampleProducts.filter(p => !existingIds.has(p.id));
    
    if (newProducts.length > 0) {
        productAll = [...productAll, ...newProducts];
        localStorage.setItem('productAll', JSON.stringify(productAll));
        console.log(`Đã thêm ${newProducts.length} sản phẩm mẫu vào hệ thống.`);
    } else {
        console.log('Tất cả sản phẩm mẫu đã tồn tại trong hệ thống.');
    }
}

// Chạy khi trang được tải
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
} else {
    initProducts();
}

