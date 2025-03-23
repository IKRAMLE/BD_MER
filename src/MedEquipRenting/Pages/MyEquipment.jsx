import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Package, Plus, Search, User, AlertCircle } from "lucide-react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const MyEquipment = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication first
  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Fetch equipment data based on current filters
  const fetchEquipment = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (sortField) params.append("sort", sortField);
      if (sortDirection) params.append("order", sortDirection);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      
      // Get user ID for filtering by owner
      if (userData && userData.id) {
        params.append("userId", userData.id);
      }
      
      // Make API request
      const response = await fetch(`http://localhost:5000/api/equipment?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch equipment");
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      setError(error.message);
      
      // Fallback to local storage in case API fails
      try {
        const productsJSON = localStorage.getItem("userProducts");
        if (productsJSON) {
          setProducts(JSON.parse(productsJSON));
        }
      } catch (storageError) {
        console.error("Error reading from localStorage:", storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch equipment after authentication check
  useEffect(() => {
    if (isLoggedIn) {
      fetchEquipment();
    }
  }, [isLoggedIn]);

  // Refetch equipment when filters change
  useEffect(() => {
    if (isLoggedIn) {
      fetchEquipment();
    }
  }, [searchQuery, sortField, sortDirection, categoryFilter]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login2");
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f0f7ff]">
        <div className="text-[#0070cc] text-xl">Chargement...</div>
      </div>
    );
  }

  // Show authentication required message
  if (authChecked && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-white to-[#f0f7ff] p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-red-500 text-white p-8 rounded-t-2xl">
              <div className="flex items-center">
                <AlertCircle size={32} className="mr-4" />
                <h2 className="text-2xl font-bold">Authentification requise</h2>
              </div>
              <p className="mt-2 text-white/90">
                Veuillez vous connecter pour accéder à cette page.
              </p>
            </div>
            <div className="p-8 bg-white">
              <p className="text-gray-600 mb-6">
                Vous devez être connecté(e) pour voir et gérer votre équipement
                médical. Veuillez vous connecter pour continuer.
              </p>
              <div className="flex flex-col space-y-4">
                <Link
                  to="/login2"
                  className="inline-flex justify-center items-center px-6 py-3 bg-[#0070cc] hover:bg-[#0058a6] text-white font-medium rounded-lg transition-colors"
                >
                  <User size={18} className="mr-2" />
                  Se connecter
                </Link>
                <Link
                  to="/"
                  className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-[#0070cc] font-medium rounded-lg hover:bg-[#f0f7ff] transition-colors"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={handleLogout} />

      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#084b88]">
                Mon Équipement
              </h1>
              <p className="text-[#0070cc] mt-1">
                Gérez tout votre équipement médical répertorié
              </p>
            </div>

            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => navigate("/add-equipment")}
                className="px-4 py-2 bg-[#0070cc] hover:bg-[#0058a6] text-white rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Ajouter un équipement
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-[#37aaf8]"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Rechercher un équipement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108de4]"
                />
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108de4]"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="Aides à la Mobilité">Aides à la Mobilité</option>
                  <option value="Équipement Respiratoire">Équipement Respiratoire</option>
                  <option value="Lits d'Hôpital">Lits d'Hôpital</option>
                  <option value="Sécurité Salle de Bain">Sécurité Salle de Bain</option>
                  <option value="Lève-Personnes">Lève-Personnes</option>
                  <option value="Aides à la Vie Quotidienne">Aides à la Vie Quotidienne</option>
                </select>
              </div>

              <div>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split("-");
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108de4]"
                >
                  <option value="name-asc">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="price-asc">Prix (Bas à Élevé)</option>
                  <option value="price-desc">Prix (Élevé à Bas)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-red-500">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-medium text-red-800">Erreur lors du chargement</h3>
                  <p className="text-red-600 mt-1">Impossible de charger votre équipement. Veuillez réessayer.</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-[#0070cc] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#108de4]">Chargement de votre équipement...</p>
            </div>
          )}

          {/* Equipment List */}
          {!loading && !error && products.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-[#7cc7fc]" />
              <h3 className="text-xl font-medium text-[#084b88] mb-2">
                Aucun équipement trouvé
              </h3>
              <p className="text-[#108de4] mb-6 max-w-md mx-auto">
                Vous n'avez pas encore ajouté d'équipement médical ou aucun équipement ne correspond à vos filtres actuels.
              </p>
              <button
                onClick={() => navigate("/add-equipment")}
                className="px-4 py-2 bg-[#0070cc] hover:bg-[#0058a6] text-white rounded-md flex items-center justify-center mx-auto"
              >
                <Plus size={18} className="mr-1" />
                Ajouter un équipement
              </button>
            </div>
          ) : !loading && !error && (
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix/Jour
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-[#e0f0fe]">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-10 w-10 object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center text-[#7cc7fc]">
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#0d4071]">
                              {product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#108de4] line-clamp-2">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-[#0d4071]">
                          {product.price} MAD
                          <span className="text-xs font-normal text-[#108de4] ml-1">
                            /jour
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.availability === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.availability === "available"
                            ? "Disponible"
                            : "Indisponible"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/edit-equipment/${product.id}`}
                          className="text-[#0070cc] hover:text-[#0058a6] px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Gérer
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyEquipment;