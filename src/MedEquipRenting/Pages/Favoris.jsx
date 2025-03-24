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
      
      // Extract equipment data from favorites
      const favoriteEquipment = response.data.data
        .filter(fav => fav && fav.equipment)
        .map(fav => fav.equipment);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(
        favoriteEquipment
          .filter(item => item && item.category)
          .map(item => item.category)
      )];
      
      setCategories(['all', ...uniqueCategories]);
      setFavorites(favoriteEquipment);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        navigate('/login2');
      } else {
        setError('Impossible de charger les favoris');
      }
      
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
      
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        navigate('/login2');
      }
    }
  };

  const handleViewDetails = (item) => {
    navigate(`/equipment/${item._id}`);
  };

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Favoris</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {categories.length > 1 && (
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes les catégories' : category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500">
          <AlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">Aucun favori trouvé</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map(item => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div 
                  className="relative h-48 cursor-pointer"
                  onClick={() => handleViewDetails(item)}
                >
                  {item.image ? (
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => removeFavorite(e, item._id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Heart className="text-red-500 fill-red-500" size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">{item.category}</p>
                  <p className="text-blue-600 font-semibold">{item.price}€/jour</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Favoris;