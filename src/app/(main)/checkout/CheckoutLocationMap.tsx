'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MOMBASA: [number, number] = [-4.0435, 39.6682];

function fixLeafletIcons() {
  if (typeof window === 'undefined') return;
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: boolean })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 14));
  }, [lat, lng, map]);
  return null;
}

export default function CheckoutLocationMap({
  lat,
  lng,
  onLocationChange,
}: {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                onLocationChange(pos.coords.latitude, pos.coords.longitude);
              },
              () => {
                onLocationChange(MOMBASA[0], MOMBASA[1]);
              },
              { enableHighAccuracy: true, timeout: 12_000 }
            );
          }}
          className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-50"
        >
          Use my current location
        </button>
        <span className="text-xs text-stone-500">Or tap the map to drop the pin</span>
      </div>
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        className="z-0 h-64 w-full overflow-hidden rounded-lg border border-stone-200"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} />
        <MapClickHandler onPick={onLocationChange} />
        <Recenter lat={lat} lng={lng} />
      </MapContainer>
      <p className="text-xs text-stone-500">
        Lat {lat.toFixed(5)}, Lng {lng.toFixed(5)}
      </p>
    </div>
  );
}
