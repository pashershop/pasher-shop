import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  Store,
  Navigation,
  ShieldCheck,
  Tag,
  Users,
  Compass,
} from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';

interface HeroSectionProps {
  currentArea: string;
  isAutoDetected?: boolean;
  onDetectLocation?: () => void;
  onSelectArea: (areaName: string) => void;
  onSearch: (query: string) => void;
  onExploreShops: () => void;
  onOpenLocationModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentArea,
  isAutoDetected,
  onDetectLocation,
  onSelectArea,
  onSearch,
  onExploreShops,
  onOpenLocationModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    } else {
      onExploreShops();
    }
  };

  const quickPicks = ['মিনিকেট চাল', 'সয়াবিন তেল', 'ফার্মের ডিম', 'নাপা এক্সটেন্ড', 'কাঁচা বাজার'];

  return (
    <section
      id="hero"
      className="relative pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-16 lg:pb-22 bg-gradient-to-b from-white via-[#F8FAFC]/60 to-[#F8FAFC] dark:from-[#030712] dark:via-[#070D1B] dark:to-[#030712] border-b border-[#E5E7EB]/80 dark:border-slate-900 transition-colors"
    >
      {/* Background Futuristic Ambient Mesh Glow in Dark Mode */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0B4A8A]/10 dark:bg-[#0B4A8A]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Grand Top Headline Block */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
          
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B4A8A] dark:text-cyan-400 bg-[#0B4A8A]/5 dark:bg-slate-900/80 border border-[#0B4A8A]/15 dark:border-cyan-500/30 px-3.5 py-1.5 rounded-full shadow-2xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF7900] animate-pulse" />
            <span>বাংলাদেশের ১ নম্বর লোকাল মার্কেটপ্লেস</span>
          </div>

          {/* Large Centered Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#171717] dark:text-white tracking-tight leading-[1.15] text-balance">
            আপনার পাশের দোকান, <span className="text-[#FF7900]">এখন অনলাইনে</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            কাছের দোকান খুঁজুন, পণ্যের দাম তুলনা করুন এবং স্থানীয় ব্যবসার সঙ্গে সরাসরি যুক্ত থাকুন।
            পাড়ার বিশ্বস্ত দোকানি এখন আপনার হাতের নাগালে।
          </p>

        </div>

        {/* Centered Search & Location Action Box */}
        <div className="max-w-3xl mx-auto w-full mb-10">
          <div className="bg-white dark:bg-[#0A0E17] p-3 sm:p-4 rounded-2xl border-2 border-[#0B4A8A]/10 dark:border-slate-800 shadow-lg dark:shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:shadow-xl transition-shadow">
            
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              {/* Search Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="আপনি কী খুঁজছেন? যেমন: মিনিকেট চাল, ডিম, মোবাইল, ওষুধ..."
                  className="w-full pl-11 pr-4 py-3.5 text-sm sm:text-base text-[#171717] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7900]/30 transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2 px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    মুছুন
                  </button>
                )}
              </div>

              {/* Submit Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#FF7900] hover:bg-[#e06b00] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-[0.99] cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>অনুসন্ধান করুন</span>
              </button>
            </form>

            {/* Quick Area and Auto-Location Bar */}
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Location display with Auto GPS button */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">আপনার এলাকা:</span>
                
                <button
                  onClick={onOpenLocationModal}
                  className="inline-flex items-center gap-1.5 font-bold text-[#0B4A8A] dark:text-cyan-400 hover:text-[#FF7900] bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                  title="এলাকা ম্যানুয়ালি পরিবর্তন করুন"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400" />
                  <span>{currentArea}</span>
                  {isAutoDetected && (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      লাইভ GPS
                    </span>
                  )}
                  <span className="text-slate-400 text-[10px] ml-0.5">(পরিবর্তন)</span>
                </button>

                {/* 1-click Auto Geolocation Button */}
                {onDetectLocation && (
                  <button
                    type="button"
                    onClick={onDetectLocation}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0B4A8A] dark:text-cyan-400 hover:text-[#FF7900] bg-[#0B4A8A]/5 dark:bg-slate-900 border border-[#0B4A8A]/20 dark:border-slate-800 transition-colors cursor-pointer"
                    title="আপনার বর্তমান অবস্থান স্বয়ংক্রিয়ভাবে শনাক্ত করুন"
                  >
                    <Navigation className="w-3 h-3 text-[#FF7900]" />
                    <span>অটো ডিটেক্ট (GPS)</span>
                  </button>
                )}
              </div>

              {/* Secondary Button: কাছের দোকান খুঁজুন */}
              <button
                onClick={onExploreShops}
                className="inline-flex items-center gap-1.5 font-bold text-[#0B4A8A] dark:text-cyan-400 hover:text-[#093a6d] transition-colors cursor-pointer"
              >
                <span>কাছের দোকানগুলো দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF7900]" />
              </button>
            </div>

          </div>

          {/* Quick Keyword Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium">জনপ্রিয় সন্ধান:</span>
            {quickPicks.map((pick) => (
              <button
                key={pick}
                onClick={() => {
                  setSearchQuery(pick);
                  onSearch(pick);
                }}
                className="px-2.5 py-1 bg-white dark:bg-[#0A0E17] hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md transition-colors font-medium hover:border-[#FF7900] cursor-pointer shadow-2xs"
              >
                {pick}
              </button>
            ))}
          </div>

        </div>

        {/* Visual Showcase Banner with Metrics Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center max-w-5xl mx-auto">
          
          {/* Left metrics info cards */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A0E17] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-[#171717] dark:text-white">৫০০+ দোকান প্রতি এলাকায়</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">মুদি, ফার্মেসি, ফলমূল ও ইলেকট্রনিক্স</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A0E17] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B4A8A]/10 text-[#0B4A8A] dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-[#0B4A8A] dark:text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-black text-[#171717] dark:text-white">দূরত্ব ও নেভিগেশন সুবিধা</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">কোন দিক দিয়ে যাবেন ও কত সময় লাগবে</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0A0E17] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-[#171717] dark:text-white">সরাসরি কল ও অর্ডার</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">দোকানির সাথে সরাসরি ফোনে যোগাযোগ</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Showcase */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] dark:border-slate-800 shadow-lg bg-slate-900 group">
              <img
                src={HERO_IMAGE}
                alt="Pasher Shop Local Marketplace in Dhaka Bangladesh"
                className="w-full h-[280px] sm:h-[340px] object-cover transition-transform duration-500 group-hover:scale-102 opacity-90"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Floating Verified Neighborhood Badge */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/40 dark:border-slate-700 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#0B4A8A] dark:text-cyan-400">লোকাল বাজার লাইভ আপডেট</span>
              </div>

              {/* Floating Interactive Card bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-white/60 dark:border-slate-700 shadow-md flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">আপনার বর্তমান এলাকা</div>
                  <div className="text-sm font-extrabold text-[#171717] dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400" />
                    <span>{currentArea}</span>
                  </div>
                </div>
                <button
                  onClick={onExploreShops}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0B4A8A] hover:bg-[#093a6d] rounded-lg transition-colors cursor-pointer"
                >
                  দোকানসমূহ দেখুন
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
