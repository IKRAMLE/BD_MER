import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import FiltringSidebar from '../Components/FiltringSidebar';
import axiosInstance from '../../utils/axiosConfig';
import { Heart } from 'lucide-react';

function RentEquip() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 10000 },
    availability: '',
    condition: ''
  });

  // Fetch equipment data from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/equipment');
        setEquipment(response.data.data);
        setFilteredEquipment(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch equipment data');
        setLoading(false);
        console.error('Error fetching equipment:', err);
      }
    };

    fetchEquipment();
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (itemId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(itemId)) {
        return prevFavorites.filter(id => id !== itemId);
      } else {
        return [...prevFavorites, itemId];
      }
    });
  };

  const addToCart = (item) => {
    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItem = existingCart.find(cartItem => cartItem.id === item._id);
    
    let newCart;
    if (existingItem) {
      // Update quantity if item exists
      newCart = existingCart.map(cartItem =>
        cartItem.id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      // Add new item
      newCart = [...existingCart, {
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image ? `http://localhost:5000${item.image}` : '/api/placeholder/100/100',
        days: 7,
        quantity: 1
      }];
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(newCart));
    
    // Update cart count in header by dispatching an event
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: newCart.length }));
  };

  // Handle filter changes from sidebar
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    let filtered = equipment;
    if (newFilters.category) {
      filtered = filtered.filter(item => item.category === newFilters.category);
    }
    filtered = filtered.filter(item => 
      item.price >= newFilters.priceRange.min && 
      item.price <= newFilters.priceRange.max
    );
    if (newFilters.availability) {
      filtered = filtered.filter(item => item.availability === newFilters.availability);
    }
    if (newFilters.condition) {
      filtered = filtered.filter(item => item.condition === newFilters.condition);
    }
    setFilteredEquipment(filtered);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row">
        <FiltringSidebar onFilterChange={handleFilterChange} />
        
        <main className="flex-1 p-5 mt-23 ml-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Rent Medical Equipment</h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">{filteredEquipment.length} items found</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment.map(item => (
                  <div key={item._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden bg-gray-100 relative">
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
                        onClick={() => toggleFavorite(item._id)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <Heart
                          size={20}
                          className={`${
                            favorites.includes(item._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-blue-600 font-bold">
                        {item.price} DH/{item.rentalPeriod}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.availability === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.availability === 'available' ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">{item.category}</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">{item.condition}</span>
                        <span className="px-2 py-1 text-xs bg-gray-100 rounded">{item.location}</span>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={item.availability !== 'available'}
                        className={`w-full py-2 rounded transition-colors ${
                          item.availability === 'available'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {item.availability === 'available' ? 'Rent Now' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredEquipment.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No equipment matches your filters</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default RentEquip;