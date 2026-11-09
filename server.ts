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
const CLOUDFLARE_D1_DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || process.env.CLOUDFLARE_D1_DATABASE_NAME || 'pasher-shop-db';
const CLOUDFLARE_D1_BINDING = process.env.CLOUDFLARE_D1_BINDING || 'DB';

const hasCloudflareCredentials = Boolean(CLOUDFLARE_ACCOUNT_ID && CLOUDFLARE_API_TOKEN);

// Local persistent file store for D1 compatibility fallback
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'pasher-shop-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial fallback dataset if pasher-shop-db.json does not exist
function getLocalD1Data() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading pasher-shop-db.json:', e);
    }
  }

  const initialData = {
    shops: [
      {
        id: 'shop-1',
        nameBn: 'রহমান ব্রাদার্স গ্রোসারি অ্যান্ড জেনারেল স্টোর',
        categoryBn: 'মুদি দোকান',
        categoryId: 'grocery',
        addressBn: 'বাড়ি নং ১২/এ, রোড নং ৭, ধানমন্ডি, ঢাকা',
        area: 'ধানমন্ডি, ঢাকা',
        distance: '৪৫০ মিটার',
        rating: 4.8,
        reviewCount: 142,
        isOpen: true,
        timingBn: 'সকাল ৭:০০ - রাত ১১:০০',
        phone: '০১৭১১-২২৩৩৪৪',
        coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
        deliveryAvailable: true,
        minOrder: 300,
        lat: 23.7465,
        lng: 90.3760,
        ownerName: 'মোঃ ফজলুর রহমান',
        featuredProducts: [
          { nameBn: 'প্রিমিয়াম মিনিকেট চাল (৫ কেজি)', price: 360 },
          { nameBn: 'তীর সয়াবিন তেল (২ লিটার)', price: 365 },
          { nameBn: 'দেশি মসুর ডাল (১ কেজি)', price: 130 },
        ],
      },
      {
        id: 'shop-2',
        nameBn: 'জননী তাজা কাঁচাবাজার ও ফ্রুটস কর্নার',
        categoryBn: 'কাঁচাবাজার',
        categoryId: 'vegetable_bazaar',
        addressBn: 'দোকান নং ৪, মিরপুর ১০ গোলচত্বর মার্কেট, ঢাকা',
        area: 'মিরপুর, ঢাকা',
        distance: '৮৫০ মিটার',
        rating: 4.9,
        reviewCount: 98,
        isOpen: true,
        timingBn: 'সকাল ৬:০০ - রাত ১০:০০',
        phone: '০১৮১২-৯৮৭৬৫৪',
        coverImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
        deliveryAvailable: true,
        minOrder: 250,
        lat: 23.8071,
        lng: 90.3686,
        ownerName: 'আবুল কালাম আজাদ',
        featuredProducts: [
          { nameBn: 'তাজা দেশি টমেটো (১ কেজি)', price: 45 },
          { nameBn: 'দেশি কাঁচামরিচ (২৫০ গ্রাম)', price: 30 },
          { nameBn: 'ফার্মের লাল ডিম (১ ডজন)', price: 142 },
        ],
      },
      {
        id: 'shop-3',
        nameBn: 'মেডিকিউর ফার্মেসি ও হেলথকেয়ার',
        categoryBn: 'ফার্মেসি',
        categoryId: 'pharmacy',
        addressBn: 'ব্লক-সি, মেইন রোড, বনশ্রী, রামপুরা, ঢাকা',
        area: 'বনশ্রী, ঢাকা',
        distance: '১.২ কিমি',
        rating: 4.7,
        reviewCount: 215,
        isOpen: true,
        timingBn: '২৪ ঘণ্টা খোলা',
        phone: '০১৯১১-২২৩৩৪৪',
        coverImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
        deliveryAvailable: true,
        minOrder: 150,
        lat: 23.7644,
        lng: 90.4312,
        ownerName: 'ডা. কামরুল হাসান',
        featuredProducts: [
          { nameBn: 'প্যারাসিটামল ৫০০ মি.গ্রা. (১০ পাতা)', price: 120 },
          { nameBn: 'সার্জিক্যাল ফেস মাস্ক (৫০ পিস বক্স)', price: 150 },
        ],
      },
    ],
    reviews: {
      'shop-1': [
        {
          id: 'r1',
          customerName: 'তানভীর আহমেদ',
          rating: 5,
          comment: 'দোকানদারের ব্যবহার খুব ভালো এবং প্রতিটি পণ্যের দাম সঠিক ছিল। চমৎকার সার্ভিস!',
          dateBn: '২ দিন আগে',
        },
        {
          id: 'r2',
          customerName: 'সাদিয়া তাসনিম',
          rating: 5,
          comment: 'ফোন দেওয়ার ১০ মিনিটের মধ্যে ডেলিভারি পেয়েছি। খুব নির্ভরযোগ্য শপ।',
          dateBn: '১ সপ্তাহ আগে',
        },
      ],
    },
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

// Helper to query Cloudflare D1 REST API
async function queryCloudflareD1(sql: string, params: any[] = []) {
  if (!hasCloudflareCredentials) {
    return null;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_D1_DATABASE_ID}/query`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = await response.json();
    if (data.success && data.result && data.result[0]) {
      return data.result[0].results;
    }
  } catch (err) {
    console.warn('Cloudflare D1 REST API query warning:', err);
  }

  return null;
}

// ----------------------------------------------------
// Cloudflare D1 REST API Endpoints
// ----------------------------------------------------

// 1. D1 Connection Status
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

// 2. Get All Shops (SELECT * FROM shops)
app.get('/api/shops', async (_req, res) => {
  // If remote Cloudflare D1 is configured, query it
  if (hasCloudflareCredentials) {
    const remoteShops = await queryCloudflareD1('SELECT * FROM shops ORDER BY created_at DESC');
    if (remoteShops && Array.isArray(remoteShops) && remoteShops.length > 0) {
      return res.json(remoteShops);
    }
  }

  // Fallback to local D1 store
  const data = getLocalD1Data();
  res.json(data.shops || []);
});

// 3. Create Shop (INSERT INTO shops ...)
app.post('/api/shops', async (req, res) => {
  const newShop = req.body;
  if (!newShop || !newShop.nameBn) {
    return res.status(400).json({ error: 'দোকানের নাম আবশ্যক' });
  }

  const shopId = newShop.id || `shop-${Date.now()}`;
  const completeShop = {
    ...newShop,
    id: shopId,
    isOpen: newShop.isOpen ?? true,
    rating: newShop.rating ?? 5.0,
    reviewCount: newShop.reviewCount ?? 0,
    featuredProducts: newShop.featuredProducts || [],
  };

  // Attempt Cloudflare D1 SQL insert
  if (hasCloudflareCredentials) {
    await queryCloudflareD1(
      `INSERT INTO shops (id, name_bn, category_id, category_bn, address_bn, area, phone, lat, lng, is_open, delivery_available, min_order, timing_bn, cover_image, banner_image, owner_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        completeShop.id,
        completeShop.nameBn,
        completeShop.categoryId || 'grocery',
        completeShop.categoryBn || 'মুদি দোকান',
        completeShop.addressBn,
        completeShop.area,
        completeShop.phone,
        completeShop.lat,
        completeShop.lng,
        completeShop.isOpen ? 1 : 0,
        completeShop.deliveryAvailable ? 1 : 0,
        completeShop.minOrder || 0,
        completeShop.timingBn || 'সকাল ৮:০০ - রাত ১১:০০',
        completeShop.coverImage,
        completeShop.bannerImage || completeShop.coverImage,
        completeShop.ownerName || '',
      ]
    );
  }

  // Persist locally in pasher-shop-db.json
  const data = getLocalD1Data();
  data.shops = [completeShop, ...data.shops.filter((s: any) => s.id !== shopId)];
  saveLocalD1Data(data);

  res.status(201).json(completeShop);
});

// 4. Update Shop (UPDATE shops SET ...)
app.put('/api/shops/:id', async (req, res) => {
  const shopId = req.params.id;
  const updatedData = req.body;

  if (hasCloudflareCredentials) {
    await queryCloudflareD1(
      `UPDATE shops SET name_bn = ?, phone = ?, address_bn = ?, timing_bn = ?, delivery_available = ?, min_order = ?, banner_image = ? WHERE id = ?`,
      [
        updatedData.nameBn,
        updatedData.phone,
        updatedData.addressBn,
        updatedData.timingBn,
        updatedData.deliveryAvailable ? 1 : 0,
        updatedData.minOrder || 0,
        updatedData.bannerImage,
        shopId,
      ]
    );
  }

  const data = getLocalD1Data();
  data.shops = data.shops.map((s: any) => (s.id === shopId ? { ...s, ...updatedData } : s));
  saveLocalD1Data(data);

  res.json({ success: true, id: shopId });
});

// 5. Get Reviews for a shop
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

// 6. Post Review for a shop
app.post('/api/shops/:id/reviews', async (req, res) => {
  const shopId = req.params.id;
  const { customerName, rating, comment, dateBn } = req.body;

  const newReview = {
    id: `rev-${Date.now()}`,
    customerName: customerName || 'সম্মানিত ক্রেতা',
    rating: rating || 5,
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
