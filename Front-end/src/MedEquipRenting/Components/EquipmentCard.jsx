import React, { useState } from 'react';
import { Heart, MapPin, Star } from 'lucide-react';

const EquipmentCard = ({
  id,
  name,
  image,
  price,
  timeUnit,
  location,
  category,
  rating,
  reviewCount,
  isNew = false,
  isFeatured = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  return (
    <div className="relative group">
      <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Conteneur d'image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 shimmer-effect"></div>
          )}
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
          />
          
          <button 
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite 
                ? 'bg-rose-50 text-rose-500' 
                : 'bg-black/10 text-white hover:bg-black/20'
            }`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          
          {isNew && (
            <div className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-green-500 text-white rounded-full">
              Nouveau
            </div>
          )}
          
          {isFeatured && (
            <div className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-amber-500 text-white rounded-full">
              Vedette
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20 pointer-events-none"></div>
        </div>
        
        {/* Contenu */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-[#f0f7ff] text-[#0070cc] mb-2">
                {category}
              </span>
              <h3 className="font-medium text-gray-900 text-lg line-clamp-1">{name}</h3>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#0058a6]">{price.toLocaleString('fr-MA')} DH</p>
              <p className="text-xs text-[#b8b2ab]">par {timeUnit}</p>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-[#b8b2ab] mb-3">
            <MapPin size={14} className="mr-1" /> {location}
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center">
              <div className="flex items-center text-amber-400 mr-1">
                <Star size={14} fill="currentColor" /> 
              </div>
              <span className="text-sm font-medium text-gray-800">{rating}</span>
              <span className="text-xs text-[#b8b2ab] ml-1">({reviewCount} avis)</span>
            </div>
            <button className="text-sm font-medium text-[#0070cc] hover:text-[#0058a6]">
              Voir les détails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
