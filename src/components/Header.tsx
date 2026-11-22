import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, User, Store, ShoppingBag, Scale, LogOut } from 'lucide-react';
import { AppView } from './BottomNavBar';

interface HeaderProps {
  hasOwnedShop?: boolean;
  ownedShopName?: string;
  currentUser?: { id: string; name: string; phone: string; role: 'customer' | 'merchant' } | null;
  onLogout?: () => void;
  currentView?: AppView;
  onOpenAddShopModal: () => void;
  onNavigateView: (view: AppView) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasOwnedShop = false,
  ownedShopName,
  currentUser,
  onLogout,
  currentView = 'home',
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
    <header className="sticky top-2 sm:top-3 z-40 w-full px-2.5 sm:px-4 lg:px-6 pointer-events-none transition-all">
      <div className="w-full max-w-full pointer-events-auto bg-gradient-to-r from-[#073463]/95 via-[#0B4A8A]/95 to-[#1262B5]/95 backdrop-blur-md text-white border border-white/20 rounded-full shadow-lg px-3.5 sm:px-5 lg:px-6 transition-all">
        {/* Sleek, compact rounded header bar: h-12 sm:h-14 */}
        <div className="flex items-center justify-between h-12 sm:h-14 gap-2 sm:gap-4 min-w-0">
          
          {/* Zone 1: Brand Wordmark / Logo */}
          <button
            onClick={() => handleNavView('home')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7900] rounded-full px-1 py-0.5 cursor-pointer shrink-0 min-w-0"
          >
            <Logo size="sm" variant="dark" />
          </button>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-[13px] font-bold">
            <button
              onClick={() => handleNavView('home')}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                currentView === 'home'
                  ? 'bg-white/15 text-[#FF7900] font-black shadow-2xs ring-1 ring-[#FF7900]/40'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              হোম
            </button>

            <button
              onClick={() => handleNavView('shops')}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'shops'
                  ? 'bg-white/15 text-[#FF7900] font-black shadow-2xs ring-1 ring-[#FF7900]/40'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>দোকানসমূহ</span>
            </button>

            <button
              onClick={() => handleNavView('products')}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'products'
                  ? 'bg-white/15 text-[#FF7900] font-black shadow-2xs ring-1 ring-[#FF7900]/40'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />
              <span>পণ্যসমূহ</span>
            </button>

            <button
              onClick={() => handleNavView('price-compare')}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'price-compare'
                  ? 'bg-white/15 text-[#FF7900] font-black shadow-2xs ring-1 ring-[#FF7900]/40'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>দাম তুলনা</span>
            </button>

            <button
              onClick={() => handleNavView('dashboard')}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-white/15 text-[#FF7900] font-black shadow-2xs ring-1 ring-[#FF7900]/40'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>{hasOwnedShop ? 'দোকান ড্যাশবোর্ড' : 'ক্রেতা ড্যাশবোর্ড'}</span>
              {hasOwnedShop && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="দোকান সক্রিয়" />
              )}
            </button>
          </nav>

          {/* Zone 3: Actions (Auth & Shop CTA) */}
          <div className="hidden sm:flex items-center gap-2">

            {/* Merchant Dashboard / Quick CTA */}
            {hasOwnedShop ? (
              <button
                onClick={() => handleNavView('dashboard')}
                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-black text-white bg-[#FF7900] hover:bg-[#e06b00] rounded-full transition-all shadow-xs whitespace-nowrap cursor-pointer active:scale-95"
                title="আপনার দোকান ড্যাশবোর্ড"
              >
                <Store className="w-3 h-3" />
                <span className="max-w-[110px] truncate">{ownedShopName ? `${ownedShopName}` : 'ড্যাশবোর্ড'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAddShopModal}
                className="hidden xl:flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                <Store className="w-3 h-3" />
                দোকান যোগ
              </button>
            )}

            {/* Authentication / User profile (shown only when logged in) */}
            {currentUser && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-white/95 border border-white/20">
                  <User className="w-3 h-3 text-[#FF7900]" />
                  <span className="max-w-[85px] truncate font-bold">{currentUser.name}</span>
                  <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90">
                    {currentUser.role === 'merchant' ? 'দোকানদার' : 'ক্রেতা'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-full transition-colors cursor-pointer border border-white/15"
                  title="লগআউট করুন"
                  aria-label="লগআউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-1.5">

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full mt-2 pointer-events-auto rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-md text-slate-900 px-4 pt-3.5 pb-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5 py-1.5 text-sm font-semibold">
            <button
              onClick={() => handleNavView('home')}
              className={`text-left px-3.5 py-2.5 rounded-2xl transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#0B4A8A] bg-slate-100 font-black'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              হোম (Home)
            </button>
            <button
              onClick={() => handleNavView('shops')}
              className={`text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'shops'
                  ? 'text-[#0B4A8A] bg-slate-100 font-black'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>দোকানসমূহ (Shops)</span>
              <Store className="w-4 h-4 text-[#FF7900]" />
            </button>
            <button
              onClick={() => handleNavView('products')}
              className={`text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'products'
                  ? 'text-[#0B4A8A] bg-slate-100 font-black'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>পণ্যসমূহ (Products)</span>
              <ShoppingBag className="w-4 h-4 text-cyan-600" />
            </button>
            <button
              onClick={() => handleNavView('price-compare')}
              className={`text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'price-compare'
                  ? 'text-[#0B4A8A] bg-slate-100 font-black'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>দাম তুলনা (Price Compare)</span>
              <Scale className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={() => handleNavView('dashboard')}
              className={`text-left px-3.5 py-2.5 rounded-2xl font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'text-[#FF7900] bg-slate-100 font-black'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF7900]" />
                <span>{hasOwnedShop ? 'দোকানদার ড্যাশবোর্ড' : 'ক্রেতা ড্যাশবোর্ড'}</span>
              </span>
              {hasOwnedShop && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                  সক্রিয় দোকান
                </span>
              )}
            </button>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-200 flex flex-col gap-2.5">
            {hasOwnedShop ? (
              <button
                onClick={() => handleNavView('dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-black text-white bg-[#FF7900] hover:bg-[#e06b00] rounded-full transition-colors shadow-xs cursor-pointer"
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
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors shadow-xs cursor-pointer"
              >
                <Store className="w-4 h-4" />
                আপনার দোকান যুক্ত করুন
              </button>
            )}

            {currentUser && (
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0B4A8A]/10 text-[#0B4A8A] flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {currentUser.role === 'merchant' ? 'দোকানদার অ্যাকাউন্ট' : 'ক্রেতা অ্যাকাউন্ট'} ({currentUser.phone})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
