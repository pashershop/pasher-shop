import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Phone,
  Tag,
  Store,
  Filter,
  CheckCircle2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { ProductItem, CategoryId } from '../types';
import { FEATURED_PRODUCTS, CATEGORIES, SHOPS } from '../data/mockData';

interface ProductsPageProps {
  products: ProductItem[];
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  onSelectProduct: (product: ProductItem) => void;
  onSelectShopById: (shopId: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onSelectShopById,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100' | '100to500' | 'over500'>('all');

  // Filter products by category, search query, and price range
  const filtered = products.filter((item) => {
    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.nameBn.toLowerCase().includes(q);
      const matchShop = item.shopName.toLowerCase().includes(q);
      if (!matchName && !matchShop) return false;
    }

    // Price range filter
    if (priceFilter === 'under100' && item.price >= 100) return false;
    if (priceFilter === '100to500' && (item.price < 100 || item.price > 500)) return false;
    if (priceFilter === 'over500' && item.price <= 500) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header Row */}
        <div className="pb-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0B4A8A] dark:text-cyan-400" />
            <span>আশেপাশের দোকানগুলোর পণ্যসমূহ</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            সরাসরি স্থানীয় দোকানদারদের সাথে যোগাযোগ করে সেরা দামে অর্ডার দিন
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পণ্যের নাম বা দোকানের নাম লিখুন (যেমন: মিনিকেট চাল, তেল)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Price Filter Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <Filter className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
              <select
                value={priceFilter}
                onChange={(e: any) => setPriceFilter(e.target.value)}
                className="w-full text-xs font-bold bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="all">সকল দামের পণ্য</option>
                <option value="under100">৳১০০ টাকার নিচে</option>
                <option value="100to500">৳১০০ - ৳৫০০ টাকা</option>
                <option value="over500">৳৫০০ টাকার উপরে</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0B4A8A] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              সকল পণ্য ({products.length})
            </button>
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B4A8A] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.nameBn}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>মোট {filtered.length}টি পণ্য পাওয়া গেছে</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceFilter('all');
                onSelectCategory('all');
              }}
              className="text-[#FF7900] hover:underline font-bold"
            >
              ফিল্টার রিসেট করুন
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-14 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
              {searchQuery ? `"${searchQuery}" এর জন্য কোনো পণ্য পাওয়া যায়নি` : 'বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              দোকানদাররা তাদের দোকানের পণ্য এবং মূল্য যুক্ত করলে এখানে সরাসরি প্রদর্শিত হবে।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            // Find corresponding shop to get phone
            const shopObj = SHOPS.find((s) => s.id === item.shopId || s.nameBn === item.shopName);
            const shopPhone = shopObj ? shopObj.phone : '01711223344';

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#0B4A8A]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.nameBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span
                      className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm ${
                        item.isAvailable ? 'bg-emerald-600' : 'bg-slate-600'
                      }`}
                    >
                      {item.stockStatus}
                    </span>

                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FF7900] text-white shadow-sm">
                        ছাড় ৳{item.originalPrice - item.price}
                      </span>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <button
                      onClick={() => onSelectShopById(item.shopId)}
                      className="text-[11px] font-bold text-[#0B4A8A] dark:text-cyan-400 hover:underline flex items-center gap-1 line-clamp-1"
                    >
                      <Store className="w-3 h-3 text-[#FF7900]" />
                      <span>{item.shopName}</span>
                    </button>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 min-h-[2.5rem]">
                      {item.nameBn}
                    </h3>

                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF7900]" />
                      <span>{item.shopArea}</span>
                    </div>

                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        ৳{item.price}
                      </span>
                      <span className="text-xs text-slate-400">/ {item.unit}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ৳{item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(item)}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>বিবরণ</span>
                  </button>

                  <a
                    href={`tel:${shopPhone}`}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল দিন</span>
                  </a>
                </div>
              </div>
            );
          })}
          </div>
        )}

      </div>
    </div>
  );
};
