import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, MapPin, X, Loader2, LocateFixed, AlertCircle, CheckCircle2, Table, CalendarDays, Map, Plus, Eye, EyeOff } from 'lucide-react';
import { STORAGE_KEY, initialData, isInFrance, formatDuration, formatAddress } from './utils';
import TableView from './TableView';
import DayPlanner from './DayPlanner';
import MapView from './MapView';
import BudgetTracker from './BudgetTracker';
import AddActivityModal from './AddActivityModal';

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
    if (!saved?.items) return { ...item, completed: false, plannedDate: '', hidden: false };
    const s = saved.items.find(i => i.id === item.id);
    if (!s) return { ...item, completed: false, plannedDate: '', hidden: false };
    return {
      ...item,
      completed: s.completed || false,
      plannedDate: s.plannedDate || '',
      hidden: s.hidden || false,
      ...(s.time ? { time: s.time } : {}),
    };
  });
  const customItems = saved?.customItems || [];
  return [...presetItems, ...customItems];
}

function Notification({ notification, onDismiss }) {
  if (!notification) return null;
  const isError = notification.type === 'error';
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm mb-4 ${
      isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      {isError ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      <span className="flex-1">{notification.message}</span>
      <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

const TABS = [
  { id: 'table', label: 'Table', icon: Table },
  { id: 'planner', label: 'Day Planner', icon: CalendarDays },
  { id: 'map', label: 'Map', icon: Map },
];

export default function App() {
  const saved = loadSavedData();
  const [items, setItems] = useState(loadState);
  const [userLocation, setUserLocation] = useState(() => saved?.location || null);
  const [addressQuery, setAddressQuery] = useState(() => saved?.location?.address || '');
  const [sortConfig, setSortConfig] = useState(() => saved?.sortConfig || { key: null, direction: 'ascending' });
  const [activeTab, setActiveTab] = useState(() => saved?.activeTab || 'table');
  const [budget, setBudget] = useState(() => saved?.budget || 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const dropdownRef = useRef(null);
  const notificationTimer = useRef(null);
  const itemsRef = useRef(items);

  // Keep ref in sync
  useEffect(() => { itemsRef.current = items; }, [items]);

  const hiddenCount = items.filter(i => i.hidden).length;

  const showNotification = useCallback((type, message, duration = 5000) => {
    clearTimeout(notificationTimer.current);
    setNotification({ type, message });
    notificationTimer.current = setTimeout(() => setNotification(null), duration);
  }, []);

  const dismissNotification = useCallback(() => {
    clearTimeout(notificationTimer.current);
    setNotification(null);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    const presetDiffs = items
      .filter(i => !i.isCustom)
      .map(({ id, completed, plannedDate, time, hidden }) => ({ id, completed, plannedDate, time, hidden }));
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced address search — France only
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
      const coordPairs = [`${lon},${lat}`, ...currentItems.map(d => `${d.lon},${d.lat}`)];
      const res = await fetch(
        `https://router.project-osrm.org/table/v1/driving/${coordPairs.join(';')}?sources=0&annotations=duration`
      );
      if (!res.ok) throw new Error(`Route server returned ${res.status}`);
      const data = await res.json();
      if (data.code !== 'Ok') throw new Error(data.message || `Route calculation failed: ${data.code}`);
      const durations = data.durations?.[0];
      if (!durations || durations.length < currentItems.length + 1) throw new Error('Incomplete response');
      // Build a map of item id -> duration
      const durationMap = {};
      currentItems.forEach((item, index) => {
        durationMap[item.id] = durations[index + 1];
      });
      setItems(prev => prev.map(item => ({
        ...item,
        time: durationMap[item.id] != null ? formatDuration(durationMap[item.id]) : item.time,
      })));
      showNotification('success', 'Transit times updated for your location.');
    } catch (e) {
      showNotification('error', `Could not calculate transit times: ${e.message}. Default times are shown.`);
    } finally {
      setIsCalculating(false);
    }
  }, [showNotification]);

  const selectAddress = async (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    if (!isInFrance(lat, lon)) { showNotification('error', 'Please select an address in France.'); return; }
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
      return { ...item, time: original ? original.time : item.isCustom ? 'N/A' : item.time };
    }));
    dismissNotification();
  };

  const useMyLocation = async () => {
    if (!navigator.geolocation) { showNotification('error', 'Geolocation is not supported by your browser.'); return; }
    setIsCalculating(true);
    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      if (!isInFrance(lat, lon)) {
        showNotification('error', 'Your current location is outside France. Please enter a French address manually.');
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
        1: 'Location access denied. Please allow location access in your browser settings.',
        2: 'Could not determine your location. Please enter an address manually.',
        3: 'Location request timed out. Please try again or enter an address manually.',
      };
      showNotification('error', msgs[e.code] || 'Could not get your location. Please enter an address manually.');
    }
  };

  const toggleComplete = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const updateDate = (id, newDate) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, plannedDate: newDate } : item));
  };

  const toggleHidden = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, hidden: !item.hidden } : item));
  };

  const addCustomItem = (item) => {
    setItems(prev => [...prev, item]);
    // If we have a user location, recalculate transit times to include the new item
    if (userLocation) {
      setTimeout(() => calculateTransitTimes(userLocation.lat, userLocation.lon), 100);
    }
  };

  const deleteCustomItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const exportToCSV = () => {
    const headers = ["Status", "Planned Date", "Activity", "Type", "Days Open", "Hours", "Price", "Est. Transit", "Location"];
    const csvRows = [headers.join(',')];
    const visibleItems = items.filter(i => !i.hidden);
    visibleItems.forEach(row => {
      csvRows.push([
        `"${row.completed ? 'Done' : 'To Do'}"`, `"${row.plannedDate}"`, `"${row.activity}"`,
        `"${row.type}"`, `"${row.days}"`, `"${row.hours}"`, `"${row.price}"`, `"${row.time}"`, `"${row.location}"`
      ].join(','));
    });
    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURI(csvRows.join('\n')));
    link.setAttribute('download', 'paris_trip_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items for child components
  const visibleItems = showHidden ? items : items.filter(i => !i.hidden);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Paris Trip Planner: February 2026</h1>
            <div className="relative mt-2" ref={dropdownRef}>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <div className="relative flex-1 max-w-md">
                  <input type="text" placeholder="Enter your base address in France..."
                    value={addressQuery}
                    onChange={(e) => { setAddressQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                  {userLocation && (
                    <button onClick={resetLocation} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button onClick={useMyLocation} disabled={isCalculating} title="Use my current location"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-2 py-1.5 hover:bg-blue-50 transition-colors shrink-0 disabled:opacity-50">
                  <LocateFixed size={14} />
                  <span className="hidden sm:inline">My location</span>
                </button>
                {isCalculating && <Loader2 size={16} className="text-blue-500 animate-spin shrink-0" />}
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute left-6 right-0 mt-1 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <li key={i} onClick={() => selectAddress(s)}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0">
                      <div className="font-medium">{s.properties.name || s.properties.street}</div>
                      <div className="text-xs text-gray-400">{formatAddress(s.properties)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-colors shrink-0">
              <Plus size={18} /> Add Activity
            </button>
            <button onClick={exportToCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors shrink-0">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        <Notification notification={notification} onDismiss={dismissNotification} />

        {/* Budget tracker */}
        <BudgetTracker items={items.filter(i => !i.hidden)} budget={budget} onBudgetChange={setBudget} />

        {/* Tabs + content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center border-b border-gray-200">
            <div className="flex flex-1">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium transition-colors ${
                      active ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}>
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {hiddenCount > 0 && (
              <button onClick={() => setShowHidden(h => !h)}
                className="flex items-center gap-1.5 px-4 py-2 mr-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                {showHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                {hiddenCount} hidden
                <span className="font-medium">{showHidden ? '— Hide' : '— Show'}</span>
              </button>
            )}
          </div>

          {activeTab === 'table' && (
            <TableView items={visibleItems} sortConfig={sortConfig} requestSort={requestSort}
              toggleComplete={toggleComplete} updateDate={updateDate}
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              toggleHidden={toggleHidden} deleteCustomItem={deleteCustomItem} showHidden={showHidden} />
          )}
          {activeTab === 'planner' && (
            <DayPlanner items={visibleItems} toggleComplete={toggleComplete} updateDate={updateDate}
              toggleHidden={toggleHidden} deleteCustomItem={deleteCustomItem} showHidden={showHidden} />
          )}
          {activeTab === 'map' && (
            <MapView items={visibleItems} userLocation={userLocation} />
          )}
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          {userLocation
            ? `*Estimated driving times from ${userLocation.address}.`
            : '*Enter your base address above to calculate transit times.'}
        </div>
      </div>

      {showAddModal && (
        <AddActivityModal onAdd={addCustomItem} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
