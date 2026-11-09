import React, { useState, useEffect } from 'react';
import { Home, Store, ShoppingBag, Scale, LayoutDashboard } from 'lucide-react';

export type AppView = 'home' | 'shops' | 'products' | 'price-compare' | 'dashboard';

interface BottomNavBarProps {
  currentView: AppView;
  hasOwnedShop: boolean;
  onNavigateView: (view: AppView) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentView,
  hasOwnedShop,
  onNavigateView,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Hide nav bar on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up or near top
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home' as AppView, label: 'হোম', Icon: Home },
    { id: 'shops' as AppView, label: 'দোকানসমূহ', Icon: Store },
    { id: 'products' as AppView, label: 'পণ্যসমূহ', Icon: ShoppingBag },
    { id: 'price-compare' as AppView, label: 'দাম তুলনা', Icon: Scale },
    { id: 'dashboard' as AppView, label: 'ড্যাশবোর্ড', Icon: LayoutDashboard },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-lg sm:max-w-xl mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigateView(id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#0B4A8A] dark:text-cyan-400 font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? 'text-[#0B4A8A] dark:text-cyan-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{label}</span>
              
              {/* Badge for shop owner in dashboard */}
              {id === 'dashboard' && hasOwnedShop && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B4A8A] dark:bg-cyan-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
