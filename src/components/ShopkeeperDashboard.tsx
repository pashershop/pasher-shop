import React, { useState } from 'react';
import {
  Store,
  Package,
  TrendingUp,
  Phone,
  Clock,
  MapPin,
  Truck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Settings,
  Upload,
  Image as ImageIcon,
  Check,
  Star,
  Users,
  Search,
  Power,
  Edit2,
  Save,
  MessageSquare,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Shop, ProductItem, ShopInquiry } from '../types';
import { CATEGORIES } from '../data/mockData';
import { toBnNumber } from '../utils/geoUtils';

interface ShopkeeperDashboardProps {
  shop: Shop | null;
  onUpdateShop: (updatedShop: Shop) => void;
  onOpenCustomerPreview: (shop: Shop) => void;
  onBackToHome: () => void;
  onOpenAddShop: () => void;
  onSelectDemoShop?: () => void;
}

// Preset banner images for banner updater
const DASHBOARD_BANNER_PRESETS = [
  {
    id: 'grocery',
    label: 'মুদি ও জেনারেল',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pharmacy',
    label: 'ফার্মেসি ও ড্রাগস',
    url: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'bazaar',
    label: 'কাঁচা বাজার ও ফলমূল',
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fashion',
    label: 'পোশাক ও ফ্যাশন',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'electronics',
    label: 'ইলেকট্রনিক্স ও গ্যাজেট',
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
  },
];

// Initial mock customer inquiries / orders for newly loaded dashboard
const INITIAL_INQUIRIES: ShopInquiry[] = [
  {
    id: 'inq-1',
    customerName: 'তানভীর আহমেদ',
    customerPhone: '০১৭১২-৩৪৫৬৭৮',
    items: 'বাসমতি চাল ৫ কেজি, সয়াবিন তেল ২ লিটার',
    totalAmount: 1150,
    timeBn: '১০ মিনিট আগে',
    status: 'নতুন',
    type: 'order',
  },
  {
    id: 'inq-2',
    customerName: 'ফারহানা ইয়াসমিন',
    customerPhone: '০১৯১১-২২৩৩৪৪',
    items: 'দোকান খোলা আছে কিনা ও হোম ডেলিভারি হবে কিনা জানতে চেয়েছিলেন',
    totalAmount: 0,
    timeBn: '৩৫ মিনিট আগে',
    status: 'সম্পন্ন',
    type: 'call',
  },
  {
    id: 'inq-3',
    customerName: 'মোঃ রাশেদুল ইসলাম',
    customerPhone: '০১৮১৮-৭৭৮৮৯৯',
    items: 'মসুর ডাল ১ কেজি, চিনি ২ কেজি, ডিম ১ ডজন',
    totalAmount: 540,
    timeBn: '২ ঘণ্টা আগে',
    status: 'প্রসেসিং',
    type: 'order',
  },
];

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({
  shop,
  onUpdateShop,
  onOpenCustomerPreview,
  onBackToHome,
  onOpenAddShop,
  onSelectDemoShop,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'reviews'>('products');
  
  // Local products state initialized from shop.featuredProducts
  const [products, setProducts] = useState<
    { id: string; nameBn: string; price: number; unit: string; inStock: boolean }[]
  >(
    shop?.featuredProducts.map((p, idx) => ({
      id: `p-${idx + 1}`,
      nameBn: p.nameBn,
      price: p.price,
      unit: 'কেজি/পিস',
      inStock: true,
    })) || []
  );

  // Inquiries / Orders state
  const [inquiries, setInquiries] = useState<ShopInquiry[]>(INITIAL_INQUIRIES);

  // Add Product Form State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('কেজি');
  const [newProductInStock, setNewProductInStock] = useState(true);

  // Settings State
  const [settingsShopName, setSettingsShopName] = useState(shop?.nameBn || '');
  const [settingsPhone, setSettingsPhone] = useState(shop?.phone || '');
  const [settingsAddress, setSettingsAddress] = useState(shop?.addressBn || '');
  const [settingsTiming, setSettingsTiming] = useState(shop?.timingBn || 'সকাল ৮:০০ - রাত ১১:০০');
  const [settingsDelivery, setSettingsDelivery] = useState(shop?.deliveryAvailable ?? true);
  const [settingsMinOrder, setSettingsMinOrder] = useState(shop?.minOrder?.toString() || '৩০০');
  const [settingsBanner, setSettingsBanner] = useState(shop?.bannerImage || shop?.coverImage || DASHBOARD_BANNER_PRESETS[0].url);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // If the user has no shop added yet -> Access Gate view!
  if (!shop) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] dark:bg-[#030712] transition-colors">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900/90 rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 text-[#FF7900] flex items-center justify-center mx-auto shadow-xs">
            <Store className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              দোকানদারদের সংরক্ষিত পেজ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              আপনার কোনো দোকান এখনো যুক্ত নেই!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              দোকানদার ড্যাশবোর্ড কেবল নিবন্ধিত দোকানদারদের জন্য। আপনার দোকানটি যুক্ত করুন অথবা একটি ডেমো দোকান দিয়ে ড্যাশবোর্ড পরীক্ষা করুন।
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={onOpenAddShop}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-[#0B4A8A] hover:bg-[#093a6d] shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 text-[#FF7900]" />
              <span>বিনামূল্যে আপনার দোকান যুক্ত করুন</span>
            </button>

            {onSelectDemoShop && (
              <button
                onClick={onSelectDemoShop}
                className="w-full py-3 px-6 rounded-2xl font-bold text-xs text-[#0B4A8A] dark:text-cyan-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FF7900]" />
                <span>ডেমো দোকান দিয়ে ড্যাশবোর্ড ডেমো দেখুন</span>
              </button>
            )}

            <button
              onClick={onBackToHome}
              className="w-full py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Toggle Shop Open / Close status
  const handleToggleShopOpen = () => {
    const updated = { ...shop, isOpen: !shop.isOpen };
    onUpdateShop(updated);
  };

  // Add Product Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice) return;

    const newPrice = parseFloat(newProductPrice) || 0;
    const newProd = {
      id: `p-${Date.now()}`,
      nameBn: newProductName.trim(),
      price: newPrice,
      unit: newProductUnit,
      inStock: newProductInStock,
    };

    const nextProducts = [newProd, ...products];
    setProducts(nextProducts);

    // Sync to shop's featuredProducts
    const updatedFeatured = nextProducts.map((p) => ({
      nameBn: p.nameBn,
      price: p.price,
    }));
    onUpdateShop({ ...shop, featuredProducts: updatedFeatured });

    // Reset Form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductUnit('কেজি');
    setNewProductInStock(true);
    setIsAddProductModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    const nextProducts = products.filter((p) => p.id !== productId);
    setProducts(nextProducts);
    const updatedFeatured = nextProducts.map((p) => ({
      nameBn: p.nameBn,
      price: p.price,
    }));
    onUpdateShop({ ...shop, featuredProducts: updatedFeatured });
  };

  // Toggle Product Stock
  const handleToggleProductStock = (productId: string) => {
    const nextProducts = products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    setProducts(nextProducts);
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = (id: string, newStatus: ShopInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Shop = {
      ...shop,
      nameBn: settingsShopName,
      phone: settingsPhone,
      addressBn: settingsAddress,
      timingBn: settingsTiming,
      deliveryAvailable: settingsDelivery,
      minOrder: parseInt(settingsMinOrder, 10) || 0,
      bannerImage: settingsBanner,
    };
    onUpdateShop(updated);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      
      {/* 1. Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#0B4A8A] dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer"
                title="মূল ওয়েবসাইটে ফিরুন"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">হোমে ফিরুন</span>
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0B4A8A] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Store className="w-4 h-4 text-[#FF7900]" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight truncate max-w-[180px] sm:max-w-xs">
                    {shop.nameBn}
                  </h1>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    দোকানদার কন্ট্রোল ড্যাশবোর্ড
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Shop Open/Close toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Live Status Switch */}
              <button
                type="button"
                onClick={handleToggleShopOpen}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs border ${
                  shop.isOpen
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                    : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800 hover:bg-red-100'
                }`}
                title="দোকান খোলা বা বন্ধ করার সুইচ"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    shop.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span className="hidden sm:inline">দোকানের অবস্থা:</span>
                <span>{shop.isOpen ? 'খোলা আছে' : 'বর্তমানে বন্ধ'}</span>
              </button>

              {/* View as customer */}
              <button
                type="button"
                onClick={() => onOpenCustomerPreview(shop)}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-[#0B4A8A] dark:text-cyan-400 bg-[#0B4A8A]/10 dark:bg-[#0B4A8A]/30 hover:bg-[#0B4A8A]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="গ্রাহকরা আপনার দোকান যেভাবে দেখতে পান"
              >
                <Eye className="w-3.5 h-3.5 text-[#FF7900]" />
                <span className="hidden md:inline">কাস্টমার ভিউ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* 2. Hero Shop Identity Card with Banner (Full Width) */}
        <div className="w-full relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="h-44 sm:h-56 w-full relative">
            <img
              src={shop.bannerImage || shop.coverImage}
              alt={shop.nameBn}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
            
            <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF7900] text-white">
                    {shop.categoryBn}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
                    {shop.area}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">{shop.nameBn}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF7900]" />
                    {shop.addressBn}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    {shop.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>ব্যানার ও তথ্য পরিবর্তন</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Analytics KPI Summary Cards (Full Width Container) */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Views */}
          <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0B4A8A] dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">আজকের দোকান ভিউ</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {toBnNumber(142)} বার
              </div>
            </div>
          </div>

          {/* Card 2: Calls */}
          <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">সরাসরি কল অনুসন্ধান</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {toBnNumber(18)} টি
              </div>
            </div>
          </div>

          {/* Card 3: Route Checked */}
          <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#FF7900] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">ম্যাপে রুট দেখা হয়েছে</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {toBnNumber(39)} বার
              </div>
            </div>
          </div>

          {/* Card 4: Products count */}
          <div className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">তালিকাভুক্ত পণ্য</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {toBnNumber(products.length)} টি
              </div>
            </div>
          </div>
        </div>

        {/* 4. Tab Navigation Bar (Full Width) */}
        <div className="w-full flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 rounded-2xl p-1.5 shadow-2xs gap-1 sm:gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#0B4A8A] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>পণ্য ব্যবস্থাপনা ({toBnNumber(products.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#0B4A8A] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডার ও অনুসন্ধান ({toBnNumber(inquiries.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#0B4A8A] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>দোকান সেটিংস ও ব্যানার</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#0B4A8A] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>গ্রাহক রিভিউ</span>
          </button>
        </div>

        {/* 5. TAB CONTENT */}

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="w-full space-y-4">
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">আপনার দোকানের পণ্যের তালিকা</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  পণ্য যুক্ত করুন বা দাম আপডেট করুন যাতে আশেপাশের কাস্টমাররা সহজেই আপনার পণ্যের দাম জানতে পারে
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(true)}
                className="py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#FF7900] hover:bg-[#e06b00] shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন পণ্য যুক্ত করুন</span>
              </button>
            </div>

            {/* Products Table Card (Full Width) */}
            <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/60 text-[#FF7900] flex items-center justify-center font-bold text-sm shrink-0">
                        {toBnNumber(idx + 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.nameBn}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>একক: {item.unit}</span>
                          <span>·</span>
                          <span
                            className={`px-2 py-0.2 rounded-md font-semibold text-[10px] ${
                              item.inStock
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                            }`}
                          >
                            {item.inStock ? 'ইন স্টক' : 'স্টক শেষ'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <div className="text-left sm:text-right">
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">নির্ধারিত দাম</div>
                        <div className="text-base font-black text-[#0B4A8A] dark:text-cyan-400">
                          ৳{toBnNumber(item.price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStock(item.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            item.inStock
                              ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                          title="স্টক স্ট্যাটাস পরিবর্তন"
                        >
                          {item.inStock ? 'স্টক শেষ চিহ্নিত করুন' : 'ইন স্টক করুন'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="পণ্যটি মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES & ORDERS */}
        {activeTab === 'orders' && (
          <div className="w-full space-y-4">
            <div className="w-full bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-slate-900 dark:text-white text-base">গ্রাহকের অর্ডার ও সাম্প্রতিক অনুসন্ধান</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                কাস্টমাররা আপনার দোকানে সরাসরি কল বা অর্ডার প্রদান করলে তা এখানে দেখতে পাবেন
              </p>
            </div>

            <div className="w-full space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="w-full bg-white dark:bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          inq.status === 'নতুন'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 animate-pulse'
                            : inq.status === 'প্রসেসিং'
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        ● {inq.status}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{inq.customerName}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">({inq.timeBn})</span>
                    </div>

                    <a
                      href={`tel:${inq.customerPhone.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{inq.customerPhone}</span>
                    </a>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white">অনুরোধ/অর্ডার বিবরণ: </span>
                    <span>{inq.items}</span>
                  </div>

                  {inq.totalAmount > 0 && (
                    <div className="text-xs font-bold text-[#0B4A8A] dark:text-cyan-400">
                      আনুমানিক মূল্য: ৳{toBnNumber(inq.totalAmount)}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {inq.status !== 'সম্পন্ন' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'সম্পন্ন')}
                        className="px-3 py-1.5 rounded-lg bg-[#0B4A8A] text-white text-xs font-bold hover:bg-[#093a6d] transition-colors cursor-pointer"
                      >
                        সম্পন্ন চিহ্নিত করুন
                      </button>
                    )}
                    {inq.status === 'নতুন' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateInquiryStatus(inq.id, 'প্রসেসিং')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        প্রসেসিং হচ্ছে
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SHOP SETTINGS & BANNER */}
        {activeTab === 'settings' && (
          <div className="w-full bg-white dark:bg-slate-900/90 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">দোকানের তথ্য ও ব্যানার সেটিংস</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  আপনার দোকানের ছবি, যোগাযোগের নম্বর এবং সময়সূচি কাস্টমাইজ করুন
                </p>
              </div>

              {showSaveToast && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* 1. Banner Image Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                  দোকানের কভার / ব্যানার ছবি:
                </label>

                {/* Banner Preview */}
                <div className="h-40 sm:h-52 w-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 relative bg-slate-100 dark:bg-slate-800 shadow-inner">
                  <img
                    src={settingsBanner}
                    alt="Current Banner"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-xl backdrop-blur-xs">
                      লাইভ ব্যানার প্রিভিউ
                    </span>
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    রেডিমেড প্রিসেট ব্যানার থেকে বেছে নিন:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {DASHBOARD_BANNER_PRESETS.map((preset) => {
                      const isSelected = settingsBanner === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSettingsBanner(preset.url)}
                          className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#FF7900] ring-2 ring-[#FF7900]/30 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 flex items-center justify-center p-1 text-center">
                            <span className="text-[10px] font-bold text-white leading-tight">
                              {preset.label}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF7900] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Shop Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দোকানের নাম (বাংলায়):
                  </label>
                  <input
                    type="text"
                    value={settingsShopName}
                    onChange={(e) => setSettingsShopName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    যোগাযোগের ফোন নম্বর:
                  </label>
                  <input
                    type="text"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দোকানের পূর্ণ ঠিকানা:
                  </label>
                  <input
                    type="text"
                    value={settingsAddress}
                    onChange={(e) => setSettingsAddress(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    খোলা থাকার সময়সূচি:
                  </label>
                  <input
                    type="text"
                    value={settingsTiming}
                    onChange={(e) => setSettingsTiming(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                  />
                </div>
              </div>

              {/* 3. Delivery Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        হোম ডেলিভারি সুবিধা
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        আপনার দোকান থেকে সরাসরি হোম ডেলিভারি সুবিধা প্রদান করেন কিনা
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsDelivery}
                    onChange={(e) => setSettingsDelivery(e.target.checked)}
                    className="w-5 h-5 accent-[#0B4A8A] rounded cursor-pointer"
                  />
                </div>

                {settingsDelivery && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      ন্যূনতম ডেলিভারি অর্ডার মূল্য (৳):
                    </label>
                    <input
                      type="number"
                      value={settingsMinOrder}
                      onChange={(e) => setSettingsMinOrder(e.target.value)}
                      className="w-28 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0B4A8A] hover:bg-[#093a6d] shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Save className="w-4 h-4 text-[#FF7900]" />
                  <span>সেটিংস ও ব্যানার সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="w-full bg-white dark:bg-slate-900/90 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">গ্রাহকদের রিভিউ ও প্রতিক্রিয়া</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  আপনার দোকানে সেবা গ্রহণকারী কাস্টমারদের মতামত
                </p>
              </div>

              <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 rounded-2xl border border-amber-200 dark:border-amber-800">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <div>
                  <div className="text-base font-black text-slate-900 dark:text-white">{shop.rating} / ৫.০</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                    {toBnNumber(shop.reviewCount)} জন কাস্টমার রেটিং দিয়েছেন
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">রাকিবুল হাসান (ধানমন্ডি)</span>
                  <span className="text-amber-500 font-bold">★★★★★ ৫/৫</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  খুবই দ্রুত হোম ডেলিভারি দিয়েছেন। পণ্যের মান ও দাম দুটোই সেরা ছিল।
                </p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">২ দিন আগে</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">সালমা বেগম</span>
                  <span className="text-amber-500 font-bold">★★★★★ ৫/৫</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  দোকানদার ভাই খুব আন্তরিক। সঠিক দামে তাজা পণ্য পাওয়া যায়।
                </p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">১ সপ্তাহ আগে</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsAddProductModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 text-slate-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-black text-slate-900 dark:text-white text-base">দোকানে নতুন পণ্য যুক্ত করুন</h3>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পণ্যের নাম (যেমন: মিনিকেট চাল):
                </label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="পণ্যের নাম বাংলায় লিখুন"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দাম (৳ টাকা):
                  </label>
                  <input
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="যেমন: ১২০"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    একক (Unit):
                  </label>
                  <select
                    value={newProductUnit}
                    onChange={(e) => setNewProductUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B4A8A]"
                  >
                    <option value="কেজি">কেজি</option>
                    <option value="লিটার">লিটার</option>
                    <option value="পিস">পিস</option>
                    <option value="ডজন">ডজন</option>
                    <option value="গ্রাম">গ্রাম</option>
                    <option value="প্যাকেট">প্যাকেট</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="stockCheck"
                  checked={newProductInStock}
                  onChange={(e) => setNewProductInStock(e.target.checked)}
                  className="w-4 h-4 accent-[#0B4A8A] rounded cursor-pointer"
                />
                <label htmlFor="stockCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  বর্তমানে দোকানে পর্যাপ্ত ইন স্টক আছে
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#0B4A8A] hover:bg-[#093a6d] text-white shadow-xs cursor-pointer"
                >
                  পণ্য যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
