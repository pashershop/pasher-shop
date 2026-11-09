import React from 'react';
import { Store, MapPin, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProductItem } from '../types';

interface FeaturedProductsSectionProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onSelectShopById: (shopId: string) => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  onSelectProduct,
  onSelectShopById,
}) => {
  return (
    <section id="featured-products" className="py-12 sm:py-16 bg-[#F8FAFC] dark:bg-[#030712] border-b border-[#E5E7EB] dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E5E7EB] dark:border-slate-800 gap-2">
          <div>
            <div className="text-xs font-bold text-[#FF7900] tracking-wider uppercase mb-1">
              সেরা ডিল ও নিত্যপ্রয়োজনীয়
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] dark:text-white tracking-tight">
              জনপ্রিয় পণ্য
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              কাছের দোকানগুলোর তাজা ও আসল পণ্যের বর্তমান দাম দেখুন।
            </p>
          </div>

          <div className="text-xs text-slate-400 dark:text-slate-500 font-medium self-start sm:self-end">
            * দাম ও স্টক স্বত্বাধিকারী দোকানদার কর্তৃক নির্ধারিত
          </div>
        </div>

        {/* Product Grid / Empty State */}
        {products.length === 0 ? (
          <div className="bg-white dark:bg-[#090D16] border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center mx-auto mb-4">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
              বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              কাছের দোকানদাররা তাদের দোকানে পণ্য ও মূল্য যুক্ত করলে এখানে সরাসরি তাজা ও আসল পণ্যের তালিকা দেখতে পাবেন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#090D16] rounded-2xl border border-[#E5E7EB] dark:border-slate-800/90 hover:border-[#FF7900]/40 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative h-48 w-full bg-slate-50 dark:bg-slate-900 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={product.imageUrl}
                    alt={product.nameBn}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-103 transition-transform duration-300 opacity-95"
                    referrerPolicy="no-referrer"
                  />

                  {/* Stock Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs backdrop-blur-xs ${
                        product.stockStatus === 'ইন স্টক'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {product.stockStatus === 'ইন স্টক' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      )}
                      <span>{product.stockStatus}</span>
                    </span>
                  </div>

                  {/* Unit Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-700 dark:text-slate-300 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-xs">
                    {product.unit}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Shop Details Affiliation */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <button
                        onClick={() => onSelectShopById(product.shopId)}
                        className="inline-flex items-center gap-1 font-semibold text-[#0B4A8A] dark:text-cyan-400 hover:underline"
                      >
                        <Store className="w-3.5 h-3.5 text-[#0B4A8A] dark:text-cyan-400" />
                        <span className="truncate max-w-[150px]">{product.shopName}</span>
                      </button>
                      <span className="inline-flex items-center gap-0.5 text-slate-400">
                        <MapPin className="w-3 h-3 text-[#FF7900]" />
                        <span>{product.shopArea}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-[#171717] dark:text-white group-hover:text-[#FF7900] transition-colors leading-snug">
                      {product.nameBn}
                    </h3>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-2xl font-extrabold text-[#0B4A8A] dark:text-cyan-400 tabular-nums">
                        ৳{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          ৳{product.originalPrice}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ {product.unit}</span>
                    </div>
                  </div>

                  {/* View Details Action Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="w-full py-2.5 px-4 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-[#FF7900] dark:hover:bg-[#FF7900] hover:text-white transition-all duration-150 flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <Eye className="w-4 h-4" />
                      <span>বিস্তারিত দেখুন</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
