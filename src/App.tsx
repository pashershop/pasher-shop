/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { NearbyShopsSection } from './components/NearbyShopsSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { PriceComparisonSection } from './components/PriceComparisonSection';
import { WhyPasherShopSection } from './components/WhyPasherShopSection';
import { ShopOwnerCTASection } from './components/ShopOwnerCTASection';
import { Footer } from './components/Footer';

import { ShopModal } from './components/ShopModal';
import { ShopDetailPage } from './components/ShopDetailPage';
import { ProductModal } from './components/ProductModal';
import { AddShopModal } from './components/AddShopModal';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { ShopkeeperDashboard } from './components/ShopkeeperDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { ShopsPage } from './components/ShopsPage';
import { ProductsPage } from './components/ProductsPage';
import { PriceComparePage } from './components/PriceComparePage';
import { BottomNavBar, AppView } from './components/BottomNavBar';
import { FloatingLocationButton } from './components/FloatingLocationButton';

import { SHOPS, FEATURED_PRODUCTS } from './data/mockData';
import { d1Service } from './services/d1Service';
import { Shop, ProductItem, CategoryId } from './types';
import {
  findNearestLocation,
  getRealLocationAddress,
  calculateDistanceKm,
  formatDistanceBn,
} from './utils/geoUtils';

export default function App() {
  const [currentArea, setCurrentArea] = useState<string>('রিয়েল লোকেশন...');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number } | null>({
    lat: 23.7465,
    lng: 90.3760,
  });
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // View state: 'home' | 'shops' | 'products' | 'price-compare' | 'dashboard'
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pasher_shop_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync theme class on <html>
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('pasher_shop_theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('pasher_shop_theme', 'light');
      } catch (e) {}
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Dynamic shops state initialized from localStorage or SHOPS
  const [allShops, setAllShops] = useState<Shop[]>(() => {
    try {
      const saved = localStorage.getItem('pasher_shop_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SHOPS;
  });

  // Owned shop ID (only shopkeepers who registered/own a shop have this)
  const [myShopId, setMyShopId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('pasher_shop_my_shop_id') || null;
    } catch (e) {
      return null;
    }
  });

  // Current active owned shop object
  const myShop = useMemo(() => {
    if (!myShopId) return null;
    return allShops.find((s) => s.id === myShopId) || null;
  }, [allShops, myShopId]);

  // Sync shops with Cloudflare D1 SQL database (DB: pasher-shop-db)
  React.useEffect(() => {
    d1Service.getAllShops().then((shopsFromD1) => {
      if (shopsFromD1 && shopsFromD1.length > 0) {
        setAllShops(shopsFromD1);
      }
    });
  }, []);

  // Shop creation and update handlers
  const handleShopCreated = (newShop: Shop) => {
    setAllShops((prev) => {
      const updated = [newShop, ...prev];
      try {
        localStorage.setItem('pasher_shop_list', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setMyShopId(newShop.id);
    try {
      localStorage.setItem('pasher_shop_my_shop_id', newShop.id);
    } catch (e) {}

    // Persist to Cloudflare D1 SQL (DB: pasher-shop-db)
    d1Service.createShop(newShop);
  };

  const handleUpdateShop = (updatedShop: Shop) => {
    setAllShops((prev) => {
      const updated = prev.map((s) => (s.id === updatedShop.id ? updatedShop : s));
      try {
        localStorage.setItem('pasher_shop_list', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Update in Cloudflare D1 SQL (DB: pasher-shop-db)
    d1Service.updateShop(updatedShop);
  };

  const handleSelectDemoShop = () => {
    const demo = allShops[0] || SHOPS[0];
    setMyShopId(demo.id);
    try {
      localStorage.setItem('pasher_shop_my_shop_id', demo.id);
    } catch (e) {}
  };

  // Listen to Google Maps Demo Key quota event
  React.useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  // Modals state
  const [activeShop, setActiveShop] = useState<Shop | null>(null);
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [isAddShopOpen, setIsAddShopOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'login' | 'signup';
  }>({ isOpen: false, mode: 'login' });

  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Automatic high-accuracy live real location detection
  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('আপনার ডিভাইসে বা ব্রাউজারে লোকেশন সুবিধা চালু নেই।');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentCoordinates(coords);
        setIsAutoDetected(true);
        setIsLocating(false);

        // Fetch real address (sublocality, neighborhood, road)
        try {
          const realName = await getRealLocationAddress(coords.lat, coords.lng);
          if (realName) {
            setCurrentArea(realName);
          } else {
            const match = findNearestLocation(coords.lat, coords.lng);
            setCurrentArea(match.nearestAreaName);
          }
        } catch {
          const match = findNearestLocation(coords.lat, coords.lng);
          setCurrentArea(match.nearestAreaName);
        }
      },
      (err) => {
        setIsLocating(false);
        console.log('Location detection skipped or unavailable:', err.message);
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Automatically attempt to detect user location on arrival
  React.useEffect(() => {
    detectLiveLocation();
  }, []);

  // Scroll to top whenever page view changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentView]);

  // Handle location selection with coordinates
  const handleSelectArea = (area: string, coords?: { lat: number; lng: number }) => {
    setCurrentArea(area);
    setIsAutoDetected(false);
    if (coords) {
      setCurrentCoordinates(coords);
    }
  };

  // Filtered and Real-Distance-Sorted Shops based on real location
  const filteredShops = useMemo(() => {
    let list = allShops.filter((shop) => {
      // Category filter
      if (selectedCategory !== 'all' && shop.categoryId !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = shop.nameBn.toLowerCase().includes(q);
        const matchesCategory = shop.categoryBn.toLowerCase().includes(q);
        const matchesProducts = shop.featuredProducts.some((p) =>
          p.nameBn.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesCategory && !matchesProducts) return false;
      }

      // If user selected a specific area manually (and not auto-detect or all areas)
      if (!isAutoDetected && !currentArea.includes('সকল এলাকা')) {
        const parts = currentArea.split(',').map((p) => p.trim().toLowerCase());
        const matchesAnyPart = parts.some(
          (part) =>
            part &&
            (shop.area.toLowerCase().includes(part) ||
              shop.addressBn.toLowerCase().includes(part))
        );
        if (!matchesAnyPart) return false;
      }

      return true;
    });

    // Calculate real physical distance & sort closest first
    if (currentCoordinates) {
      const { lat: uLat, lng: uLng } = currentCoordinates;
      list = list.map((shop) => {
        const distKm = calculateDistanceKm(uLat, uLng, shop.lat, shop.lng);
        return {
          ...shop,
          distance: formatDistanceBn(distKm),
          _liveDistKm: distKm,
        };
      });

      list.sort((a, b) => (a as any)._liveDistKm - (b as any)._liveDistKm);
    }

    return list;
  }, [selectedCategory, searchQuery, currentArea, isAutoDetected, currentCoordinates, allShops]);

  // Filtered Products based on search and category
  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.nameBn.toLowerCase().includes(q);
        const matchesShop = product.shopName.toLowerCase().includes(q);
        if (!matchesName && !matchesShop) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Navigation handlers
  const handleNavigateView = (view: AppView) => {
    setActiveShop(null);
    setCurrentView(view);
  };

  // Smooth scroll handler inside Home view
  const handleNavigateSection = (sectionId: string) => {
    setActiveShop(null);
    setCurrentView('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSearch = (query: string) => {
    setActiveShop(null);
    setSearchQuery(query);
    setCurrentView('shops');
  };

  const handleSelectShopById = (shopId: string) => {
    const found = allShops.find((s) => s.id === shopId);
    if (found) {
      setActiveShop(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-[#171717] dark:text-slate-100 font-sans antialiased selection:bg-[#FF7900]/20 selection:text-[#0B4A8A] pb-20 sm:pb-24">
      
      {/* Google Maps Platform Quota Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Header & Top Navigation */}
      <Header
        currentArea={currentArea}
        isAutoDetected={isAutoDetected}
        hasOwnedShop={!!myShop}
        ownedShopName={myShop?.nameBn}
        currentView={currentView}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onDetectLocation={detectLiveLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAuthModal={(mode) => setAuthModalConfig({ isOpen: true, mode })}
        onOpenAddShopModal={() => setIsAddShopOpen(true)}
        onNavigateView={handleNavigateView}
        onNavigateSection={handleNavigateSection}
      />

      {/* Conditional Dedicated Views Rendering */}
      {activeShop ? (
        <ShopDetailPage
          shop={activeShop}
          userCoordinates={currentCoordinates}
          userArea={currentArea}
          allShops={allShops}
          onDetectLocation={detectLiveLocation}
          onBack={() => setActiveShop(null)}
          onSelectShop={(shop) => setActiveShop(shop)}
        />
      ) : currentView === 'dashboard' ? (
        myShop ? (
          <ShopkeeperDashboard
            shop={myShop}
            onUpdateShop={handleUpdateShop}
            onOpenCustomerPreview={(shop) => setActiveShop(shop)}
            onBackToHome={() => setCurrentView('home')}
            onOpenAddShop={() => setIsAddShopOpen(true)}
            onSelectDemoShop={handleSelectDemoShop}
          />
        ) : (
          <CustomerDashboard
            currentArea={currentArea}
            isAutoDetected={isAutoDetected}
            onDetectLocation={detectLiveLocation}
            onOpenShopModal={(shop) => setActiveShop(shop)}
            onOpenAddShop={() => setIsAddShopOpen(true)}
            onBackToHome={() => setCurrentView('home')}
            onNavigateToShops={() => setCurrentView('shops')}
            onNavigateToProducts={() => setCurrentView('products')}
            onNavigateToPriceCompare={() => setCurrentView('price-compare')}
          />
        )
      ) : currentView === 'shops' ? (
        <ShopsPage
          shops={filteredShops}
          currentArea={currentArea}
          isAutoDetected={isAutoDetected}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          onSelectShop={(shop) => setActiveShop(shop)}
          onOpenAddShopModal={() => setIsAddShopOpen(true)}
          onDetectLocation={detectLiveLocation}
        />
      ) : currentView === 'products' ? (
        <ProductsPage
          products={filteredProducts.length > 0 ? filteredProducts : FEATURED_PRODUCTS}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          onSelectProduct={(product) => setActiveProduct(product)}
          onSelectShopById={handleSelectShopById}
        />
      ) : currentView === 'price-compare' ? (
        <PriceComparePage
          onOpenShopByName={(name) => {
            const found = allShops.find((s) => s.nameBn.includes(name));
            if (found) setActiveShop(found);
          }}
        />
      ) : (
        /* Home Landing View */
        <>
          <main className="flex-1">
            {/* Hero Section */}
            <HeroSection
              currentArea={currentArea}
              isAutoDetected={isAutoDetected}
              onDetectLocation={detectLiveLocation}
              onSelectArea={(area) => setCurrentArea(area)}
              onSearch={handleSearch}
              onExploreShops={() => setCurrentView('shops')}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
            />

            {/* Categories Section */}
            <CategoriesSection
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setCurrentView('shops');
              }}
            />

            {/* Search Results Alert if active */}
            {searchQuery && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="p-3.5 rounded-xl bg-[#0B4A8A]/5 border border-[#0B4A8A]/20 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#0B4A8A] font-semibold">
                    "{searchQuery}" এর জন্য পাওয়া ফলাফল ({filteredShops.length}টি দোকান, {filteredProducts.length}টি পণ্য)
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-bold text-[#FF7900] hover:underline ml-3"
                  >
                    ফিল্টার মুছুন
                  </button>
                </div>
              </div>
            )}

            {/* Nearby Shops Section */}
            <NearbyShopsSection
              shops={filteredShops}
              onSelectShop={(shop) => setActiveShop(shop)}
              currentArea={currentArea}
              selectedCoordinates={currentCoordinates}
              onOpenAddShopModal={() => setIsAddShopOpen(true)}
            />

            {/* Featured Products Section */}
            <FeaturedProductsSection
              products={filteredProducts.length > 0 ? filteredProducts : FEATURED_PRODUCTS}
              onSelectProduct={(product) => setActiveProduct(product)}
              onSelectShopById={handleSelectShopById}
            />

            {/* Price Comparison Section */}
            <PriceComparisonSection
              onOpenShopByName={(name) => {
                const found = allShops.find((s) => s.nameBn.includes(name));
                if (found) setActiveShop(found);
              }}
            />

            {/* Why Pasher Shop Section */}
            <WhyPasherShopSection />

            {/* Shop Owner CTA Section */}
            <ShopOwnerCTASection
              onOpenAddShopModal={() => setIsAddShopOpen(true)}
            />
          </main>

          {/* Footer */}
          <Footer
            onNavigate={handleNavigateSection}
            onOpenAddShopModal={() => setIsAddShopOpen(true)}
            onOpenAuthModal={(mode) => setAuthModalConfig({ isOpen: true, mode })}
          />
        </>
      )}

      {/* Floating GPS Location Button (Fixed bottom right above nav bar) */}
      <FloatingLocationButton
        currentArea={currentArea}
        isAutoDetected={isAutoDetected}
        isLocating={isLocating}
        onDetectLocation={detectLiveLocation}
      />

      {/* Modals */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onViewShop={(shopId) => {
          setActiveProduct(null);
          handleSelectShopById(shopId);
        }}
      />

      <AddShopModal
        isOpen={isAddShopOpen}
        onClose={() => setIsAddShopOpen(false)}
        onShopCreated={handleShopCreated}
        onGoToDashboard={(createdShop) => {
          handleShopCreated(createdShop);
          setActiveShop(null);
          setCurrentView('dashboard');
        }}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        currentArea={currentArea}
        onDetectLocation={detectLiveLocation}
        onSelectArea={handleSelectArea}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialMode={authModalConfig.mode}
        onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onLoginSuccess={(role, phone) => {
          if (role === 'merchant') {
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            const matchingShop = allShops.find(
              (s) => s.phone.replace(/[^0-9]/g, '') === cleanPhone
            );
            if (matchingShop) {
              setMyShopId(matchingShop.id);
              try {
                localStorage.setItem('pasher_shop_my_shop_id', matchingShop.id);
              } catch (e) {}
            }
          }
          setActiveShop(null);
          setCurrentView('dashboard');
        }}
      />

      {/* Sticky Bottom Navigation Bar */}
      <BottomNavBar
        currentView={currentView}
        hasOwnedShop={!!myShop}
        onNavigateView={handleNavigateView}
      />

    </div>
  );
}
