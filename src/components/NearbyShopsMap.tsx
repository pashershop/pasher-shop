import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Shop } from '../types';
import { AREA_COORDINATES } from '../data/mockData';
import { MapPin, Star, Clock, Phone, ChevronRight, Navigation, Store, Eye } from 'lucide-react';

interface NearbyShopsMapProps {
  shops: Shop[];
  currentArea: string;
  selectedCoordinates?: { lat: number; lng: number } | null;
  onSelectShop: (shop: Shop) => void;
}

// Controller component to smoothly pan/zoom when area or user location changes
const MapCameraControl: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  return null;
};

export const NearbyShopsMap: React.FC<NearbyShopsMapProps> = ({
  shops,
  currentArea,
  selectedCoordinates,
  onSelectShop,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const defaultAreaConfig = selectedCoordinates || AREA_COORDINATES[currentArea] || AREA_COORDINATES['ধানমন্ডি, ঢাকা'];
  const initialZoom = 'zoom' in defaultAreaConfig && typeof defaultAreaConfig.zoom === 'number' ? defaultAreaConfig.zoom : 13;

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: defaultAreaConfig.lat,
    lng: defaultAreaConfig.lng,
  });
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Update map center when currentArea or selectedCoordinates change
  useEffect(() => {
    if (selectedCoordinates) {
      setCenter(selectedCoordinates);
      setZoom(currentArea.includes('বিভাগ') ? 10 : 13);
      return;
    }
    const areaConfig = AREA_COORDINATES[currentArea];
    if (areaConfig) {
      setCenter({ lat: areaConfig.lat, lng: areaConfig.lng });
      setZoom(areaConfig.zoom);
    }
  }, [currentArea, selectedCoordinates]);

  // Request browser location for real user pin
  const handleGetLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('আপনার ব্রাউজারে লোকেশন সার্ভিস সমর্থিত নয়।');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setCenter(coords);
        setZoom(15);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        // Fallback to Dhanmondi
        setCenter(AREA_COORDINATES['ধানমন্ডি, ঢাকা']);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
      {/* Map Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0B4A8A]/10 text-[#0B4A8A] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#FF7900]" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#171717]">
              আশেপাশের দোকানগুলোর লাইভ ম্যাপ
            </h3>
            <p className="text-xs text-slate-500">
              ম্যাপের পিনগুলোতে ক্লিক করে সরাসরি দোকানের অবস্থান ও বিবরণ দেখুন
            </p>
          </div>
        </div>

        {/* Location Button */}
        <button
          type="button"
          onClick={handleGetLiveLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B4A8A] bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
          title="আমার বর্তমান অবস্থান ট্র্যাক করুন"
        >
          <Navigation className={`w-3.5 h-3.5 text-[#FF7900] ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'অবস্থান খোঁজা হচ্ছে...' : 'আমার অবস্থান (GPS)'}</span>
        </button>
      </div>

      {/* Map Canvas Container (Explicit Height as per CF2) */}
      <div className="relative w-full h-[440px] sm:h-[500px] bg-slate-100">
        {apiKey ? (
          <APIProvider apiKey={apiKey} language="bn" region="BD">
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={center}
              defaultZoom={zoom}
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              <MapCameraControl center={center} zoom={zoom} />

              {/* User Live Position Marker */}
              {userLocation && (
                <AdvancedMarker position={userLocation} title="আপনার বর্তমান অবস্থান">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75" />
                    <div className="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md" />
                  </div>
                </AdvancedMarker>
              )}

              {/* Selected Area Marker (when selected from modal) */}
              {selectedCoordinates && (
                <AdvancedMarker position={selectedCoordinates} title={`নির্বাচিত এলাকা: ${currentArea}`}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-md bg-[#0B4A8A] text-white border-2 border-white text-xs font-bold ring-2 ring-[#FF7900]/50">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7900]" />
                    <span className="max-w-[120px] truncate">{currentArea}</span>
                  </div>
                </AdvancedMarker>
              )}

              {/* Shop Markers */}
              {shops.map((shop) => {
                const isSelected = selectedShop?.id === shop.id;

                return (
                  <AdvancedMarker
                    key={shop.id}
                    position={{ lat: shop.lat, lng: shop.lng }}
                    onClick={() => setSelectedShop(shop)}
                    title={shop.nameBn}
                  >
                    {/* Custom Brand Marker Pin */}
                    <div
                      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shadow-md cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? 'bg-[#FF7900] text-white border-white scale-110 z-30'
                          : 'bg-[#0B4A8A] text-white border-white/80 hover:bg-[#093a6d] hover:scale-105 z-10'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs font-bold whitespace-nowrap max-w-[120px] truncate">
                        {shop.nameBn}
                      </span>
                      {/* Live Open Dot */}
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          shop.isOpen ? 'bg-emerald-400' : 'bg-red-400'
                        }`}
                      />
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Selected Shop Info Window */}
              {selectedShop && (
                <InfoWindow
                  position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
                  onCloseClick={() => setSelectedShop(null)}
                >
                  <div className="p-1 max-w-[240px] text-[#171717]">
                    <div className="relative h-24 w-full rounded-lg overflow-hidden mb-2 bg-slate-100">
                      <img
                        src={selectedShop.coverImage}
                        alt={selectedShop.nameBn}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-2xs">
                        {selectedShop.categoryBn}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm leading-snug line-clamp-1">
                      {selectedShop.nameBn}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                        {selectedShop.rating}
                      </span>
                      <span>·</span>
                      <span className="text-slate-600 font-medium">দূরত্ব: {selectedShop.distance}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {selectedShop.addressBn}
                    </p>

                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectShop(selectedShop);
                          setSelectedShop(null);
                        }}
                        className="flex-1 py-1.5 px-2 bg-[#0B4A8A] hover:bg-[#093a6d] text-white rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>দোকান দেখুন</span>
                      </button>

                      <a
                        href={`tel:${selectedShop.phone.replace(/[^0-9]/g, '')}`}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors shadow-2xs"
                        title="দোকানিকে কল করুন"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full relative flex flex-col items-center justify-center bg-slate-100">
            <iframe
              title="Nearby Shops Map View"
              width="100%"
              height="100%"
              className="w-full h-full border-0 pointer-events-auto"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.035}%2C${center.lat - 0.025}%2C${center.lng + 0.035}%2C${center.lat + 0.025}&layer=mapnik&marker=${center.lat}%2C${center.lng}`}
            />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-[#0B4A8A] flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>লাইভ ম্যাপ প্রিভিউ ({currentArea})</span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`দোকান সমূহ ${currentArea}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-[#FF7900] hover:text-[#e06b00] flex items-center gap-1.5 z-10"
            >
              <span>Google Maps-এ খুলুন</span>
            </a>
          </div>
        )}

        {/* Floating Quick Area Chips on Map bottom */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-white/60 shadow-md text-xs font-semibold z-10 no-scrollbar">
          <span className="text-slate-400 text-[11px] px-1">এলাকা:</span>
          {Object.entries(AREA_COORDINATES).map(([areaName, config]) => (
            <button
              key={areaName}
              type="button"
              onClick={() => {
                setCenter({ lat: config.lat, lng: config.lng });
                setZoom(config.zoom);
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                center.lat === config.lat && center.lng === config.lng
                  ? 'bg-[#0B4A8A] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {areaName.replace(', ঢাকা', '')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
