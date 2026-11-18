'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Navigation,
  Crosshair,
  ExternalLink,
  Check,
  Loader2,
  RefreshCw,
  Building2,
} from 'lucide-react';

export interface LocationData {
  venueName: string;
  city: string;
  fullAddress: string;
  googleMapsLink: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface DeliveryStyleMapPickerProps {
  initialLocation: LocationData;
  onLocationChange: (loc: LocationData) => void;
  showSaveButton?: boolean;
  onSave?: (loc: LocationData) => void;
  theme?: 'royal' | 'luxury';
}

export const DeliveryStyleMapPicker: React.FC<DeliveryStyleMapPickerProps> = ({
  initialLocation,
  onLocationChange,
  showSaveButton = true,
  onSave,
  theme = 'royal',
}) => {
  const [venueName, setVenueName] = useState(initialLocation.venueName || '');
  const [city, setCity] = useState(initialLocation.city || '');
  const [fullAddress, setFullAddress] = useState(initialLocation.fullAddress || '');
  const [googleMapsLink, setGoogleMapsLink] = useState(initialLocation.googleMapsLink || '');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>(
    initialLocation.coordinates || { lat: 24.5764, lng: 73.6835 }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const hasUserEditedRef = useRef<boolean>(false);
  const prevInitialKeyRef = useRef<string>(JSON.stringify(initialLocation));

  // Sync state if initialLocation updates externally and user hasn't actively edited
  useEffect(() => {
    const currentKey = JSON.stringify(initialLocation);
    if (currentKey !== prevInitialKeyRef.current) {
      prevInitialKeyRef.current = currentKey;
      if (!hasUserEditedRef.current) {
        if (initialLocation.venueName) setVenueName(initialLocation.venueName);
        if (initialLocation.city) setCity(initialLocation.city);
        if (initialLocation.fullAddress) setFullAddress(initialLocation.fullAddress);
        if (initialLocation.googleMapsLink) setGoogleMapsLink(initialLocation.googleMapsLink);
        if (initialLocation.coordinates) setCoordinates(initialLocation.coordinates);
      }
    }
  }, [initialLocation]);

  // Load Leaflet & Initialize Interactive Map
  useEffect(() => {
    let isCancelled = false;

    // Ensure Leaflet CSS is loaded
    if (typeof document !== 'undefined' && !document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    async function setupMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;

      // Clean up previous map if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = coordinates.lat || 24.5764;
      const initialLng = coordinates.lng || 73.6835;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // OpenStreetMap Standard Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom Delivery-App Style Bouncing Pin Icon
      const customPinIcon = L.divIcon({
        className: 'delivery-custom-pin',
        html: `
          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
            <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 14px; height: 6px; background: rgba(0,0,0,0.35); border-radius: 50%; filter: blur(1.5px);"></div>
            <div style="background: linear-gradient(135deg, #E63946 0%, #C1121F 100%); width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid #FFFFFF; box-shadow: 0 8px 18px rgba(193,18,31,0.5);">
              <span style="transform: rotate(45deg); color: #FFF; font-size: 16px; font-weight: bold; line-height: 1;">👑</span>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: customPinIcon,
      }).addTo(map);

      markerRef.current = marker;

      // When marker is dragged
      marker.on('dragend', async () => {
        const position = marker.getLatLng();
        handleNewPosition(position.lat, position.lng, true);
      });

      // When user clicks anywhere on map
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleNewPosition(lat, lng, true);
      });
    }

    setupMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map marker when coordinates state changes
  const moveMarkerTo = (lat: number, lng: number, zoom = 16) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }
  };

  // Reverse Geocode: convert Lat/Lng to Street Address using OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true);
    setStatusMessage('Fetching street address from exact pin...');
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(', ');
          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.state ||
            city ||
            'Palace Destination';
          const detectedAddress = data.display_name;
          const detectedVenue =
            data.address?.hotel ||
            data.address?.amenity ||
            data.address?.building ||
            parts[0] ||
            venueName ||
            'Royal Wedding Venue';

          hasUserEditedRef.current = true;
          setFullAddress(detectedAddress);
          if (detectedVenue) {
            setVenueName(detectedVenue);
          }
          if (detectedCity) {
            setCity(detectedCity);
          }

          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
          setGoogleMapsLink(mapsUrl);

          const updated: LocationData = {
            venueName: detectedVenue,
            city: detectedCity,
            fullAddress: detectedAddress,
            googleMapsLink: mapsUrl,
            coordinates: { lat, lng },
          };
          onLocationChange(updated);
          onSave?.(updated);
          setStatusMessage('Exact pin location & address updated!');
        }
      }
    } catch {
      // Fallback without reverse geocode
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
      hasUserEditedRef.current = true;
      setGoogleMapsLink(mapsUrl);
      const fallbackLoc: LocationData = {
        venueName: venueName || 'Royal Wedding Venue',
        city: city || 'Palace Destination',
        fullAddress,
        googleMapsLink: mapsUrl,
        coordinates: { lat, lng },
      };
      onLocationChange(fallbackLoc);
      onSave?.(fallbackLoc);
      setStatusMessage('Pin coordinates updated!');
    } finally {
      setIsReverseGeocoding(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Handler when marker moves
  const handleNewPosition = (
    lat: number,
    lng: number,
    shouldReverseGeocode = true,
    explicitData?: { venueName?: string; city?: string; fullAddress?: string }
  ) => {
    hasUserEditedRef.current = true;
    setCoordinates({ lat, lng });
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
    setGoogleMapsLink(mapsUrl);

    if (shouldReverseGeocode) {
      reverseGeocode(lat, lng);
    } else {
      const nextVenue = explicitData?.venueName ?? venueName;
      const nextCity = explicitData?.city ?? city;
      const nextAddress = explicitData?.fullAddress ?? fullAddress;
      const updatedLoc: LocationData = {
        venueName: nextVenue,
        city: nextCity,
        fullAddress: nextAddress,
        googleMapsLink: mapsUrl,
        coordinates: { lat, lng },
      };
      onLocationChange(updatedLoc);
      onSave?.(updatedLoc);
    }
  };

  // Search Address / Palace
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatusMessage('Searching location on map...');
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=1&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const item = results[0];
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const detectedCity =
            item.address?.city ||
            item.address?.town ||
            item.address?.state_district ||
            item.address?.state ||
            '';
          const newVenue = searchQuery.trim();
          const newAddress = item.display_name;
          const newCity = detectedCity || city || '';
          const newMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
          const newCoords = { lat, lng };

          hasUserEditedRef.current = true;
          setVenueName(newVenue);
          setFullAddress(newAddress);
          if (newCity) setCity(newCity);
          setGoogleMapsLink(newMapsUrl);
          setCoordinates(newCoords);

          moveMarkerTo(lat, lng, 17);

          const updatedLoc: LocationData = {
            venueName: newVenue,
            city: newCity,
            fullAddress: newAddress,
            googleMapsLink: newMapsUrl,
            coordinates: newCoords,
          };
          onLocationChange(updatedLoc);
          onSave?.(updatedLoc);

          setStatusMessage(`Found: ${item.display_name.slice(0, 40)}...`);
        } else {
          setStatusMessage('Location not found. Try entering city or landmark.');
        }
      }
    } catch {
      setStatusMessage('Search failed. Please check network connection.');
    } finally {
      setIsSearching(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setStatusMessage('Acquiring device GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        hasUserEditedRef.current = true;
        moveMarkerTo(lat, lng, 17);
        handleNewPosition(lat, lng, true);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setStatusMessage('GPS permission denied or unavailable.');
        setTimeout(() => setStatusMessage(null), 3000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Sync inputs to parent
  const handleInputChange = (
    field: 'venueName' | 'city' | 'fullAddress' | 'googleMapsLink',
    value: string
  ) => {
    hasUserEditedRef.current = true;
    let updatedName = venueName;
    let updatedCity = city;
    let updatedAddress = fullAddress;
    let updatedLink = googleMapsLink;

    if (field === 'venueName') {
      updatedName = value;
      setVenueName(value);
    }
    if (field === 'city') {
      updatedCity = value;
      setCity(value);
    }
    if (field === 'fullAddress') {
      updatedAddress = value;
      setFullAddress(value);
    }
    if (field === 'googleMapsLink') {
      updatedLink = value;
      setGoogleMapsLink(value);
    }

    const updatedLoc: LocationData = {
      venueName: updatedName,
      city: updatedCity,
      fullAddress: updatedAddress,
      googleMapsLink: updatedLink,
      coordinates,
    };
    onLocationChange(updatedLoc);
    onSave?.(updatedLoc);
  };

  return (
    <div className="card-pop3d-azure p-4 sm:p-5 rounded-2xl space-y-4 border border-[#1E3F66]/30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3F66]/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1E3F66] to-[#0284C7] flex items-center justify-center text-white shadow-sm shrink-0">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-portal text-xs sm:text-sm font-bold uppercase text-[#142F4C] flex items-center gap-1.5">
              <span>Delivery-Style Live Map Pin & Venue Navigation</span>
              <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full border border-sky-300">
                GPS Exact Pin
              </span>
            </h4>
            <p className="text-[11px] text-[#1E3F66]">
              Jaise Zomato / Swiggy me pin drop karte hain, wahi se exact palace entrance par pin lagayein.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full animate-fade-in flex items-center gap-1 self-start sm:self-auto">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Search Bar + GPS Locate Button */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#1E3F66] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue or landmark (e.g. Taj Mahal Palace, Mumbai / Jai Mahal, Jaipur)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white text-xs text-[#142F4C] placeholder-[#1E3F66]/50 focus:outline-none focus:border-[#1E3F66]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="submit"
            disabled={isSearching}
            className="btn-slim-azure text-xs font-bold py-2 px-3.5 flex items-center gap-1 shrink-0"
          >
            {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title="Pin My Current GPS Location"
            className="btn-slim-emerald text-xs font-bold py-2 px-3 flex items-center gap-1 shrink-0"
          >
            {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
            <span className="hidden sm:inline">Use GPS</span>
          </button>
        </div>
      </form>

      {/* Interactive Leaflet Map Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#1E3F66]/30 shadow-inner bg-stone-100">
        {/* Map Header Instructions Badge */}
        <div className="absolute top-2 left-2 z-40 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-[#1E3F66]/20 flex items-center gap-1.5 text-[10px] text-[#142F4C] font-bold pointer-events-none">
          <MapPin className="w-3 h-3 text-red-600 animate-bounce" />
          <span>Tap / Drag pin to exact palace gate</span>
        </div>

        {/* Live Coordinates Pill */}
        <div className="absolute bottom-2 right-2 z-40 bg-[#10243E]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg shadow-md border border-white/20 text-[10px] font-mono pointer-events-none">
          📍 {coordinates.lat.toFixed(5)}° N, {coordinates.lng.toFixed(5)}° E
        </div>

        {/* Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-64 sm:h-72 z-10" />
      </div>

      {/* Delivery-App Form Data Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#1E3F66]" /> Palace / Venue Name
          </label>
          <input
            type="text"
            value={venueName}
            onChange={(e) => handleInputChange('venueName', e.target.value)}
            placeholder="e.g. The Grand Palace & Resort"
            className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white text-[#142F4C] focus:outline-none focus:border-[#1E3F66]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] mb-1">
            City / State
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="e.g. New Delhi, Mumbai, Jaipur"
            className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white text-[#142F4C] focus:outline-none focus:border-[#1E3F66]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] mb-1">
          Full Street Address & Landmark (Auto-filled on Pin Drop)
        </label>
        <input
          type="text"
          value={fullAddress}
          onChange={(e) => handleInputChange('fullAddress', e.target.value)}
          placeholder="e.g. Gate No. 1, Palace Boulevard, Royal Heritage Enclave"
          className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white text-[#142F4C] focus:outline-none focus:border-[#1E3F66]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[10px] font-portal uppercase font-bold text-[#142F4C] flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#1E3F66]" /> Exact Google Maps Navigation Link (Guests click to navigate)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat.toFixed(6)},${coordinates.lng.toFixed(6)}`;
                setGoogleMapsLink(mapsUrl);
                handleInputChange('googleMapsLink', mapsUrl);
              }}
              className="text-[10px] font-bold text-[#1E3F66] hover:underline"
            >
              ⚡ Re-Sync Coordinates
            </button>
            {googleMapsLink && (
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
              >
                <ExternalLink className="w-2.5 h-2.5" />
                <span>Test in Google Maps</span>
              </a>
            )}
          </div>
        </div>
        <input
          type="url"
          value={googleMapsLink}
          onChange={(e) => handleInputChange('googleMapsLink', e.target.value)}
          placeholder="https://www.google.com/maps/search/?api=1&query=..."
          className="w-full px-3 py-2 rounded-xl border border-[#1E3F66]/30 bg-white font-mono text-[#142F4C] text-xs focus:outline-none focus:border-[#1E3F66]"
        />
      </div>

      {/* Save Action */}
      {showSaveButton && (
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#1E3F66] flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pin will route guests directly to exact entrance coordinates</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const currentLoc: LocationData = {
                venueName: venueName || 'Royal Wedding Venue',
                city: city || 'Palace Destination',
                fullAddress,
                googleMapsLink,
                coordinates,
              };
              onLocationChange(currentLoc);
              if (onSave) onSave(currentLoc);
              setStatusMessage('Saved to microsite!');
              setTimeout(() => setStatusMessage(null), 3500);
            }}
            className="btn-slim-emerald text-xs font-bold py-2.5 px-5 flex items-center gap-1.5 shrink-0"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Save Delivery-Style GPS Venue</span>
            <span>📍</span>
          </button>
        </div>
      )}
    </div>
  );
};
