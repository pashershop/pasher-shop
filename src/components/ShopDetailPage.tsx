import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
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
  Share2,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { Shop, ProductItem } from '../types';
import { d1Service } from '../services/d1Service';
import {
  calculateDistanceKm,
  formatDistanceBn,
  toBnNumber,
} from '../utils/geoUtils';
import { ShopRouteMap } from './ShopRouteMap';

interface ShopDetailPageProps {
  shop: Shop;
  userCoordinates?: { lat: number; lng: number } | null;
  userArea?: string;
  allShops?: Shop[];
  onDetectLocation?: () => void;
  onBack: () => void;
  onSelectShop?: (shop: Shop) => void;
}

interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  dateBn: string;
}

export const ShopDetailPage: React.FC<ShopDetailPageProps> = ({
  shop,
  userCoordinates,
  userArea = 'ধানমন্ডি, ঢাকা',
  allShops = [],
  onDetectLocation,
  onBack,
  onSelectShop,
}) => {
  // Rating & Review Form State
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerComment, setReviewerComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Scroll to top when opening & sync reviews from Cloudflare D1
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    d1Service.getReviews(shop.id).then((d1Reviews) => {
      if (d1Reviews && d1Reviews.length > 0) {
        setReviewsList(d1Reviews);
      }
    });
  }, [shop.id]);

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
      id: `rev-${Date.now()}`,
      customerName: reviewerName.trim() || 'সম্মানিত ক্রেতা',
      rating: selectedStars,
      comment: reviewerComment.trim(),
      dateBn: 'এইমাত্র',
    };

    const updated = [newRev, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem(`pasher_reviews_${shop.id}`, JSON.stringify(updated));
    } catch (e) {}

    // Persist to Cloudflare D1 SQL (DB: pasher-shop-db)
    d1Service.submitReview(shop.id, newRev);

    setReviewerComment('');
    setReviewerName('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3500);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    } catch (e) {}
  };

  // Nearby other shops in the same category or area
  const otherShops = allShops
    .filter((s) => s.id !== shop.id)
    .slice(0, 3);

  const averageRating = (
    reviewsList.reduce((acc, r) => acc + r.rating, 0) / (reviewsList.length || 1)
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 pb-28 transition-colors">
      
      {/* 1. Sticky Top Navigation Bar */}
      <div className="sticky top-12 sm:top-14 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
              title="পেছনের তালিকায় ফিরুন"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF7900]" />
              <span>ফিরে যান</span>
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block shrink-0" />

            <div className="truncate">
              <span className="text-xs text-slate-400 hidden md:inline">দোকান বিস্তারিত / </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {shop.nameBn}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Share button */}
            <button
              onClick={handleCopyLink}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="দোকানের লিঙ্ক কপি করুন"
            >
              {copiedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400 font-bold">কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">শেয়ার</span>
                </>
              )}
            </button>

            {/* Direct Call Button (Bright Green) */}
            <a
              href={`tel:${shop.phone.replace(/[^0-9]/g, '')}`}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-md flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>কল দিন ({shop.phone})</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* 2. Full-Width Hero Showcase Card */}
        <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg transition-all">
          
          {/* Banner Image */}
          <div className="relative h-60 sm:h-80 w-full bg-slate-900 overflow-hidden">
            <img
              src={shop.bannerImage || shop.coverImage}
              alt={shop.nameBn}
              className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#FF7900] text-white shadow-md">
                  {shop.categoryBn}
                </span>
                {shop.deliveryAvailable && (
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#0B4A8A]/90 text-white backdrop-blur-md border border-white/20 shadow-md flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-cyan-300" />
                    <span>হোম ডেলিভারি সুবিধা</span>
                  </span>
                )}
              </div>

              {/* Status pill */}
              <div
                className={`px-3 py-1 rounded-xl text-xs font-black shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                  shop.isOpen
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    shop.isOpen ? 'bg-white animate-pulse' : 'bg-red-200'
                  }`}
                />
                <span>{shop.isOpen ? 'এখন খোলা আছে' : 'বর্তমানে বন্ধ'}</span>
              </div>
            </div>

            {/* Bottom Shop Info Overlay */}
            <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <span className="flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-[#FF7900]" />
                    <span>ভেরিফাইড লোকাল শপ</span>
                  </span>
                  <span>·</span>
                  <span>দোকান নং: {shop.id}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-md text-white">
                  {shop.nameBn}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 leading-relaxed drop-shadow-xs">
                  <MapPin className="w-4 h-4 text-[#FF7900] shrink-0" />
                  <span>{shop.addressBn}</span>
                </p>
              </div>

              {/* Rating Box */}
              <div className="bg-white/10 dark:bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0 self-start sm:self-auto">
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span className="text-2xl font-black text-white">{averageRating}</span>
                </div>
                <span className="text-[11px] text-slate-300 font-medium block mt-0.5">
                  ({toBnNumber(reviewsList.length)} জন ক্রেতার রিভিউ)
                </span>
              </div>
            </div>
          </div>

          {/* Key Facts Strip (Full Width) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="px-3 py-1 space-y-0.5">
              <span className="text-slate-400 block font-medium">আপনার থেকে দূরত্ব:</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-[#FF7900]" />
                {formattedDistance}
              </span>
            </div>

            <div className="px-3 py-1 space-y-0.5">
              <span className="text-slate-400 block font-medium">দোকানের সময়সূচী:</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {shop.timingBn}
              </span>
            </div>

            <div className="px-3 py-1 space-y-0.5">
              <span className="text-slate-400 block font-medium">ন্যূনতম অর্ডার:</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm text-emerald-600 dark:text-emerald-400">
                {shop.minOrder ? `৳${toBnNumber(shop.minOrder)}` : 'যেকোনো পরিমাণ'}
              </span>
            </div>

            <div className="px-3 py-1 space-y-0.5">
              <span className="text-slate-400 block font-medium">মোবাইল নম্বর:</span>
              <a
                href={`tel:${shop.phone.replace(/[^0-9]/g, '')}`}
                className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm hover:underline"
              >
                {shop.phone}
              </a>
            </div>
          </div>

        </div>

        {/* 3. Main Content Grid (Full Width Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          
          {/* Left Column (8 cols): Route Map, Products & Reviews */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* A. Live Interactive Route & Google Navigation Map */}
            <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B4A8A]/10 text-[#0B4A8A] dark:text-cyan-400 flex items-center justify-center font-bold">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      দোকানে পৌঁছানোর রিয়েল ম্যাপ ও নেভিগেশন
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      আপনার বর্তমান অবস্থান থেকে {shop.nameBn}-এ যাওয়ার রাস্তা ও সময়
                    </p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${shop.lat},${shop.lng}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B4A8A] text-white text-xs font-bold hover:bg-[#093a6d] transition-colors cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Maps অ্যাপে খুলুন</span>
                </a>
              </div>

              {/* Embedded Route Map Component */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <ShopRouteMap
                  shop={shop}
                  userCoordinates={userCoordinates}
                  onDetectLocation={onDetectLocation}
                />
              </div>
            </div>

            {/* B. Featured Products Showcase Card */}
            <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      দোকানের উল্লেখযোগ্য পণ্যসমূহ
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      সরাসরি দোকানে কল দিয়ে পণ্য বুক বা অর্ডার করুন
                    </p>
                  </div>
                </div>
              </div>

              {shop.featuredProducts && shop.featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {shop.featuredProducts.map((prod, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between hover:border-[#FF7900]/50 transition-all group"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#FF7900] uppercase tracking-wider block">
                          পণ্য #{toBnNumber(idx + 1)}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                          {prod.nameBn}
                        </h3>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">মূল্য:</span>
                          <span className="text-base font-black text-[#0B4A8A] dark:text-cyan-400">
                            ৳{toBnNumber(prod.price)}
                          </span>
                        </div>

                        <a
                          href={`tel:${shop.phone.replace(/[^0-9]/g, '')}`}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>অর্ডার</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  বর্তমানে এই দোকানের পণ্য তালিকা আপডেট করা হচ্ছে। সরাসরি কল করে যে কোনো পণ্য জানতে পারেন।
                </div>
              )}
            </div>

            {/* C. Customer Reviews & Interactive Rating System */}
            <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      ক্রেতাদের রিভিউ ও রেটিং ({toBnNumber(reviewsList.length)}টি)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      দোকানের সেবার মান ও সততা সম্পর্কে নিজের মতামত জানান
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-extrabold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>গড় রেটিং: {averageRating} / ৫.০</span>
                </div>
              </div>

              {/* Interactive Review Submission Form */}
              <form onSubmit={handleSubmitReview} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    দোকানদারকে স্টার রেটিং দিন:
                  </span>
                  
                  {/* Star selector */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        title={`${star} স্টার`}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverStars || selectedStars) >= star
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 ml-2">
                      {selectedStars} স্টার
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      আপনার নাম (ঐচ্ছিক):
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="যেমন: মো. আরিফুর রহমান"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF7900]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      রিভিউ ও মতামত লিখুন <span className="text-red-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      placeholder="দোকানটির সেবা, ব্যবহার ও পণ্যের দাম কেমন লাগলো?"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF7900]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {isSubmitted && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      আপনার মূল্যবান রিভিউ সফলভাবে যুক্ত হয়েছে!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="ml-auto px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B4A8A] hover:bg-[#093a6d] shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-[#FF7900]" />
                    <span>রিভিউ পোস্ট করুন</span>
                  </button>
                </div>
              </form>

              {/* Review History Cards */}
              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#0B4A8A]/10 text-[#0B4A8A] dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                          {rev.customerName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rev.customerName}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                          ভেরিফাইড ক্রেতা
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-9">
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

          {/* Right Column (4 cols): Merchant Info, Trust Guarantee & Nearby Shops */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Merchant Info Card */}
            <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0B4A8A] to-[#FF7900] text-white flex items-center justify-center font-black text-lg shadow-md">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">দোকান স্বত্বাধিকারী</span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {shop.ownerName || 'স্বত্বাধিকারী'}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>এনআইডি ও লাইসেন্স ভেরিফাইড</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">হেল্পলাইন/কল:</span>
                  <a href={`tel:${shop.phone}`} className="font-bold text-emerald-600 hover:underline">
                    {shop.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">অবস্থান এলাকা:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{shop.area}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">দোকানি নির্ধারিত (০-৩০ টাকা)</span>
                </div>
              </div>

              <a
                href={`tel:${shop.phone.replace(/[^0-9]/g, '')}`}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>সরাসরি কল দিয়ে কথা বলুন</span>
              </a>
            </div>

            {/* Local Trust Guarantee Card */}
            <div className="w-full bg-gradient-to-br from-[#0B4A8A]/5 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 rounded-3xl border border-[#0B4A8A]/20 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <span className="text-xs font-bold text-[#0B4A8A] dark:text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF7900]" />
                Pasher Shop লোকাল শপিং গ্যারান্টি
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>কোনো মধ্যস্বত্বভোগী বা হিডেন চার্জ নেই — সরাসরি পাশের দোকান থেকে কেনাকাটা।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>পণ্য হাতে পেয়ে দেখে শুনে মূল্য পরিশোধের সুবিধা।</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>দরদাম যাচাই ও পাড়ার বিশ্বস্ত সম্পর্ক বজায় রাখার আধুনিক মাধ্যম।</span>
                </li>
              </ul>
            </div>

            {/* Nearby Other Shops in Area */}
            {otherShops.length > 0 && (
              <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-md space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    কাছের অন্যান্য দোকান
                  </h3>
                  <span className="text-[11px] text-[#FF7900] font-bold">একই এলাকা</span>
                </div>

                <div className="space-y-2.5">
                  {otherShops.map((other) => (
                    <button
                      key={other.id}
                      onClick={() => onSelectShop ? onSelectShop(other) : null}
                      className="w-full p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-[#FF7900]/40 transition-all flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <img
                        src={other.coverImage}
                        alt={other.nameBn}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-[#FF7900] transition-colors">
                          {other.nameBn}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {other.categoryBn} · {other.distance}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
