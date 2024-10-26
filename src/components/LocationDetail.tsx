import React, { useState } from 'react';
import {
  Star,
  X,
  Wine,
  Beer,
  Apple,
  Beaker,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Location } from '../types';
import { tagColors, tagNames } from '../utils/tagUtils';

interface LocationDetailProps {
  location: Location;
  onClose: () => void;
}

const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  onClose,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'winery':
        return <Wine className="text-purple-500" size={24} />;
      case 'brewery':
        return <Beer className="text-yellow-500" size={24} />;
      case 'cidery':
        return <Apple className="text-red-500" size={24} />;
      case 'distillery':
        return <Beaker className="text-blue-500" size={24} />;
      default:
        return null;
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(location.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg h-full overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{location.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="p-4 overflow-y-auto flex-grow">
        <img
          src={
            location.imagePath ||
            'https://via.placeholder.com/400x200?text=No+Image'
          }
          alt={location.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="text-yellow-400 w-5 h-5 mr-1" />
            <span className="text-lg font-semibold">
              {location.rating.toFixed(1)}
            </span>
          </div>
          {getIcon(location.type)}
        </div>
        <p className="mb-2">
          <strong>Website </strong>
          <br />
          <a
            className="text-blue-500"
            target="_blank"
            href={location.website}
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'left',
            }}
          >
            Visit
            <ExternalLink
              size={18}
              style={{ marginLeft: '4px', marginTop: '2px' }}
            />
          </a>
        </p>
        <div className="flex items-start mb-2">
          <div className="flex-grow">
            <strong>Address</strong>
            <p className="text-gray-700">{location.address}</p>
          </div>
          <button
            onClick={handleCopyAddress}
            className="ml-2 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title="Copy address"
          >
            {copySuccess ? (
              <Check size={20} className="text-green-500" />
            ) : (
              <Copy size={20} />
            )}
          </button>
        </div>
        <p className="mb-2">
          <strong>Specialties</strong>
          <br />
          <p className="text-gray-700"> {location.specialties.join(', ')}</p>
        </p>
        {location.lake && (
          <p className="mb-2">
            <strong>Lake</strong>
            <br />
            <p className="text-gray-700">{location.lake}</p>
          </p>
        )}
        <div className="mb-2">
          <strong>Tags</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {location.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-semibold ${tagColors[tag]}`}
              >
                {tagNames[tag]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
