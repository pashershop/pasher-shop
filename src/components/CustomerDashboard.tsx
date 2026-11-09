import React, { useState } from 'react';
import {
  User,
  Heart,
  PhoneCall,
  MapPin,
  Store,
  Clock,
  ChevronRight,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  Navigation,
  Phone,
  Tag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Shop, ProductItem } from '../types';
import { SHOPS, FEATURED_PRODUCTS } from '../data/mockData';

interface CustomerDashboardProps {
  currentArea: string;
  isAutoDetected: boolean;
  onDetectLocation: () => void;
  onOpenShopModal: (shop: Shop) => void;
  onOpenAddShop: () => void;
  onBackToHome: () => void;
  onNavigateToShops: () => void;
  onNavigateToProducts: () => void;
  onNavigateToPriceCompare: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentArea,
  isAutoDetected,
  onDetectLocation,
  onOpenShopModal,
  onOpenAddShop,
  onBackToHome,
  onNavigateToShops,
  onNavigateToProducts,
  onNavigateToPriceCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'calls' | 'searches'>('favorites');

  // Demo call history data for customer
  const callHistory = [
    {
      id: 'c1',
      shopName: 'রহিম জেনারেল স্টোর',
      shopPhone: '01711223344',
      timeBn: 'আজ দুপুর ১২:৩০',
      inquiry: 'মিনিকেট চাল ২৫ কেজি ও সরিষার তেল ৫ লিটার',
      area: 'ধানমন্ডি, ঢাকা',
    },
    {
      id: 'c2',
      shopName: 'বিসমিল্লাহ্ ফার্মেসি',
      shopPhone: '01812345678',
      timeBn: 'গতকাল সন্ধ্যা ৬:১৫',
      inquiry: 'নাপা এক্সট্যান্ড ও স্যাভলন অ্যান্টিসেপটিক ড্রপ',
      area: 'ধানমন্ডি ৮/এ, ঢাকা',
    },
    {
      id: 'c3',
      shopName: 'ফ্রেশ ফ্রুটস ও ভেজিটেবল বিডি',
      shopPhone: '01987654321',
      timeBn: '২ দিন আগে',
      inquiry: 'দেশি আম ও গাছ পাকা পেঁপে',
      area: 'সোবহানবাগ, ঢাকা',
    },
  ];

  // Demo search history
  const searchHistory = [
    { id: 's1', termBn: 'মিনিকেট চাল ২৫ কেজি', lowestPrice: 1750, countShops: 4, area: 'ধানমন্ডি' },
    { id: 's2', termBn: 'সরিষার তেল ১ লিটার', lowestPrice: 210, countShops: 6, area: 'ধানমন্ডি' },
    { id: 's3', termBn: 'নাপা ৫শ মিগ্রা (পাতা)', lowestPrice: 12, countShops: 3, area: 'ধানমন্ডি' },
  ];

  // Favorite shops (first 3 shops as sample favorites)
  const favoriteShops = SHOPS.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 pb-28 pt-4 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        
        {/* Top Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF7900]/10 dark:bg-[#FF7900]/20 text-[#FF7900] border border-[#FF7900]/30 dark:border-[#FF7900]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF7900]" />
                ক্রেতা পোর্টাল (Customer Portal)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              স্বাগতম, আপনার পার্সোনাল ড্যাশবোর্ড
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              আপনার চারপাশের সেরা দোকানগুলোর সাথে কানেক্টেড থাকুন এবং সহজে কেনাকাটা করুন
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              ← হোম পেইজে যান
            </button>
            <button
              onClick={onOpenAddShop}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#FF7900] to-[#e06b00] hover:from-[#e06b00] hover:to-[#c45e00] rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>নিজের দোকান যুক্ত করুন</span>
            </button>
          </div>
        </div>

        {/* User Profile Overview & GPS Card (Full Width) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
          {/* User Card */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0B4A8A]/10 dark:bg-[#0B4A8A]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B4A8A] to-[#FF7900] flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white/20">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">সম্মানিত গ্রাহক</h2>
                  <span title="ভেরিফাইড কাস্টমার">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                  <span>মোবাইল: +880 17*****39</span>
                  <span>·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">সক্রিয় মেম্বার</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7900]" />
                  <span className="font-semibold text-slate-900 dark:text-white">{currentArea}</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col gap-2 relative z-10 shrink-0">
              <button
                onClick={onDetectLocation}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Navigation className={`w-4 h-4 text-[#FF7900] ${isAutoDetected ? 'animate-bounce' : ''}`} />
                <span>GPS লোকেশন আপডেট</span>
              </button>
              <div className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                {isAutoDetected ? '✓ অটো জিপিএস লোকেশন ট্র্যাকিং সক্রিয়' : 'ম্যানুয়াল লোকেশন সেট করা'}
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">পছন্দের দোকান</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">৩টি</div>
              <span className="text-[10px] text-slate-400 mt-1">নিকটস্থ প্রিয় শপ</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">সাম্প্রতিক কল</span>
                <PhoneCall className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">৫টি</div>
              <span className="text-[10px] text-slate-400 mt-1">দোকানদারদের সাথে কল</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">দাম তুলনা সার্চ</span>
                <Tag className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">১২টি</div>
              <span className="text-[10px] text-slate-400 mt-1">সর্বনিম্ন দাম যাচাই</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">জিপিএস নির্ভুলতা</span>
                <Navigation className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">১০০%</div>
              <span className="text-[10px] text-slate-400 mt-1">রিয়েল-টাইম ডিসট্যান্স</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto w-full">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-[#0B4A8A] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>পছন্দের দোকানসমূহ ({favoriteShops.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'calls'
                ? 'bg-[#0B4A8A] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-emerald-500" />
            <span>কল ও অর্ডারের ইতিহাস</span>
          </button>

          <button
            onClick={() => setActiveTab('searches')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'searches'
                ? 'bg-[#0B4A8A] text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Search className="w-4 h-4 text-amber-500" />
            <span>দাম যাচাইয়ের ইতিহাস</span>
          </button>
        </div>

        {/* Tab 1: Favorite Shops (Full Width Cards) */}
        {activeTab === 'favorites' && (
          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-[#FF7900]" />
                <span>আমার নিবন্ধিত প্রিয় দোকানসমূহ</span>
              </h3>
              <button
                onClick={onNavigateToShops}
                className="text-xs font-semibold text-[#FF7900] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>সব দোকান দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {favoriteShops.map((shop) => (
                <div
                  key={shop.id}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-[#FF7900]/50 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Cover image & badge */}
                    <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={shop.coverImage}
                        alt={shop.nameBn}
                        className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center gap-1 shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-[#FF7900]" />
                        <span>{shop.distance}</span>
                      </div>
                      <span
                        className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          shop.isOpen
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {shop.isOpen ? 'খোলা আছে' : 'বন্ধ'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <div className="text-xs font-bold text-[#FF7900]">{shop.categoryBn}</div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">{shop.nameBn}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{shop.addressBn}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onOpenShopModal(shop)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400" />
                      <span>দোকান দেখুন</span>
                    </button>

                    <a
                      href={`tel:${shop.phone}`}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
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

        {/* Tab 2: Recent Call History (Full Width) */}
        {activeTab === 'calls' && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-500" />
              <span>সাম্প্রতিক কল ও অর্ডারের ইতিহাস</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {callHistory.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{item.shopName}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.timeBn}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400">পণ্য ইনকোয়ারি: </span>
                      {item.inquiry}
                    </p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF7900]" />
                      {item.area}
                    </div>
                  </div>

                  <a
                    href={`tel:${item.shopPhone}`}
                    className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>পুনরায় কল দিন</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Price Search History (Full Width) */}
        {activeTab === 'searches' && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-500" />
                <span>সাম্প্রতিক মূল্য যাচাই ইতিহাস</span>
              </h3>
              <button
                onClick={onNavigateToPriceCompare}
                className="text-xs text-[#FF7900] hover:underline font-bold cursor-pointer"
              >
                সব পণ্যের দাম তুলনা দেখুন →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
              {searchHistory.map((sh) => (
                <div key={sh.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{sh.area} এলাকা</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{sh.termBn}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">সর্বনিম্ন দাম:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">৳{sh.lowestPrice}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    {sh.countShops}টি স্টোরে অ্যাভেইলএবল
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Big Merchant Program CTA Banner (Full Width) */}
        <div className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B4A8A] via-[#093a6d] to-slate-900 border border-[#0B4A8A]/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF7900]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10 text-white">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF7900] text-white shadow-sm inline-flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              দোকানদারদের জন্য সুবর্ণ সুযোগ
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              আপনার কি নিজস্ব দোকান আছে? Pasher Shop এ যুক্ত হয়ে কাস্টমার বাড়ান সম্পূর্ণ ফ্রীতে!
            </h3>
            <p className="text-xs sm:text-sm text-slate-200">
              আপনার এলাকার হাজারও কাস্টমার এখন পাসার শপ অ্যাপ থেকে পণ্য খুঁজছেন। ১ মিনিটেই আপনার দোকান যোগ করুন এবং সরাসরি কাস্টমারের কল ও অর্ডার পান।
            </p>
          </div>

          <div className="shrink-0 relative z-10 w-full md:w-auto">
            <button
              onClick={onOpenAddShop}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF7900] to-[#e06b00] hover:from-[#e06b00] hover:to-[#c45e00] text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" />
              <span>বিনামূল্যে দোকান খুলুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
