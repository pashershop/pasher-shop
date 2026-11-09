import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Search,
  Phone,
  Navigation,
  Star,
  Map,
  Grid,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Shop, CategoryId } from '../types';
import { CATEGORIES } from '../data/mockData';
import { NearbyShopsMap } from './NearbyShopsMap';

interface ShopsPageProps {
  shops: Shop[];
  currentArea: string;
  isAutoDetected: boolean;
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  onSelectShop: (shop: Shop) => void;
  onOpenAddShopModal: () => void;
  onDetectLocation: () => void;
}

export const ShopsPage: React.FC<ShopsPageProps> = ({
  shops,
  currentArea,
  isAutoDetected,
  selectedCategory,
  onSelectCategory,
  onSelectShop,
  onOpenAddShopModal,
  onDetectLocation,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter shops by search query
  const filtered = shops.filter((shop) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      shop.nameBn.toLowerCase().includes(q) ||
      shop.categoryBn.toLowerCase().includes(q) ||
      shop.addressBn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Title Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-[#0B4A8A] dark:text-cyan-400" />
              <span>আপনার আশেপাশের দোকানসমূহ</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              বর্তমান এলাকা: <span className="font-bold text-[#0B4A8A] dark:text-cyan-400">{currentArea}</span>
              {isAutoDetected && ' (অটো জিপিএস সক্রিয়)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDetectLocation}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>রিফ্রেশ</span>
            </button>
            <button
              onClick={onOpenAddShopModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#0B4A8A] hover:bg-[#093a6d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>দোকান যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Filters & Search Controls Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="দোকানের নাম বা পণ্য দিয়ে খুঁজুন..."
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

            {/* View Mode Toggle Switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 w-full sm:w-auto justify-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-[#0B4A8A] dark:text-cyan-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>কার্ড ভিউ</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-slate-900 text-[#FF7900] shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>ম্যাপ ভিউ</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0B4A8A] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              সকল দোকান ({shops.length})
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

        {/* View Content */}
        {viewMode === 'map' ? (
          <NearbyShopsMap
            shops={filtered}
            currentArea={currentArea}
            onSelectShop={onSelectShop}
          />
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>মোট {filtered.length}টি দোকান পাওয়া গেছে</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ দূরত্ব অনুযায়ী সজ্জিত (নিকটতম প্রথম)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#0B4A8A]/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Header */}
                    <div className="relative h-44 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={shop.coverImage}
                        alt={shop.nameBn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      
                      {/* Distance pill */}
                      <div className="absolute top-3 right-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-slate-700 flex items-center gap-1.5 shadow-md">
                        <Navigation className="w-3.5 h-3.5 text-[#FF7900]" />
                        <span>{shop.distance}</span>
                      </div>

                      {/* Status */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-md ${
                            shop.isOpen ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        >
                          {shop.isOpen ? 'খোলা আছে' : 'বন্ধ'}
                        </span>
                        {shop.deliveryAvailable && (
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#0B4A8A] text-white">
                            হোম ডেলিভারি
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-[11px] font-bold text-[#FF7900] uppercase tracking-wide">
                          {shop.categoryBn}
                        </div>
                        <h3 className="text-lg font-bold line-clamp-1 drop-shadow-sm">
                          {shop.nameBn}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
                        <span className="line-clamp-1">{shop.addressBn}</span>
                      </div>

                      {/* Featured Items list */}
                      {shop.featuredProducts && shop.featuredProducts.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                          <span className="text-[11px] text-slate-400 font-semibold block mb-1">
                            মূল পণ্যসমূহ:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {shop.featuredProducts.map((p, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] font-medium text-slate-700 dark:text-slate-200"
                              >
                                {p.nameBn} (৳{p.price})
                                {idx < shop.featuredProducts.length - 1 && ' ·'}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectShop(shop)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>দোকান দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`tel:${shop.phone}`}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>কল দিন</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
