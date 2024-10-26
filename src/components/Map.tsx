import React, { useState, useEffect, useCallback, useRef } from 'react';
import Map, { Marker, MapRef, ViewStateChangeEvent, Popup } from 'react-map-gl';
import { Wine, Beer, Apple, Beaker } from 'lucide-react';
import { Location } from '../types';

interface MapProps {
  locations: Location[];
  selectedLocation: number | null;
  setSelectedLocation: (id: number | null) => void;
  onMapClick: () => void;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

const MapComponent: React.FC<MapProps> = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  onMapClick,
  initialViewState,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState(
    initialViewState || {
      longitude: -76.5,
      latitude: 42.44,
      zoom: 8,
    }
  );
  const [popupInfo, setPopupInfo] = useState<Location | null>(null);

  const minLng = -77.7;
  const maxLng = -75.8;
  const minLat = 42.0;
  const maxLat = 43.0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'winery':
        return <Wine className="text-purple-500" size={20} />;
      case 'brewery':
        return <Beer className="text-yellow-500" size={20} />;
      case 'cidery':
        return <Apple className="text-red-500" size={20} />;
      case 'distillery':
        return <Beaker className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const handleMapMove = useCallback((evt: ViewStateChangeEvent) => {
    const newViewState = {
      ...evt.viewState,
      longitude: Math.max(minLng, Math.min(maxLng, evt.viewState.longitude)),
      latitude: Math.max(minLat, Math.min(maxLat, evt.viewState.latitude)),
    };
    setViewState(newViewState);
  }, []);

  const handleMapClick = useCallback(
    (event: any) => {
      const clickedLocation = event.features && event.features[0];
      if (clickedLocation && clickedLocation.properties.id) {
        setSelectedLocation(clickedLocation.properties.id);
      } else {
        setSelectedLocation(null);
        onMapClick();
      }
      setPopupInfo(null);
    },
    [setSelectedLocation, onMapClick]
  );

  useEffect(() => {
    if (selectedLocation !== null && !initialViewState) {
      const location = locations.find((loc) => loc.id === selectedLocation);
      if (location) {
        setViewState({
          longitude: location.lng,
          latitude: location.lat,
          zoom: 12,
          transitionDuration: 500,
        });
      }
    }
  }, [selectedLocation, locations, initialViewState]);

  return (
    <Map
      {...viewState}
      ref={mapRef}
      mapboxAccessToken="pk.eyJ1IjoiY2MzNDc1IiwiYSI6ImNsczlxN3phczA5ajUybHFxY2E2MndoNjYifQ.XLUt5Kh-9gNrwx4BvP_RtQ"
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/cc3475/cm2lzws6h00bo01qh65ad9jgo"
      onMove={handleMapMove}
      onClick={handleMapClick}
      attributionControl={false}
      minZoom={7}
      maxZoom={15}
      maxBounds={[
        [minLng, minLat],
        [maxLng, maxLat],
      ]}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.lng}
          latitude={location.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(location);
            setSelectedLocation(location.id);
          }}
        >
          <div
            className={`cursor-pointer transition-transform duration-200 ${
              selectedLocation === location.id ? 'scale-125' : ''
            }`}
          >
            {getIcon(location.type)}
          </div>
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={popupInfo.lng}
          latitude={popupInfo.lat}
          onClose={() => setPopupInfo(null)}
        >
          <div className="p-2">
            <h3 className="font-semibold text-base mb-1">{popupInfo.name}</h3>
            <p className="text-sm text-gray-600">{popupInfo.address}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default MapComponent;
