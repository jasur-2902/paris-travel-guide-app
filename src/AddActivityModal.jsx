import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';
import { ACTIVITY_TYPES, DAYS_OPTIONS, formatAddress, isInFrance } from './utils';
import { useLanguage } from './i18n';

export default function AddActivityModal({ onAdd, onClose }) {
  const { t } = useLanguage();
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

  useEffect(() => { nameRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

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
      setError(t('modal.selectFrance'));
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
    if (!name.trim()) { setError(t('modal.nameRequired')); return; }
    if (!selectedAddress) { setError(t('modal.addressRequired')); return; }

    const priceValue = price.trim();
    let formattedPrice = 'Free';
    if (priceValue) {
      const num = parseFloat(priceValue);
      if (!isNaN(num) && num > 0) formattedPrice = `\u20AC${num.toFixed(2)}`;
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('modal.title')}</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modal.name')}</label>
            <input ref={nameRef} type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder={t('modal.namePlaceholder')}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modal.type')}</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200">
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modal.daysOpen')}</label>
              <select value={days} onChange={(e) => setDays(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200">
                {DAYS_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modal.hours')}</label>
              <input type="text" value={hours} onChange={(e) => setHours(e.target.value)}
                placeholder={t('modal.hoursPlaceholder')}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modal.price')}</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
                placeholder={t('modal.pricePlaceholder')}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400" />
            </div>
          </div>

          <div ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('modal.address')}</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input type="text" value={addressQuery}
                onChange={(e) => { setAddressQuery(e.target.value); setSelectedAddress(null); setShowSuggestions(true); }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder={t('modal.addressPlaceholder')}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400" />
              {isSearching && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />}
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => selectSuggestion(s)}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0">
                    <div className="font-medium">{s.properties.name || s.properties.street}</div>
                    <div className="text-xs text-gray-400">{formatAddress(s.properties)}</div>
                  </li>
                ))}
              </ul>
            )}
            {selectedAddress && (
              <div className="mt-1.5 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <MapPin size={12} />
                {selectedAddress.lat.toFixed(4)}, {selectedAddress.lon.toFixed(4)} — {selectedAddress.location || selectedAddress.address}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {t('modal.cancel')}
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg shadow transition-colors">
              {t('modal.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
