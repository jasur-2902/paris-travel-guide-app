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
  // Wraps around week (e.g., Wed-Mon → closed Tue)
  return dow > endDay && dow < startDay;
}

export function getDayLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function getTypeColor(type) {
  switch (type) {
    case 'Indoor': return 'bg-blue-100 text-blue-800';
    case 'Outdoor': return 'bg-green-100 text-green-800';
    case 'Mix': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
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

export const STORAGE_KEY = 'paris-trip-data';

export const initialData = [
  { id: 1, activity: "Bibliothèque Nationale (Richelieu)", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free (Oval Room)", time: "20 min", location: "2nd Arr.", lat: 48.8683, lon: 2.3385 },
  { id: 2, activity: "Palais Garnier (Opera)", type: "Indoor", days: "Daily", hours: "10:00 - 17:00", price: "€15.00", time: "20 min", location: "Opéra", lat: 48.8720, lon: 2.3316 },
  { id: 3, activity: "Musée Picasso", type: "Indoor", days: "Tue-Sun", hours: "09:30 - 18:00", price: "€16.00", time: "1 min (Walk)", location: "Marais (Next door)", lat: 48.8598, lon: 2.3625 },
  { id: 4, activity: "Musée du Louvre", type: "Indoor", days: "Wed-Mon", hours: "09:00 - 18:00", price: "€22.00", time: "20 min", location: "1st Arr.", lat: 48.8606, lon: 2.3376 },
  { id: 5, activity: "Eiffel Tower (Summit)", type: "Mix", days: "Daily", hours: "09:30 - 23:45", price: "€29.40", time: "40 min", location: "7th Arr.", lat: 48.8584, lon: 2.2945 },
  { id: 6, activity: "Eiffel Tower (Night View)", type: "Outdoor", days: "Daily", hours: "Sunset - 23:00", price: "Free", time: "35 min", location: "Trocadéro / Rue Univ.", lat: 48.8616, lon: 2.2886 },
  { id: 7, activity: "Versailles Palace & Gardens", type: "Mix", days: "Tue-Sun", hours: "09:00 - 17:30", price: "€21.00", time: "75 min", location: "Versailles", lat: 48.8049, lon: 2.1204 },
  { id: 8, activity: "Musée de l'Orangerie", type: "Indoor", days: "Wed-Mon", hours: "09:00 - 18:00", price: "€12.50", time: "25 min", location: "Tuileries", lat: 48.8607, lon: 2.3226 },
  { id: 9, activity: "Musée Carnavalet (History)", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free", time: "5 min (Walk)", location: "Marais", lat: 48.8576, lon: 2.3626 },
  { id: 10, activity: "Notre Dame de Paris", type: "Mix", days: "Daily", hours: "07:50 - 19:00", price: "Free", time: "20 min", location: "Île de la Cité", lat: 48.8530, lon: 2.3499 },
  { id: 11, activity: "Musée de la Vie Romantique", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free", time: "30 min", location: "9th Arr.", lat: 48.8812, lon: 2.3329 },
  { id: 12, activity: "Musée Rodin", type: "Mix", days: "Tue-Sun", hours: "10:00 - 17:45", price: "€14.00", time: "30 min", location: "7th Arr.", lat: 48.8554, lon: 2.3161 },
  { id: 13, activity: "Musée Marmottan Monet", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "€14.00", time: "45 min", location: "16th Arr.", lat: 48.8601, lon: 2.2668 },
  { id: 14, activity: "Dinner Cruise (Prestige)", type: "Indoor", days: "Daily", hours: "18:00 / 20:30", price: "€90 - €165", time: "40 min", location: "Seine (Alma/Eiffel)", lat: 48.8638, lon: 2.3005 },
  { id: 15, activity: "Normandy D-Day Tour", type: "Outdoor", days: "Daily", hours: "07:00 - 21:00", price: "€225.00", time: "12-14 Hours", location: "Normandy", lat: 49.3694, lon: -0.8731 },
  { id: 16, activity: "River Boat Tour (Pont Neuf)", type: "Mix", days: "Daily", hours: "10:30 - 22:00", price: "€15.00", time: "25 min", location: "Pont Neuf", lat: 48.8568, lon: 2.3415 },
  { id: 17, activity: "Sacré-Cœur Basilica", type: "Mix", days: "Daily", hours: "06:00 - 22:30", price: "Free", time: "40 min", location: "Montmartre", lat: 48.8867, lon: 2.3431 },
  { id: 18, activity: "Galeries Lafayette", type: "Indoor", days: "Daily", hours: "10:00 - 20:30", price: "Free", time: "20 min", location: "Opéra", lat: 48.8738, lon: 2.3320 },
  { id: 19, activity: "Arc de Triomphe", type: "Mix", days: "Daily", hours: "10:00 - 22:30", price: "€16.00", time: "25 min", location: "Champs-Élysées", lat: 48.8738, lon: 2.2950 },
  { id: 20, activity: "Musée de l'Armée (Invalides)", type: "Indoor", days: "Daily", hours: "10:00 - 18:00", price: "€15.00", time: "30 min", location: "7th Arr.", lat: 48.8550, lon: 2.3125 },
  { id: 21, activity: "Panthéon", type: "Indoor", days: "Daily", hours: "10:00 - 18:00", price: "€13.00", time: "25 min", location: "Latin Quarter", lat: 48.8462, lon: 2.3464 },
  { id: 22, activity: "Tour Montparnasse", type: "Mix", days: "Daily", hours: "09:30 - 22:30", price: "€19.00", time: "35 min", location: "Montparnasse", lat: 48.8422, lon: 2.3219 },
  { id: 23, activity: "Aura Invalides (Show)", type: "Indoor", days: "Select Days", hours: "19:00 +", price: "€28.00", time: "30 min", location: "Invalides", lat: 48.8550, lon: 2.3125 },
  { id: 24, activity: "Petit Palais", type: "Indoor", days: "Tue-Sun", hours: "10:00 - 18:00", price: "Free", time: "25 min", location: "Champs-Élysées", lat: 48.8662, lon: 2.3126 },
  { id: 25, activity: "Jazz Bar (Caveau Huchette)", type: "Indoor", days: "Daily", hours: "21:00 - 02:00", price: "€14.00", time: "25 min", location: "Latin Quarter", lat: 48.8524, lon: 2.3463 },
  { id: 26, activity: "Butte d'Orgemont (View)", type: "Outdoor", days: "Daily", hours: "24 Hours", price: "Free", time: "75 min", location: "Argenteuil", lat: 48.9393, lon: 2.3089 },
  { id: 27, activity: "Cité de l'Architecture", type: "Indoor", days: "Wed-Mon", hours: "11:00 - 19:00", price: "€9.00", time: "35 min", location: "Trocadéro", lat: 48.8631, lon: 2.2876 },
  { id: 28, activity: "Musée d'Orsay", type: "Indoor", days: "Tue-Sun", hours: "09:30 - 18:00", price: "€16.00", time: "30 min", location: "Left Bank", lat: 48.8600, lon: 2.3266 },
  { id: 29, activity: "Fondation Louis Vuitton", type: "Indoor", days: "Wed-Mon", hours: "11:00 - 20:00", price: "€16.00", time: "50 min", location: "Bois de Boulogne", lat: 48.8764, lon: 2.2651 },
  { id: 30, activity: "Metro Line 6 View", type: "Outdoor", days: "Daily", hours: "24 Hours", price: "Free", time: "35 min", location: "Bir-Hakeim", lat: 48.8539, lon: 2.2911 },
  { id: 31, activity: "Sainte-Chapelle", type: "Indoor", days: "Daily", hours: "09:00 - 17:00", price: "€11.50", time: "20 min", location: "Île de la Cité", lat: 48.8554, lon: 2.3450 },
  { id: 32, activity: "Catacombs of Paris", type: "Indoor", days: "Tue-Sun", hours: "09:45 - 20:30", price: "€29.00", time: "35 min", location: "14th Arr.", lat: 48.8338, lon: 2.3324 },
  { id: 33, activity: "Centre Pompidou", type: "Indoor", days: "Wed-Mon", hours: "11:00 - 21:00", price: "€15.00", time: "15 min", location: "4th Arr.", lat: 48.8607, lon: 2.3525 },
  { id: 34, activity: "Jardin du Luxembourg", type: "Outdoor", days: "Daily", hours: "07:30 - 21:00", price: "Free", time: "25 min", location: "6th Arr.", lat: 48.8462, lon: 2.3372 },
  { id: 35, activity: "Moulin Rouge", type: "Indoor", days: "Daily", hours: "21:00 - 23:00", price: "€87.00", time: "35 min", location: "Montmartre", lat: 48.8841, lon: 2.3323 },
  { id: 36, activity: "Père Lachaise Cemetery", type: "Outdoor", days: "Daily", hours: "08:00 - 17:30", price: "Free", time: "40 min", location: "20th Arr.", lat: 48.8614, lon: 2.3933 },
  { id: 37, activity: "Place des Vosges", type: "Outdoor", days: "Daily", hours: "24 Hours", price: "Free", time: "10 min", location: "Marais", lat: 48.8556, lon: 2.3653 },
  { id: 38, activity: "Palais de Tokyo", type: "Indoor", days: "Wed-Mon", hours: "12:00 - 21:00", price: "€14.00", time: "35 min", location: "16th Arr.", lat: 48.8648, lon: 2.2975 },
  { id: 39, activity: "Atelier des Lumières", type: "Indoor", days: "Daily", hours: "10:00 - 18:00", price: "€17.00", time: "30 min", location: "11th Arr.", lat: 48.8613, lon: 2.3814 },
  { id: 40, activity: "Shakespeare and Company", type: "Indoor", days: "Daily", hours: "10:00 - 20:00", price: "Free", time: "20 min", location: "Latin Quarter", lat: 48.8526, lon: 2.3471 },
  { id: 41, activity: "Conciergerie", type: "Indoor", days: "Daily", hours: "09:30 - 18:00", price: "€11.50", time: "20 min", location: "Île de la Cité", lat: 48.8560, lon: 2.3458 },
  { id: 42, activity: "Musée de Cluny", type: "Indoor", days: "Wed-Mon", hours: "09:30 - 18:15", price: "€12.00", time: "20 min", location: "Latin Quarter", lat: 48.8508, lon: 2.3442 },
  { id: 43, activity: "Jardin des Tuileries", type: "Outdoor", days: "Daily", hours: "07:00 - 21:00", price: "Free", time: "20 min", location: "1st Arr.", lat: 48.8634, lon: 2.3275 },
  { id: 44, activity: "Canal Saint-Martin", type: "Outdoor", days: "Daily", hours: "24 Hours", price: "Free", time: "25 min", location: "10th Arr.", lat: 48.8710, lon: 2.3653 },
  { id: 45, activity: "Marché aux Puces de Saint-Ouen", type: "Outdoor", days: "Sat-Mon", hours: "10:00 - 17:30", price: "Free", time: "45 min", location: "Saint-Ouen", lat: 48.9010, lon: 2.3432 },
  { id: 46, activity: "Parc des Buttes-Chaumont", type: "Outdoor", days: "Daily", hours: "07:00 - 21:00", price: "Free", time: "40 min", location: "19th Arr.", lat: 48.8809, lon: 2.3828 },
  { id: 47, activity: "Disneyland Paris", type: "Mix", days: "Daily", hours: "09:30 - 21:00", price: "€56.00", time: "90 min", location: "Marne-la-Vallée", lat: 48.8674, lon: 2.7836 },
  { id: 48, activity: "La Défense Grande Arche", type: "Mix", days: "Daily", hours: "10:00 - 19:00", price: "€15.00", time: "45 min", location: "La Défense", lat: 48.8927, lon: 2.2361 },
];

export const ACTIVITY_TYPES = ['Indoor', 'Outdoor', 'Mix'];

export const DAYS_OPTIONS = ['Daily', 'Mon-Fri', 'Mon-Sat', 'Tue-Sun', 'Wed-Mon', 'Sat-Mon', 'Select Days'];
