import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getMarkerColor, getGoogleMapsUrl } from './utils';

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

export default function MapView({ items, userLocation }) {
  // Filter out Normandy (too far to show on Paris map) for center calculation
  const parisItems = items.filter(i => i.lat > 48 && i.lat < 49.1);

  const center = useMemo(() => {
    if (userLocation) return [userLocation.lat, userLocation.lon];
    return [48.8606, 2.3376]; // Default: central Paris
  }, [userLocation]);

  return (
    <div className="h-[500px] w-full">
      <MapContainer center={center} zoom={13} className="h-full w-full rounded-b-xl z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User base location */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lon]} icon={homeIcon}>
            <Popup>
              <strong>Your base</strong><br />
              {userLocation.address}
            </Popup>
          </Marker>
        )}

        {/* Activity markers */}
        {items.map(item => (
          <Marker
            key={item.id}
            position={[item.lat, item.lon]}
            icon={createIcon(getMarkerColor(item.type, item.completed))}
          >
            <Popup>
              <div className="text-sm min-w-[180px]">
                <strong>{item.activity}</strong>
                {item.isCustom && <span style={{ marginLeft: 6, fontSize: 10, background: '#f3e8ff', color: '#7e22ce', padding: '1px 5px', borderRadius: 3, fontWeight: 600 }}>Custom</span>}
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <div>{item.type} · {item.days}</div>
                  <div>{item.hours}</div>
                  <div>{item.price} · {item.time}</div>
                  <div>{item.location}</div>
                  {item.plannedDate && <div className="font-medium text-blue-600 mt-1">Planned: {item.plannedDate}</div>}
                  {item.completed && <div className="font-medium text-green-600">Done ✓</div>}
                  <a href={getGoogleMapsUrl(item.lat, item.lon)} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11, color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                    Open in Google Maps &#x2197;
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 text-xs text-gray-500 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> Indoor</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Outdoor</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> Mix</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-400 inline-block"></span> Done</span>
        {userLocation && <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Your base</span>}
      </div>
    </div>
  );
}
