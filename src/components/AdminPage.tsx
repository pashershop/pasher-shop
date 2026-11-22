import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Search,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Lock,
  Menu,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  adminService,
  AdminOverviewData,
  AdminProfile,
} from '../services/d1Service';

interface AdminPageProps {
  onExitToSite: () => void;
  onDataChanged?: () => void;
}

type AdminTab = 'overview' | 'shops' | 'products' | 'users' | 'reviews';

export const AdminPage: React.FC<AdminPageProps> = ({
  onExitToSite,
  onDataChanged,
}) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [passwordConfigured, setPasswordConfigured] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  // Password-only auth form state
  const [passwordInput, setPasswordInput] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  // Console state
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);

  // Filters & inline confirm delete key
  const [searchTerm, setSearchTerm] = useState('');
  const [shopFilter, setShopFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [productFilter, setProductFilter] = useState<'all' | 'instock' | 'outofstock'>('all');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'merchant' | 'admin'>('all');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const loadOverview = useCallback(async () => {
    setLoadingData(true);
    setDataError('');
    const res = await adminService.getOverview();
    setLoadingData(false);
    if (res.success && res.data) {
      setOverview(res.data);
    } else {
      setDataError(res.error || 'অ্যাডমিন ডেটা লোড করতে ব্যর্থ হয়েছে');
      if (res.error?.includes('অননুমোদিত')) {
        setAuthenticated(false);
        setAdminProfile(null);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    adminService
      .getStatus()
      .then((status) => {
        if (!mounted) return;
        setApiAvailable(status.apiAvailable);
        setPasswordConfigured(status.passwordConfigured);
        setAuthenticated(status.authenticated);
        setAdminProfile(status.admin);
        if (status.error) {
          setAuthError(status.error);
        }
        setCheckingAuth(false);
        if (status.authenticated) {
          loadOverview();
        }
      })
      .catch(() => {
        if (!mounted) return;
        setApiAvailable(false);
        setCheckingAuth(false);
      });
    return () => {
      mounted = false;
    };
  }, [loadOverview]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    const res = await adminService.loginAdmin(passwordInput);
    setAuthSubmitting(false);
    if (res.success && res.admin) {
      setAuthenticated(true);
      setAdminProfile(res.admin);
      setPasswordInput('');
      loadOverview();
    } else {
      setAuthError(res.error || 'অ্যাডমিন পাসওয়ার্ড সঠিক নয়');
    }
  };

  const handleLogout = async () => {
    await adminService.logout();
    setAuthenticated(false);
    setAdminProfile(null);
    setOverview(null);
    setPasswordInput('');
  };

  const handleToggleShopOpen = async (shopId: string, currentOpen: boolean) => {
    setBusyKey(`shop-toggle-${shopId}`);
    const ok = await adminService.updateShop(shopId, { isOpen: !currentOpen });
    setBusyKey(null);
    if (ok) {
      showNotice(!currentOpen ? 'দোকানটি খোলা হিসেবে আপডেট হয়েছে' : 'দোকানটি বন্ধ হিসেবে আপডেট হয়েছে');
      await loadOverview();
      onDataChanged?.();
    }
  };

  const handleDeleteShop = async (shopId: string) => {
    setBusyKey(`shop-del-${shopId}`);
    const ok = await adminService.deleteShop(shopId);
    setBusyKey(null);
    setConfirmDeleteKey(null);
    if (ok) {
      showNotice('দোকান এবং সংশ্লিষ্ট পণ্যসমূহ মুছে ফেলা হয়েছে');
      await loadOverview();
      onDataChanged?.();
    }
  };

  const handleToggleProductStock = async (prodId: string, currentInStock: boolean) => {
    setBusyKey(`prod-toggle-${prodId}`);
    const ok = await adminService.updateProduct(prodId, { inStock: !currentInStock });
    setBusyKey(null);
    if (ok) {
      showNotice(!currentInStock ? 'পণ্যটি ইন-স্টক করা হয়েছে' : 'পণ্যটি স্টক শেষ করা হয়েছে');
      await loadOverview();
      onDataChanged?.();
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    setBusyKey(`prod-del-${prodId}`);
    const ok = await adminService.deleteProduct(prodId);
    setBusyKey(null);
    setConfirmDeleteKey(null);
    if (ok) {
      showNotice('পণ্যটি মুছে ফেলা হয়েছে');
      await loadOverview();
      onDataChanged?.();
    }
  };

  const handleChangeUserRole = async (userId: string, newRole: 'customer' | 'merchant') => {
    setBusyKey(`user-role-${userId}`);
    const ok = await adminService.updateUserRole(userId, newRole);
    setBusyKey(null);
    if (ok) {
      showNotice('ব্যবহারকারীর ভূমিকা পরিবর্তন করা হয়েছে');
      await loadOverview();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setBusyKey(`user-del-${userId}`);
    const ok = await adminService.deleteUser(userId);
    setBusyKey(null);
    setConfirmDeleteKey(null);
    if (ok) {
      showNotice('ব্যবহারকারীর অ্যাকাউন্ট মুছে ফেলা হয়েছে');
      await loadOverview();
    }
  };

  const handleDeleteReview = async (shopId: string, reviewId: string) => {
    setBusyKey(`rev-del-${reviewId}`);
    const ok = await adminService.deleteReview(shopId, reviewId);
    setBusyKey(null);
    setConfirmDeleteKey(null);
    if (ok) {
      showNotice('রিভিউটি মুছে ফেলা হয়েছে');
      await loadOverview();
      onDataChanged?.();
    }
  };

  const filteredShops = useMemo(() => {
    const list = overview?.shops || [];
    const q = searchTerm.trim().toLowerCase();
    return list.filter((s) => {
      if (shopFilter === 'open' && !s.isOpen) return false;
      if (shopFilter === 'closed' && s.isOpen) return false;
      if (!q) return true;
      return (
        s.nameBn?.toLowerCase().includes(q) ||
        s.area?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q) ||
        s.categoryBn?.toLowerCase().includes(q)
      );
    });
  }, [overview?.shops, searchTerm, shopFilter]);

  const filteredProducts = useMemo(() => {
    const list = overview?.products || [];
    const q = searchTerm.trim().toLowerCase();
    return list.filter((p) => {
      const inStock = p.inStock !== false && p.isAvailable !== false;
      if (productFilter === 'instock' && !inStock) return false;
      if (productFilter === 'outofstock' && inStock) return false;
      if (!q) return true;
      return (
        p.nameBn?.toLowerCase().includes(q) ||
        p.shopName?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });
  }, [overview?.products, searchTerm, productFilter]);

  const filteredUsers = useMemo(() => {
    const list = overview?.users || [];
    const q = searchTerm.trim().toLowerCase();
    return list.filter((u) => {
      if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
      if (!q) return true;
      return (
        u.name?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
      );
    });
  }, [overview?.users, searchTerm, userRoleFilter]);

  const filteredReviews = useMemo(() => {
    const list = overview?.reviews || [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.customerName?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        r.shopName?.toLowerCase().includes(q)
    );
  }, [overview?.reviews, searchTerm]);

  const tabMeta: Record<AdminTab, { label: string; icon: React.ReactNode }> = {
    overview: { label: 'ওভারভিউ', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    shops: { label: 'দোকানসমূহ', icon: <Store className="w-4 h-4 shrink-0" /> },
    products: { label: 'পণ্যসমূহ', icon: <Package className="w-4 h-4 shrink-0" /> },
    users: { label: 'ব্যবহারকারী', icon: <Users className="w-4 h-4 shrink-0" /> },
    reviews: { label: 'রিভিউ ও মতামত', icon: <MessageSquare className="w-4 h-4 shrink-0" /> },
  };

  // Loading gate
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-700">
        <div className="bg-white border border-slate-200 rounded-xl px-6 py-5 text-sm font-medium">
          অ্যাডমিন প্যানেল যাচাই করা হচ্ছে...
        </div>
      </div>
    );
  }

  // Setup or Login Gate
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 text-slate-900">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#0B4A8A]" />
                <span>Pasher Shop · সংরক্ষিত এলাকা</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                অ্যাডমিন কনসোল লগইন
              </h1>
            </div>
            <button
              type="button"
              onClick={onExitToSite}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>সাইটে ফিরুন</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ওয়েবসাইটের দোকান, পণ্য, ব্যবহারকারী ও রিভিউ পরিচালনা করতে আপনার নির্ধারিত অ্যাডমিন পাসওয়ার্ড (<code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code>) দিন।
          </p>

          {apiAvailable && !passwordConfigured && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                সার্ভারে এখনো <strong className="font-mono">ADMIN_PASSWORD</strong> সিক্রেট সেট করা হয়নি। Cloudflare Worker-এ <strong>Variables &amp; Secrets</strong>-এ <code className="font-mono">ADMIN_PASSWORD</code> যুক্ত করুন।
              </span>
            </div>
          )}

          {authError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                অ্যাডমিন পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="ADMIN_PASSWORD লিখুন"
                  autoFocus
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-900 focus:border-[#0B4A8A] focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full rounded-lg bg-[#0B4A8A] hover:bg-[#093a6d] disabled:opacity-60 text-white text-sm font-semibold py-2.5 px-4 transition-colors cursor-pointer"
            >
              {authSubmitting ? 'যাচাই করা হচ্ছে...' : 'অ্যাডমিন প্যানেলে প্রবেশ করুন'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 bg-white border-r border-slate-200">
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#0B4A8A] truncate">Pasher Shop Admin</div>
            <div className="text-xs text-slate-500 truncate">
              {adminProfile?.name || 'Administrator'}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {(Object.keys(tabMeta) as AdminTab[]).map((tabKey) => {
            const active = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => {
                  setActiveTab(tabKey);
                  setSearchTerm('');
                  setConfirmDeleteKey(null);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#0B4A8A] text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tabMeta[tabKey].icon}
                <span>{tabMeta[tabKey].label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-1">
          <button
            type="button"
            onClick={onExitToSite}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>মূল ওয়েবসাইটে ফিরুন</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-white border-r border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold text-[#0B4A8A]">Pasher Shop Admin</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {(Object.keys(tabMeta) as AdminTab[]).map((tabKey) => {
                const active = activeTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    type="button"
                    onClick={() => {
                      setActiveTab(tabKey);
                      setSearchTerm('');
                      setConfirmDeleteKey(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                      active
                        ? 'bg-[#0B4A8A] text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tabMeta[tabKey].icon}
                    <span>{tabMeta[tabKey].label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-slate-200 space-y-1">
              <button
                type="button"
                onClick={onExitToSite}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>মূল ওয়েবসাইটে ফিরুন</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (Breadcrumb left, 1-2 actions right) */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 truncate">
              <span className="font-semibold text-slate-900">Pasher Shop</span>
              <span aria-hidden="true">/</span>
              <span>Admin</span>
              <span aria-hidden="true">/</span>
              <span className="text-[#0B4A8A] font-semibold truncate">
                {tabMeta[activeTab].label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={loadOverview}
              disabled={loadingData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
            <button
              type="button"
              onClick={onExitToSite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B4A8A] hover:bg-[#093a6d] text-white text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">সাইটে ফিরুন</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl w-full mx-auto">
          {actionNotice && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs sm:text-sm text-emerald-800">
              <Check className="w-4 h-4 shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {dataError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs sm:text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{dataError}</span>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    প্ল্যাটফর্ম ওভারভিউ
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ডেটাবেস মোড:{' '}
                    {overview?.dbMode === 'cloudflare_d1_api' || overview?.dbMode === 'cloudflare_d1_worker'
                      ? 'Cloudflare D1 Cloud'
                      : 'লোকাল পারসিসটেন্ট D1'}{' '}
                    · অ্যাডমিন: {adminProfile?.name}
                  </p>
                </div>
              </div>

              {/* 4-column Stats Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                  <div className="text-xs font-medium text-slate-500">মোট নিবন্ধিত দোকান</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {overview?.stats.totalShops ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    খোলা: {overview?.stats.openShops ?? 0}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                  <div className="text-xs font-medium text-slate-500">মোট পণ্য তালিকা</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {overview?.stats.totalProducts ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    ইন-স্টক: {overview?.stats.inStockProducts ?? 0}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                  <div className="text-xs font-medium text-slate-500">নিবন্ধিত ব্যবহারকারী</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {overview?.stats.totalUsers ?? 0}
                  </div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    দোকানদার: {overview?.stats.merchantCount ?? 0}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                  <div className="text-xs font-medium text-slate-500">গ্রাহক রিভিউ</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {overview?.stats.totalReviews ?? 0}
                  </div>
                  <div className="text-xs text-slate-500">সক্রিয় মতামত</div>
                </div>
              </div>

              {/* Recent Shops Summary Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold text-slate-900">সাম্প্রতিক দোকানসমূহ</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('shops')}
                    className="text-xs font-semibold text-[#0B4A8A] hover:underline cursor-pointer whitespace-nowrap"
                  >
                    সব দোকান দেখুন
                  </button>
                </div>

                {loadingData && !overview ? (
                  <div className="p-6 text-xs text-slate-500">ডেটা লোড হচ্ছে...</div>
                ) : (overview?.shops.length ?? 0) === 0 ? (
                  <div className="p-6 text-xs sm:text-sm text-slate-500">
                    এখনো কোনো দোকান নিবন্ধিত হয়নি। ব্যবহারকারীরা ওয়েবসাইটে দোকান যুক্ত করলে এখানে তালিকা দেখাবে।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                          <th className="py-2.5 px-4">দোকানের নাম</th>
                          <th className="py-2.5 px-4">ক্যাটাগরি</th>
                          <th className="py-2.5 px-4">এলাকা</th>
                          <th className="py-2.5 px-4">মোবাইল</th>
                          <th className="py-2.5 px-4 text-right">অবস্থা</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(overview?.shops || []).slice(0, 6).map((shop) => (
                          <tr key={shop.id} className="hover:bg-slate-50/70">
                            <td className="py-2.5 px-4 font-semibold text-slate-900">
                              {shop.nameBn}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">{shop.categoryBn}</td>
                            <td className="py-2.5 px-4 text-slate-600">{shop.area}</td>
                            <td className="py-2.5 px-4 font-mono tabular-nums text-slate-600">
                              {shop.phone}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <span
                                className={`text-xs font-semibold ${
                                  shop.isOpen ? 'text-emerald-700' : 'text-red-600'
                                }`}
                              >
                                {shop.isOpen ? 'খোলা' : 'বন্ধ'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SHOPS TAB */}
          {activeTab === 'shops' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="দোকানের নাম, এলাকা বা ফোন নম্বর খুঁজুন..."
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-[#0B4A8A] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit">
                  {(['all', 'open', 'closed'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setShopFilter(f)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer ${
                        shopFilter === f
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f === 'all' ? 'সবগুলো' : f === 'open' ? 'খোলা' : 'বন্ধ'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {filteredShops.length === 0 ? (
                  <div className="p-8 text-center text-xs sm:text-sm text-slate-500">
                    কোনো দোকান পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                          <th className="py-2.5 px-4">দোকান</th>
                          <th className="py-2.5 px-4">এলাকা ও ঠিকানা</th>
                          <th className="py-2.5 px-4">যোগাযোগ</th>
                          <th className="py-2.5 px-4 text-right">রেটিং</th>
                          <th className="py-2.5 px-4 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredShops.map((shop) => {
                          const delKey = `shop-${shop.id}`;
                          return (
                            <tr key={shop.id} className="hover:bg-slate-50/70">
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900">{shop.nameBn}</div>
                                <div className="text-xs text-slate-500">{shop.categoryBn}</div>
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                <div>{shop.area}</div>
                                <div className="text-xs text-slate-400 truncate max-w-[220px]">
                                  {shop.addressBn}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                                {shop.phone}
                              </td>
                              <td className="py-3 px-4 text-right tabular-nums text-slate-700">
                                {(shop.rating ?? 5).toFixed(1)} · {shop.reviewCount ?? 0}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    disabled={busyKey === `shop-toggle-${shop.id}`}
                                    onClick={() => handleToggleShopOpen(shop.id, Boolean(shop.isOpen))}
                                    className={`px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap cursor-pointer ${
                                      shop.isOpen
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {shop.isOpen ? 'খোলা' : 'বন্ধ'}
                                  </button>

                                  {confirmDeleteKey === delKey ? (
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        disabled={busyKey === `shop-del-${shop.id}`}
                                        onClick={() => handleDeleteShop(shop.id)}
                                        className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium whitespace-nowrap cursor-pointer"
                                      >
                                        নিশ্চিত
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteKey(null)}
                                        className="px-2 py-1 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                                      >
                                        বাতিল
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(delKey)}
                                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                                      title="দোকান মুছুন"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="পণ্যের নাম বা দোকানের নাম খুঁজুন..."
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-[#0B4A8A] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit">
                  {(['all', 'instock', 'outofstock'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setProductFilter(f)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer ${
                        productFilter === f
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f === 'all' ? 'সব পণ্য' : f === 'instock' ? 'ইন স্টক' : 'স্টক শেষ'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {filteredProducts.length === 0 ? (
                  <div className="p-8 text-center text-xs sm:text-sm text-slate-500">
                    কোনো পণ্য পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                          <th className="py-2.5 px-4">পণ্যের নাম</th>
                          <th className="py-2.5 px-4">দোকান</th>
                          <th className="py-2.5 px-4 text-right">দাম</th>
                          <th className="py-2.5 px-4 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProducts.map((prod) => {
                          const inStock = prod.inStock !== false && prod.isAvailable !== false;
                          const delKey = `prod-${prod.id}`;
                          return (
                            <tr key={prod.id} className="hover:bg-slate-50/70">
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900">{prod.nameBn}</div>
                                <div className="text-xs text-slate-500">
                                  {prod.category} · {prod.unit}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                <div>{prod.shopName || '—'}</div>
                                <div className="text-xs text-slate-400">{prod.shopArea}</div>
                              </td>
                              <td className="py-3 px-4 text-right font-semibold tabular-nums text-slate-900">
                                ৳{prod.price}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    disabled={busyKey === `prod-toggle-${prod.id}`}
                                    onClick={() => handleToggleProductStock(prod.id, inStock)}
                                    className={`px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap cursor-pointer ${
                                      inStock
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                        : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                    }`}
                                  >
                                    {inStock ? 'ইন স্টক' : 'স্টক শেষ'}
                                  </button>

                                  {confirmDeleteKey === delKey ? (
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        disabled={busyKey === `prod-del-${prod.id}`}
                                        onClick={() => handleDeleteProduct(prod.id)}
                                        className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium whitespace-nowrap cursor-pointer"
                                      >
                                        নিশ্চিত
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteKey(null)}
                                        className="px-2 py-1 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                                      >
                                        বাতিল
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteKey(delKey)}
                                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                                      title="পণ্য মুছুন"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ব্যবহারকারীর নাম বা মোবাইল নম্বর খুঁজুন..."
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-[#0B4A8A] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit overflow-x-auto">
                  {(['all', 'customer', 'merchant', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer ${
                        userRoleFilter === r
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r === 'all'
                        ? 'সবাই'
                        : r === 'customer'
                        ? 'ক্রেতা'
                        : r === 'merchant'
                        ? 'দোকানদার'
                        : 'অ্যাডমিন'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-xs sm:text-sm text-slate-500">
                    কোনো নিবন্ধিত ব্যবহারকারী পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                          <th className="py-2.5 px-4">নাম</th>
                          <th className="py-2.5 px-4">মোবাইল নম্বর</th>
                          <th className="py-2.5 px-4">ভূমিকা</th>
                          <th className="py-2.5 px-4 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => {
                          const delKey = `user-${user.id}`;
                          const isAdminUser = user.role === 'admin';
                          return (
                            <tr key={user.id} className="hover:bg-slate-50/70">
                              <td className="py-3 px-4 font-semibold text-slate-900">
                                {user.name}
                              </td>
                              <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                                {user.phone}
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                {isAdminUser
                                  ? 'অ্যাডমিন'
                                  : user.role === 'merchant'
                                  ? 'দোকানদার'
                                  : 'ক্রেতা'}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {isAdminUser ? (
                                  <span className="text-xs text-slate-400">সংরক্ষিত</span>
                                ) : (
                                  <div className="inline-flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      disabled={busyKey === `user-role-${user.id}`}
                                      onClick={() =>
                                        handleChangeUserRole(
                                          user.id,
                                          user.role === 'merchant' ? 'customer' : 'merchant'
                                        )
                                      }
                                      className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 whitespace-nowrap cursor-pointer"
                                    >
                                      {user.role === 'merchant' ? 'ক্রেতা করুন' : 'দোকানদার করুন'}
                                    </button>

                                    {confirmDeleteKey === delKey ? (
                                      <div className="inline-flex items-center gap-1">
                                        <button
                                          type="button"
                                          disabled={busyKey === `user-del-${user.id}`}
                                          onClick={() => handleDeleteUser(user.id)}
                                          className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium whitespace-nowrap cursor-pointer"
                                        >
                                          নিশ্চিত
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setConfirmDeleteKey(null)}
                                          className="px-2 py-1 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                                        >
                                          বাতিল
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setConfirmDeleteKey(delKey)}
                                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                                        title="ব্যবহারকারী মুছুন"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="গ্রাহকের নাম, দোকানের নাম বা মন্তব্য খুঁজুন..."
                  className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm focus:border-[#0B4A8A] focus:outline-none"
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                {filteredReviews.length === 0 ? (
                  <div className="p-8 text-center text-xs sm:text-sm text-slate-500">
                    কোনো রিভিউ পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const delKey = `rev-${rev.id}`;
                    return (
                      <div
                        key={rev.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-900 text-sm">
                              {rev.customerName}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{rev.shopName || rev.shopId}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums font-medium text-amber-700">
                              রেটিং {rev.rating}/5
                            </span>
                            {rev.dateBn && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{rev.dateBn}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center justify-end">
                          {confirmDeleteKey === delKey ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                disabled={busyKey === `rev-del-${rev.id}`}
                                onClick={() => handleDeleteReview(rev.shopId, rev.id)}
                                className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium whitespace-nowrap cursor-pointer"
                              >
                                নিশ্চিত
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteKey(null)}
                                className="px-2 py-1 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                বাতিল
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteKey(delKey)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer whitespace-nowrap"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>মুছুন</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
