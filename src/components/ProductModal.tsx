import React from 'react';
import { X, Store, MapPin, Phone, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { ProductItem } from '../types';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onViewShop: (shopId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onViewShop,
}) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-60 w-full bg-slate-100 flex items-center justify-center p-4">
          <img
            src={product.imageUrl}
            alt={product.nameBn}
            className="w-full h-full object-cover rounded-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 border border-slate-200">
            একক: {product.unit}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 space-y-5">
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {product.stockStatus}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">{product.shopArea}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#171717] leading-snug">
              {product.nameBn}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-3xl font-black text-[#0B4A8A] tabular-nums">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  ৳{product.originalPrice}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">প্রতি {product.unit}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              পণ্যের বিবরণ
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.descriptionBn}
            </p>
          </div>

          {/* Seller / Store Card inside */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">বিক্রেতা দোকান:</span>
                <span className="font-bold text-sm text-[#0B4A8A] flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#FF7900]" />
                  <span>{product.shopName}</span>
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onViewShop(product.shopId);
                }}
                className="text-xs font-bold text-[#0B4A8A] hover:underline"
              >
                দোকান প্রোফাইল দেখুন →
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
              <span>অবস্থান: {product.shopArea}</span>
            </div>
          </div>

          {/* Direct Call Button */}
          <div className="pt-2">
            <a
              href="tel:01701123456"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#FF7900] hover:bg-[#e06b00] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>দোকানিতে কল করে স্টক কনফার্ম করুন</span>
            </a>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Pasher Shop একটি ওপেন মার্কেটপ্লেস — ক্রেতা ও দোকানি সরাসরি লেনদেন করেন।
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
