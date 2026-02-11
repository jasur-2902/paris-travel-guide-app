import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';
import { ACTIVITY_TYPES, DAYS_OPTIONS, formatAddress, isInFrance } from './utils';

export default function AddActivityModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Indoor');
  const [days, setDays] = useState('Daily');
  const [hours, setHours] = useState('');
  const [price, setPrice] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Debounced address search
  useEffect(() => {
    if (addressQuery.length < 3 || selectedAddress?.address === addressQuery) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
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
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => { clearTimeout(timer); setIsSearching(false); };
  }, [addressQuery, selectedAddress]);

  const selectSuggestion = (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    if (!isInFrance(lat, lon)) {
      setError('Please select a location in France.');
      return;
    }
    const address = formatAddress(feature.properties);
    const location = feature.properties.city || feature.properties.district || feature.properties.name || '';
    setSelectedAddress({ address, lat, lon, location });
    setAddressQuery(address);
    setShowSuggestions(false);
    setSuggestions([]);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Activity name is required.'); return; }
    if (!selectedAddress) { setError('Please search and select an address.'); return; }

    const priceValue = price.trim();
    let formattedPrice = 'Free';
    if (priceValue) {
      const num = parseFloat(priceValue);
      if (!isNaN(num) && num > 0) {
        formattedPrice = `\u20AC${num.toFixed(2)}`;
      }
    }

    const item = {
      id: 'custom-' + Date.now(),
      activity: name.trim(),
      type,
      days,
      hours: hours.trim() || 'Check venue',
      price: formattedPrice,
      time: 'N/A',
      location: selectedAddress.location,
      lat: selectedAddress.lat,
      lon: selectedAddress.lon,
      isCustom: true,
      completed: false,
      plannedDate: '',
      hidden: false,
    };

    onAdd(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Add Custom Activity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Activity Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name *</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Local Wine Bar"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Type + Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white">
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days Open</label>
              <select value={days} onChange={(e) => setDays(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white">
                {DAYS_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Hours + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 10:00 - 22:00"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (EUR)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0 for free"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Address with geocoding */}
          <div ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={addressQuery}
                onChange={(e) => { setAddressQuery(e.target.value); setSelectedAddress(null); setShowSuggestions(true); }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search for an address in France..."
                className="w-full border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              {isSearching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />}
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => selectSuggestion(s)}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0">
                    <div className="font-medium">{s.properties.name || s.properties.street}</div>
                    <div className="text-xs text-gray-400">{formatAddress(s.properties)}</div>
                  </li>
                ))}
              </ul>
            )}
            {selectedAddress && (
              <div className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                <MapPin size={12} />
                {selectedAddress.lat.toFixed(4)}, {selectedAddress.lon.toFixed(4)} — {selectedAddress.location || selectedAddress.address}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-colors">
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
