import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, MapPin, X, Loader2, LocateFixed, AlertCircle, CheckCircle2, Table, CalendarDays, Map, Plus, Eye, EyeOff, Sun as SunIcon, Moon, Globe, Cloud, CloudSun, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog, ChevronDown, Settings, ToggleLeft, ToggleRight, ClipboardCopy, HelpCircle } from 'lucide-react';
import { STORAGE_KEY, initialData, isInFrance, formatAddress, getWeatherInfo, estimateHybridTransit } from './utils';
import { useLanguage, SUPPORTED_LANGUAGES } from './i18n';
import TableView from './TableView';
import DayPlanner from './DayPlanner';
import MapView from './MapView';
import BudgetTracker from './BudgetTracker';
import TripStats from './TripStats';
import TripTips from './TripTips';
import AddActivityModal from './AddActivityModal';
import Tutorial from './Tutorial';

function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved)) return { items: saved };
    return saved;
  } catch {
    return null;
  }
}

function loadState() {
  const saved = loadSavedData();
  const presetItems = initialData.map(item => {
    if (!saved?.items) return { ...item, completed: false, plannedDate: '', hidden: false, notes: '', sortOrder: 0 };
    const s = saved.items.find(i => i.id === item.id);
    if (!s) return { ...item, completed: false, plannedDate: '', hidden: false, notes: '', sortOrder: 0 };
    return {
      ...item,
      completed: s.completed || false,
      plannedDate: s.plannedDate || '',
      hidden: s.hidden || false,
      notes: s.notes || '',
      sortOrder: s.sortOrder || 0,
      ...(s.time ? { time: s.time } : {}),
      ...(s.transitMethod ? { transitMethod: s.transitMethod } : {}),
      ...(s.timeBreakdown ? { timeBreakdown: s.timeBreakdown } : {}),
    };
  });
  const customItems = (saved?.customItems || []).map(i => ({ ...i, notes: i.notes || '', sortOrder: i.sortOrder || 0 }));
  return [...presetItems, ...customItems];
}

function Notification({ notification, onDismiss }) {
  if (!notification) return null;
  const isError = notification.type === 'error';
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm mb-4 ${
      isError ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
    }`}>
      {isError ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      <span className="flex-1">{notification.message}</span>
      <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

const WEATHER_ICONS = { Sun: SunIcon, CloudSun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog };

function WeatherSkeleton() {
  return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 animate-skeleton" />
      <div className="w-16 h-3 rounded bg-gray-200 dark:bg-gray-600 animate-skeleton" />
    </div>
  );
}

function WeatherPill({ weather, locale, t, onDayClick }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allDates = Object.keys(weather).sort();
  if (allDates.length === 0) return null;

  const today = new Date().toISOString().split('T')[0];

  // Focused 8-day window: 3 past + today + 4 future
  const todayIdx = allDates.indexOf(today);
  let windowDates;
  if (todayIdx === -1) {
    // today not in data — show first 8
    windowDates = allDates.slice(0, 8);
  } else {
    const start = Math.max(0, todayIdx - 3);
    windowDates = allDates.slice(start, start + 8);
  }

  const displayDates = expanded ? allDates : windowDates;

  // Pill summary uses the 8-day window
  const windowHighs = windowDates.map(d => weather[d].high);
  const windowLows = windowDates.map(d => weather[d].low);
  const minLow = Math.round(Math.min(...windowLows));
  const maxHigh = Math.round(Math.max(...windowHighs));

  // Most common weather icon in window
  const iconCounts = {};
  windowDates.forEach(d => {
    const info = getWeatherInfo(weather[d].code);
    iconCounts[info.icon] = (iconCounts[info.icon] || 0) + 1;
  });
  const topIcon = Object.entries(iconCounts).sort((a, b) => b[1] - a[1])[0][0];
  const PillIcon = WEATHER_ICONS[topIcon] || Cloud;

  return (
    <div ref={ref} data-tutorial="weather-pill" className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
      >
        <PillIcon size={15} />
        <span className="font-semibold">{minLow}° — {maxHigh}°C</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 max-w-[calc(100vw-2rem)] ${expanded ? 'min-w-[280px] sm:min-w-[320px]' : 'min-w-[280px] sm:min-w-[460px]'}`}>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">{t('weather.forecast')}</div>
          <div className={`grid ${expanded ? 'gap-1.5 grid-cols-3 sm:grid-cols-4 md:grid-cols-5' : 'gap-2 sm:gap-3 grid-cols-4 sm:grid-cols-8'}`}>
            {displayDates.map(date => {
              const w = weather[date];
              const info = getWeatherInfo(w.code);
              const Icon = WEATHER_ICONS[info.icon] || Cloud;
              const d = new Date(date + 'T12:00:00');
              const dayLabel = d.toLocaleDateString(locale, { weekday: 'short' });
              const dayNum = d.getDate();
              const isToday = date === today;
              return (
                <button
                  key={date}
                  onClick={() => { onDayClick(date); setOpen(false); setExpanded(false); }}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-2.5 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors group ${isToday ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/40' : ''}`}
                  title={t(info.labelKey)}
                >
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase">{isToday ? t('weather.today') : dayLabel}</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{dayNum}</span>
                  <Icon size={20} className="text-sky-600 dark:text-sky-400 my-0.5" />
                  <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-100">{Math.round(w.high)}°</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{Math.round(w.low)}°</span>
                </button>
              );
            })}
          </div>
          {allDates.length > 8 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center justify-center gap-1 w-full mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              <span>{expanded ? t('weather.showLess') : t('weather.showAll')}</span>
              <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { t, locale } = useLanguage();
  const saved = loadSavedData();
  const [items, setItems] = useState(loadState);
  const [userLocation, setUserLocation] = useState(() => saved?.location || null);
  const [addressQuery, setAddressQuery] = useState(() => saved?.location?.address || '');
  const [sortConfig, setSortConfig] = useState(() => saved?.sortConfig || { key: null, direction: 'ascending' });
  const [viewMode, setViewMode] = useState(() => {
    try {
      const sv = localStorage.getItem('paris-trip-view');
      if (sv) return sv;
      return 'full';
    } catch { return 'full'; }
  });
  const [activeTab, setActiveTab] = useState(() => {
    if (saved?.activeTab) return saved.activeTab;
    return 'table';
  });
  const [budget, setBudget] = useState(() => saved?.budget || 0);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('paris-trip-dark');
      if (saved !== null) return saved === 'true';
      return true;
    } catch { return true; }
  });
  const [weather, setWeather] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const prevViewModeRef = useRef(null);
  const dropdownRef = useRef(null);
  const settingsRef = useRef(null);
  const notificationTimer = useRef(null);
  const itemsRef = useRef(items);

  useEffect(() => { itemsRef.current = items; }, [items]);

  const hiddenCount = items.filter(i => i.hidden).length;
  const isSimple = viewMode === 'simple';

  const startTutorial = useCallback(() => {
    prevViewModeRef.current = viewMode;
    setViewMode('full');
    setTutorialActive(true);
  }, [viewMode]);

  const closeTutorial = useCallback(() => {
    setTutorialActive(false);
    try { localStorage.setItem('paris-trip-tutorial-done', 'true'); } catch {}
    if (prevViewModeRef.current) {
      setViewMode(prevViewModeRef.current);
      prevViewModeRef.current = null;
    }
  }, []);

  // Auto-start tutorial on first visit
  useEffect(() => {
    try {
      if (localStorage.getItem('paris-trip-tutorial-done')) return;
    } catch { return; }
    const timer = setTimeout(() => startTutorial(), 800);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist view mode
  useEffect(() => {
    try { localStorage.setItem('paris-trip-view', viewMode); } catch {}
  }, [viewMode]);

  // Click outside settings menu
  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try { localStorage.setItem('paris-trip-dark', String(darkMode)); } catch {}
  }, [darkMode]);

  // Weather fetch — next 16 days forecast + last 14 days archive
  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const forecastEnd = new Date(now.getTime() + 15 * 86400000).toISOString().split('T')[0];
      const archiveStart = new Date(now.getTime() - 14 * 86400000).toISOString().split('T')[0];
      const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];
      const weatherMap = {};

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&start_date=${today}&end_date=${forecastEnd}`
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.daily) {
            data.daily.time.forEach((date, idx) => {
              weatherMap[date] = {
                code: data.daily.weather_code[idx],
                high: data.daily.temperature_2m_max[idx],
                low: data.daily.temperature_2m_min[idx],
              };
            });
          }
        }
      } catch {}

      try {
        const res = await fetch(
          `https://archive-api.open-meteo.com/v1/archive?latitude=48.8566&longitude=2.3522&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&start_date=${archiveStart}&end_date=${yesterday}`
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.daily) {
            data.daily.time.forEach((date, idx) => {
              if (!weatherMap[date]) {
                weatherMap[date] = {
                  code: data.daily.weather_code[idx],
                  high: data.daily.temperature_2m_max[idx],
                  low: data.daily.temperature_2m_min[idx],
                };
              }
            });
          }
        }
      } catch {}

      if (!cancelled) {
        setWeather(weatherMap);
        setWeatherLoading(false);
      }
    }
    fetchWeather();
    return () => { cancelled = true; };
  }, []);

  const showNotification = useCallback((type, message, duration = 5000) => {
    clearTimeout(notificationTimer.current);
    setNotification({ type, message });
    notificationTimer.current = setTimeout(() => setNotification(null), duration);
  }, []);

  const dismissNotification = useCallback(() => {
    clearTimeout(notificationTimer.current);
    setNotification(null);
  }, []);

  useEffect(() => {
    const presetDiffs = items
      .filter(i => !i.isCustom)
      .map(({ id, completed, plannedDate, time, hidden, notes, sortOrder, transitMethod, timeBreakdown }) => ({ id, completed, plannedDate, time, hidden, notes, sortOrder, transitMethod, timeBreakdown }));
    const customItems = items.filter(i => i.isCustom);
    const toSave = {
      items: presetDiffs,
      customItems,
      location: userLocation,
      sortConfig,
      activeTab,
      budget,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [items, userLocation, sortConfig, activeTab, budget]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (addressQuery.length < 3 || userLocation?.address === addressQuery) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(addressQuery)}&lat=48.8566&lon=2.3522&limit=10&lang=en&bbox=-5.2,41.3,9.6,51.1`
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSuggestions((data.features || []).filter(f => f.properties.countrycode === 'FR').slice(0, 5));
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [addressQuery, userLocation]);

  const calculateTransitTimes = useCallback(async (lat, lon) => {
    setIsCalculating(true);
    try {
      const currentItems = itemsRef.current;

      // Phase 1: OSRM walking times (non-fatal if fails)
      let osrmDurations = null;
      try {
        const coordPairs = [`${lon},${lat}`, ...currentItems.map(d => `${d.lon},${d.lat}`)];
        const res = await fetch(
          `https://router.project-osrm.org/table/v1/foot/${coordPairs.join(';')}?sources=0&annotations=duration`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.code === 'Ok' && data.durations?.[0]) {
            osrmDurations = {};
            currentItems.forEach((item, idx) => {
              osrmDurations[item.id] = data.durations[0][idx + 1];
            });
          }
        }
      } catch {} // OSRM failure is non-fatal

      // Phase 2: Hybrid estimation for each item
      setItems(prev => prev.map(item => {
        const osrmSec = osrmDurations?.[item.id] ?? null;
        const result = estimateHybridTransit(lat, lon, item.lat, item.lon, osrmSec);

        // Day trips: keep original default time
        if (result.method === 'daytrip') {
          const original = initialData.find(d => d.id === item.id);
          return { ...item, time: original?.time || item.time, transitMethod: 'daytrip', timeBreakdown: null };
        }

        return { ...item, time: result.formatted, transitMethod: result.method, timeBreakdown: result.breakdown };
      }));

      showNotification('success', t('notify.transitUpdated'));
    } catch (e) {
      showNotification('error', t('notify.transitError', { error: e.message }));
    } finally {
      setIsCalculating(false);
    }
  }, [showNotification, t]);

  const selectAddress = async (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    if (!isInFrance(lat, lon)) { showNotification('error', t('notify.selectFrance')); return; }
    const address = formatAddress(feature.properties);
    setUserLocation({ address, lat, lon });
    setAddressQuery(address);
    setShowSuggestions(false);
    setSuggestions([]);
    await calculateTransitTimes(lat, lon);
  };

  const resetLocation = () => {
    setUserLocation(null);
    setAddressQuery('');
    setSuggestions([]);
    setItems(prev => prev.map(item => {
      const original = initialData.find(d => d.id === item.id);
      return { ...item, time: original ? original.time : item.isCustom ? 'N/A' : item.time, transitMethod: null, timeBreakdown: null };
    }));
    dismissNotification();
  };

  const useMyLocation = async () => {
    if (!navigator.geolocation) { showNotification('error', t('notify.geoNotSupported')); return; }
    setIsCalculating(true);
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      if (!isInFrance(lat, lon)) {
        showNotification('error', t('notify.outsideFrance'));
        setIsCalculating(false);
        return;
      }
      let address = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      try {
        const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=en`);
        if (res.ok) {
          const data = await res.json();
          if (data.features?.length) address = formatAddress(data.features[0].properties);
        }
      } catch {}
      setUserLocation({ address, lat, lon });
      setAddressQuery(address);
      setShowSuggestions(false);
      setSuggestions([]);
      await calculateTransitTimes(lat, lon);
    } catch (e) {
      setIsCalculating(false);
      const msgs = {
        1: t('notify.locationDenied'),
        2: t('notify.locationUnavailable'),
        3: t('notify.locationTimeout'),
      };
      showNotification('error', msgs[e.code] || t('notify.locationError'));
    }
  };

  const toggleComplete = (id) => setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  const updateDate = (id, newDate) => setItems(prev => prev.map(item => item.id === id ? { ...item, plannedDate: newDate } : item));
  const updateNotes = (id, notes) => setItems(prev => prev.map(item => item.id === id ? { ...item, notes } : item));
  const toggleHidden = (id) => setItems(prev => prev.map(item => item.id === id ? { ...item, hidden: !item.hidden } : item));
  const addCustomItem = (item) => {
    setItems(prev => [...prev, { ...item, notes: '', sortOrder: 0 }]);
    if (userLocation) setTimeout(() => calculateTransitTimes(userLocation.lat, userLocation.lon), 100);
  };
  const deleteCustomItem = (id) => setItems(prev => prev.filter(item => item.id !== id));
  const reorderItems = (updatedItems) => setItems(updatedItems);

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const exportToCSV = () => {
    const headers = [t('csv.status'), t('csv.plannedDate'), t('table.activity'), t('table.type'), t('csv.daysOpen'), t('table.hours'), t('table.price'), t('csv.transit'), t('csv.location'), t('table.metro'), t('csv.notes')];
    const csvRows = [headers.join(',')];
    const vis = items.filter(i => !i.hidden);
    vis.forEach(row => {
      csvRows.push([
        `"${row.completed ? t('csv.done') : t('csv.toDo')}"`, `"${row.plannedDate}"`, `"${row.activity}"`,
        `"${row.type}"`, `"${row.days}"`, `"${row.hours}"`, `"${row.price}"`, `"${row.time}"`,
        `"${row.location}"`, `"${row.metro || ''}"`, `"${(row.notes || '').replace(/"/g, '""')}"`
      ].join(','));
    });
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csvRows.join('\n')));
    link.setAttribute('download', 'paris_trip_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyItinerary = async () => {
    const byDate = {};
    items.filter(i => i.plannedDate && !i.hidden).forEach(i => {
      if (!byDate[i.plannedDate]) byDate[i.plannedDate] = [];
      byDate[i.plannedDate].push(i);
    });
    const sortedDates = Object.keys(byDate).sort();
    if (sortedDates.length === 0) {
      showNotification('error', t('copy.noPlanned'));
      return;
    }
    const lines = [];
    lines.push(`🗼 ${t('header.title')}\n`);
    sortedDates.forEach(date => {
      const d = new Date(date + 'T12:00:00');
      const label = d.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
      lines.push(`📅 ${label}`);
      byDate[date]
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .forEach((item, idx) => {
          const check = item.completed ? '✅' : '⬜';
          lines.push(`  ${idx + 1}. ${check} ${item.activity} — ${item.price} (${item.hours})`);
          if (item.notes) lines.push(`     📝 ${item.notes}`);
        });
      lines.push('');
    });
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      showNotification('success', t('copy.success'));
    } catch {
      showNotification('error', t('copy.error'));
    }
  };

  const visibleItems = showHidden ? items : items.filter(i => !i.hidden);

  const TABS = [
    { id: 'table', label: t('tabs.table'), icon: Table },
    { id: 'planner', label: t('tabs.itinerary'), icon: CalendarDays },
    { id: 'map', label: t('tabs.map'), icon: Map },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
        {/* Header — branded title */}
        <div className="text-center pt-2 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{t('header.title')}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('header.subtitle')}</p>
        </div>

        {/* Controls row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex-1">
            {(!isSimple || showLocationInput) && (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 max-w-md">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    <input type="text" placeholder={t('header.addressPlaceholder')}
                      value={addressQuery}
                      onChange={(e) => { setAddressQuery(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      className="w-full h-10 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg pl-9 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800" />
                    {userLocation && (
                      <button onClick={() => { resetLocation(); if (isSimple) setShowLocationInput(false); }}
                        aria-label={t('header.clearAddress') || 'Clear address'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button onClick={useMyLocation} disabled={isCalculating} title={t('header.useMyLocation')}
                    className="flex items-center gap-1 h-10 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-lg px-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors shrink-0 disabled:opacity-50">
                    <LocateFixed size={14} />
                    <span className="hidden sm:inline">{t('header.myLocation')}</span>
                  </button>
                  {isCalculating && <Loader2 size={16} className="text-blue-500 animate-spin shrink-0" />}
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-1 max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden">
                    {suggestions.map((s, i) => (
                      <li key={i} onClick={() => { selectAddress(s); if (isSimple) setShowLocationInput(false); }}
                        className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="font-medium">{s.properties.name || s.properties.street}</div>
                        <div className="text-xs text-gray-400">{formatAddress(s.properties)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {/* Weather pill */}
            {!isSimple && (weatherLoading ? <WeatherSkeleton /> : <WeatherPill weather={weather} locale={locale} t={t} onDayClick={(date) => { setActiveTab('planner'); }} />)}
            {/* View mode toggle */}
            <button data-tutorial="view-toggle" onClick={() => setViewMode(v => v === 'simple' ? 'full' : 'simple')} title={t('view.toggle')} aria-label={t('view.toggle')}
              className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border transition-colors ${
                isSimple
                  ? 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}>
              {isSimple ? <ToggleLeft size={15} /> : <ToggleRight size={15} />}
              <span>{isSimple ? t('view.simple') : t('view.full')}</span>
            </button>
            {/* Dark mode toggle */}
            <button data-tutorial="dark-toggle" onClick={() => setDarkMode(d => !d)} title={t('dark.toggle')} aria-label={t('dark.toggle')}
              className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border transition-colors ${
                darkMode
                  ? 'border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
              {darkMode ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
              <span>{darkMode ? t('dark.dark') : t('dark.light')}</span>
            </button>
            {/* Settings menu */}
            <SettingsMenu
              settingsRef={settingsRef}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              exportToCSV={exportToCSV}
              copyItinerary={copyItinerary}
              showHidden={showHidden}
              setShowHidden={setShowHidden}
              hiddenCount={hiddenCount}
              isSimple={isSimple}
              onSetBaseLocation={() => { setShowLocationInput(true); setShowSettings(false); }}
              onStartTour={() => { setShowSettings(false); startTutorial(); }}
              t={t}
            />
          </div>
        </div>

        <Notification notification={notification} onDismiss={dismissNotification} />
        {!isSimple && <BudgetTracker items={items.filter(i => !i.hidden)} budget={budget} onBudgetChange={setBudget} />}

        {/* Tabs + content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
            <div data-tutorial="tabs" className="flex flex-1 min-w-0">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 sm:px-5 py-3 text-sm font-medium transition-colors ${
                      active ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}>
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mr-2 shrink-0">
              {!isSimple && hiddenCount > 0 && (
                <button onClick={() => setShowHidden(h => !h)}
                  title={`${t('hidden.count', { count: hiddenCount })} — ${showHidden ? t('hidden.hide') : t('hidden.show')}`}
                  aria-label={`${t('hidden.count', { count: hiddenCount })} — ${showHidden ? t('hidden.hide') : t('hidden.show')}`}
                  className="hidden min-[376px]:flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {showHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{hiddenCount}</span>
                  <span className="hidden sm:inline font-medium">— {showHidden ? t('hidden.hide') : t('hidden.show')}</span>
                </button>
              )}
              <button data-tutorial="add-activity" onClick={() => setShowAddModal(true)}
                title={t('header.addActivity')}
                aria-label={t('header.addActivity')}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shrink-0">
                <Plus size={15} /> <span className="hidden sm:inline">{t('header.addActivity')}</span>
              </button>
            </div>
          </div>

          <div className="relative">
            {isCalculating && (
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <Loader2 size={16} className="text-blue-500 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{t('notify.calculating') || 'Calculating transit times...'}</span>
                </div>
              </div>
            )}
            {activeTab === 'table' && (
              <TableView items={visibleItems} sortConfig={sortConfig} requestSort={requestSort}
                toggleComplete={toggleComplete} updateDate={updateDate} updateNotes={updateNotes}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                toggleHidden={toggleHidden} deleteCustomItem={deleteCustomItem} showHidden={showHidden}
                simpleView={isSimple} />
            )}
            {activeTab === 'planner' && (
              <DayPlanner items={visibleItems} allItems={items} toggleComplete={toggleComplete} updateDate={updateDate} updateNotes={updateNotes}
                toggleHidden={toggleHidden} deleteCustomItem={deleteCustomItem} showHidden={showHidden}
                reorderItems={reorderItems} userLocation={userLocation} weather={weather} darkMode={darkMode} />
            )}
            {activeTab === 'map' && (
              <MapView items={visibleItems} userLocation={userLocation} darkMode={darkMode} />
            )}
          </div>
        </div>

        {/* Stats & Tips — below main content */}
        {!isSimple && <div className="mt-4 space-y-3">
          <TripStats items={items.filter(i => !i.hidden)} />
          <TripTips items={items.filter(i => !i.hidden)} weather={weather} />
        </div>}

        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
          {userLocation
            ? t('footer.transitFrom', { address: userLocation.address })
            : t('footer.enterAddress')}
        </div>
      </div>


      {showAddModal && (
        <AddActivityModal onAdd={addCustomItem} onClose={() => setShowAddModal(false)} />
      )}
      <Tutorial active={tutorialActive} onClose={closeTutorial} />
    </div>
  );
}

function SettingsMenu({ settingsRef, showSettings, setShowSettings, exportToCSV, copyItinerary, showHidden, setShowHidden, hiddenCount, isSimple, onSetBaseLocation, onStartTour, t }) {
  return (
    <div ref={settingsRef} data-tutorial="settings" className="relative">
      <button onClick={() => setShowSettings(s => !s)} title={t('settings.title')}
        aria-label={t('settings.title')}
        aria-expanded={showSettings}
        className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
        <Settings size={15} />
      </button>
      {showSettings && (
        <div role="menu" className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl min-w-[200px] sm:min-w-[240px] max-w-[calc(100vw-2rem)] py-1">
          {/* Language */}
          <div className="px-3 py-2.5 flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings.language')}</span>
            <LanguageSelector />
          </div>
          {/* Set location (simple view only) */}
          {isSimple && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <button onClick={onSetBaseLocation}
                className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                <MapPin size={14} className="text-gray-400" />
                {t('settings.setLocation')}
              </button>
            </>
          )}
          {/* Hidden items */}
          {hiddenCount > 0 && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <button onClick={() => setShowHidden(h => !h)}
                className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {showHidden ? t('hidden.hide') : t('hidden.show')} ({hiddenCount})
                </span>
                {showHidden ? <Eye size={14} className="text-gray-400" /> : <EyeOff size={14} className="text-gray-400" />}
              </button>
            </>
          )}
          <div className="border-t border-gray-100 dark:border-gray-700" />
          {/* Copy Itinerary */}
          <button onClick={() => { copyItinerary(); setShowSettings(false); }}
            className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
            <ClipboardCopy size={14} className="text-gray-400" />
            {t('settings.copyItinerary')}
          </button>
          <div className="border-t border-gray-100 dark:border-gray-700" />
          {/* Export CSV */}
          <button onClick={() => { exportToCSV(); setShowSettings(false); }}
            className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
            <Download size={14} className="text-gray-400" />
            {t('header.exportCsv')}
          </button>
          <div className="border-t border-gray-100 dark:border-gray-700" />
          {/* Start tour */}
          <button onClick={onStartTour}
            className="w-full px-3 py-2.5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
            <HelpCircle size={14} className="text-gray-400" />
            {t('settings.startTour')}
          </button>
        </div>
      )}
    </div>
  );
}

function LanguageSelector() {
  const { lang, changeLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800">
      <Globe size={14} className="text-gray-500 dark:text-gray-400" />
      <select value={lang} onChange={(e) => changeLang(e.target.value)}
        className="text-xs bg-transparent border-none focus:outline-none cursor-pointer text-gray-600 dark:text-gray-300">
        {SUPPORTED_LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.flag}</option>
        ))}
      </select>
    </div>
  );
}
