import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Cloudflare D1 Configuration
// Binding: DB, Database: pasher-shop-db
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CLOUDFLARE_D1_DATABASE_ID =
  process.env.CLOUDFLARE_D1_DATABASE_ID ||
  process.env.CLOUDFLARE_D1_DATABASE_NAME ||
  'pasher-shop-db';
const CLOUDFLARE_D1_BINDING = process.env.CLOUDFLARE_D1_BINDING || 'DB';

const hasCloudflareCredentials = Boolean(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN);

// Local persistent file store for D1 compatibility fallback
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'pasher-shop-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_CATEGORIES = [
  { id: 'grocery', nameBn: 'মুদি দোকান', nameEn: 'Grocery', iconName: 'ShoppingBag', count: 0 },
  { id: 'pharmacy', nameBn: 'ফার্মেসি', nameEn: 'Pharmacy', iconName: 'HeartPulse', count: 0 },
  { id: 'vegetable_bazaar', nameBn: 'কাঁচাবাজার', nameEn: 'Vegetables', iconName: 'Carrot', count: 0 },
  { id: 'fruits', nameBn: 'ফলমূল', nameEn: 'Fruits', iconName: 'Apple', count: 0 },
  { id: 'clothing', nameBn: 'পোশাক', nameEn: 'Clothing', iconName: 'Shirt', count: 0 },
  { id: 'electronics', nameBn: 'ইলেকট্রনিক্স', nameEn: 'Electronics', iconName: 'Smartphone', count: 0 },
  { id: 'restaurant', nameBn: 'রেস্টুরেন্ট', nameEn: 'Restaurant', iconName: 'Utensils', count: 0 },
  { id: 'household', nameBn: 'গৃহস্থালি', nameEn: 'Household', iconName: 'Home', count: 0 },
  { id: 'stationery', nameBn: 'স্টেশনারি', nameEn: 'Stationery', iconName: 'BookOpen', count: 0 },
  { id: 'all', nameBn: 'আরও দেখুন', nameEn: 'Explore More', iconName: 'LayoutGrid', count: 0 },
];

function getLocalD1Data() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!data.categories) data.categories = [];
      if (!data.shops) data.shops = [];
      if (!data.products) data.products = [];
      if (!data.reviews) data.reviews = {};
      if (!data.inquiries) data.inquiries = [];
      if (!data.users) data.users = [];
      if (!data.sessions) data.sessions = [];
      return data;
    } catch (e) {
      console.error('Error reading pasher-shop-db.json:', e);
    }
  }

  const initialData = {
    users: [],
    sessions: [],
    categories: [],
    shops: [],
    products: [],
    reviews: {},
    inquiries: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

function saveLocalD1Data(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving pasher-shop-db.json:', e);
  }
}

// Helper to query Cloudflare D1 REST API using prepared statements
async function queryCloudflareD1(sql: string, params: any[] = []) {
  if (!hasCloudflareCredentials) {
    return null;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = (await response.json()) as any;
    if (data.success && data.result && data.result[0]) {
      return data.result[0].results;
    }
  } catch (err) {
    console.warn('Cloudflare D1 REST API query warning:', err);
  }

  return null;
}

// ----------------------------------------------------
// 0. Cloudflare D1 Status Endpoint: GET /api/d1/status
// ----------------------------------------------------
app.get('/api/d1/status', async (_req, res) => {
  res.json({
    binding: CLOUDFLARE_D1_BINDING,
    databaseName: 'pasher-shop-db',
    connected: true,
    mode: hasCloudflareCredentials ? 'cloudflare_d1_api' : 'local_persistent_d1',
    message: hasCloudflareCredentials
      ? 'Cloudflare D1 SQL (DB: pasher-shop-db) রিমোট ক্লাউডে সংযুক্ত'
      : 'Cloudflare D1 SQL (DB: pasher-shop-db) লোকাল পারসিসটেন্ট স্টোরেজে সক্রিয় রয়েছে',
  });
});

// Secure native Web Crypto SHA-256 password hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ':pasher_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Cryptographically secure token generator
function generateToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `pst_${Date.now()}_${hex}`;
}

// Phone normalizer
function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

// ----------------------------------------------------
// 0.1 Authentication: Register (POST /api/auth/register)
// ----------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone: rawPhone, password, role: reqRole } = req.body || {};
    const trimmedName = (name || '').trim();
    const phone = normalizePhone(rawPhone || '');
    const trimmedPassword = (password || '').trim();
    const role = reqRole === 'merchant' ? 'merchant' : 'customer';

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ error: 'আপনার পূর্ণ নাম অন্তত ২ অক্ষরের হতে হবে', success: false });
    }
    if (!phone || phone.length < 11) {
      return res.status(400).json({ error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন', success: false });
    }
    if (!trimmedPassword || trimmedPassword.length < 6) {
      return res.status(400).json({ error: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে', success: false });
    }

    // Check duplicate in Cloudflare D1
    if (hasCloudflareCredentials) {
      const existing = await queryCloudflareD1('SELECT id FROM users WHERE phone = ?', [phone]);
      if (existing && existing.length > 0) {
        return res.status(409).json({
          error: 'এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।',
          success: false,
        });
      }
    }

    // Check duplicate in local storage
    const data = getLocalD1Data();
    const localExisting = (data.users || []).find((u: any) => u.phone === phone);
    if (localExisting) {
      return res.status(409).json({
        error: 'এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।',
        success: false,
      });
    }

    const userId = `usr-${Date.now()}`;
    const passwordHash = await hashPassword(trimmedPassword);
    const createdAt = new Date().toISOString();
    const token = generateToken();
    const sessionId = `ses-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();

    if (hasCloudflareCredentials) {
      await queryCloudflareD1(
        'INSERT INTO users (id, name, phone, role, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, trimmedName, phone, role, passwordHash, createdAt]
      );
      await queryCloudflareD1(
        'INSERT INTO sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
        [sessionId, userId, token, expiresAt, createdAt]
      );
    }

    // Save to local D1 store
    data.users.push({
      id: userId,
      name: trimmedName,
      phone,
      role,
      password_hash: passwordHash,
      created_at: createdAt,
    });
    data.sessions.push({
      id: sessionId,
      user_id: userId,
      token,
      expires_at: expiresAt,
      created_at: createdAt,
    });
    saveLocalD1Data(data);

    return res.status(201).json({
      success: true,
      message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে',
      token,
      user: {
        id: userId,
        name: trimmedName,
        phone,
        role,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'নিবন্ধন সম্পন্ন করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।', success: false });
  }
});

// ----------------------------------------------------
// 0.2 Authentication: Login (POST /api/auth/login)
// ----------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone: rawPhone, password } = req.body || {};
    const phone = normalizePhone(rawPhone || '');
    const trimmedPassword = (password || '').trim();

    if (!phone || !trimmedPassword) {
      return res.status(400).json({ error: 'মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন', success: false });
    }

    let userRow: any = null;

    if (hasCloudflareCredentials) {
      const results = await queryCloudflareD1(
        'SELECT id, name, phone, role, password_hash FROM users WHERE phone = ?',
        [phone]
      );
      if (results && results[0]) {
        userRow = results[0];
      }
    }

    if (!userRow) {
      const data = getLocalD1Data();
      userRow = (data.users || []).find((u: any) => u.phone === phone);
    }

    if (!userRow) {
      return res.status(401).json({ error: 'মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়', success: false });
    }

    const inputHash = await hashPassword(trimmedPassword);
    if (inputHash !== userRow.password_hash) {
      return res.status(401).json({ error: 'মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়', success: false });
    }

    // Generate new active session
    const token = generateToken();
    const sessionId = `ses-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
    const createdAt = new Date().toISOString();

    if (hasCloudflareCredentials) {
      await queryCloudflareD1(
        'INSERT INTO sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)',
        [sessionId, userRow.id, token, expiresAt, createdAt]
      );
    }

    const data = getLocalD1Data();
    data.sessions.push({
      id: sessionId,
      user_id: userRow.id,
      token,
      expires_at: expiresAt,
      created_at: createdAt,
    });
    saveLocalD1Data(data);

    return res.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      token,
      user: {
        id: userRow.id,
        name: userRow.name,
        phone: userRow.phone,
        role: userRow.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'লগইন প্রক্রিয়ায় ত্রুটি ঘটেছে', success: false });
  }
});

// ----------------------------------------------------
// 0.3 Authentication: Current User (GET /api/auth/me)
// ----------------------------------------------------
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return res.status(401).json({ error: 'অথেনটিকেশন টোকেন পাওয়া যায়নি', success: false });
    }

    const now = new Date().toISOString();

    if (hasCloudflareCredentials) {
      const results = await queryCloudflareD1(
        `SELECT u.id, u.name, u.phone, u.role
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.token = ? AND s.expires_at > ?`,
        [token, now]
      );
      if (results && results[0]) {
        return res.json({ success: true, user: results[0] });
      }
    }

    // Local check
    const data = getLocalD1Data();
    const session = (data.sessions || []).find((s: any) => s.token === token && s.expires_at > now);
    if (!session) {
      return res.status(401).json({ error: 'সেশন মেয়াদোত্তীর্ণ বা অকার্যকর, পুনরায় লগইন করুন', success: false });
    }

    const user = (data.users || []).find((u: any) => u.id === session.user_id);
    if (!user) {
      return res.status(401).json({ error: 'ব্যবহারকারী পাওয়া যায়নি', success: false });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Get me error:', err);
    return res.status(500).json({ error: 'অথেনটিকেশন যাচাইয়ে ত্রুটি ঘটেছে', success: false });
  }
});

// ----------------------------------------------------
// 0.4 Authentication: Logout (POST /api/auth/logout)
// ----------------------------------------------------
app.post('/api/auth/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (token) {
      if (hasCloudflareCredentials) {
        await queryCloudflareD1('DELETE FROM sessions WHERE token = ?', [token]);
      }
      const data = getLocalD1Data();
      data.sessions = (data.sessions || []).filter((s: any) => s.token !== token);
      saveLocalD1Data(data);
    }

    return res.json({ success: true, message: 'লগআউট সফল হয়েছে' });
  } catch (err: any) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'লগআউট সম্পন্ন হতে ত্রুটি ঘটেছে', success: false });
  }
});


// ----------------------------------------------------
// 1. Categories: GET /api/categories
// ----------------------------------------------------
app.get('/api/categories', async (_req, res) => {
  if (hasCloudflareCredentials) {
    const remote = await queryCloudflareD1(
      'SELECT id, name_bn as nameBn, name_en as nameEn, icon_name as iconName, display_order FROM categories ORDER BY display_order ASC'
    );
    if (remote && Array.isArray(remote) && remote.length > 0) {
      return res.json(remote);
    }
  }

  const data = getLocalD1Data();
  if (data.categories && data.categories.length > 0) {
    return res.json(data.categories);
  }

  res.json(DEFAULT_CATEGORIES);
});

// ----------------------------------------------------
// 2. Shops: GET /api/shops
// ----------------------------------------------------
app.get('/api/shops', async (req, res) => {
  const { category, area, search } = req.query;

  if (hasCloudflareCredentials) {
    let query = 'SELECT * FROM shops WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND category_id = ?';
      params.push(category);
    }
    if (area && typeof area === 'string' && !area.includes('সকল এলাকা')) {
      query += ' AND (area LIKE ? OR address_bn LIKE ?)';
      params.push(`%${area}%`, `%${area}%`);
    }
    if (search && typeof search === 'string') {
      query += ' AND (name_bn LIKE ? OR category_bn LIKE ? OR address_bn LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY created_at DESC';

    const remoteShops = await queryCloudflareD1(query, params);
    if (remoteShops && Array.isArray(remoteShops)) {
      const formatted = remoteShops.map((row: any) => ({
        id: row.id,
        nameBn: row.name_bn,
        categoryId: row.category_id,
        categoryBn: row.category_bn,
        addressBn: row.address_bn,
        area: row.area,
        distance: row.distance || '০ কিমি',
        rating: Number(row.rating) || 5.0,
        reviewCount: Number(row.review_count) || 0,
        isOpen: Boolean(row.is_open),
        timingBn: row.timing_bn || 'সকাল ৮:০০ - রাত ১১:০০',
        phone: row.phone,
        coverImage: row.cover_image,
        bannerImage: row.banner_image || row.cover_image,
        deliveryAvailable: Boolean(row.delivery_available),
        minOrder: Number(row.min_order) || 0,
        lat: Number(row.lat),
        lng: Number(row.lng),
        ownerName: row.owner_name || '',
        ownerPhone: row.owner_phone || '',
        featuredProducts: [],
      }));
      return res.json(formatted);
    }
  }

  // Local fallback with filtering
  const data = getLocalD1Data();
  let list = data.shops || [];

  if (category && category !== 'all') {
    list = list.filter((s: any) => s.categoryId === category);
  }
  if (area && typeof area === 'string' && !area.includes('সকল এলাকা')) {
    const q = area.toLowerCase();
    list = list.filter(
      (s: any) =>
        (s.area && s.area.toLowerCase().includes(q)) ||
        (s.addressBn && s.addressBn.toLowerCase().includes(q))
    );
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (s: any) =>
        (s.nameBn && s.nameBn.toLowerCase().includes(q)) ||
        (s.categoryBn && s.categoryBn.toLowerCase().includes(q)) ||
        (s.addressBn && s.addressBn.toLowerCase().includes(q))
    );
  }

  res.json(list);
});

// ----------------------------------------------------
// 3. Shop by ID: GET /api/shops/:id
// ----------------------------------------------------
app.get('/api/shops/:id', async (req, res) => {
  const shopId = req.params.id;

  if (hasCloudflareCredentials) {
    const remoteShop = await queryCloudflareD1('SELECT * FROM shops WHERE id = ?', [shopId]);
    if (remoteShop && remoteShop[0]) {
      const row = remoteShop[0];
      const remoteProds = await queryCloudflareD1(
        'SELECT * FROM products WHERE shop_id = ? ORDER BY created_at DESC',
        [shopId]
      );
      const products = (remoteProds || []).map((p: any) => ({
        id: p.id,
        nameBn: p.name_bn,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        unit: p.unit || 'কেজি',
        inStock: Boolean(p.in_stock),
        imageUrl: p.image_url || '',
        category: p.category_id || row.category_id,
        shopId: p.shop_id,
        shopName: row.name_bn,
        shopArea: row.area,
      }));

      return res.json({
        id: row.id,
        nameBn: row.name_bn,
        categoryId: row.category_id,
        categoryBn: row.category_bn,
        addressBn: row.address_bn,
        area: row.area,
        distance: row.distance || '০ কিমি',
        rating: Number(row.rating) || 5.0,
        reviewCount: Number(row.review_count) || 0,
        isOpen: Boolean(row.is_open),
        timingBn: row.timing_bn || 'সকাল ৮:০০ - রাত ১১:০০',
        phone: row.phone,
        coverImage: row.cover_image,
        bannerImage: row.banner_image || row.cover_image,
        deliveryAvailable: Boolean(row.delivery_available),
        minOrder: Number(row.min_order) || 0,
        lat: Number(row.lat),
        lng: Number(row.lng),
        ownerName: row.owner_name || '',
        ownerPhone: row.owner_phone || '',
        featuredProducts: products.map((p: any) => ({ nameBn: p.nameBn, price: p.price })),
        products,
      });
    }
  }

  const data = getLocalD1Data();
  const shop = (data.shops || []).find((s: any) => s.id === shopId);
  if (!shop) {
    return res.status(404).json({ error: 'দোকানটি পাওয়া যায়নি', success: false });
  }

  const products = (data.products || []).filter((p: any) => p.shopId === shopId);
  res.json({
    ...shop,
    products,
  });
});

// ----------------------------------------------------
// 4. Create Shop: POST /api/shops
// ----------------------------------------------------
app.post('/api/shops', async (req, res) => {
  const newShop = req.body;
  if (!newShop || !newShop.nameBn || !newShop.nameBn.trim()) {
    return res.status(400).json({ error: 'দোকানের নাম (nameBn) আবশ্যক', success: false });
  }
  if (!newShop.phone || !newShop.phone.trim()) {
    return res.status(400).json({ error: 'যোগাযোগের ফোন নম্বর আবশ্যক', success: false });
  }
  if (newShop.lat === undefined || newShop.lng === undefined) {
    return res.status(400).json({ error: 'দোকানের রিয়েল জিপিএস লোকেশন আবশ্যক', success: false });
  }

  const shopId = newShop.id || `shop-${Date.now()}`;
  const completeShop = {
    ...newShop,
    id: shopId,
    isOpen: newShop.isOpen ?? true,
    rating: newShop.rating ?? 5.0,
    reviewCount: newShop.reviewCount ?? 0,
    deliveryAvailable: newShop.deliveryAvailable ?? true,
    minOrder: Number(newShop.minOrder) || 0,
    featuredProducts: newShop.featuredProducts || [],
  };

  if (hasCloudflareCredentials) {
    await queryCloudflareD1(
      `INSERT INTO shops (
        id, name_bn, category_id, category_bn, address_bn, area, distance,
        rating, review_count, is_open, timing_bn, phone, cover_image, banner_image,
        delivery_available, min_order, lat, lng, owner_name, owner_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        completeShop.id,
        completeShop.nameBn,
        completeShop.categoryId || 'grocery',
        completeShop.categoryBn || 'মুদি দোকান',
        completeShop.addressBn || '',
        completeShop.area || '',
        completeShop.distance || '০ কিমি',
        completeShop.rating,
        completeShop.reviewCount,
        completeShop.isOpen ? 1 : 0,
        completeShop.timingBn || 'সকাল ৮:০০ - রাত ১১:০০',
        completeShop.phone,
        completeShop.coverImage || '',
        completeShop.bannerImage || completeShop.coverImage || '',
        completeShop.deliveryAvailable ? 1 : 0,
        completeShop.minOrder,
        completeShop.lat,
        completeShop.lng,
        completeShop.ownerName || '',
        completeShop.ownerPhone || completeShop.phone,
      ]
    );
  }

  // Persist locally in pasher-shop-db.json
  const data = getLocalD1Data();
  data.shops = [completeShop, ...data.shops.filter((s: any) => s.id !== shopId)];

  // Also sync initial featured products into products array if provided
  if (Array.isArray(completeShop.featuredProducts)) {
    completeShop.featuredProducts.forEach((fp: any, idx: number) => {
      if (fp.nameBn && fp.price) {
        data.products.push({
          id: `prod-${Date.now()}-${idx}`,
          shopId,
          nameBn: fp.nameBn,
          category: completeShop.categoryId || 'grocery',
          price: Number(fp.price),
          unit: 'কেজি',
          inStock: true,
          shopName: completeShop.nameBn,
          shopArea: completeShop.area,
        });
      }
    });
  }

  saveLocalD1Data(data);
  res.status(201).json(completeShop);
});

// ----------------------------------------------------
// 5. Update Shop: PUT /api/shops/:id
// ----------------------------------------------------
app.put('/api/shops/:id', async (req, res) => {
  const shopId = req.params.id;
  const updatedData = req.body;

  if (hasCloudflareCredentials) {
    await queryCloudflareD1(
      `UPDATE shops SET
        name_bn = COALESCE(?, name_bn),
        phone = COALESCE(?, phone),
        address_bn = COALESCE(?, address_bn),
        timing_bn = COALESCE(?, timing_bn),
        delivery_available = COALESCE(?, delivery_available),
        min_order = COALESCE(?, min_order),
        banner_image = COALESCE(?, banner_image),
        is_open = COALESCE(?, is_open)
      WHERE id = ?`,
      [
        updatedData.nameBn,
        updatedData.phone,
        updatedData.addressBn,
        updatedData.timingBn,
        updatedData.deliveryAvailable !== undefined ? (updatedData.deliveryAvailable ? 1 : 0) : null,
        updatedData.minOrder !== undefined ? Number(updatedData.minOrder) : null,
        updatedData.bannerImage,
        updatedData.isOpen !== undefined ? (updatedData.isOpen ? 1 : 0) : null,
        shopId,
      ]
    );
  }

  const data = getLocalD1Data();
  data.shops = data.shops.map((s: any) => (s.id === shopId ? { ...s, ...updatedData } : s));
  saveLocalD1Data(data);

  res.json({ success: true, id: shopId, message: 'দোকান তথ্য সফলভাবে সংরক্ষিত হয়েছে' });
});

// ----------------------------------------------------
// 6. Delete Shop: DELETE /api/shops/:id
// ----------------------------------------------------
app.delete('/api/shops/:id', async (req, res) => {
  const shopId = req.params.id;

  if (hasCloudflareCredentials) {
    await queryCloudflareD1('DELETE FROM shops WHERE id = ?', [shopId]);
  }

  const data = getLocalD1Data();
  data.shops = data.shops.filter((s: any) => s.id !== shopId);
  data.products = data.products.filter((p: any) => p.shopId !== shopId);
  delete data.reviews[shopId];
  saveLocalD1Data(data);

  res.json({ success: true, id: shopId, message: 'দোকানটি সফলভাবে মুছে ফেলা হয়েছে' });
});

// ----------------------------------------------------
// 7. Products: GET /api/products
// ----------------------------------------------------
app.get('/api/products', async (req, res) => {
  const { shop_id, category, search } = req.query;

  if (hasCloudflareCredentials) {
    let query = `
      SELECT p.*, s.name_bn as shop_name, s.area as shop_area, s.phone as shop_phone
      FROM products p
      LEFT JOIN shops s ON p.shop_id = s.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (shop_id && typeof shop_id === 'string') {
      query += ' AND p.shop_id = ?';
      params.push(shop_id);
    }
    if (category && category !== 'all') {
      query += ' AND p.category_id = ?';
      params.push(category);
    }
    if (search && typeof search === 'string') {
      query += ' AND (p.name_bn LIKE ? OR s.name_bn LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    query += ' ORDER BY p.created_at DESC';

    const remoteProds = await queryCloudflareD1(query, params);
    if (remoteProds && Array.isArray(remoteProds)) {
      const formatted = remoteProds.map((row: any) => ({
        id: row.id,
        shopId: row.shop_id,
        nameBn: row.name_bn,
        category: row.category_id || 'grocery',
        price: Number(row.price),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        unit: row.unit || 'কেজি',
        inStock: Boolean(row.in_stock),
        stockStatus: row.in_stock ? 'ইন স্টক' : 'স্টক শেষ',
        imageUrl: row.image_url || '',
        descriptionBn: row.description_bn || '',
        shopName: row.shop_name || '',
        shopArea: row.shop_area || '',
        shopPhone: row.shop_phone || '',
        isAvailable: Boolean(row.in_stock),
      }));
      return res.json(formatted);
    }
  }

  // Local fallback
  const data = getLocalD1Data();
  let list = data.products || [];

  if (shop_id && typeof shop_id === 'string') {
    list = list.filter((p: any) => p.shopId === shop_id);
  }
  if (category && category !== 'all') {
    list = list.filter((p: any) => p.category === category || p.categoryId === category);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (p: any) =>
        (p.nameBn && p.nameBn.toLowerCase().includes(q)) ||
        (p.shopName && p.shopName.toLowerCase().includes(q))
    );
  }

  res.json(list);
});

// ----------------------------------------------------
// 8. Product by ID: GET /api/products/:id
// ----------------------------------------------------
app.get('/api/products/:id', async (req, res) => {
  const prodId = req.params.id;

  if (hasCloudflareCredentials) {
    const remote = await queryCloudflareD1(
      `SELECT p.*, s.name_bn as shop_name, s.area as shop_area, s.phone as shop_phone
       FROM products p
       LEFT JOIN shops s ON p.shop_id = s.id
       WHERE p.id = ?`,
      [prodId]
    );
    if (remote && remote[0]) {
      const row = remote[0];
      return res.json({
        id: row.id,
        shopId: row.shop_id,
        nameBn: row.name_bn,
        category: row.category_id || 'grocery',
        price: Number(row.price),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        unit: row.unit || 'কেজি',
        inStock: Boolean(row.in_stock),
        stockStatus: row.in_stock ? 'ইন স্টক' : 'স্টক শেষ',
        imageUrl: row.image_url || '',
        descriptionBn: row.description_bn || '',
        shopName: row.shop_name || '',
        shopArea: row.shop_area || '',
        shopPhone: row.shop_phone || '',
        isAvailable: Boolean(row.in_stock),
      });
    }
  }

  const data = getLocalD1Data();
  const prod = (data.products || []).find((p: any) => p.id === prodId);
  if (!prod) {
    return res.status(404).json({ error: 'পণ্যটি পাওয়া যায়নি', success: false });
  }

  res.json(prod);
});

// ----------------------------------------------------
// 9. Create Product: POST /api/products
// ----------------------------------------------------
app.post('/api/products', async (req, res) => {
  const body = req.body;
  if (!body.shopId || !body.nameBn || body.price === undefined) {
    return res.status(400).json({ error: 'দোকান আইডি (shopId), নাম (nameBn) এবং দাম আবশ্যক', success: false });
  }

  const id = body.id || `prod-${Date.now()}`;
  const completeProduct = {
    ...body,
    id,
    price: Number(body.price),
    unit: body.unit || 'কেজি',
    inStock: body.inStock !== false,
  };

  if (hasCloudflareCredentials) {
    await queryCloudflareD1(
      `INSERT INTO products (
        id, shop_id, name_bn, category_id, price, original_price, unit, in_stock, image_url, description_bn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        completeProduct.shopId,
        completeProduct.nameBn.trim(),
        completeProduct.category || completeProduct.categoryId || 'grocery',
        completeProduct.price,
        completeProduct.originalPrice ? Number(completeProduct.originalPrice) : null,
        completeProduct.unit,
        completeProduct.inStock ? 1 : 0,
        completeProduct.imageUrl || '',
        completeProduct.descriptionBn || '',
      ]
    );
  }

  const data = getLocalD1Data();
  data.products = [completeProduct, ...data.products.filter((p: any) => p.id !== id)];
  saveLocalD1Data(data);

  res.status(201).json(completeProduct);
});

// ----------------------------------------------------
// 10. Update Product: PUT /api/products/:id
// ----------------------------------------------------
app.put('/api/products/:id', async (req, res) => {
  const prodId = req.params.id;
  const body = req.body;

  if (hasCloudflareCredentials) {
    await queryCloudflareD1(
      `UPDATE products SET
        name_bn = COALESCE(?, name_bn),
        price = COALESCE(?, price),
        original_price = COALESCE(?, original_price),
        unit = COALESCE(?, unit),
        in_stock = COALESCE(?, in_stock),
        image_url = COALESCE(?, image_url),
        description_bn = COALESCE(?, description_bn)
      WHERE id = ?`,
      [
        body.nameBn,
        body.price !== undefined ? Number(body.price) : null,
        body.originalPrice !== undefined ? Number(body.originalPrice) : null,
        body.unit,
        body.inStock !== undefined ? (body.inStock ? 1 : 0) : null,
        body.imageUrl,
        body.descriptionBn,
        prodId,
      ]
    );
  }

  const data = getLocalD1Data();
  data.products = data.products.map((p: any) => (p.id === prodId ? { ...p, ...body } : p));
  saveLocalD1Data(data);

  res.json({ success: true, id: prodId, message: 'পণ্য সফলভাবে আপডেট হয়েছে' });
});

// ----------------------------------------------------
// 11. Delete Product: DELETE /api/products/:id
// ----------------------------------------------------
app.delete('/api/products/:id', async (req, res) => {
  const prodId = req.params.id;

  if (hasCloudflareCredentials) {
    await queryCloudflareD1('DELETE FROM products WHERE id = ?', [prodId]);
  }

  const data = getLocalD1Data();
  data.products = data.products.filter((p: any) => p.id !== prodId);
  saveLocalD1Data(data);

  res.json({ success: true, id: prodId, message: 'পণ্য সফলভাবে মুছে ফেলা হয়েছে' });
});

// ----------------------------------------------------
// 12. Reviews Endpoints: GET & POST /api/shops/:id/reviews
// ----------------------------------------------------
app.get('/api/shops/:id/reviews', async (req, res) => {
  const shopId = req.params.id;

  if (hasCloudflareCredentials) {
    const remoteReviews = await queryCloudflareD1(
      'SELECT * FROM reviews WHERE shop_id = ? ORDER BY created_at DESC',
      [shopId]
    );
    if (remoteReviews) {
      return res.json(remoteReviews);
    }
  }

  const data = getLocalD1Data();
  const shopReviews = data.reviews?.[shopId] || [];
  res.json(shopReviews);
});

app.post('/api/shops/:id/reviews', async (req, res) => {
  const shopId = req.params.id;
  const { customerName, rating, comment, dateBn } = req.body;

  const newReview = {
    id: `rev-${Date.now()}`,
    shopId,
    customerName: customerName || 'সম্মানিত ক্রেতা',
    rating: Number(rating) || 5,
    comment: comment || '',
    dateBn: dateBn || 'এইমাত্র',
  };

  if (hasCloudflareCredentials) {
    await queryCloudflareD1(
      `INSERT INTO reviews (id, shop_id, customer_name, rating, comment, date_bn) VALUES (?, ?, ?, ?, ?, ?)`,
      [newReview.id, shopId, newReview.customerName, newReview.rating, newReview.comment, newReview.dateBn]
    );
  }

  const data = getLocalD1Data();
  if (!data.reviews) data.reviews = {};
  if (!data.reviews[shopId]) data.reviews[shopId] = [];
  data.reviews[shopId] = [newReview, ...data.reviews[shopId]];
  saveLocalD1Data(data);

  res.status(201).json(newReview);
});

// ----------------------------------------------------
// Vite Server Integration (Port 3000)
// ----------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
    console.log(`Cloudflare D1 SQL initialized with DB: pasher-shop-db`);
  });
}

startServer();
