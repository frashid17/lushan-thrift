'use client';

import { useEffect, useState } from 'react';
import Map, { GeolocateControl, Marker, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/** OpenFreeMap — free vector tiles, no API key (OpenStreetMap data). */
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

function geoErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'Location access was blocked. Allow location for this site in your browser settings, then try again.';
    case 2:
      return 'Your position could not be determined. Try again or tap the map.';
    case 3:
      return 'Location timed out. Try the compass on the map, move near a window, or tap the map.';
    default:
      return 'Could not get your location. Use the map compass or tap the map to set the pin.';
  }
}

/**
 * Try Wi‑Fi / cell fix first (fast indoors), then GPS (slower, needs sky view).
 * Pure GPS with enableHighAccuracy often times out inside buildings.
 */
function runGeolocation(
  onSuccess: (lat: number, lng: number) => void,
  onFail: (code: number) => void
) {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    onFail(0);
    return;
  }

  const strategies = [
    { enableHighAccuracy: false, timeout: 45_000, maximumAge: 300_000 },
    { enableHighAccuracy: false, timeout: 30_000, maximumAge: 0 },
    { enableHighAccuracy: true, timeout: 35_000, maximumAge: 0 },
  ] as const;

  let i = 0;

  function attempt() {
    if (i >= strategies.length) {
      onFail(3);
      return;
    }
    const opts = strategies[i];
    i += 1;
    navigator.geolocation.getCurrentPosition(
      (pos) => onSuccess(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (err.code === 1) {
          onFail(1);
          return;
        }
        attempt();
      },
      opts
    );
  }

  attempt();
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
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    longitude: lng,
    latitude: lat,
    zoom: 13,
  });

  useEffect(() => {
    setViewState((v) => ({
      ...v,
      longitude: lng,
      latitude: lat,
    }));
  }, [lat, lng]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={locating}
          onClick={() => {
            setGeoError(null);
            if (typeof window !== 'undefined' && !window.isSecureContext) {
              setGeoError(
                'Browser location only works on HTTPS or http://localhost. Open the site that way, or tap the map.'
              );
              return;
            }
            setLocating(true);
            runGeolocation(
              (la, ln) => {
                setLocating(false);
                onLocationChange(la, ln);
              },
              (code) => {
                setLocating(false);
                setGeoError(geoErrorMessage(code));
              }
            );
          }}
          className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-50 disabled:opacity-60"
        >
          {locating ? 'Getting location…' : 'Use my current location'}
        </button>
        <span className="text-xs text-stone-500">
          Or tap the map · compass control uses the same location (often works when the button times out)
        </span>
      </div>
      {geoError && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950" role="alert">
          {geoError}
        </p>
      )}
      <div className="h-64 w-full overflow-hidden rounded-lg border border-stone-200">
        <Map
          mapLib={maplibregl}
          mapStyle={MAP_STYLE}
          {...viewState}
          style={{ width: '100%', height: '100%' }}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={(e) => {
            onLocationChange(e.lngLat.lat, e.lngLat.lng);
          }}
          onLoad={(ev) => {
            ev.target.resize();
            requestAnimationFrame(() => ev.target.resize());
          }}
          reuseMaps
        >
          <GeolocateControl
            position="top-left"
            positionOptions={{
              enableHighAccuracy: false,
              timeout: 50_000,
              maximumAge: 300_000,
            }}
            trackUserLocation={false}
            showAccuracyCircle
            onGeolocate={(e) => {
              setGeoError(null);
              onLocationChange(e.coords.latitude, e.coords.longitude);
            }}
            onError={(e) => {
              const code = typeof e.code === 'number' ? e.code : 0;
              setGeoError(geoErrorMessage(code));
            }}
          />
          <NavigationControl position="top-right" />
          <Marker longitude={lng} latitude={lat} anchor="bottom">
            <span
              className="block h-4 w-4 rounded-full border-2 border-white bg-amber-600 shadow-md ring-2 ring-amber-800/30"
              aria-hidden
            />
          </Marker>
        </Map>
      </div>
      <p className="text-xs text-stone-500">
        Lat {lat.toFixed(5)}, Lng {lng.toFixed(5)}
      </p>
      <p className="text-[10px] leading-relaxed text-stone-400">
        Map:{' '}
        <a href="https://openfreemap.org" className="underline hover:text-stone-600" target="_blank" rel="noreferrer">
          OpenFreeMap
        </a>{' '}
        · ©{' '}
        <a
          href="https://www.openstreetmap.org/copyright"
          className="underline hover:text-stone-600"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap
        </a>{' '}
        contributors
      </p>
    </div>
  );
}
