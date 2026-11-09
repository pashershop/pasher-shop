import React from 'react';
import {
  ShoppingBag,
  HeartPulse,
  Carrot,
  Apple,
  Shirt,
  Smartphone,
  Utensils,
  Home,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { CategoryId } from '../types';
import { toBnNumber } from '../utils/geoUtils';

interface CategoriesSectionProps {
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    const iconClass = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110';
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className={iconClass} />;
      case 'HeartPulse':
        return <HeartPulse className={iconClass} />;
      case 'Carrot':
        return <Carrot className={iconClass} />;
      case 'Apple':
        return <Apple className={iconClass} />;
      case 'Shirt':
        return <Shirt className={iconClass} />;
      case 'Smartphone':
        return <Smartphone className={iconClass} />;
      case 'Utensils':
        return <Utensils className={iconClass} />;
      case 'Home':
        return <Home className={iconClass} />;
      case 'BookOpen':
        return <BookOpen className={iconClass} />;
      default:
        return <LayoutGrid className={iconClass} />;
    }
  };

  return (
    <section id="categories" className="py-7 sm:py-9 bg-[#F8FAFC] dark:bg-[#030712] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E5E7EB] dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF7900]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#171717] dark:text-white tracking-tight">
              জনপ্রিয় ক্যাটাগরি
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              ({toBnNumber(CATEGORIES.length)}টি ক্যাটাগরি)
            </span>
          </div>
          
          {selectedCategory !== 'all' ? (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-bold text-[#FF7900] hover:underline cursor-pointer"
            >
              সবগুলো দেখুন (রিসেট)
            </button>
          ) : (
            <span className="text-xs text-slate-400">
              পছন্দের ক্যাটাগরিতে ক্লিক করুন
            </span>
          )}
        </div>

        {/* 10 Compact Category Cards Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all duration-150 focus:outline-none cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-[#0B0F19] border-[#FF7900] dark:border-[#FF7900] shadow-sm ring-2 ring-[#FF7900]/30 scale-[1.02]'
                    : 'bg-white dark:bg-[#090D16] hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-[#0B4A8A]/40 dark:hover:border-cyan-500/40 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Compact Icon */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                    isSelected
                      ? 'bg-[#FF7900] text-white shadow-2xs'
                      : 'bg-[#0B4A8A]/5 dark:bg-slate-800 text-[#0B4A8A] dark:text-cyan-400 group-hover:bg-[#FF7900]/10 group-hover:text-[#FF7900]'
                  }`}
                >
                  {getIcon(cat.iconName)}
                </div>

                {/* Category Title */}
                <span
                  className={`text-[11px] sm:text-xs font-bold tracking-tight line-clamp-1 transition-colors ${
                    isSelected
                      ? 'text-[#FF7900]'
                      : 'text-slate-700 dark:text-slate-200 group-hover:text-[#0B4A8A] dark:group-hover:text-cyan-400'
                  }`}
                  title={cat.nameBn}
                >
                  {cat.nameBn}
                </span>

                {/* Compact Count */}
                <span className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                  {toBnNumber(cat.count)}+
                </span>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#FF7900] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
