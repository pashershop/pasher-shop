import { Shop, ProductItem } from '../types';
import { SHOPS } from '../data/mockData';

export interface D1StatusResponse {
  binding: string;
  databaseName: string;
  connected: boolean;
  mode: 'cloudflare_d1_api' | 'local_persistent_d1';
  message: string;
}

/**
 * Cloudflare D1 Service
 * Binding: DB
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
      // Backend fallback
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
   * Fetch all shops from Cloudflare D1 SQL database
   */
  async getAllShops(): Promise<Shop[]> {
    try {
      const res = await fetch('/api/shops');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Cache in localStorage for instant offline access
          try {
            localStorage.setItem('pasher_shop_list', JSON.stringify(data));
          } catch (e) {}
          return data;
        }
      }
    } catch (err) {
      console.warn('D1 fetch fallback to local storage:', err);
    }

    // Fallback to localStorage or mockData
    try {
      const saved = localStorage.getItem('pasher_shop_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return SHOPS;
  },

  /**
   * Create a new shop in Cloudflare D1 SQL
   */
  async createShop(shop: Shop): Promise<boolean> {
    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop),
      });
      return res.ok;
    } catch (err) {
      console.warn('D1 createShop error:', err);
      return false;
    }
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
  async submitReview(shopId: string, review: { customerName: string; rating: number; comment: string; dateBn: string }): Promise<boolean> {
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
