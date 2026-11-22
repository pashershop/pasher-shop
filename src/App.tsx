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
import { AdminPage } from './components/AdminPage';

import { SHOPS } from './data/mockData';
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

  // Exclusive /admin URL routing (accessible only directly via /admin)
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.replace(/\/+$/, '') === '/admin';
  });

  React.useEffect(() => {
    const onPopState = () => {
      setIsAdminRoute(window.location.pathname.replace(/\/+$/, '') === '/admin');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  React.useEffect(() => {
    document.title = isAdminRoute
      ? 'Admin Console — Pasher Shop'
      : 'Pasher Shop – আপনার পাশের দোকান, এখন অনলাইনে';
  }, [isAdminRoute]);

  // Ensure light mode only across the entire app
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem('pasher_shop_theme');
    } catch {
      // ignore
    }
  }, []);

  // Dynamic shops state initialized from localStorage or SHOPS (filtered of any legacy demo shops)
  const [allShops, setAllShops] = useState<Shop[]>(() => {
    try {
      const saved = localStorage.getItem('pasher_shop_list');
      if (saved) {
        const parsed: Shop[] = JSON.parse(saved);
        const cleaned = parsed.filter(
          (s) => !['shop-1', 'shop-2', 'shop-3'].includes(s.id)
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('pasher_shop_list', JSON.stringify(cleaned));
        }
        return cleaned;
      }
    } catch (e) {
      console.error(e);
    }
    return SHOPS;
  });

  // Owned shop ID (only shopkeepers who registered/own a shop have this)
  const [myShopId, setMyShopId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('pasher_shop_my_shop_id');
      if (saved && ['shop-1', 'shop-2', 'shop-3'].includes(saved)) {
        localStorage.removeItem('pasher_shop_my_shop_id');
        return null;
      }
      return saved || null;
    } catch (e) {
      return null;
    }
  });

  // Current active owned shop object
  const myShop = useMemo(() => {
    if (!myShopId) return null;
    return allShops.find((s) => s.id === myShopId) || null;
  }, [allShops, myShopId]);

  // Dynamic products state synced with Cloudflare D1 SQL database
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);

  // Authenticated user state from Cloudflare D1
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    phone: string;
    role: 'customer' | 'merchant';
  } | null>(() => {
    try {
      const saved = localStorage.getItem('pasher_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const refreshProductsFromD1 = React.useCallback(() => {
    d1Service.getAllProducts().then((productsFromD1) => {
      if (Array.isArray(productsFromD1)) {
        setAllProducts(productsFromD1);
      }
    });
  }, []);

  const refreshShopsFromD1 = React.useCallback(() => {
    d1Service.getAllShops().then((shopsFromD1) => {
      if (Array.isArray(shopsFromD1)) {
        setAllShops(shopsFromD1);
      }
    });
  }, []);

  // Sync session and data with Cloudflare D1 SQL database (DB: pasher-shop-db)
  React.useEffect(() => {
    // Check active session
    d1Service.getCurrentUser().then((res) => {
      if (res.success && res.user) {
        setCurrentUser(res.user);
      } else {
        setCurrentUser(null);
      }
    });

    refreshShopsFromD1();
    refreshProductsFromD1();
  }, [refreshProductsFromD1, refreshShopsFromD1]);

  const handleLogout = async () => {
    await d1Service.logout();
    setCurrentUser(null);
  };

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
    d1Service.createShop(newShop).then(() => {
      refreshProductsFromD1();
    });
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
  const [locationNotice, setLocationNotice] = useState<string>('');

  // Automatic high-accuracy live real location detection
  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice('আপনার ডিভাইসে বা ব্রাউজারে লোকেশন সুবিধা চালু নেই। সকল এলাকার দোকান দেখানো হচ্ছে।');
      setCurrentArea((prev) => (prev.includes('রিয়েল লোকেশন') ? 'সকল এলাকা (সমগ্র বাংলাদেশ)' : prev));
      setTimeout(() => setLocationNotice(''), 5000);
      return;
    }
    setLocationNotice('');
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
        setCurrentArea((prev) => (prev.includes('রিয়েল লোকেশন') ? 'সকল এলাকা (সমগ্র বাংলাদেশ)' : prev));
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

      // If user selected a specific area manually (and not auto-detect, placeholder, or all areas)
      if (
        !isAutoDetected &&
        !currentArea.includes('সকল এলাকা') &&
        !currentArea.includes('রিয়েল লোকেশন')
      ) {
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
    const combinedProducts: ProductItem[] = [...allProducts];

    // Ensure shop featured products are represented
    allShops.forEach((s) => {
      if (Array.isArray(s.featuredProducts)) {
        s.featuredProducts.forEach((p, idx) => {
          const exists = combinedProducts.some(
            (cp) => cp.shopId === s.id && cp.nameBn === p.nameBn
          );
          if (!exists) {
            combinedProducts.push({
              id: `${s.id}-fp-${idx}`,
              shopId: s.id,
              nameBn: p.nameBn,
              category: s.categoryId,
              price: p.price,
              unit: 'কেজি',
              imageUrl: s.coverImage || '',
              shopName: s.nameBn,
              shopArea: s.area,
              shopPhone: s.phone,
              isAvailable: true,
              stockStatus: 'ইন স্টক',
              descriptionBn: '',
            });
          }
        });
      }
    });

    return combinedProducts.filter((product) => {
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
  }, [allProducts, allShops, selectedCategory, searchQuery]);

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

  const handleExitAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
    refreshShopsFromD1();
    refreshProductsFromD1();
  };

  if (isAdminRoute) {
    return (
      <AdminPage
        onExitToSite={handleExitAdmin}
        onDataChanged={() => {
          refreshShopsFromD1();
          refreshProductsFromD1();
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-gradient-to-b from-[#EAF2FF] via-[#F8FAFC] to-[#EEF4FF] text-[#171717] font-sans antialiased selection:bg-[#FF7900]/20 selection:text-[#0B4A8A] pb-20 sm:pb-24">
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

      {/* Non-blocking Location Notice Banner */}
      {locationNotice && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs text-center">
          {locationNotice}
        </div>
      )}

      {/* Header & Top Navigation */}
      <Header
        hasOwnedShop={!!myShop}
        ownedShopName={myShop?.nameBn}
        currentUser={currentUser}
        onLogout={handleLogout}
        currentView={currentView}
        onOpenAddShopModal={() => setIsAddShopOpen(true)}
        onNavigateView={handleNavigateView}
        onNavigateSection={handleNavigateSection}
      />

      {/* Conditional Dedicated Views Rendering */}
      <div className="relative z-10 flex-1 flex flex-col w-full min-w-0">
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
            onProductsChanged={refreshProductsFromD1}
            onOpenCustomerPreview={(shop) => setActiveShop(shop)}
            onBackToHome={() => setCurrentView('home')}
            onOpenAddShop={() => setIsAddShopOpen(true)}
          />
        ) : (
          <CustomerDashboard
            currentArea={currentArea}
            isAutoDetected={isAutoDetected}
            currentUser={currentUser}
            onLogout={handleLogout}
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
          products={filteredProducts}
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
          <main className="flex-1 w-full min-w-0 overflow-x-hidden">
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
              shops={allShops}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setCurrentView('shops');
              }}
            />

            {/* Search Results Alert if active */}
            {searchQuery && (
              <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
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
              products={filteredProducts}
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
      </div>

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
        onLoginSuccess={(role, phone, user) => {
          if (user) {
            setCurrentUser(user);
          } else {
            setCurrentUser({
              id: `usr-${Date.now()}`,
              name: role === 'merchant' ? 'দোকানদার' : 'সম্মানিত ক্রেতা',
              phone,
              role,
            });
          }

          if (role === 'merchant') {
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            const matchingShop = allShops.find(
              (s) =>
                s.phone.replace(/[^0-9]/g, '') === cleanPhone ||
                (s.ownerPhone && s.ownerPhone.replace(/[^0-9]/g, '') === cleanPhone)
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
