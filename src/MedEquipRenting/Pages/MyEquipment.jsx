import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { Package, Edit, Trash2, Plus, Compass, TrendingUp, User, Heart, Settings } from "lucide-react";
import DashboardHeader from "../Components/DashboardHeader";
import Sidebar from "../Components/Sidebar";

const API_URL = 'http://localhost:5000';

const MyEquipmentPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userData] = useState(JSON.parse(localStorage.getItem("user")));

  const menuItems = [
    { icon: Compass, text: "Tableau de bord", path: "/dashboard" },
    { icon: Package, text: "Mon Équipement", path: "/my-equipment" },
    { icon: TrendingUp, text: "Analytiques", path: "/analytics" },
    { icon: User, text: "Profil", path: "/profile" },
    { icon: Heart, text: "Favoris", path: "/favorites" },
    { icon: Settings, text: "Paramètres", path: "/settings" },
  ];

  useEffect(() => {
    if (userData) {
      fetchEquipment();
    }
  }, [userData]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const userId = userData.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      console.log("Fetching equipment for user:", userId);
      const response = await axiosInstance.get('/equipment');
      console.log("Raw API response:", response.data);
      
      const userEquipment = response.data.data
        .filter(item => item.userId === userId)
        .map(item => ({
          ...item,
          image: item.image && !item.image.startsWith('http') ? `${API_URL}${item.image}` : item.image
        }));
      
      console.log("Processed equipment:", userEquipment);
      setEquipment(userEquipment);
      setError(null);
    } catch (err) {
      console.error("Error fetching equipment:", err);
      setError("Échec du chargement des données. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (item) => {
    console.log("Viewing details for item:", item);
    if (item && item._id) {
      const url = `/equipment/${item._id}`;
      console.log("Navigating to:", url);
      navigate(url);
    } else {
      console.error("Invalid equipment item:", item);
    }
  };

  const handleAddEquipment = () => {
    navigate("/rent-equip");
  };

  const handleDeleteEquipment = (item) => {
    navigate("/dashboard", { state: { deleteEquipment: item } });
  };

  // Filter equipment based on search query
  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f0f7ff]">
      <Sidebar isOpen={isSidebarOpen} menuItems={menuItems} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Mon Équipement</h1>
              <button
                onClick={handleAddEquipment}
                className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Ajouter un équipement
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070cc]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            ) : equipment.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-xl text-gray-600 mb-4">
                  Vous n'avez pas encore d'équipement
                </p>
                <button
                  onClick={handleAddEquipment}
                  className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-6 py-3 rounded-lg flex items-center mx-auto"
                >
                  <Plus size={20} className="mr-2" />
                  Ajouter Votre Premier Équipement
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Équipement
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          État
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ville
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEquipment.map((item) => (
                        <tr 
                          key={item._id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewDetails(item)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {item.image ? (
                                  <img
                                    className="h-10 w-10 rounded-lg object-cover"
                                    src={item.image}
                                    alt={item.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-lg bg-[#f0f7ff] flex items-center justify-center">
                                    <Package size={20} className="text-[#0070cc]" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.price} DH</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.condition}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEquipment(item);
                              }}
                              className="text-red-600 hover:text-red-900 ml-4"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyEquipmentPage;
