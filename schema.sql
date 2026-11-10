-- =========================================================
-- Cloudflare D1 SQL Schema
-- Database Binding: DB
-- Database Name: pasher-shop-db
-- =========================================================

-- 1. Users Table (Customer, Merchant, Admin)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'customer', -- 'customer' | 'merchant' | 'admin'
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    name_en TEXT,
    icon_name TEXT DEFAULT 'ShoppingBag',
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Shops Table
CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    name_bn TEXT NOT NULL,
    category_id TEXT NOT NULL,
    category_bn TEXT NOT NULL,
    address_bn TEXT NOT NULL,
    area TEXT NOT NULL,
    distance TEXT DEFAULT '০ কিমি',
    rating REAL DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    is_open INTEGER DEFAULT 1,
    timing_bn TEXT DEFAULT 'সকাল ৮:০০ - রাত ১১:০০',
    phone TEXT NOT NULL,
    cover_image TEXT,
    banner_image TEXT,
    delivery_available INTEGER DEFAULT 1,
    min_order INTEGER DEFAULT 0,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    owner_name TEXT,
    owner_phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    category_id TEXT DEFAULT 'grocery',
    price REAL NOT NULL,
    original_price REAL,
    unit TEXT DEFAULT 'কেজি',
    in_stock INTEGER DEFAULT 1,
    image_url TEXT,
    description_bn TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 5. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    date_bn TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 6. Shop Inquiries / Orders Table
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items TEXT NOT NULL,
    total_amount REAL DEFAULT 0,
    time_bn TEXT,
    status TEXT DEFAULT 'নতুন',
    type TEXT DEFAULT 'order',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- High Performance Indexes
CREATE INDEX IF NOT EXISTS idx_shops_category ON shops(category_id);
CREATE INDEX IF NOT EXISTS idx_shops_area ON shops(area);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_reviews_shop_id ON reviews(shop_id);
