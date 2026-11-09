import React, { useState } from 'react';
import {
  Scale,
  Search,
  Phone,
  Store,
  MapPin,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { PRICE_COMPARISONS } from '../data/mockData';
import { PriceComparisonItem, PriceComparisonOption, CategoryId } from '../types';

interface PriceComparePageProps {
  onOpenShopByName: (shopName: string) => void;
}

export const PriceComparePage: React.FC<PriceComparePageProps> = ({
  onOpenShopByName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered: PriceComparisonItem[] = PRICE_COMPARISONS.filter((item: PriceComparisonItem) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.productNameBn.toLowerCase().includes(q);
      const matchCat = item.categoryBn.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-28 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Title Header Row */}
        <div className="pb-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#0B4A8A] dark:text-cyan-400" />
            <span>আপনার এলাকার দোকানগুলোর দাম তুলনা</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            সবচেয়ে কম দামে পণ্য বিক্রেতা দোকানদারকে সরাসরি ডায়াল করুন
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="যেকোনো পণ্যের দাম তুলনা করতে নাম লিখুন (যেমন: মিনিকেট চাল, সরিষার তেল)..."
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
        </div>

        {/* Comparison Cards List */}
        <div className="space-y-6">
          {filtered.map((item: PriceComparisonItem) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md hover:border-[#0B4A8A]/40 transition-all p-5 space-y-4"
            >
              {/* Product Info Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.productNameBn}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-[#FF7900]">
                      {item.categoryBn}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.productNameBn} ({item.unitBn})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      গড় পাইকারি ও খুচরা বাজারদর: ৳{item.standardPrice}
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                  <span>সর্বনিম্ন দামে সেভ করুন প্রতি অর্ডারে!</span>
                </div>
              </div>

              {/* Shop Price Comparison Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {item.shops.map((s: PriceComparisonOption, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                      s.isLowest
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onOpenShopByName(s.shopName)}
                          className="font-bold text-slate-900 dark:text-white text-sm hover:text-[#0B4A8A] hover:underline text-left line-clamp-1 cursor-pointer"
                        >
                          {s.shopName}
                        </button>
                        {s.isLowest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-xs shrink-0">
                            সবচেয়ে কম দাম!
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-[#FF7900]" />
                        <span>{s.shopArea} ({s.distance})</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">বিক্রয় মূল্য</div>
                        <div
                          className={`text-xl font-black ${
                            s.isLowest
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          ৳{s.price}
                        </div>
                      </div>

                      <a
                        href={`tel:01711223344`}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>কল করুন</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
