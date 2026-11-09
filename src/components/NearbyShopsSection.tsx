import React, { useState } from 'react';
import { MapPin, Star, Clock, Phone, ChevronRight, Store, Map as MapIcon, LayoutGrid, Layers } from 'lucide-react';
import { Shop } from '../types';
import { NearbyShopsMap } from './NearbyShopsMap';

interface NearbyShopsSectionProps {
  shops: Shop[];
  onSelectShop: (shop: Shop) => void;
  currentArea: string;
  selectedCoordinates?: { lat: number; lng: number } | null;
  onOpenAddShopModal?: () => void;
}

export const NearbyShopsSection: React.FC<NearbyShopsSectionProps> = ({
  shops,
  onSelectShop,
  currentArea,
  selectedCoordinates,
  onOpenAddShopModal,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'map' | 'both'>('both');

  return (
    <section id="nearby-shops" className="py-12 sm:py-16 bg-white dark:bg-[#030712] border-b border-[#E5E7EB] dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E5E7EB] dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0B4A8A] dark:text-cyan-400 tracking-wider uppercase">
                লোকাল ডিরেক্টরি
              </span>
              <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                ডেমো ডেটা (Sample Data)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] dark:text-white tracking-tight">
                আপনার কাছের দোকান
              </h2>
              {selectedCoordinates && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  রিয়েল দূরত্ব অনুযায়ী সাজানো
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {currentArea}-এর আশেপাশের দোকানসমূহ ও আসল দূরত্ব আবিষ্কার করুন।
            </p>
          </div>

          {/* View Mode Toggle Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl self-start md:self-end border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'both'
                  ? 'bg-white dark:bg-slate-800 text-[#0B4A8A] dark:text-cyan-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>ম্যাপ ও কার্ড</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-800 text-[#0B4A8A] dark:text-cyan-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400" />
              <span>রিয়েল ম্যাপ</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-800 text-[#0B4A8A] dark:text-cyan-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span>শুধু কার্ড</span>
            </button>
          </div>
        </div>

        {/* Real Interactive Google Map View */}
        {(viewMode === 'map' || viewMode === 'both') && (
          <div className="mb-10 animate-in fade-in duration-300">
            <NearbyShopsMap
              shops={shops}
              currentArea={currentArea}
              selectedCoordinates={selectedCoordinates}
              onSelectShop={onSelectShop}
            />
          </div>
        )}

        {/* Shop Cards Grid */}
        {(viewMode === 'cards' || viewMode === 'both') && (
          shops.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center mx-auto mb-4">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                "{currentArea}" এলাকায় এখনও কোনো দোকান তালিকাভুক্ত হয়নি
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                আপনার কি এই এলাকায় কোনো দোকান বা ব্যবসা আছে? Pasher Shop-এ সম্পূর্ণ বিনামূল্যে নিবন্ধন করুন এবং স্থানীয় ক্রেতাদের কাছে নিজের দোকান পৌঁছে দিন।
              </p>
              {onOpenAddShopModal && (
                <button
                  onClick={onOpenAddShopModal}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0B4A8A] hover:bg-[#093a6d] shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-[#FF7900]" />
                  আপনার দোকান যুক্ত করুন
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5 w-full animate-in fade-in duration-300">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  onClick={() => onSelectShop(shop)}
                  className="w-full bg-white dark:bg-[#090D16] rounded-3xl border border-slate-200 dark:border-slate-800/90 hover:border-[#FF7900]/60 dark:hover:border-[#FF7900]/60 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer"
                >
                  {/* Cover Image Banner */}
                  <div className="relative w-full sm:w-64 md:w-80 h-48 sm:h-auto min-h-[190px] bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
                    <img
                      src={shop.coverImage}
                      alt={shop.nameBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    
                    {/* Distance badge */}
                    <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-[#0B4A8A] dark:text-cyan-400 px-3 py-1 rounded-xl text-xs font-black border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7900]" />
                      <span>{shop.distance}</span>
                    </div>

                    {/* Open / Closed Status */}
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-black shadow-md backdrop-blur-xs flex items-center gap-1.5 ${
                        shop.isOpen
                          ? 'bg-emerald-600/95 text-white'
                          : 'bg-rose-600/95 text-white'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          shop.isOpen ? 'bg-white animate-pulse' : 'bg-red-200'
                        }`}
                      />
                      <span>{shop.isOpen ? 'খোলা আছে' : 'বন্ধ'}</span>
                    </div>

                    {/* Category Badge on Bottom of Image */}
                    <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-xl border border-white/20">
                      {shop.categoryBn}
                    </div>
                  </div>

                  {/* Shop Details - Full Width Info Panel */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Category & Verification Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-[#FF7900] uppercase tracking-wider">
                            {shop.categoryBn}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                            <Store className="w-3 h-3 text-[#0B4A8A] dark:text-cyan-400" />
                            <span>{shop.area}</span>
                          </span>
                        </div>

                        {shop.deliveryAvailable && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B4A8A] dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                            ✓ হোম ডেলিভারি দেয়
                          </span>
                        )}
                      </div>

                      {/* Shop Name */}
                      <h3 className="font-black text-lg sm:text-xl text-[#171717] dark:text-white group-hover:text-[#FF7900] transition-colors line-clamp-1">
                        {shop.nameBn}
                      </h3>

                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <div className="flex items-center text-amber-500 font-bold">
                          <Star className="w-4 h-4 fill-amber-500 stroke-amber-500 mr-1" />
                          <span className="text-sm font-extrabold">{shop.rating}</span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">({shop.reviewCount} জন ক্রেতার রিভিউ)</span>
                      </div>

                      {/* Address & Timings */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-[#FF7900] shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-relaxed">{shop.addressBn}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>সময়সূচী: {shop.timingBn}</span>
                        </div>
                      </div>

                      {/* Featured Products Pills Preview */}
                      {shop.featuredProducts && shop.featuredProducts.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">
                            পণ্যসমূহ:
                          </span>
                          {shop.featuredProducts.slice(0, 4).map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                            >
                              {p.nameBn} <span className="text-[#0B4A8A] dark:text-cyan-400 font-bold">(৳{p.price})</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions Row */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#FF7900] group-hover:underline flex items-center gap-1">
                        <span>দোকানের বিস্তারিত ও পণ্যের পূর্ণ তালিকা দেখুন</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${shop.phone.replace(/[^0-9]/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-sm rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          title={`সরাসরি কল করুন: ${shop.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>কল দিন ({shop.phone})</span>
                        </a>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectShop(shop);
                          }}
                          className="px-4 py-2 text-xs font-black text-white bg-[#0B4A8A] hover:bg-[#093a6d] rounded-xl transition-all flex items-center gap-1 shadow-sm active:scale-98"
                        >
                          <span>সম্পূর্ণ পেজ</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
        ))}

      </div>
    </section>
  );
};
