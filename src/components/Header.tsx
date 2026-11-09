import React, { useState } from 'react';
import { Logo } from './Logo';
import { MapPin, Menu, X, ChevronDown, User, Store, Navigation, ShoppingBag, Scale, Sun, Moon } from 'lucide-react';
import { AppView } from './BottomNavBar';

interface HeaderProps {
  currentArea: string;
  isAutoDetected?: boolean;
  hasOwnedShop?: boolean;
  ownedShopName?: string;
  currentView?: AppView;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onDetectLocation?: () => void;
  onOpenLocationModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onOpenAddShopModal: () => void;
  onNavigateView: (view: AppView) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentArea,
  isAutoDetected,
  hasOwnedShop = false,
  ownedShopName,
  currentView = 'home',
  isDarkMode,
  onToggleTheme,
  onDetectLocation,
  onOpenLocationModal,
  onOpenAuthModal,
  onOpenAddShopModal,
  onNavigateView,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavView = (view: AppView) => {
    onNavigateView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B4A8A] text-white border-b border-[#08386a] transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Sleeker, even more compact height: h-12 sm:h-14 */}
        <div className="flex items-center justify-between h-12 sm:h-14 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark / Logo */}
          <button
            onClick={() => handleNavView('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7900] rounded-lg cursor-pointer shrink-0"
          >
            <Logo size="sm" variant="dark" />
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-[13px] font-bold">
            <button
              onClick={() => handleNavView('home')}
              className={`transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#FF7900] font-black border-b-2 border-[#FF7900] pb-0.5'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              হোম
            </button>

            <button
              onClick={() => handleNavView('shops')}
              className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                currentView === 'shops'
                  ? 'text-[#FF7900] font-black border-b-2 border-[#FF7900] pb-0.5'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>দোকানসমূহ</span>
            </button>

            <button
              onClick={() => handleNavView('products')}
              className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                currentView === 'products'
                  ? 'text-[#FF7900] font-black border-b-2 border-[#FF7900] pb-0.5'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />
              <span>পণ্যসমূহ</span>
            </button>

            <button
              onClick={() => handleNavView('price-compare')}
              className={`transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                currentView === 'price-compare'
                  ? 'text-[#FF7900] font-black border-b-2 border-[#FF7900] pb-0.5'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>দাম তুলনা</span>
            </button>

            <button
              onClick={() => handleNavView('dashboard')}
              className={`transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-[#FF7900] font-black border-b-2 border-[#FF7900] pb-0.5'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>{hasOwnedShop ? 'দোকান ড্যাশবোর্ড' : 'ক্রেতা ড্যাশবোর্ড'}</span>
              {hasOwnedShop && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="দোকান সক্রিয়" />
              )}
            </button>
          </nav>

          {/* Zone 3: Actions (Location, Dark Mode, Auth & Shop CTA) */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Ultra-compact Location Selector Button */}
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="এলাকা বা জিপিএস অবস্থান"
            >
              <Navigation className="w-3 h-3 text-[#FF7900] shrink-0" />
              <span className="max-w-[85px] sm:max-w-[105px] truncate">{currentArea}</span>
              {isAutoDetected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" title="জিপিএস সক্রিয়" />
              )}
              <ChevronDown className="w-2.5 h-2.5 text-white/70 shrink-0" />
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer border border-white/20 flex items-center gap-1 text-[11px] font-bold"
              title={isDarkMode ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                  <span className="hidden xl:inline text-[10px]">লাইট</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-200" />
                  <span className="hidden xl:inline text-[10px]">ডার্ক</span>
                </>
              )}
            </button>

            {/* Merchant Dashboard / Quick CTA */}
            {hasOwnedShop ? (
              <button
                onClick={() => handleNavView('dashboard')}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-black text-white bg-[#FF7900] hover:bg-[#e06b00] rounded-lg transition-all shadow-xs whitespace-nowrap cursor-pointer active:scale-95"
                title="আপনার দোকান ড্যাশবোর্ড"
              >
                <Store className="w-3 h-3" />
                <span className="max-w-[110px] truncate">{ownedShopName ? `${ownedShopName}` : 'ড্যাশবোর্ড'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAddShopModal}
                className="hidden xl:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                <Store className="w-3 h-3" />
                দোকান যোগ
              </button>
            )}

            {/* Login button */}
            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-2 py-1 text-[11px] font-semibold text-white/90 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              লগইন
            </button>

            {/* Sign up / Primary Action */}
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="px-2.5 py-1 text-[11px] font-black text-white bg-[#FF7900] hover:bg-[#e06b00] rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              সাইন আপ
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-1.5">
            {/* Dark Mode toggle on mobile */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-white hover:bg-white/10 rounded-lg border border-white/20 cursor-pointer"
              title="থিম পরিবর্তন"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-cyan-200" />}
            </button>

            {/* Compact location badge */}
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white bg-white/10 border border-white/20 rounded-md cursor-pointer"
            >
              <Navigation className="w-2.5 h-2.5 text-[#FF7900] shrink-0" />
              <span className="max-w-[80px] truncate">{currentArea}</span>
              {isAutoDetected && <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#08386a] bg-slate-900 text-white px-4 pt-3 pb-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400">ওয়েবসাইট থিম নির্বাচন:</span>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-bold text-white flex items-center gap-2 border border-slate-700"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>লাইট মোডে যান</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-200" />
                  <span>ডার্ক মোডে যান</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2 py-2 text-sm font-semibold">
            <button
              onClick={() => handleNavView('home')}
              className="text-left px-3 py-2.5 rounded-xl text-white bg-slate-800 font-bold"
            >
              হোম (Home)
            </button>
            <button
              onClick={() => handleNavView('shops')}
              className="text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>দোকানসমূহ (Shops)</span>
              <Store className="w-4 h-4 text-[#FF7900]" />
            </button>
            <button
              onClick={() => handleNavView('products')}
              className="text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>পণ্যসমূহ (Products)</span>
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => handleNavView('price-compare')}
              className="text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>দাম তুলনা (Price Compare)</span>
              <Scale className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => handleNavView('dashboard')}
              className="text-left px-3 py-2.5 rounded-xl text-[#FF7900] bg-slate-800 font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF7900]" />
                <span>{hasOwnedShop ? 'দোকানদার ড্যাশবোর্ড' : 'ক্রেতা ড্যাশবোর্ড'}</span>
              </span>
              {hasOwnedShop && (
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-700">
                  সক্রিয় দোকান
                </span>
              )}
            </button>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-2.5">
            {hasOwnedShop ? (
              <button
                onClick={() => handleNavView('dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-black text-white bg-[#FF7900] hover:bg-[#e06b00] rounded-xl transition-colors shadow-xs"
              >
                <Store className="w-4 h-4" />
                <span>আমার দোকান ড্যাশবোর্ড ({ownedShopName || 'প্রবেশ করুন'})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAddShopModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-xs"
              >
                <Store className="w-4 h-4" />
                আপনার দোকান যুক্ত করুন
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('login');
                }}
                className="w-full py-2.5 text-xs font-semibold text-white border border-slate-700 rounded-xl hover:bg-slate-800 text-center"
              >
                লগইন (Login)
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal('signup');
                }}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#FF7900] rounded-xl hover:bg-[#e06b00] text-center"
              >
                সাইন আপ
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
