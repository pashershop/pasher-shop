import { Category, Shop, ProductItem, PriceComparisonItem } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_pasher_shop_marketplace_1793695052235.jpg';
export const SHOP_GROCERY_IMG = '/src/assets/images/shop_bengali_grocery_store_1793695053012.jpg';
export const SHOP_BAZAAR_IMG = '/src/assets/images/shop_fresh_produce_bazaar_1793695053074.jpg';
export const SHOP_PHARMACY_IMG = '/src/assets/images/shop_modern_local_pharmacy_1793695054634.jpg';

export const AREAS = [
  { id: 'all', nameBn: 'সকল এলাকা', count: 0 },
  { id: 'dhanmondi', nameBn: 'ধানমন্ডি, ঢাকা', count: 0 },
  { id: 'mirpur', nameBn: 'মিরপুর, ঢাকা', count: 0 },
  { id: 'uttara', nameBn: 'উত্তরা, ঢাকা', count: 0 },
  { id: 'banasree', nameBn: 'বনশ্রী, ঢাকা', count: 0 },
  { id: 'gulshan', nameBn: 'গুলশান, ঢাকা', count: 0 },
  { id: 'mohammadpur', nameBn: 'মোহাম্মদপুর, ঢাকা', count: 0 },
];

export const CATEGORIES: Category[] = [
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

export const AREA_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  'সকল এলাকা': { lat: 23.7806, lng: 90.4000, zoom: 12 },
  'ধানমন্ডি, ঢাকা': { lat: 23.7465, lng: 90.3760, zoom: 14 },
  'মিরপুর, ঢাকা': { lat: 23.8071, lng: 90.3686, zoom: 14 },
  'উত্তরা, ঢাকা': { lat: 23.8732, lng: 90.3984, zoom: 14 },
  'বনশ্রী, ঢাকা': { lat: 23.7644, lng: 90.4312, zoom: 14 },
  'গুলশান, ঢাকা': { lat: 23.7925, lng: 90.4078, zoom: 14 },
  'মোহাম্মদপুর, ঢাকা': { lat: 23.7658, lng: 90.3584, zoom: 14 },
};

// Pure real database state - No mock / demo shops
export const SHOPS: Shop[] = [];

// Pure real database state - No mock / demo products
export const FEATURED_PRODUCTS: ProductItem[] = [];

// Pure real database state - No mock / demo price comparisons
export const PRICE_COMPARISONS: PriceComparisonItem[] = [];

export const WHY_US_FEATURES = [
  {
    id: 'nearby',
    titleBn: 'Nearby Shops (কাছের দোকান)',
    descBn: 'আপনার এলাকা বা লোকেশন অনুযায়ী হাতের কাছে থাকা বিশ্বস্ত স্থানীয় দোকানগুলো দ্রুত ও নির্ভুলভাবে খুঁজে নিন।',
    iconName: 'MapPin',
  },
  {
    id: 'price-comp',
    titleBn: 'Price Comparison (দাম তুলনা)',
    descBn: 'একই পণ্যের দাম বিভিন্ন দোকানে যাচাই করুন। আপনার সাশ্রয়ী মূল্যে সেরা ডিল বেছে নেওয়ার সুযোগ।',
    iconName: 'Scale',
  },
  {
    id: 'local-business',
    titleBn: 'Local Business (স্থানীয় ব্যবসা)',
    descBn: 'মহল্লার পরিচিত দোকানিদের সঙ্গে সরাসরি যোগাযোগ ও স্থানীয় পাড়া-মহল্লার অর্থনৈতিক প্রবৃদ্ধিতে ভূমিকা রাখুন।',
    iconName: 'Store',
  },
  {
    id: 'easy-discovery',
    titleBn: 'Easy Discovery (সহজ সন্ধান)',
    descBn: 'মুদি, কাঁচাবাজার, ফার্মেসি কিংবা জামাকাপড়—সব ধরনের প্রয়োজনীয় দোকান ও পণ্য এক প্ল্যাটফর্মে সার্চ করুন।',
    iconName: 'Search',
  },
];
