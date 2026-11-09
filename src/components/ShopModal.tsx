import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Star,
  Clock,
  Phone,
  Store,
  Truck,
  MessageSquare,
  Send,
  CheckCircle2,
  User,
} from 'lucide-react';
import { Shop } from '../types';
import {
  calculateDistanceKm,
  formatDistanceBn,
  toBnNumber,
} from '../utils/geoUtils';
import { ShopRouteMap } from './ShopRouteMap';

interface ShopModalProps {
  shop: Shop | null;
  userCoordinates?: { lat: number; lng: number } | null;
  userArea?: string;
  onDetectLocation?: () => void;
  onClose: () => void;
}

interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  dateBn: string;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  shop,
  userCoordinates,
  userArea = 'ধানমন্ডি, ঢাকা',
  onDetectLocation,
  onClose,
}) => {
  if (!shop) return null;

  // Rating & Review Form State
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerComment, setReviewerComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Reviews List for this shop
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem(`pasher_reviews_${shop.id}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Default sample reviews
    return [
      {
        id: 'r1',
        customerName: 'তানভীর আহমেদ',
        rating: 5,
        comment: 'দোকানদারের ব্যবহার খুব ভালো এবং প্রতিটি পণ্যের দাম সঠিক ছিল। চমৎকার সার্ভিস!',
        dateBn: '২ দিন আগে',
      },
      {
        id: 'r2',
        customerName: 'সাদিয়া তাসনিম',
        rating: 5,
        comment: 'ফোন দেওয়ার ১০ মিনিটের মধ্যে ডেলিভারি পেয়েছি। খুব নির্ভরযোগ্য শপ।',
        dateBn: '১ সপ্তাহ আগে',
      },
    ];
  });

  // Calculate live distance
  const hasUserCoords = !!userCoordinates;
  const userLat = userCoordinates?.lat ?? 23.7465;
  const userLng = userCoordinates?.lng ?? 90.3760;

  const liveDistanceKm = hasUserCoords
    ? calculateDistanceKm(userLat, userLng, shop.lat, shop.lng)
    : parseFloat(shop.distance) || 1.2;

  const formattedDistance = formatDistanceBn(liveDistanceKm);

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerComment.trim()) {
      alert('অনুগ্রহ করে রিভিউ বা মন্তব্য লিখুন।');
      return;
    }

    const newRev: CustomerReview = {
      id: `rev_${Date.now()}`,
      customerName: reviewerName.trim() || 'সাধারণ ক্রেতা',
      rating: selectedStars,
      comment: reviewerComment.trim(),
      dateBn: 'এইমাত্র',
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem(`pasher_reviews_${shop.id}`, JSON.stringify(updated));
    } catch (err) {}

    setIsSubmitted(true);
    setReviewerComment('');
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center transition-all focus:outline-none cursor-pointer hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover / Banner Photo */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={shop.bannerImage || shop.coverImage}
            alt={shop.nameBn}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF7900] text-white shadow-xs">
                {shop.categoryBn}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  shop.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                }`}
              >
                {shop.isOpen ? '● এখন খোলা আছে' : '○ বর্তমানে বন্ধ'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white drop-shadow-sm">
              {shop.nameBn}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 mt-2">
              <span className="flex items-center text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300 mr-1" />
                {shop.rating} ({toBnNumber(reviewsList.length + shop.reviewCount)}টি রিভিউ)
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 font-semibold text-white bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <MapPin className="w-3.5 h-3.5 text-[#FF7900]" />
                দূরত্ব: {formattedDistance}
              </span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* 1. In-App Interactive Route & Navigation Map */}
          <ShopRouteMap
            shop={shop}
            userCoordinates={userCoordinates}
            userArea={userArea}
            onDetectLocation={onDetectLocation}
          />

          {/* 2. Key Info Strip */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
            <div className="space-y-1">
              <div className="text-slate-400 font-medium">বর্তমান অবস্থা:</div>
              <div className="flex items-center gap-1.5 font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    shop.isOpen ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                />
                <span className={shop.isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>
                  {shop.isOpen ? 'এখন খোলা আছে' : 'বর্তমানে বন্ধ'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400 font-medium">খোলা থাকার সময়সূচি:</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{shop.timingBn}</span>
              </div>
            </div>
          </div>

          {/* 3. Address & Direct Contact */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-[#0B4A8A] dark:text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">দোকানের ঠিকানা:</span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{shop.addressBn}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0B4A8A]/5 dark:bg-slate-800/80 border border-[#0B4A8A]/15 dark:border-slate-700">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">সরাসরি যোগাযোগের নম্বর</div>
                <div className="text-base font-bold text-[#0B4A8A] dark:text-cyan-400">{shop.phone}</div>
              </div>
              <a
                href={`tel:${shop.phone.replace(/[^0-9]/g, '')}`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>কল করুন</span>
              </a>
            </div>
          </div>

          {/* 4. Featured Products at this shop */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#FF7900]" />
              <span>এই দোকানের জনপ্রিয় পণ্য ও দাম</span>
            </h4>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {shop.featuredProducts.map((p, idx) => (
                <div key={idx} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{p.nameBn}</span>
                  <span className="font-black text-[#0B4A8A] dark:text-cyan-400 tabular-nums text-sm">
                    ৳{toBnNumber(p.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Customer Rating & Review System */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF7900]" />
                <span>দোকানদারকে রেটিং ও মতামত দিন</span>
              </h4>
              <span className="text-xs text-slate-400">
                {reviewsList.length}টি মতামত
              </span>
            </div>

            {/* Success Message Banner */}
            {isSubmitted && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে প্রকাশিত হয়েছে।</span>
              </div>
            )}

            {/* Interactive Rating Form */}
            <form onSubmit={handleSubmitReview} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  রেটিং প্রদান করুন (স্টার চাপুন):
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedStars(star)}
                      onMouseEnter={() => setHoverStars(star)}
                      onMouseLeave={() => setHoverStars(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                      title={`${star} স্টার`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverStars || selectedStars)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-500 ml-2">
                    {hoverStars || selectedStars} / ৫ স্টার
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="আপনার নাম (ঐচ্ছিক)"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#0B4A8A] hover:bg-[#093a6d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>রিভিউ জমা দিন</span>
                </button>
              </div>

              <textarea
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder="এই দোকান সম্পর্কে আপনার অভিজ্ঞতা বা রিভিউ লিখুন (যেমন: সার্ভিস খুব ভালো ছিল)..."
                rows={2}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
              />
            </form>

            {/* Display Reviews List */}
            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                অন্যান্য কাস্টমারদের রিভিউসমূহ:
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0B4A8A]/10 text-[#0B4A8A] dark:text-cyan-400 font-bold flex items-center justify-center text-[10px]">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">{rev.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <div className="text-[10px] text-slate-400 text-right">
                      {rev.dateBn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>এই দোকানে হোম ডেলিভারি সুবিধা প্রযোজ্য (শর্ত সাপেক্ষে)। সরাসরি ফোনে কথা বলে অর্ডার করুন।</span>
          </div>

        </div>
      </div>
    </div>
  );
};
