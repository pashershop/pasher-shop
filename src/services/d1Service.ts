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
};
