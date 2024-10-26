import React, { useState, useEffect, useCallback } from 'react';
import Map from './components/Map';
import FilterBar from './components/FilterBar';
import LocationList from './components/LocationList';
import LocationDetail from './components/LocationDetail';
import { Location } from './types';
import locationsData from './data/locations.json';
import { Filter } from 'lucide-react';

interface Filters {
  types: string[];
  specialties: string[];
  lakes: string[];
  tags: string[];
}

const App: React.FC = () => {
  const [locations] = useState<Location[]>(locationsData.locations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    types: [],
    specialties: [],
    lakes: [],
    tags: [],
  });

  const allSpecialties = Array.from(
    new Set(locations.flatMap((loc) => loc.specialties))
  ).sort();

  const allLakes = Array.from(
    new Set(
      locations.filter((loc) => loc.lake).map((loc) => loc.lake as string)
    )
  ).sort();

  const allTags = Array.from(
    new Set(locations.flatMap((loc) => loc.tags))
  ).sort();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleMapClick = () => {
    setShowFilters(false);
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTypes =
      filters.types.length === 0 || filters.types.includes(location.type);
    const matchesSpecialties =
      filters.specialties.length === 0 ||
      location.specialties.some((s) => filters.specialties.includes(s));
    const matchesLakes =
      filters.lakes.length === 0 ||
      (location.lake && filters.lakes.includes(location.lake));

    return matchesSearch && matchesTypes && matchesSpecialties && matchesLakes;
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-md p-4 flex items-center space-x-4 mb-4">
        <h1 className="logo-text mr-auto">
          <span className="connect">Connect</span>
          <span className="flx">FLX</span>
        </h1>
      </div>
      <div className="flex flex-1 overflow-hidden px-4 pb-4 relative">
        <div className="hidden md:block w-1/3 mr-4">
          {selectedLocation ? (
            <LocationDetail
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          ) : (
            <div className="bg-white shadow-lg rounded-lg h-full overflow-hidden">
              <LocationList
                locations={filteredLocations}
                selectedLocation={selectedLocation?.id || null}
                setSelectedLocation={(id) =>
                  setSelectedLocation(
                    locations.find((loc) => loc.id === id) || null
                  )
                }
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
          )}
        </div>
        <div className="flex-1 rounded-lg overflow-hidden shadow-lg relative">
          <div className="absolute top-4 right-4 z-30">
            <button
              className="p-2 rounded-full bg-white shadow-md text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
              onClick={toggleFilters}
            >
              <Filter size={20} />
            </button>
          </div>
          {showFilters && (
            <div
              className="absolute top-16 right-4 z-20 bg-white shadow-lg rounded-lg p-4"
              style={{ width: 'calc(100% - 2rem)', maxWidth: '400px' }}
            >
              <FilterBar
                filters={filters}
                setFilters={setFilters}
                allSpecialties={allSpecialties}
                allLakes={allLakes}
                allTags={allTags}
              />
            </div>
          )}
          <Map
            locations={filteredLocations}
            selectedLocation={selectedLocation?.id || null}
            setSelectedLocation={(id) =>
              setSelectedLocation(
                locations.find((loc) => loc.id === id) || null
              )
            }
            onMapClick={handleMapClick}
          />
        </div>

        {/* Mobile List View */}
        <div
          className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out transform ${
            showList ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Locations</h2>
              <button
                onClick={() => setShowList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <LocationList
              locations={filteredLocations}
              selectedLocation={selectedLocation?.id || null}
              setSelectedLocation={(id) => {
                setSelectedLocation(
                  locations.find((loc) => loc.id === id) || null
                );
                setShowList(false);
              }}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* Mobile Detail View */}
        <div
          className={`md:hidden fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out transform ${
            selectedLocation && !showList ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {selectedLocation && (
            <div className="h-full flex flex-col">
              <div className="h-1/3">
                <Map
                  locations={[selectedLocation]}
                  selectedLocation={selectedLocation.id}
                  setSelectedLocation={() => {}}
                  onMapClick={() => {}}
                  initialViewState={{
                    longitude: selectedLocation.lng,
                    latitude: selectedLocation.lat,
                    zoom: 14,
                  }}
                />
              </div>
              <div className="h-2/3 overflow-y-auto">
                <LocationDetail
                  location={selectedLocation}
                  onClose={() => setSelectedLocation(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Centered List View Button */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center md:hidden">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-lg"
          onClick={() => setShowList(!showList)}
        >
          List View
        </button>
      </div>
    </div>
  );
};

export default App;
