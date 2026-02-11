import { METRO_STATIONS } from './metroStations';

export function getGoogleMapsUrl(lat, lon) {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}

export const FRANCE_BOUNDS = { minLat: 41.3, maxLat: 51.1, minLon: -5.2, maxLon: 9.6 };

export function isInFrance(lat, lon) {
  return lat >= FRANCE_BOUNDS.minLat && lat <= FRANCE_BOUNDS.maxLat &&
         lon >= FRANCE_BOUNDS.minLon && lon <= FRANCE_BOUNDS.maxLon;
}

export function parseTimeToMinutes(timeStr) {
  if (!timeStr || timeStr === 'N/A') return Infinity;
  const hourMatch = timeStr.match(/(\d+)h\s*(\d+)?m?/);
  if (hourMatch) return parseInt(hourMatch[1]) * 60 + (parseInt(hourMatch[2]) || 0);
  const minMatch = timeStr.match(/(\d+)\s*min/);
  if (minMatch) return parseInt(minMatch[1]);
  const hoursMatch = timeStr.match(/(\d+)(?:-\d+)?\s*Hours?/i);
  if (hoursMatch) return parseInt(hoursMatch[1]) * 60;
  return Infinity;
}

export function formatDuration(seconds) {
  if (seconds == null || seconds <= 0) return 'N/A';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `~${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem === 0) return `~${hours}h`;
  return `~${hours}h ${rem}m`;
}

export function formatAddress(props) {
  const parts = [];
  if (props.housenumber && props.street) {
    parts.push(`${props.housenumber} ${props.street}`);
  } else if (props.street) {
    parts.push(props.street);
  } else if (props.name) {
    parts.push(props.name);
  }
  if (props.city) parts.push(props.city);
  else if (props.district) parts.push(props.district);
  if (props.postcode) parts.push(props.postcode);
  return parts.join(', ') || props.name || 'Unknown';
}

export function parsePrice(priceStr) {
  if (!priceStr || priceStr.startsWith('Free')) return 0;
  const match = priceStr.match(/€([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

const DAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function isClosedOnDate(daysOpen, dateStr) {
  if (!dateStr || daysOpen === 'Daily') return false;
  if (daysOpen === 'Select Days') return 'maybe';

  const match = daysOpen.match(/^(\w+)-(\w+)$/);
  if (!match) return false;

  const startDay = DAY_MAP[match[1]];
  const endDay = DAY_MAP[match[2]];
  if (startDay === undefined || endDay === undefined) return false;

  const date = new Date(dateStr + 'T12:00:00');
  const dow = date.getDay();

  if (startDay <= endDay) {
    return dow < startDay || dow > endDay;
  }
  return dow > endDay && dow < startDay;
}

export function getDayLabel(dateStr, locale = 'en-US') {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
}

export function getTypeColor(type) {
  switch (type) {
    case 'Indoor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'Outdoor': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'Mix': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

export function getWeatherInfo(code) {
  if (code === 0) return { icon: 'Sun', labelKey: 'weather.clearSky' };
  if (code === 1) return { icon: 'Sun', labelKey: 'weather.mainlyClear' };
  if (code === 2) return { icon: 'CloudSun', labelKey: 'weather.partlyCloudy' };
  if (code === 3) return { icon: 'Cloud', labelKey: 'weather.overcast' };
  if (code === 45 || code === 48) return { icon: 'CloudFog', labelKey: 'weather.foggy' };
  if (code >= 51 && code <= 55) return { icon: 'CloudDrizzle', labelKey: 'weather.drizzle' };
  if (code >= 56 && code <= 57) return { icon: 'CloudDrizzle', labelKey: 'weather.freezingDrizzle' };
  if (code >= 61 && code <= 65) return { icon: 'CloudRain', labelKey: 'weather.rain' };
  if (code >= 66 && code <= 67) return { icon: 'CloudRain', labelKey: 'weather.freezingRain' };
  if (code >= 71 && code <= 77) return { icon: 'CloudSnow', labelKey: 'weather.snow' };
  if (code >= 80 && code <= 82) return { icon: 'CloudRain', labelKey: 'weather.rainShowers' };
  if (code >= 85 && code <= 86) return { icon: 'CloudSnow', labelKey: 'weather.snowShowers' };
  if (code === 95) return { icon: 'CloudLightning', labelKey: 'weather.thunderstorm' };
  if (code >= 96 && code <= 99) return { icon: 'CloudLightning', labelKey: 'weather.thunderstormHail' };
  return { icon: 'Cloud', labelKey: 'weather.unknown' };
}

export function getMarkerColor(type, completed) {
  if (completed) return '#9ca3af';
  switch (type) {
    case 'Indoor': return '#3b82f6';
    case 'Outdoor': return '#22c55e';
    case 'Mix': return '#f97316';
    default: return '#6b7280';
  }
}

// Colors for day-based map markers (up to 22 days)
export const DAY_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
  '#6366f1', '#d946ef', '#0ea5e9', '#eab308', '#a855f6',
  '#10b981', '#e11d48', '#0284c7', '#65a30d', '#7c3aed',
  '#db2777', '#059669',
];

// Hybrid metro+walking transit constants
const WALK_SPEED = 80;            // meters per minute (4.8 km/h)
const METRO_SPEED = 500;          // meters per minute (~30 km/h avg)
const METRO_OVERHEAD = 5;         // minutes (wait + platform + transfer)
const SHORT_DISTANCE = 1200;      // meters — below this, walking is always better
const MAX_STATION_RADIUS = 1500;  // meters — don't consider stations farther
const WALK_DETOUR_FACTOR = 1.3;   // streets aren't straight lines
const DAY_TRIP_THRESHOLD = 30000; // meters — keep original default time

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestStation(lat, lon) {
  if (!METRO_STATIONS || METRO_STATIONS.length === 0) return null;
  let best = null;
  let bestDist = Infinity;
  for (const station of METRO_STATIONS) {
    const d = haversineDistance(lat, lon, station.lat, station.lon);
    if (d < bestDist) {
      bestDist = d;
      best = station;
    }
  }
  if (bestDist > MAX_STATION_RADIUS) return null;
  return { station: best, distance: bestDist };
}

export function estimateHybridTransit(originLat, originLon, destLat, destLon, osrmWalkSec) {
  // Guard against missing coordinates
  if (!originLat || !originLon || !destLat || !destLon) {
    return { totalMinutes: 0, method: 'walking', breakdown: null, formatted: 'N/A' };
  }

  const straightLine = haversineDistance(originLat, originLon, destLat, destLon);

  // Day trips: keep original default time
  if (straightLine > DAY_TRIP_THRESHOLD) {
    return { totalMinutes: 0, method: 'daytrip', breakdown: null, formatted: null };
  }

  // Pure walking estimate: prefer OSRM if available, else Haversine
  const pureWalkMin = osrmWalkSec != null
    ? osrmWalkSec / 60
    : (straightLine * WALK_DETOUR_FACTOR) / WALK_SPEED;

  // Short distance: walking is always better
  if (straightLine < SHORT_DISTANCE) {
    const mins = Math.round(pureWalkMin);
    return { totalMinutes: mins, method: 'walking', breakdown: null, formatted: `~${mins} min` };
  }

  // Find nearest stations
  const originStation = findNearestStation(originLat, originLon);
  const destStation = findNearestStation(destLat, destLon);

  // No station nearby or same station → walking only
  if (!originStation || !destStation || originStation.station.name === destStation.station.name) {
    const mins = Math.round(pureWalkMin);
    return { totalMinutes: mins, method: 'walking', breakdown: null, formatted: `~${mins} min` };
  }

  // Hybrid: walk to metro + ride + walk from metro
  const walk1 = (originStation.distance * WALK_DETOUR_FACTOR) / WALK_SPEED;
  const walk2 = (destStation.distance * WALK_DETOUR_FACTOR) / WALK_SPEED;
  const metroDist = haversineDistance(
    originStation.station.lat, originStation.station.lon,
    destStation.station.lat, destStation.station.lon
  );
  const metroTime = metroDist / METRO_SPEED;
  const totalMetro = walk1 + metroTime + METRO_OVERHEAD + walk2;

  if (totalMetro < pureWalkMin) {
    const mins = Math.round(totalMetro);
    return {
      totalMinutes: mins,
      method: 'metro',
      breakdown: {
        walk1: Math.round(walk1),
        metro: Math.round(metroTime),
        overhead: METRO_OVERHEAD,
        walk2: Math.round(walk2),
      },
      formatted: `~${mins} min`,
    };
  }

  const mins = Math.round(pureWalkMin);
  return { totalMinutes: mins, method: 'walking', breakdown: null, formatted: `~${mins} min` };
}

export const STORAGE_KEY = 'paris-trip-data';

export const initialData = [
  { id: 1, activity: "Bibliothèque Nationale (Richelieu)", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free (Oval Room)", time: "20 min", location: "2nd Arr.", lat: 48.8683, lon: 2.3385, metro: "Bourse (Line 3)" },
  { id: 2, activity: "Palais Garnier (Opera)", type: "Indoor", days: "Daily", hours: "10:00 - 17:00", price: "€15.00", time: "20 min", location: "Opéra", lat: 48.8720, lon: 2.3316, metro: "Opéra (Lines 3, 7, 8)" },
  { id: 3, activity: "Musée Picasso", type: "Indoor", days: "Tue-Sun", hours: "09:30 - 18:00", price: "€16.00", time: "1 min (Walk)", location: "Marais (Next door)", lat: 48.8598, lon: 2.3625, metro: "Saint-Paul (Line 1)" },
  { id: 4, activity: "Musée du Louvre", type: "Indoor", days: "Wed-Mon", hours: "09:00 - 18:00", price: "€22.00", time: "20 min", location: "1st Arr.", lat: 48.8606, lon: 2.3376, metro: "Palais Royal (Lines 1, 7)" },
  { id: 5, activity: "Eiffel Tower (Summit)", type: "Mix", days: "Daily", hours: "09:30 - 23:45", price: "€29.40", time: "40 min", location: "7th Arr.", lat: 48.8584, lon: 2.2945, metro: "Bir-Hakeim (Line 6)" },
  { id: 6, activity: "Eiffel Tower (Night View)", type: "Outdoor", days: "Daily", hours: "Sunset - 23:00", price: "Free", time: "35 min", location: "Trocadéro / Rue Univ.", lat: 48.8616, lon: 2.2886, metro: "Trocadéro (Lines 6, 9)" },
  { id: 7, activity: "Versailles Palace & Gardens", type: "Mix", days: "Tue-Sun", hours: "09:00 - 17:30", price: "€21.00", time: "75 min", location: "Versailles", lat: 48.8049, lon: 2.1204, metro: "Versailles Château (RER C)" },
  { id: 8, activity: "Musée de l'Orangerie", type: "Indoor", days: "Wed-Mon", hours: "09:00 - 18:00", price: "€12.50", time: "25 min", location: "Tuileries", lat: 48.8607, lon: 2.3226, metro: "Concorde (Lines 1, 8, 12)" },
  { id: 9, activity: "Musée Carnavalet (History)", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free", time: "5 min (Walk)", location: "Marais", lat: 48.8576, lon: 2.3626, metro: "Saint-Paul (Line 1)" },
  { id: 10, activity: "Notre Dame de Paris", type: "Mix", days: "Daily", hours: "07:50 - 19:00", price: "Free", time: "20 min", location: "Île de la Cité", lat: 48.8530, lon: 2.3499, metro: "Cité (Line 4)" },
  { id: 11, activity: "Musée de la Vie Romantique", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free", time: "30 min", location: "9th Arr.", lat: 48.8812, lon: 2.3329, metro: "Blanche (Line 2)" },
  { id: 12, activity: "Musée Rodin", type: "Mix", days: "Tue-Sun", hours: "10:00 - 17:45", price: "€14.00", time: "30 min", location: "7th Arr.", lat: 48.8554, lon: 2.3161, metro: "Varenne (Line 13)" },
  { id: 13, activity: "Musée Marmottan Monet", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "€14.00", time: "45 min", location: "16th Arr.", lat: 48.8601, lon: 2.2668, metro: "La Muette (Line 9)" },
  { id: 14, activity: "Dinner Cruise (Prestige)", type: "Indoor", days: "Daily", hours: "18:00 / 20:30", price: "€90 - €165", time: "40 min", location: "Seine (Alma/Eiffel)", lat: 48.8638, lon: 2.3005, metro: "Alma-Marceau (Line 9)" },
  { id: 16, activity: "River Boat Tour (Pont Neuf)", type: "Mix", days: "Daily", hours: "10:30 - 22:00", price: "€15.00", time: "25 min", location: "Pont Neuf", lat: 48.8568, lon: 2.3415, metro: "Pont Neuf (Line 7)" },
  { id: 17, activity: "Sacré-Cœur Basilica", type: "Mix", days: "Daily", hours: "06:00 - 22:30", price: "Free", time: "40 min", location: "Montmartre", lat: 48.8867, lon: 2.3431, metro: "Anvers (Line 2)" },
  { id: 18, activity: "Galeries Lafayette", type: "Indoor", days: "Daily", hours: "10:00 - 20:30", price: "Free", time: "20 min", location: "Opéra", lat: 48.8738, lon: 2.3320, metro: "Chaussée d'Antin (Lines 7, 9)" },
  { id: 19, activity: "Arc de Triomphe", type: "Mix", days: "Daily", hours: "10:00 - 22:30", price: "€16.00", time: "25 min", location: "Champs-Élysées", lat: 48.8738, lon: 2.2950, metro: "Charles de Gaulle-Étoile (Lines 1, 2, 6)" },
  { id: 20, activity: "Musée de l'Armée (Invalides)", type: "Indoor", days: "Daily", hours: "10:00 - 18:00", price: "€15.00", time: "30 min", location: "7th Arr.", lat: 48.8550, lon: 2.3125, metro: "Invalides (Lines 8, 13)" },
  { id: 21, activity: "Panthéon", type: "Indoor", days: "Daily", hours: "10:00 - 18:00", price: "€13.00", time: "25 min", location: "Latin Quarter", lat: 48.8462, lon: 2.3464, metro: "Cardinal Lemoine (Line 10)" },
  { id: 22, activity: "Tour Montparnasse", type: "Mix", days: "Daily", hours: "09:30 - 22:30", price: "€19.00", time: "35 min", location: "Montparnasse", lat: 48.8422, lon: 2.3219, metro: "Montparnasse (Lines 4, 6, 12, 13)" },
  { id: 23, activity: "Aura Invalides (Show)", type: "Indoor", days: "Select Days", hours: "19:00 +", price: "€28.00", time: "30 min", location: "Invalides", lat: 48.8550, lon: 2.3125, metro: "Invalides (Lines 8, 13)" },
  { id: 24, activity: "Petit Palais", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free", time: "25 min", location: "Champs-Élysées", lat: 48.8662, lon: 2.3126, metro: "Champs-Élysées-Clemenceau (Lines 1, 13)" },
  { id: 25, activity: "Jazz Bar (Caveau Huchette)", type: "Indoor", days: "Daily", hours: "21:00 - 02:00", price: "€14.00", time: "25 min", location: "Latin Quarter", lat: 48.8524, lon: 2.3463, metro: "Saint-Michel (Line 4, RER B/C)" },
  { id: 27, activity: "Cité de l'Architecture", type: "Indoor", days: "Wed-Mon", hours: "11:00 - 19:00", price: "€9.00", time: "35 min", location: "Trocadéro", lat: 48.8631, lon: 2.2876, metro: "Trocadéro (Lines 6, 9)" },
  { id: 28, activity: "Musée d'Orsay", type: "Indoor", days: "Tue-Sun", hours: "09:30 - 18:00", price: "€16.00", time: "30 min", location: "Left Bank", lat: 48.8600, lon: 2.3266, metro: "Solférino (Line 12)" },
  { id: 29, activity: "Fondation Louis Vuitton", type: "Indoor", days: "Wed-Mon", hours: "11:00 - 20:00", price: "€16.00", time: "50 min", location: "Bois de Boulogne", lat: 48.8764, lon: 2.2651, metro: "Les Sablons (Line 1)" },
  { id: 31, activity: "Sainte-Chapelle", type: "Indoor", days: "Daily", hours: "09:00 - 17:00", price: "€11.50", time: "20 min", location: "Île de la Cité", lat: 48.8554, lon: 2.3450, metro: "Cité (Line 4)" },
  { id: 32, activity: "Catacombs of Paris", type: "Indoor", days: "Tue-Sun", hours: "09:45 - 20:30", price: "€29.00", time: "35 min", location: "14th Arr.", lat: 48.8338, lon: 2.3324, metro: "Denfert-Rochereau (Lines 4, 6)" },
  { id: 33, activity: "Centre Pompidou", type: "Indoor", days: "Wed-Mon", hours: "11:00 - 21:00", price: "€15.00", time: "15 min", location: "4th Arr.", lat: 48.8607, lon: 2.3525, metro: "Rambuteau (Line 11)" },
  { id: 34, activity: "Jardin du Luxembourg", type: "Outdoor", days: "Daily", hours: "07:30 - 21:00", price: "Free", time: "25 min", location: "6th Arr.", lat: 48.8462, lon: 2.3372, metro: "Luxembourg (RER B)" },
  { id: 35, activity: "Moulin Rouge", type: "Indoor", days: "Daily", hours: "21:00 - 23:00", price: "€87.00", time: "35 min", location: "Montmartre", lat: 48.8841, lon: 2.3323, metro: "Blanche (Line 2)" },
  { id: 36, activity: "Père Lachaise Cemetery", type: "Outdoor", days: "Daily", hours: "08:00 - 17:30", price: "Free", time: "40 min", location: "20th Arr.", lat: 48.8614, lon: 2.3933, metro: "Père Lachaise (Lines 2, 3)" },
  { id: 37, activity: "Place des Vosges", type: "Outdoor", days: "Daily", hours: "24 Hours", price: "Free", time: "10 min", location: "Marais", lat: 48.8556, lon: 2.3653, metro: "Bastille (Lines 1, 5, 8)" },
  { id: 38, activity: "Palais de Tokyo", type: "Indoor", days: "Wed-Mon", hours: "12:00 - 21:00", price: "€14.00", time: "35 min", location: "16th Arr.", lat: 48.8648, lon: 2.2975, metro: "Iéna (Line 9)" },
  { id: 39, activity: "Atelier des Lumières", type: "Indoor", days: "Daily", hours: "10:00 - 18:00", price: "€17.00", time: "30 min", location: "11th Arr.", lat: 48.8613, lon: 2.3814, metro: "Voltaire (Line 9)" },
  { id: 40, activity: "Shakespeare and Company", type: "Indoor", days: "Daily", hours: "10:00 - 20:00", price: "Free", time: "20 min", location: "Latin Quarter", lat: 48.8526, lon: 2.3471, metro: "Saint-Michel (Line 4, RER B/C)" },
  { id: 41, activity: "Conciergerie", type: "Indoor", days: "Daily", hours: "09:30 - 18:00", price: "€11.50", time: "20 min", location: "Île de la Cité", lat: 48.8560, lon: 2.3458, metro: "Cité (Line 4)" },
  { id: 42, activity: "Musée de Cluny", type: "Indoor", days: "Wed-Mon", hours: "09:30 - 18:15", price: "€12.00", time: "20 min", location: "Latin Quarter", lat: 48.8508, lon: 2.3442, metro: "Cluny-La Sorbonne (Line 10)" },
  { id: 43, activity: "Jardin des Tuileries", type: "Outdoor", days: "Daily", hours: "07:00 - 21:00", price: "Free", time: "20 min", location: "1st Arr.", lat: 48.8634, lon: 2.3275, metro: "Tuileries (Line 1)" },
  { id: 44, activity: "Canal Saint-Martin", type: "Outdoor", days: "Daily", hours: "24 Hours", price: "Free", time: "25 min", location: "10th Arr.", lat: 48.8710, lon: 2.3653, metro: "République (Lines 3, 5, 8, 9, 11)" },
  { id: 45, activity: "Marché aux Puces de Saint-Ouen", type: "Outdoor", days: "Sat-Mon", hours: "10:00 - 17:30", price: "Free", time: "45 min", location: "Saint-Ouen", lat: 48.9010, lon: 2.3432, metro: "Porte de Clignancourt (Line 4)" },
  { id: 46, activity: "Parc des Buttes-Chaumont", type: "Outdoor", days: "Daily", hours: "07:00 - 21:00", price: "Free", time: "40 min", location: "19th Arr.", lat: 48.8809, lon: 2.3828, metro: "Buttes Chaumont (Line 7bis)" },
  { id: 47, activity: "Disneyland Paris", type: "Mix", days: "Daily", hours: "09:30 - 21:00", price: "€56.00", time: "90 min", location: "Marne-la-Vallée", lat: 48.8674, lon: 2.7836, metro: "Marne-la-Vallée (RER A)" },
  { id: 48, activity: "La Défense Grande Arche", type: "Mix", days: "Daily", hours: "10:00 - 19:00", price: "€15.00", time: "45 min", location: "La Défense", lat: 48.8927, lon: 2.2361, metro: "La Défense (Line 1, RER A)" },
];

export const ACTIVITY_TYPES = ['Indoor', 'Outdoor', 'Mix'];

export const DAYS_OPTIONS = ['Daily', 'Mon-Fri', 'Mon-Sat', 'Tue-Sun', 'Wed-Mon', 'Sat-Mon', 'Select Days'];
