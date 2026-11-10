/**
 * Cloudflare Workers Backend API
 * Database Binding: DB
 * Database Name: pasher-shop-db
 */

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: any }>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta: any }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<Array<{ results?: T[]; success: boolean }>>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface Env {
  DB: D1Database;
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  [key: string]: any;
}

// Default standard category list fallback
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

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function errorResponse(message: string, status = 400, details?: any) {
  return jsonResponse({ error: message, success: false, details }, status);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only intercept /api/* endpoints in the worker
    if (!pathname.startsWith('/api/')) {
      if (env.ASSETS) {
        return await env.ASSETS.fetch(request);
      }
      return new Response('Not Found', { status: 404 });
    }

    try {
      // ---------------------------------------------------------
      // 0. Health & D1 Status Endpoint: GET /api/d1/status
      // ---------------------------------------------------------
      if (pathname === '/api/d1/status' && method === 'GET') {
        let isDbConnected = false;
        try {
          if (env.DB) {
            await env.DB.prepare('SELECT 1').run();
            isDbConnected = true;
          }
        } catch (e) {
          console.error('D1 health check error:', e);
        }

        return jsonResponse({
          binding: 'DB',
          databaseName: 'pasher-shop-db',
          connected: isDbConnected,
          mode: 'cloudflare_d1_worker',
          message: isDbConnected
            ? 'Cloudflare D1 SQL (DB: pasher-shop-db) সংযুক্ত ও সক্রিয়'
            : 'Cloudflare D1 SQL বাইন্ডিং পাওয়া যায়নি বা সংযোগে ত্রুটি',
        });
      }

      // ---------------------------------------------------------
      // 1. Categories: GET /api/categories
      // ---------------------------------------------------------
      if (pathname === '/api/categories' && method === 'GET') {
        try {
          const { results } = await env.DB.prepare(
            'SELECT id, name_bn as nameBn, name_en as nameEn, icon_name as iconName, display_order FROM categories ORDER BY display_order ASC'
          ).all<any>();

          if (results && results.length > 0) {
            return jsonResponse(results);
          }
        } catch (err) {
          console.warn('Categories query error or table empty, using fallback:', err);
        }
        return jsonResponse(DEFAULT_CATEGORIES);
      }

      // ---------------------------------------------------------
      // 2. Shops List: GET /api/shops
      // ---------------------------------------------------------
      if (pathname === '/api/shops' && method === 'GET') {
        const category = url.searchParams.get('category');
        const area = url.searchParams.get('area');
        const search = url.searchParams.get('search');
        const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 100);
        const offset = Number(url.searchParams.get('offset')) || 0;

        let query = 'SELECT * FROM shops WHERE 1=1';
        const params: any[] = [];

        if (category && category !== 'all') {
          query += ' AND category_id = ?';
          params.push(category);
        }
        if (area && !area.includes('সকল এলাকা')) {
          query += ' AND (area LIKE ? OR address_bn LIKE ?)';
          params.push(`%${area}%`, `%${area}%`);
        }
        if (search) {
          query += ' AND (name_bn LIKE ? OR category_bn LIKE ? OR address_bn LIKE ?)';
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const stmt = env.DB.prepare(query);
        const { results } = await stmt.bind(...params).all<any>();

        // Format SQL column names to frontend camelCase
        const shops = (results || []).map((row: any) => ({
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

        return jsonResponse(shops);
      }

      // ---------------------------------------------------------
      // 3. Shop by ID: GET /api/shops/:id
      // ---------------------------------------------------------
      const shopIdMatch = pathname.match(/^\/api\/shops\/([^/]+)$/);
      if (shopIdMatch && method === 'GET') {
        const id = shopIdMatch[1];
        const shopRow = await env.DB.prepare('SELECT * FROM shops WHERE id = ?').bind(id).first<any>();

        if (!shopRow) {
          return errorResponse('দোকানটি পাওয়া যায়নি', 404);
        }

        // Fetch products for this shop
        const { results: productRows } = await env.DB.prepare(
          'SELECT * FROM products WHERE shop_id = ? ORDER BY created_at DESC'
        ).bind(id).all<any>();

        const products = (productRows || []).map((p: any) => ({
          id: p.id,
          nameBn: p.name_bn,
          price: Number(p.price),
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          unit: p.unit || 'কেজি',
          inStock: Boolean(p.in_stock),
          imageUrl: p.image_url || '',
          category: p.category_id || shopRow.category_id,
          shopId: p.shop_id,
          shopName: shopRow.name_bn,
          shopArea: shopRow.area,
        }));

        const shop = {
          id: shopRow.id,
          nameBn: shopRow.name_bn,
          categoryId: shopRow.category_id,
          categoryBn: shopRow.category_bn,
          addressBn: shopRow.address_bn,
          area: shopRow.area,
          distance: shopRow.distance || '০ কিমি',
          rating: Number(shopRow.rating) || 5.0,
          reviewCount: Number(shopRow.review_count) || 0,
          isOpen: Boolean(shopRow.is_open),
          timingBn: shopRow.timing_bn || 'সকাল ৮:০০ - রাত ১১:০০',
          phone: shopRow.phone,
          coverImage: shopRow.cover_image,
          bannerImage: shopRow.banner_image || shopRow.cover_image,
          deliveryAvailable: Boolean(shopRow.delivery_available),
          minOrder: Number(shopRow.min_order) || 0,
          lat: Number(shopRow.lat),
          lng: Number(shopRow.lng),
          ownerName: shopRow.owner_name || '',
          ownerPhone: shopRow.owner_phone || '',
          featuredProducts: products.map((p: any) => ({ nameBn: p.nameBn, price: p.price })),
          products,
        };

        return jsonResponse(shop);
      }

      // ---------------------------------------------------------
      // 4. Create Shop: POST /api/shops
      // ---------------------------------------------------------
      if (pathname === '/api/shops' && method === 'POST') {
        const body = await request.json() as any;

        // Validation
        if (!body.nameBn || typeof body.nameBn !== 'string') {
          return errorResponse('দোকানের নাম (nameBn) আবশ্যক');
        }
        if (!body.phone || typeof body.phone !== 'string') {
          return errorResponse('যোগাযোগের ফোন নম্বর (phone) আবশ্যক');
        }
        if (body.lat === undefined || body.lng === undefined) {
          return errorResponse('দোকানের রিয়েল জিপিএস লোকেশন (lat, lng) আবশ্যক');
        }

        const id = body.id || `shop-${Date.now()}`;
        const nameBn = body.nameBn.trim();
        const categoryId = body.categoryId || 'grocery';
        const categoryBn = body.categoryBn || 'মুদি দোকান';
        const addressBn = body.addressBn || '';
        const area = body.area || '';
        const distance = body.distance || '০ কিমি';
        const rating = Number(body.rating) || 5.0;
        const reviewCount = Number(body.reviewCount) || 0;
        const isOpen = body.isOpen !== false ? 1 : 0;
        const timingBn = body.timingBn || 'সকাল ৮:০০ - রাত ১১:০০';
        const phone = body.phone.trim();
        const coverImage = body.coverImage || '';
        const bannerImage = body.bannerImage || coverImage;
        const deliveryAvailable = body.deliveryAvailable !== false ? 1 : 0;
        const minOrder = Number(body.minOrder) || 0;
        const lat = Number(body.lat);
        const lng = Number(body.lng);
        const ownerName = body.ownerName || '';
        const ownerPhone = body.ownerPhone || phone;

        // Prepared Statement with SQL injection prevention
        await env.DB.prepare(
          `INSERT INTO shops (
            id, name_bn, category_id, category_bn, address_bn, area, distance,
            rating, review_count, is_open, timing_bn, phone, cover_image, banner_image,
            delivery_available, min_order, lat, lng, owner_name, owner_phone
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            id, nameBn, categoryId, categoryBn, addressBn, area, distance,
            rating, reviewCount, isOpen, timingBn, phone, coverImage, bannerImage,
            deliveryAvailable, minOrder, lat, lng, ownerName, ownerPhone
          )
          .run();

        // If initial featured products are provided, insert them into products table
        if (Array.isArray(body.featuredProducts) && body.featuredProducts.length > 0) {
          for (let i = 0; i < body.featuredProducts.length; i++) {
            const p = body.featuredProducts[i];
            if (p.nameBn && p.price) {
              const prodId = `prod-${Date.now()}-${i}`;
              await env.DB.prepare(
                `INSERT INTO products (id, shop_id, name_bn, category_id, price, unit, in_stock)
                 VALUES (?, ?, ?, ?, ?, ?, 1)`
              )
                .bind(prodId, id, p.nameBn, categoryId, Number(p.price), 'কেজি')
                .run();
            }
          }
        }

        return jsonResponse({
          success: true,
          id,
          nameBn,
          categoryId,
          categoryBn,
          addressBn,
          area,
          phone,
          lat,
          lng,
          isOpen: Boolean(isOpen),
        }, 201);
      }

      // ---------------------------------------------------------
      // 5. Update Shop: PUT /api/shops/:id
      // ---------------------------------------------------------
      if (shopIdMatch && method === 'PUT') {
        const id = shopIdMatch[1];
        const body = await request.json() as any;

        // Check if shop exists
        const exists = await env.DB.prepare('SELECT id FROM shops WHERE id = ?').bind(id).first();
        if (!exists) {
          return errorResponse('দোকানটি পাওয়া যায়নি', 404);
        }

        // Build dynamic update with prepared statements
        const fields: string[] = [];
        const params: any[] = [];

        if (body.nameBn !== undefined) {
          fields.push('name_bn = ?');
          params.push(body.nameBn.trim());
        }
        if (body.phone !== undefined) {
          fields.push('phone = ?');
          params.push(body.phone.trim());
        }
        if (body.addressBn !== undefined) {
          fields.push('address_bn = ?');
          params.push(body.addressBn.trim());
        }
        if (body.timingBn !== undefined) {
          fields.push('timing_bn = ?');
          params.push(body.timingBn.trim());
        }
        if (body.deliveryAvailable !== undefined) {
          fields.push('delivery_available = ?');
          params.push(body.deliveryAvailable ? 1 : 0);
        }
        if (body.minOrder !== undefined) {
          fields.push('min_order = ?');
          params.push(Number(body.minOrder) || 0);
        }
        if (body.bannerImage !== undefined) {
          fields.push('banner_image = ?');
          params.push(body.bannerImage);
        }
        if (body.coverImage !== undefined) {
          fields.push('cover_image = ?');
          params.push(body.coverImage);
        }
        if (body.isOpen !== undefined) {
          fields.push('is_open = ?');
          params.push(body.isOpen ? 1 : 0);
        }

        if (fields.length === 0) {
          return errorResponse('আপডেট করার মতো কোনো তথ্য পাওয়া যায়নি');
        }

        const updateQuery = `UPDATE shops SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        await env.DB.prepare(updateQuery).bind(...params).run();
        return jsonResponse({ success: true, id, message: 'দোকানের তথ্য সফলভাবে আপডেট হয়েছে' });
      }

      // ---------------------------------------------------------
      // 6. Delete Shop: DELETE /api/shops/:id
      // ---------------------------------------------------------
      if (shopIdMatch && method === 'DELETE') {
        const id = shopIdMatch[1];
        await env.DB.prepare('DELETE FROM shops WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, id, message: 'দোকানটি সফলভাবে মুছে ফেলা হয়েছে' });
      }

      // ---------------------------------------------------------
      // 7. Products List: GET /api/products
      // ---------------------------------------------------------
      if (pathname === '/api/products' && method === 'GET') {
        const shopId = url.searchParams.get('shop_id');
        const category = url.searchParams.get('category');
        const search = url.searchParams.get('search');
        const limit = Math.min(Number(url.searchParams.get('limit')) || 60, 100);
        const offset = Number(url.searchParams.get('offset')) || 0;

        let query = `
          SELECT p.*, s.name_bn as shop_name, s.area as shop_area, s.phone as shop_phone
          FROM products p
          LEFT JOIN shops s ON p.shop_id = s.id
          WHERE 1=1
        `;
        const params: any[] = [];

        if (shopId) {
          query += ' AND p.shop_id = ?';
          params.push(shopId);
        }
        if (category && category !== 'all') {
          query += ' AND p.category_id = ?';
          params.push(category);
        }
        if (search) {
          query += ' AND (p.name_bn LIKE ? OR s.name_bn LIKE ?)';
          params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const { results } = await env.DB.prepare(query).bind(...params).all<any>();

        const products = (results || []).map((row: any) => ({
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

        return jsonResponse(products);
      }

      // ---------------------------------------------------------
      // 8. Product by ID: GET /api/products/:id
      // ---------------------------------------------------------
      const productIdMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
      if (productIdMatch && method === 'GET') {
        const id = productIdMatch[1];
        const row = await env.DB.prepare(`
          SELECT p.*, s.name_bn as shop_name, s.area as shop_area, s.phone as shop_phone
          FROM products p
          LEFT JOIN shops s ON p.shop_id = s.id
          WHERE p.id = ?
        `).bind(id).first<any>();

        if (!row) {
          return errorResponse('পণ্যটি পাওয়া যায়নি', 404);
        }

        const product = {
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
        };

        return jsonResponse(product);
      }

      // ---------------------------------------------------------
      // 9. Create Product: POST /api/products
      // ---------------------------------------------------------
      if (pathname === '/api/products' && method === 'POST') {
        const body = await request.json() as any;

        if (!body.shopId || !body.nameBn || body.price === undefined) {
          return errorResponse('পণ্যের নাম (nameBn), দোকান আইডি (shopId) এবং দাম (price) আবশ্যক');
        }

        const id = body.id || `prod-${Date.now()}`;
        const shopId = body.shopId;
        const nameBn = body.nameBn.trim();
        const categoryId = body.category || body.categoryId || 'grocery';
        const price = Number(body.price);
        const originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
        const unit = body.unit || 'কেজি';
        const inStock = body.inStock !== false ? 1 : 0;
        const imageUrl = body.imageUrl || '';
        const descriptionBn = body.descriptionBn || '';

        await env.DB.prepare(
          `INSERT INTO products (
            id, shop_id, name_bn, category_id, price, original_price, unit, in_stock, image_url, description_bn
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(id, shopId, nameBn, categoryId, price, originalPrice, unit, inStock, imageUrl, descriptionBn)
          .run();

        return jsonResponse({
          success: true,
          id,
          shopId,
          nameBn,
          price,
          unit,
          inStock: Boolean(inStock),
        }, 201);
      }

      // ---------------------------------------------------------
      // 10. Update Product: PUT /api/products/:id
      // ---------------------------------------------------------
      if (productIdMatch && method === 'PUT') {
        const id = productIdMatch[1];
        const body = await request.json() as any;

        const fields: string[] = [];
        const params: any[] = [];

        if (body.nameBn !== undefined) {
          fields.push('name_bn = ?');
          params.push(body.nameBn.trim());
        }
        if (body.price !== undefined) {
          fields.push('price = ?');
          params.push(Number(body.price));
        }
        if (body.originalPrice !== undefined) {
          fields.push('original_price = ?');
          params.push(body.originalPrice ? Number(body.originalPrice) : null);
        }
        if (body.unit !== undefined) {
          fields.push('unit = ?');
          params.push(body.unit);
        }
        if (body.inStock !== undefined) {
          fields.push('in_stock = ?');
          params.push(body.inStock ? 1 : 0);
        }
        if (body.imageUrl !== undefined) {
          fields.push('image_url = ?');
          params.push(body.imageUrl);
        }
        if (body.descriptionBn !== undefined) {
          fields.push('description_bn = ?');
          params.push(body.descriptionBn);
        }

        if (fields.length === 0) {
          return errorResponse('আপডেট করার মতো তথ্য পাওয়া যায়নি');
        }

        const updateQuery = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        await env.DB.prepare(updateQuery).bind(...params).run();
        return jsonResponse({ success: true, id, message: 'পণ্য সফলভাবে আপডেট হয়েছে' });
      }

      // ---------------------------------------------------------
      // 11. Delete Product: DELETE /api/products/:id
      // ---------------------------------------------------------
      if (productIdMatch && method === 'DELETE') {
        const id = productIdMatch[1];
        await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, id, message: 'পণ্য সফলভাবে মুছে ফেলা হয়েছে' });
      }

      // ---------------------------------------------------------
      // 12. Shop Reviews: GET & POST /api/shops/:id/reviews
      // ---------------------------------------------------------
      const reviewsMatch = pathname.match(/^\/api\/shops\/([^/]+)\/reviews$/);
      if (reviewsMatch) {
        const shopId = reviewsMatch[1];

        if (method === 'GET') {
          const { results } = await env.DB.prepare(
            'SELECT * FROM reviews WHERE shop_id = ? ORDER BY created_at DESC'
          ).bind(shopId).all<any>();

          const reviews = (results || []).map((r: any) => ({
            id: r.id,
            shopId: r.shop_id,
            customerName: r.customer_name,
            rating: Number(r.rating),
            comment: r.comment,
            dateBn: r.date_bn,
          }));

          return jsonResponse(reviews);
        }

        if (method === 'POST') {
          const body = await request.json() as any;
          const id = `rev-${Date.now()}`;
          const customerName = body.customerName?.trim() || 'সম্মানিত ক্রেতা';
          const rating = Math.min(Math.max(Number(body.rating) || 5, 1), 5);
          const comment = body.comment?.trim() || '';
          const dateBn = body.dateBn || 'এইমাত্র';

          await env.DB.prepare(
            'INSERT INTO reviews (id, shop_id, customer_name, rating, comment, date_bn) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(id, shopId, customerName, rating, comment, dateBn).run();

          // Update review count & avg rating in shops table
          const avgRes = await env.DB.prepare(
            'SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE shop_id = ?'
          ).bind(shopId).first<any>();

          if (avgRes) {
            await env.DB.prepare(
              'UPDATE shops SET review_count = ?, rating = ROUND(?, 1) WHERE id = ?'
            ).bind(avgRes.count, avgRes.avg_rating || 5.0, shopId).run();
          }

          return jsonResponse({
            id,
            shopId,
            customerName,
            rating,
            comment,
            dateBn,
          }, 201);
        }
      }

      return errorResponse('API রুট পাওয়া যায়নি', 404);
    } catch (err: any) {
      console.error('Cloudflare Worker API Error:', err);
      return errorResponse(err.message || 'সার্ভারে অভ্যন্তরীণ ত্রুটি হয়েছে', 500);
    }
  },
};
