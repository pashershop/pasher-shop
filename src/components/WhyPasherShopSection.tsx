import React from 'react';
import { MapPin, Scale, Store, Search, CheckCircle } from 'lucide-react';
import { WHY_US_FEATURES } from '../data/mockData';

export const WhyPasherShopSection: React.FC = () => {
  const getIcon = (name: string) => {
    const iconClass = 'w-6 h-6 text-white';
    switch (name) {
      case 'MapPin':
        return <MapPin className={iconClass} />;
      case 'Scale':
        return <Scale className={iconClass} />;
      case 'Store':
        return <Store className={iconClass} />;
      default:
        return <Search className={iconClass} />;
    }
  };

  return (
    <section id="why-us" className="py-14 sm:py-20 bg-[#F8FAFC] dark:bg-[#030712] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-bold text-[#FF7900] tracking-wider uppercase mb-2">
            আমাদের সুবিধা ও লক্ষ্য
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] dark:text-white tracking-tight">
            কেন Pasher Shop ব্যবহার করবেন?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 text-balance">
            আমাদের লক্ষ্য স্থানীয় পাড়া-মহল্লার দোকান ও ক্রেতাদের মধ্যে একটি আধুনিক, নির্ভরযোগ্য ও দ্রুত যোগাযোগের ডিজিটাল মাধ্যম গড়ে তোলা।
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US_FEATURES.map((feature, idx) => (
            <div
              key={feature.id}
              className="bg-white dark:bg-[#090D16] p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] dark:border-slate-800/90 hover:border-[#0B4A8A]/30 dark:hover:border-cyan-500/30 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Feature Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#0B4A8A] group-hover:bg-[#FF7900] transition-colors flex items-center justify-center mb-5 shadow-xs">
                  {getIcon(feature.iconName)}
                </div>

                {/* Number index */}
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  ০{idx + 1}
                </span>

                {/* Feature Title */}
                <h3 className="text-lg font-bold text-[#171717] dark:text-white mt-1 group-hover:text-[#0B4A8A] dark:group-hover:text-cyan-400 transition-colors">
                  {feature.titleBn}
                </h3>

                {/* Feature Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  {feature.descBn}
                </p>
              </div>

              {/* Bottom decorative subtle trust bar */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>যাচাইকৃত সুবিধা</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
