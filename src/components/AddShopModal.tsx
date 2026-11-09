import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Store,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  Image as ImageIcon,
  Upload,
  Check,
  Navigation,
  Loader2,
} from 'lucide-react';
import { Shop } from '../types';
import { CATEGORIES } from '../data/mockData';
import { getRealLocationAddress, findNearestLocation } from '../utils/geoUtils';

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopCreated?: (shop: Shop) => void;
  onGoToDashboard?: (shop: Shop) => void;
}

// Preset banner images for quick selection
const BANNER_PRESETS = [
  {
    id: 'grocery',
    label: 'মুদি ও ডিপার্টমেন্টাল',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'pharmacy',
    label: 'ফার্মেসি ও ড্রাগস',
    url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'bazaar',
    label: 'কাঁচা বাজার ও ফলমূল',
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'fashion',
    label: 'পোশাক ও ফ্যাশন',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'electronics',
    label: 'ইলেকট্রনিক্স ও গ্যাজেট',
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80',
  },
];

export const AddShopModal: React.FC<AddShopModalProps> = ({
  isOpen,
  onClose,
  onShopCreated,
  onGoToDashboard,
}) => {
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);

  // Automatic Real GPS Location State (No manual dropdowns!)
  const [realLocationAddress, setRealLocationAddress] = useState<string>('রিয়েল লোকেশন খোঁজা হচ্ছে...');
  const [shopCoords, setShopCoords] = useState<{ lat: number; lng: number }>({
    lat: 23.7465,
    lng: 90.3760,
  });
  const [isLocatingShop, setIsLocatingShop] = useState<boolean>(false);
  const [isGpsCaptured, setIsGpsCaptured] = useState<boolean>(false);

  const [addressDetail, setAddressDetail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');

  // Shop Banner Image State
  const [bannerUrl, setBannerUrl] = useState<string>(BANNER_PRESETS[0].url);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdShop, setCreatedShop] = useState<Shop | null>(null);

  // Auto detect shopkeeper real location when modal opens
  const detectShopRealLocation = () => {
    if (!navigator.geolocation) {
      setRealLocationAddress('ঢাকা সদর');
      return;
    }
    setIsLocatingShop(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setShopCoords(coords);
        setIsGpsCaptured(true);
        setIsLocatingShop(false);

        try {
          const address = await getRealLocationAddress(coords.lat, coords.lng);
          setRealLocationAddress(address || 'স্বয়ংক্রিয় জিপিএস অবস্থান');
        } catch {
          const match = findNearestLocation(coords.lat, coords.lng);
          setRealLocationAddress(match.nearestAreaName);
        }
      },
      (err) => {
        setIsLocatingShop(false);
        setRealLocationAddress('ঢাকা, বাংলাদেশ');
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isOpen) {
      detectShopRealLocation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !phone) return;

    const categoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
    const newShop: Shop = {
      id: `shop-${Date.now()}`,
      nameBn: shopName.trim(),
      categoryBn: categoryObj.nameBn,
      categoryId: category,
      addressBn: addressDetail.trim() ? `${addressDetail.trim()}, ${realLocationAddress}` : realLocationAddress,
      area: realLocationAddress,
      distance: '০.১ কি.মি.',
      rating: 5.0,
      reviewCount: 1,
      isOpen: true,
      timingBn: 'সকাল ৮:০০ - রাত ১১:০০',
      phone: phone.trim(),
      coverImage: bannerUrl,
      bannerImage: bannerUrl,
      deliveryAvailable: true,
      minOrder: 250,
      lat: shopCoords.lat,
      lng: shopCoords.lng,
      ownerName: ownerName.trim() || 'দোকান স্বত্বাধিকারী',
      ownerPhone: phone.trim(),
      isOwner: true,
      featuredProducts: [
        { nameBn: 'বিশেষ অফার পণ্য ১', price: 120 },
        { nameBn: 'জনপ্রিয় পণ্য ২', price: 250 },
      ],
    };

    setCreatedShop(newShop);
    if (onShopCreated) {
      onShopCreated(newShop);
    }
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setShopName('');
    setAddressDetail('');
    setPhone('');
    setOwnerName('');
    setBannerUrl(BANNER_PRESETS[0].url);
    setCreatedShop(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white dark:bg-[#0A0E17] text-slate-900 dark:text-slate-100 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              অভিনন্দন! আপনার আবেদন সফল হয়েছে
            </h3>

            {/* Banner preview in success card */}
            {bannerUrl && (
              <div className="h-28 w-full max-w-md mx-auto rounded-xl overflow-hidden relative shadow-sm border border-slate-200 dark:border-slate-700">
                <img src={bannerUrl} alt="Shop banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-base px-3 py-1 bg-black/60 rounded-lg">
                    {shopName}
                  </span>
                </div>
              </div>
            )}

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              <span className="font-bold text-[#0B4A8A] dark:text-cyan-400">"{shopName}"</span> দোকানটির রিয়েল জিপিএস লোকেশন ও ছবি সফলভাবে সংরক্ষিত হয়েছে।
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-1.5 max-w-md mx-auto">
              <div className="text-slate-500 dark:text-slate-400 font-semibold">নিবন্ধনের সংক্ষিপ্ত বিবরণ:</div>
              <div>• ক্যাটাগরি: <span className="font-bold">{CATEGORIES.find(c => c.id === category)?.nameBn}</span></div>
              <div>• রিয়েল লোকেশন (GPS): <span className="font-bold text-emerald-600 dark:text-emerald-400">{realLocationAddress}</span></div>
              <div>• বিস্তারিত ঠিকানা: <span className="font-bold">{addressDetail || 'জিপিএস ঠিকানা'}</span></div>
              <div>• মালিকের নাম: <span className="font-bold">{ownerName || 'নাম্বার ভিত্তিক'}</span></div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {onGoToDashboard && createdShop && (
                <button
                  type="button"
                  onClick={() => {
                    const target = createdShop;
                    handleResetAndClose();
                    onGoToDashboard(target);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#FF7900] hover:bg-[#e06b00] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Store className="w-4 h-4" />
                  <span>সরাসরি আপনার দোকান ড্যাশবোর্ডে যান</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                মূল সাইটে ফিরুন
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center shrink-0">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  আপনার দোকান যুক্ত করুন
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  অটোমেটিক রিয়েল লোকেশন ও ফটো সহ ১ মিনিটে দোকান রেজিস্টার করুন
                </p>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Shop Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  দোকানের নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="যেমন: ভাই ভাই জেনারেল স্টোর / সিমেক্স ফার্মেসি"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF7900]"
                  />
                </div>
              </div>

              {/* Shop Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  দোকানের ধরন / ক্যাটাগরি <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF7900] cursor-pointer"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameBn} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* AUTOMATIC REAL LOCATION GPS SECTION (NO MANUAL DROPDOWNS!) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                    <Navigation className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isLocatingShop ? 'animate-spin' : ''}`} />
                    <span>অটোমেটিক রিয়েল জিপিএস লোকেশন (Real Location)</span>
                  </div>
                  <button
                    type="button"
                    onClick={detectShopRealLocation}
                    disabled={isLocatingShop}
                    className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isLocatingShop ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                    <span>রিফ্রেশ জিপিএস</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2 text-xs">
                  <MapPin className="w-4 h-4 text-[#FF7900] shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-400 block font-medium">শনাক্তকৃত দোকানের সঠিক অবস্থান:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs">{realLocationAddress}</span>
                  </div>
                  {isGpsCaptured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
                      ✓ GPS ঠিক
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  * ম্যানুয়াল জেলা/উপজেলা সিলেক্ট করার প্রয়োজন নেই। ডিভাইস জিপিএস থেকে দোকানদারের সঠিক লোকেশন পিন পয়েন্ট করা হয়েছে।
                </p>
              </div>

              {/* Full Address details */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রাস্তা / বাড়ি নং / দোকান নম্বর (বিস্তারিত ঠিকানা)
                </label>
                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="যেমন: দোকান নং ১২, সুপার মার্কেট রোড"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF7900]"
                />
              </div>

              {/* Banner Image Upload / Selection */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <ImageIcon className="w-4 h-4 text-[#FF7900]" />
                    <span>দোকানের ব্যানার বা কভার ছবি (Shop Banner)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">প্রোফাইলে দেখাবে</span>
                </div>

                {/* Banner Preview */}
                {bannerUrl && (
                  <div className="relative h-28 sm:h-32 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xs group">
                    <img
                      src={bannerUrl}
                      alt="Banner Preview"
                      className="w-full h-full object-cover opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                      <div className="text-white">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF7900] bg-black/40 px-1.5 py-0.5 rounded">
                          ব্যানার প্রিভিউ
                        </span>
                        <div className="font-extrabold text-sm drop-shadow-sm truncate max-w-[280px]">
                          {shopName || 'আপনার দোকানের নাম'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload or Choose from presets */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-bold text-[#0B4A8A] dark:text-cyan-400 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#FF7900]" />
                      <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                    </button>
                  </div>

                  {/* Preset Banner Selector */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                      অথবা তৈরি করা ব্যানার থেকে নির্বাচন করুন:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {BANNER_PRESETS.map((preset) => {
                        const isChosen = bannerUrl === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setBannerUrl(preset.url)}
                            className={`relative h-12 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                              isChosen
                                ? 'ring-2 ring-[#FF7900] border-transparent scale-102 shadow-xs'
                                : 'border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                            }`}
                            title={preset.label}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                            />
                            {isChosen && (
                              <div className="absolute inset-0 bg-[#FF7900]/40 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner details in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মালিক / প্রতিনিধির নাম
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="যেমন: মো. রফিকুল ইসলাম"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF7900]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="০১XXXXXXXXX"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF7900]"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#0B4A8A] hover:bg-[#093a6d] shadow-sm transition-colors flex items-center justify-center gap-2 group cursor-pointer"
                >
                  দোকান তালিকাভুক্ত করার জন্য আবেদন করুন
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[11px] text-slate-400 text-center mt-2.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  আপনার তথ্য সম্পূর্ণ নিরাপদ রাখা হবে। কোনো হিডেন চার্জ নেই।
                </p>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};
