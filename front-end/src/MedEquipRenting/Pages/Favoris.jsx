import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, AlertCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';

const Favoris = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/favorites');
      const favoritesData = response.data.data;
      
      // Extract unique categories
      const uniqueCategories = [...new Set(favoritesData.map(item => item.category))];
      setCategories(['all', ...uniqueCategories]);
      
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Impossible de charger les favoris');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (e, equipmentId) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/favorites/${equipmentId}`);
      setFavorites(prev => prev.filter(item => item._id !== equipmentId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleViewDetails = (item) => {
    navigate(`/equipment/${item._id}`);
  };

  // Filter and search logic
  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0070cc]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-center text-[#0070cc]">
            <AlertCircle className="h-8 w-8" />
          </div>
          <p className="text-center mt-2 text-[#084b88]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-[#084b88] mb-4">
          Mes Favoris
        </h2>

        {/* Search and Filter */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7cc7fc] h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#bae0fd] focus:outline-none focus:ring-2 focus:ring-[#0070cc] bg-[#f0f7ff] text-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7cc7fc] h-4 w-4" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#bae0fd] focus:outline-none focus:ring-2 focus:ring-[#0070cc] bg-[#f0f7ff] appearance-none cursor-pointer text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Favorites List */}
        <div className="space-y-3">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-6 text-[#7d7469]">
              {searchTerm || filterCategory !== 'all' 
                ? 'Aucun favori ne correspond à vos critères'
                : 'Aucun favori pour le moment'}
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filteredFavorites.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    onClick={() => handleViewDetails(item)}
                    className="bg-[#f0f7ff] rounded-lg p-3 flex items-center space-x-3 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <img
                      src={item.image ? `http://localhost:5000${item.image}` : '/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-[#084b88] truncate pr-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={(e) => removeFavorite(e, item._id)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                      
                      <p className="text-[#4e4942] text-xs line-clamp-1 mb-1">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#0070cc] font-medium">
                          {item.price} DH
                        </span>
                        <span className={`text-xs ${
                          item.availability === 'available' 
                            ? 'text-[#059669]' 
                            : 'text-[#dc2626]'
                        }`}>
                          {item.availability === 'available' ? 'Disponible' : 'Non disponible'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favoris;
