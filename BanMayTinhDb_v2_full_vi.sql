/*
    CSDL BanMayTinh V2 - Ban tieng Viet (khong dau)
    Day du: Thuong mai dien tu + Quan tri + POS + Kho
*/

SET NOCOUNT ON;
GO

IF DB_ID(N'BanMayTinhDb_V2') IS NULL
BEGIN
    CREATE DATABASE BanMayTinhDb_V2 COLLATE Vietnamese_100_CI_AS;
END
GO

USE BanMayTinhDb_V2;
GO

/* =========================
   1) Nguoi dung + phan quyen
   ========================= */

CREATE TABLE dbo.NguoiDung (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap             NVARCHAR(100) NOT NULL,
    Email                   NVARCHAR(200) NOT NULL,
    MatKhauHash             NVARCHAR(500) NOT NULL,
    HoTen                   NVARCHAR(200) NULL,
    SoDienThoai             NVARCHAR(20) NULL,
    DiaChi                  NVARCHAR(500) NULL,
    AnhDaiDien              NVARCHAR(500) NULL,
    NgaySinh                DATE NULL,
    GioiTinh                NVARCHAR(20) NULL,
    VaiTro                  NVARCHAR(50) NOT NULL CONSTRAINT DF_NguoiDung_VaiTro DEFAULT N'Customer',
    HoatDong                BIT NOT NULL CONSTRAINT DF_NguoiDung_HoatDong DEFAULT(1),
    DaXacThucEmail          BIT NOT NULL CONSTRAINT DF_NguoiDung_DaXacThucEmail DEFAULT(0),
    LanDangNhapCuoi         DATETIME2 NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_NguoiDung_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT UQ_NguoiDung_TenDangNhap UNIQUE (TenDangNhap),
    CONSTRAINT UQ_NguoiDung_Email UNIQUE (Email)
);
GO

CREATE TABLE dbo.VaiTro (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    MaVaiTro                NVARCHAR(50) NOT NULL,
    TenVaiTro               NVARCHAR(100) NOT NULL,
    MoTa                    NVARCHAR(500) NULL,
    VaiTroHeThong           BIT NOT NULL CONSTRAINT DF_VaiTro_HeThong DEFAULT(0),
    HoatDong                BIT NOT NULL CONSTRAINT DF_VaiTro_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_VaiTro_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_VaiTro_MaVaiTro UNIQUE (MaVaiTro)
);
GO

CREATE TABLE dbo.Quyen (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    MaQuyen                 NVARCHAR(100) NOT NULL,
    TenQuyen                NVARCHAR(200) NOT NULL,
    NhomChucNang            NVARCHAR(100) NOT NULL,
    MoTa                    NVARCHAR(500) NULL,
    CONSTRAINT UQ_Quyen_MaQuyen UNIQUE (MaQuyen)
);
GO

CREATE TABLE dbo.VaiTro_Quyen (
    VaiTroId                INT NOT NULL,
    QuyenId                 INT NOT NULL,
    NgayGan                 DATETIME2 NOT NULL CONSTRAINT DF_VaiTro_Quyen_NgayGan DEFAULT SYSUTCDATETIME(),
    PRIMARY KEY (VaiTroId, QuyenId),
    CONSTRAINT FK_VaiTro_Quyen_VaiTro FOREIGN KEY (VaiTroId) REFERENCES dbo.VaiTro(Id),
    CONSTRAINT FK_VaiTro_Quyen_Quyen FOREIGN KEY (QuyenId) REFERENCES dbo.Quyen(Id)
);
GO

CREATE TABLE dbo.NguoiDung_VaiTro (
    NguoiDungId             INT NOT NULL,
    VaiTroId                INT NOT NULL,
    NguoiGanId              INT NULL,
    NgayGan                 DATETIME2 NOT NULL CONSTRAINT DF_NguoiDung_VaiTro_NgayGan DEFAULT SYSUTCDATETIME(),
    PRIMARY KEY (NguoiDungId, VaiTroId),
    CONSTRAINT FK_NguoiDung_VaiTro_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_NguoiDung_VaiTro_VaiTro FOREIGN KEY (VaiTroId) REFERENCES dbo.VaiTro(Id),
    CONSTRAINT FK_NguoiDung_VaiTro_NguoiGan FOREIGN KEY (NguoiGanId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.MaNguoiDung (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    NguoiDungId             INT NOT NULL,
    LoaiMa                  NVARCHAR(50) NOT NULL,  -- RefreshToken, XacThucEmail, QuenMatKhau
    GiaTriHash              NVARCHAR(500) NOT NULL,
    HetHanLuc               DATETIME2 NOT NULL,
    ThuHoiLuc               DATETIME2 NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_MaNguoiDung_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_MaNguoiDung_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(Id)
);
GO

/* =========================
   2) Danh muc san pham
   ========================= */

CREATE TABLE dbo.DanhMuc (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    DanhMucChaId            INT NULL,
    Ten                     NVARCHAR(200) NOT NULL,
    Slug                    NVARCHAR(200) NULL,
    MoTa                    NVARCHAR(1000) NULL,
    ThuTuSapXep             INT NOT NULL CONSTRAINT DF_DanhMuc_ThuTu DEFAULT(0),
    HoatDong                BIT NOT NULL CONSTRAINT DF_DanhMuc_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_DanhMuc_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT FK_DanhMuc_DanhMucCha FOREIGN KEY (DanhMucChaId) REFERENCES dbo.DanhMuc(Id)
);
GO

CREATE TABLE dbo.ThuongHieu (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    Ten                     NVARCHAR(200) NOT NULL,
    Slug                    NVARCHAR(200) NULL,
    MoTa                    NVARCHAR(1000) NULL,
    Website                 NVARCHAR(500) NULL,
    HoatDong                BIT NOT NULL CONSTRAINT DF_ThuongHieu_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_ThuongHieu_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL
);
GO

CREATE TABLE dbo.DonViTinh (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    MaDonVi                 NVARCHAR(20) NOT NULL,
    TenDonVi                NVARCHAR(100) NOT NULL,
    CONSTRAINT UQ_DonViTinh_Ma UNIQUE (MaDonVi)
);
GO

CREATE TABLE dbo.SanPham (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    SKU                     NVARCHAR(100) NOT NULL,
    MaVach                  NVARCHAR(100) NULL,
    DanhMucId               INT NOT NULL,
    ThuongHieuId            INT NULL,
    DonViTinhId             INT NULL,
    Ten                     NVARCHAR(300) NOT NULL,
    Slug                    NVARCHAR(300) NULL,
    MoTaNgan                NVARCHAR(1000) NULL,
    MoTa                    NVARCHAR(MAX) NULL,
    GiaBan                  DECIMAL(18,2) NOT NULL,
    GiaGoc                  DECIMAL(18,2) NULL,
    GiaVon                  DECIMAL(18,2) NULL,
    VAT                     DECIMAL(5,2) NOT NULL CONSTRAINT DF_SanPham_VAT DEFAULT(0),
    SoLuongTon              INT NOT NULL CONSTRAINT DF_SanPham_Ton DEFAULT(0),
    MucTonToiThieu          INT NOT NULL CONSTRAINT DF_SanPham_TonToiThieu DEFAULT(0),
    MucTonToiDa             INT NULL,
    AnhDaiDien              NVARCHAR(500) NULL,
    AnhSanPham              NVARCHAR(500) NULL,
    BaoHanhThang            INT NULL,
    KhoiLuongGram           DECIMAL(18,2) NULL,
    NoiBat                  BIT NOT NULL CONSTRAINT DF_SanPham_NoiBat DEFAULT(0),
    MoiNhat                 BIT NOT NULL CONSTRAINT DF_SanPham_MoiNhat DEFAULT(0),
    BanChay                 BIT NOT NULL CONSTRAINT DF_SanPham_BanChay DEFAULT(0),
    HoatDong                BIT NOT NULL CONSTRAINT DF_SanPham_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_SanPham_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT UQ_SanPham_SKU UNIQUE (SKU),
    CONSTRAINT UQ_SanPham_MaVach UNIQUE (MaVach),
    CONSTRAINT FK_SanPham_DanhMuc FOREIGN KEY (DanhMucId) REFERENCES dbo.DanhMuc(Id),
    CONSTRAINT FK_SanPham_ThuongHieu FOREIGN KEY (ThuongHieuId) REFERENCES dbo.ThuongHieu(Id),
    CONSTRAINT FK_SanPham_DonViTinh FOREIGN KEY (DonViTinhId) REFERENCES dbo.DonViTinh(Id)
);
GO

CREATE TABLE dbo.AnhSanPham (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    SanPhamId               INT NOT NULL,
    DuongDanAnh             NVARCHAR(500) NOT NULL,
    AltText                 NVARCHAR(300) NULL,
    AnhChinh                BIT NOT NULL CONSTRAINT DF_AnhSanPham_AnhChinh DEFAULT(0),
    ThuTu                   INT NOT NULL CONSTRAINT DF_AnhSanPham_ThuTu DEFAULT(0),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_AnhSanPham_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AnhSanPham_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

CREATE TABLE dbo.ThongSoSanPham (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    SanPhamId               INT NOT NULL,
    NhomThongSo             NVARCHAR(100) NULL,
    TenThongSo              NVARCHAR(200) NOT NULL,
    GiaTriThongSo           NVARCHAR(1000) NOT NULL,
    ThuTu                   INT NOT NULL CONSTRAINT DF_ThongSoSanPham_ThuTu DEFAULT(0),
    CONSTRAINT FK_ThongSoSanPham_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

/* =========================
   3) Marketing + noi dung
   ========================= */

CREATE TABLE dbo.KhuyenMai (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    MaKhuyenMai             NVARCHAR(50) NOT NULL,
    TenKhuyenMai            NVARCHAR(200) NOT NULL,
    MoTa                    NVARCHAR(1000) NULL,
    LoaiGiamGia             NVARCHAR(20) NOT NULL,   -- Percent / Amount
    GiaTriGiam              DECIMAL(18,2) NOT NULL,
    GiamToiDa               DECIMAL(18,2) NULL,
    DonToiThieu             DECIMAL(18,2) NULL,
    BatDauLuc               DATETIME2 NOT NULL,
    KetThucLuc              DATETIME2 NOT NULL,
    HoatDong                BIT NOT NULL CONSTRAINT DF_KhuyenMai_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_KhuyenMai_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT UQ_KhuyenMai_Ma UNIQUE (MaKhuyenMai)
);
GO

CREATE TABLE dbo.KhuyenMai_SanPham (
    KhuyenMaiId             INT NOT NULL,
    SanPhamId               INT NOT NULL,
    PRIMARY KEY (KhuyenMaiId, SanPhamId),
    CONSTRAINT FK_KhuyenMai_SanPham_KhuyenMai FOREIGN KEY (KhuyenMaiId) REFERENCES dbo.KhuyenMai(Id),
    CONSTRAINT FK_KhuyenMai_SanPham_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

CREATE TABLE dbo.MaGiamGia (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    Ma                      NVARCHAR(50) NOT NULL,
    Ten                     NVARCHAR(200) NOT NULL,
    MoTa                    NVARCHAR(1000) NULL,
    LoaiGiamGia             NVARCHAR(20) NOT NULL,
    GiaTriGiam              DECIMAL(18,2) NOT NULL,
    DonToiThieu             DECIMAL(18,2) NULL,
    SoLanSuDungToiDa        INT NULL,
    SoLanDaDung             INT NOT NULL CONSTRAINT DF_MaGiamGia_DaDung DEFAULT(0),
    GioiHanMoiNguoi         INT NULL,
    BatDauLuc               DATETIME2 NOT NULL,
    KetThucLuc              DATETIME2 NOT NULL,
    HoatDong                BIT NOT NULL CONSTRAINT DF_MaGiamGia_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_MaGiamGia_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_MaGiamGia_Ma UNIQUE (Ma)
);
GO

CREATE TABLE dbo.Banner (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    TieuDe                  NVARCHAR(300) NOT NULL,
    DuongDanAnh             NVARCHAR(500) NOT NULL,
    LinkDieuHuong           NVARCHAR(500) NULL,
    ViTri                   NVARCHAR(50) NOT NULL,
    ThuTuHienThi            INT NOT NULL CONSTRAINT DF_Banner_ThuTu DEFAULT(0),
    BatDauLuc               DATETIME2 NULL,
    KetThucLuc              DATETIME2 NULL,
    HoatDong                BIT NOT NULL CONSTRAINT DF_Banner_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_Banner_NgayTao DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.DanhMucTinTuc (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    Ten                     NVARCHAR(200) NOT NULL,
    Slug                    NVARCHAR(200) NULL,
    HoatDong                BIT NOT NULL CONSTRAINT DF_DanhMucTinTuc_HoatDong DEFAULT(1),
    CONSTRAINT UQ_DanhMucTinTuc_Ten UNIQUE (Ten)
);
GO

CREATE TABLE dbo.BaiVietTinTuc (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    DanhMucTinTucId         INT NULL,
    TacGiaId                INT NULL,
    TieuDe                  NVARCHAR(300) NOT NULL,
    Slug                    NVARCHAR(300) NULL,
    TomTat                  NVARCHAR(1000) NULL,
    NoiDung                 NVARCHAR(MAX) NULL,
    AnhDaiDien              NVARCHAR(500) NULL,
    XuatBan                 BIT NOT NULL CONSTRAINT DF_BaiVietTinTuc_XuatBan DEFAULT(0),
    XuatBanLuc              DATETIME2 NULL,
    LuotXem                 BIGINT NOT NULL CONSTRAINT DF_BaiVietTinTuc_LuotXem DEFAULT(0),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_BaiVietTinTuc_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT FK_BaiVietTinTuc_DanhMuc FOREIGN KEY (DanhMucTinTucId) REFERENCES dbo.DanhMucTinTuc(Id),
    CONSTRAINT FK_BaiVietTinTuc_TacGia FOREIGN KEY (TacGiaId) REFERENCES dbo.NguoiDung(Id)
);
GO

/* =========================
   4) Tuong tac nguoi dung
   ========================= */

CREATE TABLE dbo.BinhLuan (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    SanPhamId               INT NOT NULL,
    NguoiDungId             INT NOT NULL,
    DanhGia                 INT NOT NULL,
    NoiDung                 NVARCHAR(1000) NULL,
    Duyet                   BIT NOT NULL CONSTRAINT DF_BinhLuan_Duyet DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_BinhLuan_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT FK_BinhLuan_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id),
    CONSTRAINT FK_BinhLuan_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT CK_BinhLuan_DanhGia CHECK (DanhGia BETWEEN 1 AND 5)
);
GO

/* =========================
   5) Gio hang + don hang
   ========================= */

CREATE TABLE dbo.GioHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    NguoiDungId             INT NULL,
    SessionId               NVARCHAR(200) NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_GioHang_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT FK_GioHang_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.ChiTietGioHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    GioHangId               BIGINT NOT NULL,
    SanPhamId               INT NOT NULL,
    SoLuong                 INT NOT NULL,
    DonGiaSnapshot          DECIMAL(18,2) NOT NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_ChiTietGioHang_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT FK_ChiTietGioHang_GioHang FOREIGN KEY (GioHangId) REFERENCES dbo.GioHang(Id),
    CONSTRAINT FK_ChiTietGioHang_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id),
    CONSTRAINT UQ_ChiTietGioHang UNIQUE (GioHangId, SanPhamId)
);
GO

CREATE TABLE dbo.DonHang (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    MaDonHang               NVARCHAR(50) NOT NULL,
    NguoiDungId             INT NOT NULL,
    MaGiamGiaId             INT NULL,
    NgayDat                 DATETIME2 NOT NULL CONSTRAINT DF_DonHang_NgayDat DEFAULT SYSUTCDATETIME(),
    TrangThai               NVARCHAR(50) NOT NULL CONSTRAINT DF_DonHang_TrangThai DEFAULT N'Pending',
    TrangThaiThanhToan      NVARCHAR(50) NOT NULL CONSTRAINT DF_DonHang_TrangThaiTT DEFAULT N'Unpaid',
    TrangThaiVanChuyen      NVARCHAR(50) NOT NULL CONSTRAINT DF_DonHang_TrangThaiVC DEFAULT N'NotShipped',
    TamTinh                 DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonHang_TamTinh DEFAULT(0),
    TienGiam                DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonHang_TienGiam DEFAULT(0),
    PhiVanChuyen            DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonHang_PhiVC DEFAULT(0),
    Thue                    DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonHang_Thue DEFAULT(0),
    TongTien                DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonHang_TongTien DEFAULT(0),
    TenNguoiNhan            NVARCHAR(200) NULL,
    DiaChiGiaoHang          NVARCHAR(500) NOT NULL,
    SoDienThoai             NVARCHAR(20) NOT NULL,
    GhiChu                  NVARCHAR(1000) NULL,
    PhuongThucThanhToan     NVARCHAR(50) NULL,
    HuyLuc                  DATETIME2 NULL,
    LyDoHuy                 NVARCHAR(500) NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_DonHang_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT UQ_DonHang_Ma UNIQUE (MaDonHang),
    CONSTRAINT FK_DonHang_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_DonHang_MaGiamGia FOREIGN KEY (MaGiamGiaId) REFERENCES dbo.MaGiamGia(Id)
);
GO

CREATE TABLE dbo.ChiTietDonHang (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    DonHangId               INT NOT NULL,
    SanPhamId               INT NOT NULL,
    TenSanPhamSnapshot      NVARCHAR(300) NOT NULL,
    SKUSnapshot             NVARCHAR(100) NULL,
    SoLuong                 INT NOT NULL,
    DonGia                  DECIMAL(18,2) NOT NULL,
    PhanTramGiamGia         DECIMAL(5,2) NOT NULL CONSTRAINT DF_ChiTietDonHang_GiamPT DEFAULT(0),
    TienGiam                DECIMAL(18,2) NOT NULL CONSTRAINT DF_ChiTietDonHang_TienGiam DEFAULT(0),
    CONSTRAINT FK_ChiTietDonHang_DonHang FOREIGN KEY (DonHangId) REFERENCES dbo.DonHang(Id),
    CONSTRAINT FK_ChiTietDonHang_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

/* =========================
   6) Kho + POS + bao cao (rut gon ten)
   ========================= */

CREATE TABLE dbo.KhoHang (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    MaKho                   NVARCHAR(50) NOT NULL,
    TenKho                  NVARCHAR(200) NOT NULL,
    DiaChi                  NVARCHAR(500) NULL,
    SoDienThoai             NVARCHAR(20) NULL,
    HoatDong                BIT NOT NULL CONSTRAINT DF_KhoHang_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_KhoHang_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_KhoHang_Ma UNIQUE (MaKho)
);
GO

CREATE TABLE dbo.TonKhoSanPham (
    SanPhamId               INT NOT NULL,
    KhoHangId               INT NOT NULL,
    SoLuongTon              INT NOT NULL CONSTRAINT DF_TonKhoSanPham_Ton DEFAULT(0),
    SoLuongDatTruoc         INT NOT NULL CONSTRAINT DF_TonKhoSanPham_DatTruoc DEFAULT(0),
    CapNhatLuc              DATETIME2 NOT NULL CONSTRAINT DF_TonKhoSanPham_CapNhat DEFAULT SYSUTCDATETIME(),
    PRIMARY KEY (SanPhamId, KhoHangId),
    CONSTRAINT FK_TonKhoSanPham_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id),
    CONSTRAINT FK_TonKhoSanPham_KhoHang FOREIGN KEY (KhoHangId) REFERENCES dbo.KhoHang(Id)
);
GO

CREATE TABLE dbo.GiaoDichKho (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    SanPhamId               INT NOT NULL,
    KhoHangId               INT NOT NULL,
    LoaiGiaoDich            NVARCHAR(50) NOT NULL,
    SoLuong                 INT NOT NULL,
    DonGiaVon               DECIMAL(18,2) NULL,
    LoaiThamChieu           NVARCHAR(50) NULL,
    MaThamChieu             NVARCHAR(100) NULL,
    GhiChu                  NVARCHAR(500) NULL,
    NguoiTaoId              INT NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_GiaoDichKho_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_GiaoDichKho_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id),
    CONSTRAINT FK_GiaoDichKho_KhoHang FOREIGN KEY (KhoHangId) REFERENCES dbo.KhoHang(Id),
    CONSTRAINT FK_GiaoDichKho_NguoiTao FOREIGN KEY (NguoiTaoId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.CaBanHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaCa                    NVARCHAR(50) NOT NULL,
    NhanVienId              INT NOT NULL,
    MoCaLuc                 DATETIME2 NOT NULL CONSTRAINT DF_CaBanHang_MoCa DEFAULT SYSUTCDATETIME(),
    DongCaLuc               DATETIME2 NULL,
    TienDauCa               DECIMAL(18,2) NOT NULL CONSTRAINT DF_CaBanHang_TienDau DEFAULT(0),
    TienCuoiCa              DECIMAL(18,2) NULL,
    TrangThai               NVARCHAR(20) NOT NULL CONSTRAINT DF_CaBanHang_TrangThai DEFAULT N'Open',
    GhiChu                  NVARCHAR(500) NULL,
    CONSTRAINT UQ_CaBanHang_Ma UNIQUE (MaCa),
    CONSTRAINT FK_CaBanHang_NhanVien FOREIGN KEY (NhanVienId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.HoaDonQuay (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaHoaDon                NVARCHAR(50) NOT NULL,
    CaBanHangId             BIGINT NULL,
    ThuNganId               INT NOT NULL,
    KhachHangId             INT NULL,
    KhoHangId               INT NULL,
    TrangThai               NVARCHAR(20) NOT NULL CONSTRAINT DF_HoaDonQuay_TrangThai DEFAULT N'Completed',
    TamTinh                 DECIMAL(18,2) NOT NULL CONSTRAINT DF_HoaDonQuay_TamTinh DEFAULT(0),
    TienGiam                DECIMAL(18,2) NOT NULL CONSTRAINT DF_HoaDonQuay_TienGiam DEFAULT(0),
    TongTien                DECIMAL(18,2) NOT NULL CONSTRAINT DF_HoaDonQuay_TongTien DEFAULT(0),
    PhuongThucThanhToan     NVARCHAR(50) NOT NULL,
    GhiChu                  NVARCHAR(500) NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_HoaDonQuay_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_HoaDonQuay_Ma UNIQUE (MaHoaDon),
    CONSTRAINT FK_HoaDonQuay_CaBanHang FOREIGN KEY (CaBanHangId) REFERENCES dbo.CaBanHang(Id),
    CONSTRAINT FK_HoaDonQuay_ThuNgan FOREIGN KEY (ThuNganId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_HoaDonQuay_KhachHang FOREIGN KEY (KhachHangId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_HoaDonQuay_KhoHang FOREIGN KEY (KhoHangId) REFERENCES dbo.KhoHang(Id)
);
GO

CREATE TABLE dbo.ChiTietHoaDonQuay (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    HoaDonQuayId             BIGINT NOT NULL,
    SanPhamId               INT NOT NULL,
    TenSanPhamSnapshot      NVARCHAR(300) NOT NULL,
    SoLuong                 INT NOT NULL,
    DonGia                  DECIMAL(18,2) NOT NULL,
    PhanTramGiamGia         DECIMAL(5,2) NOT NULL CONSTRAINT DF_ChiTietHoaDonQuay_GiamPT DEFAULT(0),
    TienGiam                DECIMAL(18,2) NOT NULL CONSTRAINT DF_ChiTietHoaDonQuay_TienGiam DEFAULT(0),
    CONSTRAINT FK_ChiTietHoaDonQuay_HoaDon FOREIGN KEY (HoaDonQuayId) REFERENCES dbo.HoaDonQuay(Id),
    CONSTRAINT FK_ChiTietHoaDonQuay_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

CREATE TABLE dbo.ThanhToanQuay (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    HoaDonQuayId            BIGINT NOT NULL,
    PhuongThuc              NVARCHAR(50) NOT NULL,
    SoTien                  DECIMAL(18,2) NOT NULL,
    ThanhToanLuc            DATETIME2 NOT NULL CONSTRAINT DF_ThanhToanQuay_ThanhToanLuc DEFAULT SYSUTCDATETIME(),
    MaThamChieu             NVARCHAR(100) NULL,
    CONSTRAINT FK_ThanhToanQuay_HoaDon FOREIGN KEY (HoaDonQuayId) REFERENCES dbo.HoaDonQuay(Id)
);
GO

CREATE TABLE dbo.LichSuTrangThaiDonHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    DonHangId               INT NOT NULL,
    TrangThaiCu             NVARCHAR(50) NULL,
    TrangThaiMoi            NVARCHAR(50) NOT NULL,
    NguoiCapNhatId          INT NULL,
    LyDo                    NVARCHAR(500) NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_LichSuTrangThaiDonHang_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_LichSuTrangThaiDonHang_DonHang FOREIGN KEY (DonHangId) REFERENCES dbo.DonHang(Id),
    CONSTRAINT FK_LichSuTrangThaiDonHang_NguoiDung FOREIGN KEY (NguoiCapNhatId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.ThanhToanDonHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    DonHangId               INT NOT NULL,
    MaThanhToan             NVARCHAR(100) NULL,
    PhuongThuc              NVARCHAR(50) NOT NULL,
    SoTien                  DECIMAL(18,2) NOT NULL,
    TrangThai               NVARCHAR(50) NOT NULL CONSTRAINT DF_ThanhToanDonHang_TrangThai DEFAULT N'Pending',
    ThanhToanLuc            DATETIME2 NULL,
    DuLieuCongThanhToan     NVARCHAR(MAX) NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_ThanhToanDonHang_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ThanhToanDonHang_DonHang FOREIGN KEY (DonHangId) REFERENCES dbo.DonHang(Id)
);
GO

CREATE TABLE dbo.VanDon (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    DonHangId               INT NOT NULL,
    DonViVanChuyen          NVARCHAR(200) NULL,
    MaVanDon                NVARCHAR(100) NULL,
    PhiVanChuyen            DECIMAL(18,2) NOT NULL CONSTRAINT DF_VanDon_Phi DEFAULT(0),
    TrangThai               NVARCHAR(50) NOT NULL CONSTRAINT DF_VanDon_TrangThai DEFAULT N'Preparing',
    GuiHangLuc              DATETIME2 NULL,
    GiaoHangLuc             DATETIME2 NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_VanDon_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_VanDon_DonHang FOREIGN KEY (DonHangId) REFERENCES dbo.DonHang(Id)
);
GO

CREATE TABLE dbo.NhaCungCap (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    MaNhaCungCap            NVARCHAR(50) NOT NULL,
    TenNhaCungCap           NVARCHAR(200) NOT NULL,
    NguoiLienHe             NVARCHAR(200) NULL,
    SoDienThoai             NVARCHAR(20) NULL,
    Email                   NVARCHAR(200) NULL,
    DiaChi                  NVARCHAR(500) NULL,
    MaSoThue                NVARCHAR(50) NULL,
    HoatDong                BIT NOT NULL CONSTRAINT DF_NhaCungCap_HoatDong DEFAULT(1),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_NhaCungCap_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_NhaCungCap_Ma UNIQUE (MaNhaCungCap)
);
GO

CREATE TABLE dbo.DieuChinhKho (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaDieuChinh             NVARCHAR(50) NOT NULL,
    KhoHangId               INT NOT NULL,
    LyDo                    NVARCHAR(500) NULL,
    TrangThai               NVARCHAR(50) NOT NULL CONSTRAINT DF_DieuChinhKho_TrangThai DEFAULT N'Draft',
    NguoiTaoId              INT NULL,
    NguoiDuyetId            INT NULL,
    DuyetLuc                DATETIME2 NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_DieuChinhKho_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_DieuChinhKho_Ma UNIQUE (MaDieuChinh),
    CONSTRAINT FK_DieuChinhKho_KhoHang FOREIGN KEY (KhoHangId) REFERENCES dbo.KhoHang(Id),
    CONSTRAINT FK_DieuChinhKho_NguoiTao FOREIGN KEY (NguoiTaoId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_DieuChinhKho_NguoiDuyet FOREIGN KEY (NguoiDuyetId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.ChiTietDieuChinhKho (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    DieuChinhKhoId          BIGINT NOT NULL,
    SanPhamId               INT NOT NULL,
    SoLuongTruoc            INT NOT NULL,
    SoLuongSau              INT NOT NULL,
    GhiChu                  NVARCHAR(300) NULL,
    CONSTRAINT FK_ChiTietDieuChinhKho_DieuChinh FOREIGN KEY (DieuChinhKhoId) REFERENCES dbo.DieuChinhKho(Id),
    CONSTRAINT FK_ChiTietDieuChinhKho_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

CREATE TABLE dbo.DonNhapHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaDonNhap               NVARCHAR(50) NOT NULL,
    NhaCungCapId            INT NOT NULL,
    KhoHangId               INT NOT NULL,
    NgayDat                 DATETIME2 NOT NULL CONSTRAINT DF_DonNhapHang_NgayDat DEFAULT SYSUTCDATETIME(),
    NgayDuKien              DATETIME2 NULL,
    TrangThai               NVARCHAR(50) NOT NULL CONSTRAINT DF_DonNhapHang_TrangThai DEFAULT N'Draft',
    TamTinh                 DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonNhapHang_TamTinh DEFAULT(0),
    TienGiam                DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonNhapHang_TienGiam DEFAULT(0),
    TongTien                DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonNhapHang_TongTien DEFAULT(0),
    GhiChu                  NVARCHAR(1000) NULL,
    NguoiTaoId              INT NULL,
    NguoiDuyetId            INT NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_DonNhapHang_NgayTao DEFAULT SYSUTCDATETIME(),
    NgayCapNhat             DATETIME2 NULL,
    CONSTRAINT UQ_DonNhapHang_Ma UNIQUE (MaDonNhap),
    CONSTRAINT FK_DonNhapHang_NhaCungCap FOREIGN KEY (NhaCungCapId) REFERENCES dbo.NhaCungCap(Id),
    CONSTRAINT FK_DonNhapHang_KhoHang FOREIGN KEY (KhoHangId) REFERENCES dbo.KhoHang(Id),
    CONSTRAINT FK_DonNhapHang_NguoiTao FOREIGN KEY (NguoiTaoId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_DonNhapHang_NguoiDuyet FOREIGN KEY (NguoiDuyetId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.ChiTietDonNhapHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    DonNhapHangId           BIGINT NOT NULL,
    SanPhamId               INT NOT NULL,
    SoLuong                 INT NOT NULL,
    SoLuongDaNhan           INT NOT NULL CONSTRAINT DF_ChiTietDonNhapHang_DaNhan DEFAULT(0),
    DonGiaVon               DECIMAL(18,2) NOT NULL,
    PhanTramGiamGia         DECIMAL(5,2) NOT NULL CONSTRAINT DF_ChiTietDonNhapHang_GiamPT DEFAULT(0),
    CONSTRAINT FK_ChiTietDonNhapHang_DonNhap FOREIGN KEY (DonNhapHangId) REFERENCES dbo.DonNhapHang(Id),
    CONSTRAINT FK_ChiTietDonNhapHang_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

CREATE TABLE dbo.PhieuNhapKho (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaPhieuNhap             NVARCHAR(50) NOT NULL,
    DonNhapHangId           BIGINT NULL,
    KhoHangId               INT NOT NULL,
    NhaCungCapId            INT NULL,
    NgayNhap                DATETIME2 NOT NULL CONSTRAINT DF_PhieuNhapKho_NgayNhap DEFAULT SYSUTCDATETIME(),
    GhiChu                  NVARCHAR(1000) NULL,
    NguoiTaoId              INT NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_PhieuNhapKho_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_PhieuNhapKho_Ma UNIQUE (MaPhieuNhap),
    CONSTRAINT FK_PhieuNhapKho_DonNhap FOREIGN KEY (DonNhapHangId) REFERENCES dbo.DonNhapHang(Id),
    CONSTRAINT FK_PhieuNhapKho_KhoHang FOREIGN KEY (KhoHangId) REFERENCES dbo.KhoHang(Id),
    CONSTRAINT FK_PhieuNhapKho_NhaCungCap FOREIGN KEY (NhaCungCapId) REFERENCES dbo.NhaCungCap(Id),
    CONSTRAINT FK_PhieuNhapKho_NguoiTao FOREIGN KEY (NguoiTaoId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.ChiTietPhieuNhapKho (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    PhieuNhapKhoId          BIGINT NOT NULL,
    SanPhamId               INT NOT NULL,
    SoLuong                 INT NOT NULL,
    DonGiaVon               DECIMAL(18,2) NOT NULL,
    GhiChu                  NVARCHAR(300) NULL,
    CONSTRAINT FK_ChiTietPhieuNhapKho_Phieu FOREIGN KEY (PhieuNhapKhoId) REFERENCES dbo.PhieuNhapKho(Id),
    CONSTRAINT FK_ChiTietPhieuNhapKho_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

CREATE TABLE dbo.DonTraHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaDonTra                NVARCHAR(50) NOT NULL,
    DonHangId               INT NULL,
    HoaDonQuayId            BIGINT NULL,
    KhachHangId             INT NULL,
    NguoiTaoId              INT NOT NULL,
    LyDo                    NVARCHAR(1000) NULL,
    TrangThai               NVARCHAR(50) NOT NULL CONSTRAINT DF_DonTraHang_TrangThai DEFAULT N'Pending',
    SoTienHoan              DECIMAL(18,2) NOT NULL CONSTRAINT DF_DonTraHang_SoTienHoan DEFAULT(0),
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_DonTraHang_NgayTao DEFAULT SYSUTCDATETIME(),
    XuLyLuc                 DATETIME2 NULL,
    CONSTRAINT UQ_DonTraHang_Ma UNIQUE (MaDonTra),
    CONSTRAINT FK_DonTraHang_DonHang FOREIGN KEY (DonHangId) REFERENCES dbo.DonHang(Id),
    CONSTRAINT FK_DonTraHang_HoaDonQuay FOREIGN KEY (HoaDonQuayId) REFERENCES dbo.HoaDonQuay(Id),
    CONSTRAINT FK_DonTraHang_KhachHang FOREIGN KEY (KhachHangId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_DonTraHang_NguoiTao FOREIGN KEY (NguoiTaoId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.ChiTietDonTraHang (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    DonTraHangId            BIGINT NOT NULL,
    SanPhamId               INT NOT NULL,
    SoLuong                 INT NOT NULL,
    DonGiaHoan              DECIMAL(18,2) NOT NULL,
    TinhTrang               NVARCHAR(100) NULL,
    GhiChu                  NVARCHAR(500) NULL,
    CONSTRAINT FK_ChiTietDonTraHang_DonTra FOREIGN KEY (DonTraHangId) REFERENCES dbo.DonTraHang(Id),
    CONSTRAINT FK_ChiTietDonTraHang_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id)
);
GO

CREATE TABLE dbo.LichSuGiaSanPham (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    SanPhamId               INT NOT NULL,
    GiaCu                   DECIMAL(18,2) NULL,
    GiaMoi                  DECIMAL(18,2) NOT NULL,
    NguoiCapNhatId          INT NULL,
    LyDo                    NVARCHAR(500) NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_LichSuGiaSanPham_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_LichSuGiaSanPham_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id),
    CONSTRAINT FK_LichSuGiaSanPham_NguoiDung FOREIGN KEY (NguoiCapNhatId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.NhatKyHeThong (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    NguoiDungId             INT NULL,
    HanhDong                NVARCHAR(100) NOT NULL,
    DoiTuong                NVARCHAR(100) NOT NULL,
    DoiTuongId              NVARCHAR(100) NULL,
    GiaTriCu                NVARCHAR(MAX) NULL,
    GiaTriMoi               NVARCHAR(MAX) NULL,
    DiaChiIP                NVARCHAR(64) NULL,
    UserAgent               NVARCHAR(500) NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_NhatKyHeThong_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_NhatKyHeThong_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(Id)
);
GO

CREATE TABLE dbo.CaiDatHeThong (
    Id                      INT IDENTITY(1,1) PRIMARY KEY,
    [Khoa]                  NVARCHAR(100) NOT NULL,
    GiaTri                  NVARCHAR(MAX) NULL,
    MoTa                    NVARCHAR(500) NULL,
    CapNhatLuc              DATETIME2 NOT NULL CONSTRAINT DF_CaiDatHeThong_CapNhat DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_CaiDatHeThong_Khoa UNIQUE ([Khoa])
);
GO

CREATE TABLE dbo.DanhSachYeuThich (
    Id                      BIGINT IDENTITY(1,1) PRIMARY KEY,
    NguoiDungId             INT NOT NULL,
    SanPhamId               INT NOT NULL,
    NgayTao                 DATETIME2 NOT NULL CONSTRAINT DF_DanhSachYeuThich_NgayTao DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_DanhSachYeuThich_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(Id),
    CONSTRAINT FK_DanhSachYeuThich_SanPham FOREIGN KEY (SanPhamId) REFERENCES dbo.SanPham(Id),
    CONSTRAINT UQ_DanhSachYeuThich UNIQUE (NguoiDungId, SanPhamId)
);
GO

/* =========================
   7) Chi muc
   ========================= */

CREATE INDEX IX_NguoiDung_HoatDong ON dbo.NguoiDung(HoatDong);
CREATE INDEX IX_NguoiDung_VaiTro ON dbo.NguoiDung(VaiTro);
CREATE INDEX IX_SanPham_DanhMucId ON dbo.SanPham(DanhMucId);
CREATE INDEX IX_SanPham_ThuongHieuId ON dbo.SanPham(ThuongHieuId);
CREATE INDEX IX_SanPham_HoatDong ON dbo.SanPham(HoatDong);
CREATE INDEX IX_DonHang_NguoiDungId ON dbo.DonHang(NguoiDungId);
CREATE INDEX IX_DonHang_TrangThai ON dbo.DonHang(TrangThai);
CREATE INDEX IX_ChiTietDonHang_DonHangId ON dbo.ChiTietDonHang(DonHangId);
CREATE INDEX IX_LichSuTrangThaiDonHang_DonHang ON dbo.LichSuTrangThaiDonHang(DonHangId, NgayTao DESC);
CREATE INDEX IX_BinhLuan_SanPham_NgayTao ON dbo.BinhLuan(SanPhamId, NgayTao DESC);
CREATE INDEX IX_TonKhoSanPham_KhoHang ON dbo.TonKhoSanPham(KhoHangId);
CREATE INDEX IX_GiaoDichKho_SanPham_Kho_Ngay ON dbo.GiaoDichKho(SanPhamId, KhoHangId, NgayTao DESC);
CREATE INDEX IX_HoaDonQuay_NgayTao ON dbo.HoaDonQuay(NgayTao DESC);
CREATE INDEX IX_BaiVietTinTuc_XuatBan_Ngay ON dbo.BaiVietTinTuc(XuatBan, XuatBanLuc DESC);
CREATE INDEX IX_Banner_ViTri_HoatDong ON dbo.Banner(ViTri, HoatDong);
CREATE INDEX IX_NhatKyHeThong_NgayTao ON dbo.NhatKyHeThong(NgayTao DESC);
GO

/* =========================
   8) Du lieu mau toi thieu
   ========================= */

INSERT INTO dbo.VaiTro (MaVaiTro, TenVaiTro, MoTa, VaiTroHeThong, HoatDong)
VALUES
    (N'OWNER', N'Chu cua hang', N'Toan quyen he thong', 1, 1),
    (N'ADMIN', N'Quan tri vien', N'Quan ly he thong va noi dung', 1, 1),
    (N'SALES_STAFF', N'Nhan vien ban hang', N'Tao don hang va POS', 1, 1),
    (N'WAREHOUSE_STAFF', N'Thu kho', N'Nhap xuat va dieu chinh kho', 1, 1),
    (N'CUSTOMER', N'Khach hang', N'Mua hang', 1, 1);
GO

INSERT INTO dbo.DonViTinh (MaDonVi, TenDonVi)
VALUES (N'PCS', N'Cai'), (N'BOX', N'Hop'), (N'SET', N'Bo');
GO

INSERT INTO dbo.Quyen (MaQuyen, TenQuyen, NhomChucNang, MoTa)
VALUES
    (N'product.view', N'Xem san pham', N'SanPham', N'Xem danh sach va chi tiet san pham'),
    (N'product.create', N'Them san pham', N'SanPham', N'Tao san pham moi'),
    (N'product.update', N'Sua san pham', N'SanPham', N'Cap nhat thong tin san pham'),
    (N'product.delete', N'Xoa san pham', N'SanPham', N'Xoa san pham'),
    (N'order.view', N'Xem don hang', N'DonHang', N'Xem danh sach va chi tiet don hang'),
    (N'order.update_status', N'Cap nhat trang thai don', N'DonHang', N'Doi trang thai don hang'),
    (N'warehouse.manage', N'Quan ly kho', N'Kho', N'Nhap xuat, dieu chinh ton'),
    (N'pos.sell', N'Ban hang tai quay', N'POS', N'Tao hoa don POS'),
    (N'user.manage', N'Quan ly nguoi dung', N'NguoiDung', N'Phan quyen, khoa/mo nguoi dung'),
    (N'content.manage', N'Quan ly noi dung', N'NoiDung', N'Banner, tin tuc, khuyen mai');
GO

