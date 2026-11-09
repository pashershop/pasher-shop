import React from 'react';
import { Store, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface ShopOwnerCTASectionProps {
  onOpenAddShopModal: () => void;
}

export const ShopOwnerCTASection: React.FC<ShopOwnerCTASectionProps> = ({
  onOpenAddShopModal,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#030712] border-b border-[#E5E7EB] dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0B4A8A] via-[#093a6d] to-[#06294d] dark:from-[#0B2545] dark:via-[#0A192F] dark:to-[#030712] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl border border-white/10 dark:border-slate-800">
          
          {/* Background futuristic glow */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#FF7900]/10 blur-3xl pointer-events-none" />
          <div className="absolute right-20 -top-20 w-60 h-60 rounded-full bg-[#0B4A8A]/20 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            
            {/* Merchant badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-orange-200 border border-white/20 mb-4">
              <Store className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>লোকাল দোকানদার ও উদ্যোক্তাদের জন্য</span>
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              আপনার দোকানটিও নিয়ে আসুন অনলাইনে!
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-200 mt-3 sm:mt-4 leading-relaxed">
              Pasher Shop-এর সঙ্গে যুক্ত হয়ে আপনার দোকান ও পণ্য পৌঁছে দিন আরও বেশি ক্রেতার কাছে।
              মহল্লার সবাই জানুক আপনার দোকানের পণ্য, নিয়মিত দাম ও সেরা অফার।
            </p>

            {/* Key Merchant Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-xs sm:text-sm text-slate-100 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FF7900] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span>মাত্র ২ মিনিটে সহজ নিবন্ধন</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FF7900] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span>ক্রেতাদের সরাসরি ফোন ও অর্ডার</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FF7900] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span>জিরো কমিশন (কোনো অতিরিক্ত চার্জ নেই)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#FF7900] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span>এলাকার মানুষের কাছে ডিজিটাল পরিচিতি</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onOpenAddShopModal}
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-[#FF7900] hover:bg-[#e06b00] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              >
                <Store className="w-4 h-4" />
                <span>আপনার দোকান যুক্ত করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-300 text-center sm:text-left">
                নিবন্ধন সম্পূর্ণ বিনামূল্যে · কোনো গোপন শর্তাবলি নেই
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
