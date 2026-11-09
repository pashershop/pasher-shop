-- =========================================================
-- Cloudflare D1 SQL Schema
-- Database Binding: DB
-- Database Name: pasher-shop-db
-- =========================================================

-- 1. Shops Table
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    unit TEXT DEFAULT 'কেজি',
    in_stock INTEGER DEFAULT 1,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 3. Customer Reviews Table
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

-- 4. Shop Inquiries / Orders Table
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

-- =========================================================
-- Initial Seed Data for pasher-shop-db
-- =========================================================

INSERT OR IGNORE INTO shops (
    id, name_bn, category_id, category_bn, address_bn, area, distance, rating, review_count, is_open, timing_bn, phone, cover_image, banner_image, delivery_available, min_order, lat, lng, owner_name
) VALUES 
('shop-1', 'রহমান ব্রাদার্স গ্রোসারি অ্যান্ড জেনারেল স্টোর', 'grocery', 'মুদি দোকান', 'বাড়ি নং ১২/এ, রোড নং ৭, ধানমন্ডি, ঢাকা', 'ধানমন্ডি, ঢাকা', '৪৫০ মিটার', 4.8, 142, 1, 'সকাল ৭:০০ - রাত ১১:০০', '০১৭১১-২২৩৩৪৪', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', 1, 300, 23.7465, 90.3760, 'মোঃ ফজলুর রহমান'),
('shop-2', 'জননী তাজা কাঁচাবাজার ও ফ্রুটস কর্নার', 'vegetable_bazaar', 'কাঁচাবাজার', 'দোকান নং ৪, মিরপুর ১০ গোলচত্বর মার্কেট, ঢাকা', 'মিরপুর, ঢাকা', '৮৫০ মিটার', 4.9, 98, 1, 'সকাল ৬:০০ - রাত ১০:০০', '০১৮১২-৯৮৭৬৫৪', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80', 1, 250, 23.8071, 90.3686, 'আবুল কালাম আজাদ'),
('shop-3', 'মেডিকিউর ফার্মেসি ও হেলথকেয়ার', 'pharmacy', 'ফার্মেসি', 'ব্লক-সি, মেইন রোড, বনশ্রী, রামপুরা, ঢাকা', 'বনশ্রী, ঢাকা', '১.২ কিমি', 4.7, 215, 1, '২৪ ঘণ্টা খোলা', '০১৯১১-২২৩৩৪৪', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80', 1, 150, 23.7644, 90.4312, 'ডা. কামরুল হাসান');

INSERT OR IGNORE INTO products (id, shop_id, name_bn, price, original_price, unit, in_stock, image_url) VALUES
('prod-1', 'shop-1', 'প্রিমিয়াম মিনিকেট চাল (৫ কেজি)', 360, 380, '৫ কেজি', 1, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'),
('prod-2', 'shop-1', 'তীর সয়াবিন তেল (২ লিটার)', 365, 380, '২ লিটার', 1, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'),
('prod-3', 'shop-1', 'দেশি মসুর ডাল (১ কেজি)', 130, 140, '১ কেজি', 1, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'),
('prod-4', 'shop-2', 'তাজা দেশি টমেটো (১ কেজি)', 45, 55, '১ কেজি', 1, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'),
('prod-5', 'shop-2', 'ফার্মের লাল ডিম (১ ডজন)', 142, 150, '১ ডজন', 1, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80');

INSERT OR IGNORE INTO reviews (id, shop_id, customer_name, rating, comment, date_bn) VALUES
('rev-1', 'shop-1', 'তানভীর আহমেদ', 5, 'দোকানদারের ব্যবহার খুব ভালো এবং প্রতিটি পণ্যের দাম সঠিক ছিল। চমৎকার সার্ভিস!', '২ দিন আগে'),
('rev-2', 'shop-1', 'সাদিয়া তাসনিম', 5, 'ফোন দেওয়ার ১০ মিনিটের মধ্যে ডেলিভারি পেয়েছি। খুব নির্ভরযোগ্য শপ।', '১ সপ্তাহ আগে');
