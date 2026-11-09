import { BANGLADESH_DIVISIONS, District, Division } from '../data/bangladeshLocations';

/**
 * Convert English digits to Bengali digits
 */
export const toBnNumber = (num: number | string): string => {
  const bnDigits: { [key: string]: string } = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
    '.': '.',
  };
  return num
    .toString()
    .split('')
    .map((char) => bnDigits[char] || char)
    .join('');
};

/**
 * Calculates distance in kilometers between two coordinates using Haversine formula
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Returns formatted distance in Bengali (e.g., "৮৫০ মিটার" or "১.৫ কি.মি.")
 */
export const formatDistanceBn = (distanceKm: number): string => {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${toBnNumber(meters)} মিটার`;
  }
  return `${toBnNumber(distanceKm.toFixed(1))} কি.মি.`;
};

/**
 * Calculates compass direction from origin to destination in Bengali
 */
export const calculateDirectionBn = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { directionBn: string; bearing: number; description: string } => {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  let directionBn = 'উত্তর দিকে';
  let description = 'সোজা সামনে এগিয়ে যান';

  if (bearing >= 337.5 || bearing < 22.5) {
    directionBn = 'উত্তর দিকে';
    description = 'আপনার বর্তমান অবস্থান থেকে উত্তর দিকে সোজা এগিয়ে যান';
  } else if (bearing >= 22.5 && bearing < 67.5) {
    directionBn = 'উত্তর-পূর্ব দিকে';
    description = 'আপনার অবস্থান থেকে উত্তর-পূর্ব দিকে অগ্রসর হোন';
  } else if (bearing >= 67.5 && bearing < 112.5) {
    directionBn = 'পূর্ব দিকে';
    description = 'পূর্ব দিক বরাবর এগিয়ে যান';
  } else if (bearing >= 112.5 && bearing < 157.5) {
    directionBn = 'দক্ষিণ-পূর্ব দিকে';
    description = 'দক্ষিণ-পূর্ব রাস্তা ধরে সামনে যান';
  } else if (bearing >= 157.5 && bearing < 202.5) {
    directionBn = 'দক্ষিণ দিকে';
    description = 'দক্ষিণমুখী রাস্তায় সোজা অগ্রসর হোন';
  } else if (bearing >= 202.5 && bearing < 247.5) {
    directionBn = 'দক্ষিণ-পশ্চিম দিকে';
    description = 'দক্ষিণ-পশ্চিম রোড দিয়ে এগিয়ে যান';
  } else if (bearing >= 247.5 && bearing < 292.5) {
    directionBn = 'পশ্চিম দিকে';
    description = 'পশ্চিম দিক বরাবর প্রধান রাস্তা ধরে যান';
  } else if (bearing >= 292.5 && bearing < 337.5) {
    directionBn = 'উত্তর-পশ্চিম দিকে';
    description = 'উত্তর-পশ্চিম মুখী গলি/রোড ধরে এগিয়ে যান';
  }

  return { directionBn, bearing: Math.round(bearing), description };
};

/**
 * Estimates travel times for Walking, Rickshaw/Bike, and Car/CNG
 */
export const estimateTravelTimes = (distanceKm: number) => {
  // Average speeds in BD urban setting
  // Walk: ~4.5 km/h
  // Rickshaw / Bicycle / Local Bike: ~15-18 km/h
  // Car / CNG / Auto: ~25 km/h
  const walkMinutes = Math.max(1, Math.round((distanceKm / 4.5) * 60));
  const bikeMinutes = Math.max(1, Math.round((distanceKm / 16) * 60));
  const carMinutes = Math.max(1, Math.round((distanceKm / 25) * 60));

  const formatMinutesBn = (mins: number): string => {
    if (mins < 60) {
      return `${toBnNumber(mins)} মিনিট`;
    }
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (remMins === 0) {
      return `${toBnNumber(hours)} ঘণ্টা`;
    }
    return `${toBnNumber(hours)} ঘণ্টা ${toBnNumber(remMins)} মিনিট`;
  };

  return {
    walk: {
      minutes: walkMinutes,
      labelBn: formatMinutesBn(walkMinutes),
    },
    bike: {
      minutes: bikeMinutes,
      labelBn: formatMinutesBn(bikeMinutes),
    },
    car: {
      minutes: carMinutes,
      labelBn: formatMinutesBn(carMinutes),
    },
  };
};

/**
 * Find closest district in Bangladesh to given GPS coordinates
 */
export const findNearestLocation = (
  lat: number,
  lng: number
): {
  division: Division;
  district: District;
  nearestAreaName: string;
  distanceKm: number;
} => {
  let closestDist: District | null = null;
  let closestDiv: Division | null = null;
  let minDistance = Infinity;

  for (const div of BANGLADESH_DIVISIONS) {
    for (const dist of div.districts) {
      const d = calculateDistanceKm(lat, lng, dist.lat, dist.lng);
      if (d < minDistance) {
        minDistance = d;
        closestDist = dist;
        closestDiv = div;
      }
    }
  }

  const division = closestDiv || BANGLADESH_DIVISIONS[0];
  const district = closestDist || BANGLADESH_DIVISIONS[0].districts[0];
  const firstUpazila = district.upazilas[0] || district.nameBn;

  return {
    division,
    district,
    nearestAreaName: `${firstUpazila}, ${district.nameBn}`,
    distanceKm: minDistance,
  };
};

/**
 * Resolves accurate real-world location name from coordinates via reverse geocoding
 */
export const getRealLocationAddress = async (lat: number, lng: number): Promise<string> => {
  // 1. Try Google Maps Geocoder if loaded in window
  if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await new Promise<any>((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0]);
          } else {
            reject(status);
          }
        });
      });
      if (response && response.formatted_address) {
        const sublocality = response.address_components?.find((c: any) =>
          c.types.includes('sublocality') || c.types.includes('neighborhood')
        )?.long_name;
        const locality = response.address_components?.find((c: any) =>
          c.types.includes('locality')
        )?.long_name;
        if (sublocality && locality) {
          return `${sublocality}, ${locality}`;
        }
        return response.formatted_address.split(',').slice(0, 2).join(',').trim();
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Try OpenStreetMap Reverse Geocode in Bengali
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=bn`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      if (addr) {
        const localName = addr.suburb || addr.neighbourhood || addr.village || addr.residential || addr.road;
        const districtOrCity = addr.city || addr.town || addr.state_district || addr.county;
        if (localName && districtOrCity) {
          return `${localName}, ${districtOrCity}`;
        }
        if (data.display_name) {
          return data.display_name.split(',').slice(0, 2).join(',').trim();
        }
      }
    }
  } catch (e) {
    // Fallback
  }

  // 3. Fallback to nearest district match
  const match = findNearestLocation(lat, lng);
  return match.nearestAreaName;
};

