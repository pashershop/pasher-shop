import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Navigation,
  Compass,
  Footprints,
  Bike,
  Car,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Store,
  Layers,
  LocateFixed,
  AlertCircle,
} from 'lucide-react';
import { Shop } from '../types';
import {
  calculateDistanceKm,
  formatDistanceBn,
  calculateDirectionBn,
  estimateTravelTimes,
  toBnNumber,
} from '../utils/geoUtils';

interface ShopRouteMapProps {
  shop: Shop;
  userCoordinates?: { lat: number; lng: number } | null;
  userArea?: string;
  onDetectLocation?: () => void;
}

// Convert English text / numbers from Google Directions to clean Bengali
function formatGoogleManeuverToBn(instructionHtml: string): string {
  // Strip HTML tags
  const text = instructionHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Basic dictionary translations for common road directions
  let bn = text;
  bn = bn.replace(/\bHead\b/gi, 'সোজা এগিয়ে যান:');
  bn = bn.replace(/\bTurn left onto\b/gi, 'বামে মোড় নিন:');
  bn = bn.replace(/\bTurn left\b/gi, 'বামে মোড় নিন');
  bn = bn.replace(/\bTurn right onto\b/gi, 'ডানে মোড় নিন:');
  bn = bn.replace(/\bTurn right\b/gi, 'ডানে মোড় নিন');
  bn = bn.replace(/\bSlight left\b/gi, 'হালকা বামে চলুন');
  bn = bn.replace(/\bSlight right\b/gi, 'হালকা ডানে চলুন');
  bn = bn.replace(/\bContinue straight\b/gi, 'সোজা চলতে থাকুন');
  bn = bn.replace(/\bContinue onto\b/gi, 'চলতে থাকুন:');
  bn = bn.replace(/\bDestination will be on the left\b/gi, 'দোকানটি আপনার বাম পাশে অবস্থিত হবে');
  bn = bn.replace(/\bDestination will be on the right\b/gi, 'দোকানটি আপনার ডান পাশে অবস্থিত হবে');
  bn = bn.replace(/\btoward\b/gi, 'এর দিকে');
  bn = bn.replace(/\bnorth\b/gi, 'উত্তর দিকে');
  bn = bn.replace(/\bsouth\b/gi, 'দক্ষিণ দিকে');
  bn = bn.replace(/\beast\b/gi, 'পূর্ব দিকে');
  bn = bn.replace(/\bwest\b/gi, 'পশ্চিম দিকে');
  bn = bn.replace(/\bmin\b/gi, 'মিনিট');
  bn = bn.replace(/\bmins\b/gi, 'মিনিট');
  bn = bn.replace(/\bkm\b/gi, 'কি.মি.');
  bn = bn.replace(/\bm\b/gi, 'মিটার');

  // Convert English digits to Bengali digits
  return toBnNumber(bn);
}

// Subcomponent that manages route rendering using modern Routes API (Route.computeRoutes)
interface DirectionsRouteHandlerProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  travelMode: 'walk' | 'bike' | 'car';
  onRouteResult: (result: google.maps.DirectionsResult | null, error?: string) => void;
}

const DirectionsRouteHandler: React.FC<DirectionsRouteHandlerProps> = ({
  origin,
  destination,
  travelMode,
  onRouteResult,
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // Cleanup previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const routesAny = routesLib as any;

    // Modern Routes API travel mode
    const modernTravelMode =
      travelMode === 'walk'
        ? 'WALKING'
        : travelMode === 'bike'
        ? 'BICYCLING'
        : 'DRIVING';

    // Helper to draw a direct route fallback line if service returns error
    const drawDirectPath = () => {
      const fallbackLine = new google.maps.Polyline({
        path: [origin, destination],
        strokeColor: '#FF7900',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        geodesic: true,
      });
      fallbackLine.setMap(map);
      polylinesRef.current = [fallbackLine];
    };

    // 1. Try modern Route.computeRoutes first (Mandatory Zero-Legacy pattern)
    if (routesAny.Route && typeof routesAny.Route.computeRoutes === 'function') {
      routesAny.Route.computeRoutes({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: modernTravelMode,
        fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
      })
        .then(({ routes }: { routes: any[] }) => {
          if (!routes || routes.length === 0) {
            drawDirectPath();
            onRouteResult(null, 'No route found');
            return;
          }
          const primaryRoute = routes[0];
          const newPolylines = primaryRoute.createPolylines
            ? primaryRoute.createPolylines()
            : [
                new google.maps.Polyline({
                  path: primaryRoute.path || [origin, destination],
                  strokeColor: '#FF7900',
                  strokeWeight: 6,
                  strokeOpacity: 0.9,
                }),
              ];

          newPolylines.forEach((poly: google.maps.Polyline) => {
            poly.setOptions({
              strokeColor: '#FF7900',
              strokeWeight: 6,
              strokeOpacity: 0.9,
            });
            poly.setMap(map);
          });
          polylinesRef.current = newPolylines;

          if (primaryRoute.viewport) {
            map.fitBounds(primaryRoute.viewport);
          }

          // Synthetic result for UI distance/duration display
          const distKm = primaryRoute.distanceMeters
            ? (primaryRoute.distanceMeters / 1000).toFixed(1)
            : '';
          const mins = primaryRoute.durationMillis
            ? Math.round(primaryRoute.durationMillis / 60000)
            : 0;

          onRouteResult({
            routes: [
              {
                legs: [
                  {
                    distance: { text: distKm ? `${distKm} কি.মি.` : '', value: primaryRoute.distanceMeters || 0 },
                    duration: { text: mins ? `${mins} মিনিট` : '', value: mins * 60 },
                  },
                ],
              },
            ],
          } as any);
        })
        .catch(() => {
          // If Routes API fails (e.g. driving across walking only), try legacy DirectionsService or direct line
          try {
            if (routesLib.DirectionsService) {
              const ds = new routesLib.DirectionsService();
              ds.route(
                {
                  origin,
                  destination,
                  travelMode:
                    travelMode === 'walk'
                      ? google.maps.TravelMode.WALKING
                      : google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK && result) {
                    const line = new google.maps.Polyline({
                      path: result.routes[0]?.overview_path || [origin, destination],
                      strokeColor: '#FF7900',
                      strokeWeight: 6,
                      strokeOpacity: 0.9,
                    });
                    line.setMap(map);
                    polylinesRef.current = [line];
                    onRouteResult(result);
                  } else {
                    drawDirectPath();
                    onRouteResult(null, status);
                  }
                }
              );
            } else {
              drawDirectPath();
            }
          } catch {
            drawDirectPath();
          }
        });
    } else {
      drawDirectPath();
    }

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng, travelMode]);

  return null;
};

// Auto Fit Bounds controller
const FitRouteBoundsController: React.FC<{
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  triggerFit: number;
}> = ({ origin, destination, triggerFit }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    map.fitBounds(bounds, { top: 60, bottom: 60, left: 60, right: 60 });
  }, [map, origin.lat, origin.lng, destination.lat, destination.lng, triggerFit]);

  return null;
};

export const ShopRouteMap: React.FC<ShopRouteMapProps> = ({
  shop,
  userCoordinates,
  userArea = 'ধানমন্ডি, ঢাকা',
  onDetectLocation,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [travelMode, setTravelMode] = useState<'walk' | 'bike' | 'car'>('bike');
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [triggerFit, setTriggerFit] = useState(0);

  const [routeResult, setRouteResult] = useState<google.maps.DirectionsResult | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Fallback origin if user coordinates aren't allowed
  const hasUserCoords = !!userCoordinates;
  const userLat = userCoordinates?.lat ?? 23.7465;
  const userLng = userCoordinates?.lng ?? 90.3760;

  const origin = useMemo(() => ({ lat: userLat, lng: userLng }), [userLat, userLng]);
  const destination = useMemo(() => ({ lat: shop.lat, lng: shop.lng }), [shop.lat, shop.lng]);

  // Geometric calculations for instant display
  const haversineDistKm = calculateDistanceKm(userLat, userLng, shop.lat, shop.lng);
  const directionInfo = calculateDirectionBn(userLat, userLng, shop.lat, shop.lng);
  const localTravelTimes = estimateTravelTimes(haversineDistKm);

  // Extracted route leg information if DirectionsService responds
  const routeLeg = routeResult?.routes?.[0]?.legs?.[0];
  const googleDistanceText = routeLeg?.distance?.text
    ? toBnNumber(routeLeg.distance.text.replace('km', 'কি.মি.').replace('m', 'মিটার'))
    : formatDistanceBn(haversineDistKm);

  const googleDurationText = routeLeg?.duration?.text
    ? toBnNumber(routeLeg.duration.text.replace('mins', 'মিনিট').replace('min', 'মিনিট').replace('hours', 'ঘণ্টা').replace('hour', 'ঘণ্টা'))
    : localTravelTimes[travelMode].labelBn;

  // External link as secondary action for live turn-by-turn driving navigation
  const externalGoogleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${shop.lat},${shop.lng}&travelmode=${
    travelMode === 'walk' ? 'walking' : 'driving'
  }`;

  return (
    <div className="rounded-2xl border-2 border-[#0B4A8A]/20 bg-white shadow-md overflow-hidden transition-all duration-300">
      {/* 1. Header Toolbar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-50 via-white to-orange-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0B4A8A] text-white flex items-center justify-center shadow-xs">
            <Navigation className="w-4 h-4 text-[#FF7900]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                দোকানের রুট ও লাইভ ম্যাপ
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                অ্যাপেই দেখুন
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {hasUserCoords ? 'আপনার বর্তমান লাইভ অবস্থান থেকে রুট' : `${userArea} থেকে রুট`}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Map style toggle */}
          <button
            type="button"
            onClick={() => setMapTypeId((prev) => (prev === 'roadmap' ? 'hybrid' : 'roadmap'))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="ম্যাপ ভিউ পরিবর্তন (স্যাটেলাইট / সাধারণ)"
          >
            <Layers className="w-3.5 h-3.5 text-[#0B4A8A]" />
            <span className="text-[11px] font-medium hidden sm:inline">
              {mapTypeId === 'roadmap' ? 'স্যাটেলাইট' : 'সাধারণ'}
            </span>
          </button>

          {/* Re-center / Fit bounds */}
          <button
            type="button"
            onClick={() => setTriggerFit((prev) => prev + 1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer text-xs flex items-center gap-1"
            title="সম্পূর্ণ রুট ফিট করুন"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FF7900]" />
            <span className="text-[11px] font-medium hidden sm:inline">ফিট রুট</span>
          </button>

          {/* Expand / Minimize */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title={isExpanded ? 'ছোট করুন' : 'বড় করে দেখুন'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Travel Mode Selector & Quick ETA */}
      <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 mr-1">যাওয়ার মাধ্যম:</span>

          {/* Walking */}
          <button
            type="button"
            onClick={() => setTravelMode('walk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              travelMode === 'walk'
                ? 'bg-[#0B4A8A] text-white border-[#0B4A8A] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>হেঁটে</span>
          </button>

          {/* Rickshaw / Bike */}
          <button
            type="button"
            onClick={() => setTravelMode('bike')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              travelMode === 'bike'
                ? 'bg-[#FF7900] text-white border-[#FF7900] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>রিকশা/বাইক</span>
          </button>

          {/* Car / CNG */}
          <button
            type="button"
            onClick={() => setTravelMode('car')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              travelMode === 'car'
                ? 'bg-[#0B4A8A] text-white border-[#0B4A8A] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>গাড়ি/সিএনজি</span>
          </button>
        </div>

        {/* Live Distance & Duration Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
            দূরত্ব: <span className="text-[#FF7900] font-black">{googleDistanceText}</span>
          </div>
          <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
            সময়: <span className="text-[#0B4A8A] font-black">{googleDurationText}</span>
          </div>
        </div>
      </div>

      {/* 3. The Interactive Google Map Embedded in Pasher Shop */}
      <div
        className={`relative w-full transition-all duration-300 bg-slate-100 ${
          isExpanded ? 'h-[440px]' : 'h-[280px] sm:h-[320px]'
        }`}
      >
        {apiKey ? (
          <APIProvider apiKey={apiKey} language="bn" region="BD">
            <Map
              mapId="DEMO_MAP_ID"
              defaultCenter={destination}
              defaultZoom={14}
              mapTypeId={mapTypeId}
              gestureHandling="greedy"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              {/* Auto fit route to screen */}
              <FitRouteBoundsController
                origin={origin}
                destination={destination}
                triggerFit={triggerFit}
              />

              {/* Directions polyline renderer */}
              <DirectionsRouteHandler
                origin={origin}
                destination={destination}
                travelMode={travelMode}
                onRouteResult={(res, err) => {
                  setRouteResult(res);
                  setRouteError(err || null);
                }}
              />

              {/* User live position AdvancedMarker */}
              <AdvancedMarker position={origin} title="আপনার বর্তমান অবস্থান">
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center gap-1 bg-[#0B4A8A] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md border border-white mb-1 whitespace-nowrap animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>আপনি</span>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75" />
                    <div className="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md" />
                  </div>
                </div>
              </AdvancedMarker>

              {/* Shop destination AdvancedMarker */}
              <AdvancedMarker position={destination} title={shop.nameBn}>
                <div className="relative flex flex-col items-center">
                  <div className="flex items-center gap-1.5 bg-[#FF7900] text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-lg border-2 border-white mb-1 whitespace-nowrap">
                    <Store className="w-3.5 h-3.5" />
                    <span>{shop.nameBn}</span>
                  </div>
                  <div className="w-3 h-3 bg-[#FF7900] rotate-45 -mt-2 border-r-2 border-b-2 border-white" />
                </div>
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-100 dark:bg-slate-900">
            <MapPin className="w-8 h-8 text-[#FF7900] mb-2 animate-bounce" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {shop.nameBn} এর অবস্থান ও দিকদর্শন
            </p>
            <p className="text-xs text-slate-500 mt-1">
              দূরত্ব: {formatDistanceBn(haversineDistKm)} · দিক: {directionInfo.directionBn}
            </p>
            <a
              href={externalGoogleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B4A8A] text-white text-xs font-bold hover:bg-[#093a6d] transition-all shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps অ্যাপে সরাসরি রাস্তা দেখুন</span>
            </a>
          </div>
        )}

        {/* Floating Controls Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {/* Compass bearing pill */}
          <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-md border border-slate-200/80 text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#0B4A8A]" />
            <span>দিক: {directionInfo.directionBn} ({toBnNumber(directionInfo.bearing)}°)</span>
          </div>

          {!hasUserCoords && onDetectLocation && (
            <button
              type="button"
              onClick={onDetectLocation}
              className="bg-white/95 hover:bg-white backdrop-blur-xs px-2.5 py-1.5 rounded-xl shadow-md border border-blue-200 text-[11px] font-bold text-[#0B4A8A] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <LocateFixed className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>লাইভ GPS চালু করুন</span>
            </button>
          )}
        </div>

        {/* Route status message badge if offline or direct line */}
        {routeError && (
          <div className="absolute bottom-3 left-3 right-3 z-10 bg-amber-500/95 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>সরাসরি দূরত্ব দেখানো হচ্ছে ({formatDistanceBn(haversineDistKm)})</span>
          </div>
        )}
      </div>

      {/* 4. Turn-by-Turn Route Steps Accordion (টার্ন-বাই-টার্ন পথ নির্দেশনা) */}
      <div className="border-t border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setShowSteps((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FF7900]/10 text-[#FF7900] flex items-center justify-center">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                টার্ন-বাই-টার্ন পথ নির্দেশনা (রুট গাইড)
              </span>
              <span className="text-[11px] text-slate-500 ml-2">
                {routeLeg?.steps?.length
                  ? `(${toBnNumber(routeLeg.steps.length)} টি ধাপ)`
                  : '(সাধারণ গাইড)'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#0B4A8A]">
            <span>{showSteps ? 'লুকান' : 'বিস্তারিত দেখুন'}</span>
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showSteps && (
          <div className="px-4 pb-4 pt-1 space-y-2.5 bg-slate-50/60 border-t border-slate-100 max-h-56 overflow-y-auto">
            {routeLeg?.steps && routeLeg.steps.length > 0 ? (
              routeLeg.steps.map((step, idx) => {
                const stepBn = formatGoogleManeuverToBn(step.instructions);
                const stepDist = step.distance?.text
                  ? toBnNumber(step.distance.text.replace('km', 'কি.মি.').replace('m', 'মিটার'))
                  : '';

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0B4A8A]/10 text-[#0B4A8A] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {toBnNumber(idx + 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-medium leading-relaxed">{stepBn}</p>
                      {stepDist && (
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5 inline-block">
                          {stepDist} এগিয়ে যান
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0B4A8A] shrink-0" />
                  <span>
                    আপনার অবস্থান থেকে <strong>{directionInfo.directionBn}</strong> দিকে অগ্রসর হয়ে{' '}
                    <strong>{shop.addressBn}</strong> তে পৌঁছান।
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#FF7900] shrink-0" />
                  <span>
                    দোকানের অবস্থান: <strong>{shop.nameBn}</strong> ({shop.categoryBn})
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Footer with External Google Maps App Link as Backup */}
      <div className="p-3 sm:p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="text-[11px] text-slate-500 text-center sm:text-left">
          পাসার শপের ম্যাপে লাইভ রুট দেখানো হয়েছে। গাড়ি বা বাইক চালানোর সময় ভয়েস নেভিগেশনের জন্য:
        </div>

        <a
          href={externalGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-[#0B4A8A] hover:text-[#093a6d] bg-white hover:bg-slate-100 border border-slate-300 shadow-2xs flex items-center justify-center gap-1.5 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#FF7900]" />
          <span>গুগল ম্যাপ অ্যাপে খুলুন</span>
        </a>
      </div>
    </div>
  );
};
