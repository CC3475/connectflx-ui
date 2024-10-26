import React, { forwardRef } from 'react';
import { Star, Wine, Beer, Apple, Beaker, Search } from 'lucide-react';
import { Location } from '../types';
import { tagColors, tagNames } from '../utils/tagUtils';

interface LocationListProps {
  locations: Location[];
  selectedLocation: number | null;
  setSelectedLocation: (id: number | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const LocationList = forwardRef<HTMLDivElement, LocationListProps>(
  ({ locations, selectedLocation, setSelectedLocation, searchTerm, setSearchTerm }, ref) => {
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

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div ref={ref} className="overflow-y-auto flex-grow">
          {locations.map((location) => (
            <div 
              key={location.id} 
              data-id={location.id}
              className={`p-6 border-b border-gray-200 hover:bg-indigo-50 transition-colors duration-200 cursor-pointer ${selectedLocation === location.id ? 'bg-indigo-100 shadow-md' : ''}`}
              onClick={() => setSelectedLocation(location.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{location.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="text-yellow-400 w-4 h-4 mr-1" />
                    <span>{location.rating.toFixed(1)}</span>
                  </div>
                  {getIcon(location.type)}
                </div>
              </div>
              <p className="text-sm text-gray-700">
                <strong>Specialties:</strong> {location.specialties.join(', ')}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {location.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className={`px-2 py-1 rounded-full text-xs font-semibold ${tagColors[tag]}`}>
                    {tagNames[tag]}
                  </span>
                ))}
                {location.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{location.tags.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default LocationList;