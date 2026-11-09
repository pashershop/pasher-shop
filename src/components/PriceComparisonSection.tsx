import React, { useState } from 'react';
import { Scale, TrendingDown, Store, MapPin, Check, Phone } from 'lucide-react';
import { PRICE_COMPARISONS } from '../data/mockData';
import { PriceComparisonItem } from '../types';

interface PriceComparisonSectionProps {
  onOpenShopByName?: (shopName: string) => void;
}

export const PriceComparisonSection: React.FC<PriceComparisonSectionProps> = ({
  onOpenShopByName,
}) => {
  const hasComparisons = PRICE_COMPARISONS && PRICE_COMPARISONS.length > 0;
  const [selectedItemId, setSelectedItemId] = useState<string>(
    hasComparisons ? PRICE_COMPARISONS[0].id : ''
  );

  const activeItem = hasComparisons
    ? PRICE_COMPARISONS.find((item) => item.id === selectedItemId) || PRICE_COMPARISONS[0]
    : null;

  // Calculate highest vs lowest
  const prices = activeItem?.shops ? activeItem.shops.map((s) => s.price) : [];
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const savings = highestPrice - lowestPrice;

  return (
    <section id="price-comparison" className="py-12 sm:py-16 bg-white dark:bg-[#030712] border-b border-[#E5E7EB] dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E5E7EB] dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0B4A8A] dark:text-cyan-400 tracking-wider uppercase">
                স্মার্ট শপিং টুল
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] dark:text-white tracking-tight mt-1">
              একই পণ্য, বিভিন্ন দোকানের দাম
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              আপনার পাড়ার বিভিন্ন দোকানে একই পণ্যের দাম কত? তুলনা করে সেরা দামে কেনাকাটা করুন।
            </p>
          </div>

          {hasComparisons && savings > 0 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold self-start md:self-end">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>প্রতি কেনাকাটায় সর্বোচ্চ ৳{savings} পর্যন্ত সাশ্রয়!</span>
            </div>
          )}
        </div>

        {!hasComparisons ? (
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-[#0B4A8A]/10 text-[#0B4A8A] dark:text-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              বর্তমানে পণ্যের মূল্য তুলনা তালিকা আপডেট হচ্ছে
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              কাছের নিবন্ধিত দোকানদাররা তাদের পণ্যের দাম যুক্ত করলে আপনি এখানে একই পণ্যের বিভিন্ন দোকানের লাইভ দাম সরাসরি তুলনা করতে পারবেন।
            </p>
          </div>
        ) : (
          <>
            {/* Product Selector Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
              {PRICE_COMPARISONS.map((item) => {
                const isSelected = item.id === selectedItemId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B4A8A] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent dark:border-slate-800'
                    }`}
                  >
                    <span>{item.productNameBn}</span>
                  </button>
                );
              })}
            </div>

            {/* Comparison Showcase Container */}
            {activeItem && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#F8FAFC] dark:bg-[#070A12] rounded-2xl p-5 sm:p-7 border border-[#E5E7EB] dark:border-slate-800/90">
                
                {/* Active Product Preview & Savings Banner */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                  <div className="bg-white dark:bg-[#090D16] p-4 rounded-xl border border-[#E5E7EB] dark:border-slate-800 shadow-xs">
                    <div className="w-full h-36 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                      <img
                        src={activeItem.imageUrl}
                        alt={activeItem.productNameBn}
                        className="w-full h-full object-cover opacity-95"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#FF7900] bg-[#FF7900]/10 dark:bg-[#FF7900]/20 px-2 py-0.5 rounded">
                      {activeItem.categoryBn}
                    </span>
                    <h3 className="font-extrabold text-lg text-[#171717] dark:text-white mt-2">
                      {activeItem.productNameBn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      পরিমাপ একক: <span className="font-bold text-slate-700 dark:text-slate-200">{activeItem.unitBn}</span>
                    </p>
                  </div>

                  {/* Savings Callout Box */}
                  <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-100">
                      <Scale className="w-4 h-4" />
                      <span>দাম বিশ্লেষণ ফলাফল</span>
                    </div>
                    <div className="text-2xl font-black mt-2 tabular-nums">
                      ৳{lowestPrice} <span className="text-xs font-normal opacity-90">সর্বনিম্ন দাম</span>
                    </div>
                    <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                      পাশের কম দামের দোকান থেকে নিলে প্রতি {activeItem.unitBn}-এ{' '}
                      <span className="font-bold underline">৳{savings} সাশ্রয়</span> হচ্ছে!
                    </p>
                  </div>
                </div>

                {/* Shop-by-Shop Price Comparison Table */}
                <div className="lg:col-span-8 flex flex-col space-y-3">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
                    কাছের দোকানগুলোর রেট চার্ট ({activeItem.shops.length}টি দোকান যাচাইকৃত)
                  </div>

                  {activeItem.shops.map((shop) => {
                    const isBest = shop.price === lowestPrice;
                    const diffFromLowest = shop.price - lowestPrice;

                    return (
                      <div
                        key={shop.shopId}
                        className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isBest
                            ? 'bg-white dark:bg-[#0B1520] border-emerald-400 dark:border-emerald-500 shadow-sm ring-1 ring-emerald-400/30'
                            : 'bg-white dark:bg-[#090D16] border-[#E5E7EB] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Shop Info */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              isBest ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <Store className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-[#171717] dark:text-white">
                                {shop.shopName}
                              </span>
                              {isBest && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  সেরা ডিল (Best Deal)
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#FF7900]" />
                                <span>{shop.shopArea}</span>
                              </span>
                              <span>·</span>
                              <span>দূরত্ব: {shop.distance}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                          <div className="text-left sm:text-right">
                            <div className="text-2xl font-black text-[#0B4A8A] dark:text-cyan-400 tabular-nums">
                              ৳{shop.price}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {isBest ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">সবচেয়ে কম মূল্য</span>
                              ) : (
                                <span>+৳{diffFromLowest} বেশি</span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenShopByName && onOpenShopByName(shop.shopName)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                              isBest
                                ? 'bg-[#FF7900] hover:bg-[#e06b00] text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>যোগাযোগ</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};
