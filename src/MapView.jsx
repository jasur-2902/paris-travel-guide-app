import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { getMarkerColor, getGoogleMapsUrl, DAY_COLORS } from './utils';
import { useLanguage } from './i18n';

function createIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
}

const homeIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function MapView({ items, userLocation, darkMode }) {
  const { t } = useLanguage();

  const center = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lon];
    return [48.8606, 2.3376];
  }, [userLocation]);

  const dayRoutes = useMemo(() => {
    const byDate = {};
    items.forEach(item => {
      if (item.plannedDate && !item.completed) {
        if (!byDate[item.plannedDate]) byDate[item.plannedDate] = [];
        byDate[item.plannedDate].push(item);
      }
    });
    const sortedDates = Object.keys(byDate).sort();
    return sortedDates
      .filter(date => byDate[date].length >= 2)
      .map((date, idx) => ({
        date,
        color: DAY_COLORS[idx % DAY_COLORS.length],
        positions: byDate[date]
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map(i => [i.lat, i.lon]),
      }));
  }, [items]);

  return (
    <div className={`h-[500px] w-full ${darkMode ? 'dark-map' : ''}`}>
      <MapContainer center={center} zoom={13} className="h-full w-full rounded-b-xl z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {dayRoutes.map(route => (
          <Polyline key={route.date} positions={route.positions} color={route.color} weight={3} opacity={0.5} dashArray="8 4" />
        ))}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lon]} icon={homeIcon}>
            <Popup><strong>{t('map.yourBase')}</strong><br />{userLocation.address}</Popup>
          </Marker>
        )}

        {items.map(item => (
          <Marker key={item.id} position={[item.lat, item.lon]} icon={createIcon(getMarkerColor(item.type, item.completed))}>
            <Popup>
              <div className="text-sm min-w-[180px]">
                <strong>{item.activity}</strong>
                {item.isCustom && <span className="ml-1.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-100 text-purple-700">{t('table.custom')}</span>}
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <div>{item.type} · {item.days}</div>
                  <div>{item.hours}</div>
                  <div>{item.price} · {item.time}</div>
                  <div>{item.location}</div>
                  {item.metro && <div className="text-indigo-500 font-medium">{item.metro}</div>}
                  {item.plannedDate && <div className="font-medium text-blue-600 mt-1">{t('map.planned')}: {item.plannedDate}</div>}
                  {item.completed && <div className="font-medium text-green-600">{t('map.done')} ✓</div>}
                  <a href={getGoogleMapsUrl(item.lat, item.lon, item.activity)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-blue-600 font-medium hover:text-blue-700">
                    {t('map.openMaps')} ↗
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="flex items-center gap-4 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> {t('map.indoor')}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> {t('map.outdoor')}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> {t('map.mix')}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span> {t('map.done')}</span>
        {userLocation && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> {t('map.yourBase')}</span>}
        {dayRoutes.length > 0 && <span className="text-gray-400 dark:text-gray-500 ml-2">{t('map.dayRoutes')}</span>}
      </div>
    </div>
  );
}
