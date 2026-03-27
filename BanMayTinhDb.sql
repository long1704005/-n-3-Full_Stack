CREATE DATABASE BanNuocHoaDb
go
Use BanMayTinhDb
-- 1. Bảng Users
CREATE TABLE Users (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    UserName        NVARCHAR(100) NOT NULL UNIQUE,
    Email           NVARCHAR(200) NOT NULL UNIQUE,
    PasswordHash    NVARCHAR(500) NOT NULL,
    FullName        NVARCHAR(200) NULL,
    Phone           NVARCHAR(20) NULL,
    Address         NVARCHAR(500) NULL,
    Role            NVARCHAR(50) NOT NULL DEFAULT N'Customer', -- Customer / Admin
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);


-- 2. Bảng Categories
CREATE TABLE Categories (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Name            NVARCHAR(200) NOT NULL,
    Slug            NVARCHAR(200) NULL,
    Description     NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- 3. Bảng Brands
CREATE TABLE Brands (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Name            NVARCHAR(200) NOT NULL,
    Slug            NVARCHAR(200) NULL,
    Description     NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- 4. Bảng Products
CREATE TABLE Products (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CategoryId      INT NOT NULL,
    BrandId         INT NULL,
    Name            NVARCHAR(300) NOT NULL,
    Slug            NVARCHAR(300) NULL,
    ShortDescription NVARCHAR(500) NULL,
    Description     NVARCHAR(MAX) NULL,
    Price           DECIMAL(18,2) NOT NULL,
    OriginalPrice   DECIMAL(18,2) NULL,
    StockQuantity   INT NOT NULL DEFAULT 0,
    ThumbnailUrl    NVARCHAR(500) NULL,
    ImageUrl        NVARCHAR(500) NULL,
    IsFeatured      BIT NOT NULL DEFAULT 0,
    IsNew           BIT NOT NULL DEFAULT 0,
    IsBestSeller    BIT NOT NULL DEFAULT 0,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt       DATETIME2 NULL,

    CONSTRAINT FK_Products_Categories
        FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    CONSTRAINT FK_Products_Brands
        FOREIGN KEY (BrandId) REFERENCES Brands(Id)
);
GO

-- 5. Bảng ProductImages (tuỳ chọn, nếu muốn nhiều ảnh / sản phẩm)
CREATE TABLE ProductImages (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    ProductId       INT NOT NULL,
    ImageUrl        NVARCHAR(500) NOT NULL,
    IsPrimary       BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_ProductImages_Products
        FOREIGN KEY (ProductId) REFERENCES Products(Id)
);
GO

-- 6. Bảng Orders
CREATE TABLE Orders (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    UserId          INT NOT NULL,
    OrderDate       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Status          NVARCHAR(50) NOT NULL DEFAULT N'Pending',  -- Pending, Confirmed, Shipping, Completed, Cancelled
    TotalAmount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    ShippingAddress NVARCHAR(500) NOT NULL,
    Phone           NVARCHAR(20) NOT NULL,
    Note            NVARCHAR(500) NULL,
    PaymentMethod   NVARCHAR(50) NULL, -- COD, BankTransfer, etc.
    PaymentStatus   NVARCHAR(50) NULL, -- Unpaid, Paid, Refunded

    CONSTRAINT FK_Orders_Users
        FOREIGN KEY (UserId) REFERENCES Users(Id)
);
GO

-- 7. Bảng OrderItems
CREATE TABLE OrderItems (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    OrderId         INT NOT NULL,
    ProductId       INT NOT NULL,
    Quantity        INT NOT NULL,
    UnitPrice       DECIMAL(18,2) NOT NULL,
    DiscountPercent INT NOT NULL DEFAULT 0,

    CONSTRAINT FK_OrderItems_Orders
        FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    CONSTRAINT FK_OrderItems_Products
        FOREIGN KEY (ProductId) REFERENCES Products(Id)
);
GO

-- 8. Indexes phụ trợ (tối ưu truy vấn)
CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);
CREATE INDEX IX_Products_BrandId ON Products(BrandId);
CREATE INDEX IX_Orders_UserId ON Orders(UserId);
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
GO

USE BanMayTinhDb;

DELETE FROM Users
WHERE Email = N'long1704005@gmail.com';

UPDATE Users SET PasswordHash = N'Long170405' WHERE Email = N'long1704005@gmail.com';

USE BanMayTinhDb;
UPDATE Users SET Role = N'Admin' WHERE Email = N'long1704005@gmail.com';

SELECT Email, LEFT(PasswordHash, 20) AS HashPrefix, Role FROM Users WHERE Email = N'long1704005@gmail.com';