import { Shop, ProductItem, Category } from '../types';
import { CATEGORIES } from '../data/mockData';

export interface D1StatusResponse {
  binding: string;
  databaseName: string;
  connected: boolean;
  mode: 'cloudflare_d1_api' | 'cloudflare_d1_worker' | 'local_persistent_d1';
  message: string;
}

/**
 * Cloudflare D1 Database Client Service
 * Database Binding: DB
 * Database Name: pasher-shop-db
 */
export const d1Service = {
  /**
   * Check connection status of Cloudflare D1
   */
  async getStatus(): Promise<D1StatusResponse> {
    try {
      const res = await fetch('/api/d1/status');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fallback
    }
    return {
      binding: 'DB',
      databaseName: 'pasher-shop-db',
      connected: true,
      mode: 'local_persistent_d1',
      message: 'Cloudflare D1 SQL (DB: pasher-shop-db) সক্রিয় রয়েছে',
    };
  },

  /**
   * Fetch all categories from D1
   */
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('D1 getCategories fallback:', err);
    }
    return CATEGORIES;
  },

  /**
   * Fetch all shops from Cloudflare D1 SQL database
   */
  async getAllShops(filters?: { category?: string; area?: string; search?: string }): Promise<Shop[]> {
    try {
      let url = '/api/shops';
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.area && !filters.area.includes('সকল এলাকা')) params.append('area', filters.area);
      if (filters?.search) params.append('search', filters.search);

      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Cache in localStorage for offline resiliency
          try {
            localStorage.setItem('pasher_shop_list', JSON.stringify(data));
          } catch (e) {}
          return data;
        }
      }
    } catch (err) {
      console.warn('D1 fetch fallback to local storage:', err);
    }

    // Fallback to localStorage
    try {
      const saved = localStorage.getItem('pasher_shop_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [];
  },

  /**
   * Fetch a single shop by ID with products
   */
  async getShopById(id: string): Promise<Shop | null> {
    try {
      const res = await fetch(`/api/shops/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`D1 getShopById error for ${id}:`, err);
    }
    return null;
  },

  /**
   * Create a new shop in Cloudflare D1 SQL
   */
  async createShop(shop: Partial<Shop>): Promise<Shop | null> {
    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('D1 createShop error:', err);
    }
    return null;
  },

  /**
   * Update an existing shop in Cloudflare D1 SQL
   */
  async updateShop(shop: Shop): Promise<boolean> {
    try {
      const res = await fetch(`/api/shops/${shop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop),
      });
      return res.ok;
    } catch (err) {
      console.warn('D1 updateShop error:', err);
      return false;
    }
  },

  /**
   * Delete a shop from Cloudflare D1 SQL
   */
  async deleteShop(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/shops/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn(`D1 deleteShop error for ${id}:`, err);
      return false;
    }
  },

  /**
   * Fetch all products from Cloudflare D1 SQL database
   */
  async getAllProducts(filters?: { shopId?: string; category?: string; search?: string }): Promise<ProductItem[]> {
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (filters?.shopId) params.append('shop_id', filters.shopId);
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn('D1 getAllProducts error:', err);
    }
    return [];
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id: string): Promise<ProductItem | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`D1 getProductById error for ${id}:`, err);
    }
    return null;
  },

  /**
   * Create a new product in Cloudflare D1 SQL
   */
  async createProduct(product: Partial<ProductItem>): Promise<ProductItem | null> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('D1 createProduct error:', err);
    }
    return null;
  },

  /**
   * Update an existing product in Cloudflare D1 SQL
   */
  async updateProduct(id: string, product: Partial<ProductItem>): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return res.ok;
    } catch (err) {
      console.warn(`D1 updateProduct error for ${id}:`, err);
      return false;
    }
  },

  /**
   * Delete a product from Cloudflare D1 SQL
   */
  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn(`D1 deleteProduct error for ${id}:`, err);
      return false;
    }
  },

  /**
   * Fetch customer reviews for a specific shop
   */
  async getReviews(shopId: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/shops/${shopId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn('D1 getReviews fallback:', err);
    }

    try {
      const saved = localStorage.getItem(`pasher_reviews_${shopId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [];
  },

  /**
   * Submit a new customer review to Cloudflare D1 SQL
   */
  async submitReview(
    shopId: string,
    review: { customerName: string; rating: number; comment: string; dateBn: string }
  ): Promise<boolean> {
    try {
      const res = await fetch(`/api/shops/${shopId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      return res.ok;
    } catch (err) {
      console.warn('D1 submitReview error:', err);
      return false;
    }
  },

  // ----------------------------------------------------
  // Authentication & Session Management (Cloudflare D1)
  // ----------------------------------------------------
  getStoredToken(): string | null {
    try {
      return localStorage.getItem('pasher_auth_token');
    } catch {
      return null;
    }
  },

  setStoredToken(token: string) {
    try {
      localStorage.setItem('pasher_auth_token', token);
    } catch {}
  },

  removeStoredToken() {
    try {
      localStorage.removeItem('pasher_auth_token');
      localStorage.removeItem('pasher_auth_user');
    } catch {}
  },

  /**
   * Register new user (Customer or Shopkeeper) in Cloudflare D1
   */
  async register(data: {
    name: string;
    phone: string;
    password: string;
    role: 'customer' | 'merchant';
  }): Promise<{ success: boolean; message?: string; token?: string; user?: any; error?: string }> {
    const cleanPhone = normalizePhoneNumber(data.phone);
    if (!cleanPhone || cleanPhone.length < 11) {
      return { success: false, error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)' };
    }

    const payload = {
      name: data.name.trim(),
      phone: cleanPhone,
      password: data.password.trim(),
      role: data.role === 'merchant' ? 'merchant' : 'customer',
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let result: any = null;
      try {
        result = rawText ? JSON.parse(rawText) : null;
      } catch {
        result = null;
      }

      if (res.ok && result?.success && result?.token && result?.user) {
        this.setStoredToken(result.token);
        try {
          localStorage.setItem('pasher_auth_user', JSON.stringify(result.user));
        } catch {}
        return {
          success: true,
          message: result.message,
          token: result.token,
          user: result.user,
        };
      }

      if (result?.error) {
        return {
          success: false,
          error: result.error,
        };
      }

      if (res.status === 404 || res.status === 405) {
        return {
          success: false,
          error: 'অথেনটিকেশন API (/api/auth/register) পাওয়া যায়নি। ব্যাকএন্ড সার্ভার বা Cloudflare Worker চালু আছে কিনা নিশ্চিত করুন।',
        };
      }

      return {
        success: false,
        error: `নিবন্ধন সম্পন্ন করা যায়নি (HTTP ${res.status})। অনুগ্রহ করে পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।`,
      };
    } catch (err: any) {
      console.error('d1Service.register network error:', err);
      return {
        success: false,
        error: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। আপনার ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।',
      };
    }
  },

  /**
   * Login user with Phone and Password from Cloudflare D1
   */
  async login(data: {
    phone: string;
    password: string;
  }): Promise<{ success: boolean; message?: string; token?: string; user?: any; error?: string }> {
    const cleanPhone = normalizePhoneNumber(data.phone);
    if (!cleanPhone || cleanPhone.length < 11) {
      return { success: false, error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন' };
    }

    const payload = {
      phone: cleanPhone,
      password: data.password.trim(),
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let result: any = null;
      try {
        result = rawText ? JSON.parse(rawText) : null;
      } catch {
        result = null;
      }

      if (res.ok && result?.success && result?.token && result?.user) {
        this.setStoredToken(result.token);
        try {
          localStorage.setItem('pasher_auth_user', JSON.stringify(result.user));
        } catch {}
        return {
          success: true,
          message: result.message,
          token: result.token,
          user: result.user,
        };
      }

      if (result?.error) {
        return {
          success: false,
          error: result.error,
        };
      }

      if (res.status === 404 || res.status === 405) {
        return {
          success: false,
          error: 'লগইন API (/api/auth/login) পাওয়া যায়নি। ব্যাকএন্ড সার্ভার বা Cloudflare Worker চালু আছে কিনা নিশ্চিত করুন।',
        };
      }

      return {
        success: false,
        error: 'মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয় অথবা সার্ভারে ত্রুটি হয়েছে।',
      };
    } catch (err: any) {
      console.error('d1Service.login network error:', err);
      return {
        success: false,
        error: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। পুনরায় চেষ্টা করুন।',
      };
    }
  },

  /**
   * Get current authenticated user using session token
   */
  async getCurrentUser(): Promise<{ success: boolean; user?: any; error?: string }> {
    const token = this.getStoredToken();
    if (!token) {
      return { success: false, error: 'কোনো সক্রিয় সেশন নেই' };
    }

    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const rawText = await res.text();
      let result: any = null;
      try {
        result = rawText ? JSON.parse(rawText) : null;
      } catch {
        result = null;
      }

      if (res.ok && result?.success && result?.user) {
        try {
          localStorage.setItem('pasher_auth_user', JSON.stringify(result.user));
        } catch {}
        return { success: true, user: result.user };
      }

      if (res.status === 401 || res.status === 403) {
        this.removeStoredToken();
        return { success: false, error: result?.error || 'সেশন মেয়াদোত্তীর্ণ হয়েছে' };
      }
    } catch (err) {
      console.warn('d1Service.getCurrentUser network error:', err);
    }

    return { success: false, error: 'সেশন যাচাই করা যায়নি' };
  },

  /**
   * Logout user and invalidate Cloudflare D1 session
   */
  async logout(): Promise<void> {
    const token = this.getStoredToken();
    this.removeStoredToken();

    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn('d1Service.logout network notice:', err);
      }
    }
  },
};

// ----------------------------------------------------
// Authentication Helpers (Client)
// ----------------------------------------------------
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  let clean = rawPhone.replace(/[০-৯]/g, (d) => bnToEnMap[d] || d);
  clean = clean.replace(/[^0-9]/g, '');
  if (clean.startsWith('880') && clean.length >= 13) {
    clean = clean.slice(2);
  }
  return clean;
}

// ----------------------------------------------------
// Admin Console Service (/api/admin/*)
// ----------------------------------------------------
export interface AdminProfile {
  id: string;
  name: string;
  phone: string;
  role: 'admin';
}

export interface AdminUserItem {
  id: string;
  name: string;
  phone: string;
  role: 'customer' | 'merchant' | 'admin';
  createdAt?: string;
}

export interface AdminReviewItem {
  id: string;
  shopId: string;
  shopName?: string;
  customerName: string;
  rating: number;
  comment: string;
  dateBn: string;
}

export interface AdminOverviewData {
  stats: {
    totalShops: number;
    openShops: number;
    totalProducts: number;
    inStockProducts: number;
    totalUsers: number;
    merchantCount: number;
    totalReviews: number;
  };
  shops: Shop[];
  products: ProductItem[];
  users: AdminUserItem[];
  reviews: AdminReviewItem[];
  dbMode: string;
}

const ADMIN_TOKEN_KEY = 'pasher_admin_token';

export const adminService = {
  getToken(): string | null {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string) {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch {}
  },

  clearToken() {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {}
  },

  async getStatus(): Promise<{
    passwordConfigured: boolean;
    authenticated: boolean;
    admin: AdminProfile | null;
  }> {
    const token = this.getToken();
    const res = await fetch('/api/admin/status', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (!data.authenticated && token) {
      this.clearToken();
    }
    return {
      passwordConfigured: Boolean(data.passwordConfigured),
      authenticated: Boolean(data.authenticated),
      admin: data.admin || null,
    };
  },

  async loginAdmin(
    password: string
  ): Promise<{ success: boolean; admin?: AdminProfile; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        this.setToken(data.token);
        return { success: true, admin: data.admin };
      }
      return { success: false, error: data.error || 'অ্যাডমিন পাসওয়ার্ড সঠিক নয়' };
    } catch {
      return { success: false, error: 'সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে' };
    }
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    this.clearToken();
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
  },

  async getOverview(): Promise<{ success: boolean; data?: AdminOverviewData; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'অননুমোদিত প্রবেশাধিকার' };
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json };
      }
      if (res.status === 401) {
        this.clearToken();
      }
      return { success: false, error: json.error || 'তথ্য লোড করা যায়নি' };
    } catch {
      return { success: false, error: 'সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে' };
    }
  },

  async updateShop(id: string, body: Partial<Shop>): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const res = await fetch(`/api/admin/shops/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  },

  async deleteShop(id: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const res = await fetch(`/api/admin/shops/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },

  async updateProduct(id: string, body: Partial<ProductItem>): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },

  async updateUserRole(id: string, role: 'customer' | 'merchant'): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    return res.ok;
  },

  async deleteUser(id: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },

  async deleteReview(shopId: string, reviewId: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    const res = await fetch(`/api/admin/reviews/${shopId}/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },
};


