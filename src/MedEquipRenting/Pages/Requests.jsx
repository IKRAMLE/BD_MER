import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { Compass, TrendingUp, User, Heart, Package, Settings, MessageSquare, ClipboardList, Check, X, Clock, Mail, Phone, MapPin } from "lucide-react";
import DashboardHeader from "../Components/DashboardHeader";
import Sidebar from "../../MedEquipRenting/Components/Sidebar";
import AuthenticationRequired from "../Components/AuthenticationRequired";

const Requests = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("/requests");
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setUserData(parsedUser);
      setActiveMenuItem(location.pathname);
    } else {
      // Redirect to login if no user data
      navigate("/login2");
    }
    setAuthChecked(true);
  }, [location, navigate]);

  useEffect(() => {
    // Only fetch data if we have user data
    if (userData && userData.id) {
      fetchRequests();
    }
  }, [userData]);

  // Fetch requests from API
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const userId = userData.id;
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Fetch orders from the backend API
      const response = await axiosInstance.get('/orders/owner');
      
      if (response.data.success) {
        const orders = response.data.data;
        
        // Transform orders data to match the component's expected format
        const transformedRequests = orders.map(order => {
          // Ensure we have valid items and equipment data
          const firstItem = order.items && order.items[0];
          const equipment = firstItem?.equipmentId;
          const user = order.userId;
          const personalInfo = order.personalInfo || {};

          if (!equipment) {
            console.warn('Order missing equipment data:', order);
            return null;
          }

          return {
            _id: order._id,
            equipmentId: equipment._id,
            equipmentName: equipment.name || 'Unknown Equipment',
            requesterId: user?._id,
            requesterName: personalInfo.firstName && personalInfo.lastName 
              ? `${personalInfo.firstName} ${personalInfo.lastName}`
              : 'Utilisateur',
            status: order.status || 'pending',
            startDate: order.startDate || new Date().toISOString(),
            endDate: order.endDate || new Date().toISOString(),
            rentalPeriod: firstItem?.rentalPeriod || 'day',
            totalPrice: order.totalAmount || 0,
            message: order.message || "Aucun message",
            createdAt: order.createdAt || new Date().toISOString(),
            equipmentPhoto: equipment.photos?.[0] || "/api/placeholder/100/100",
            personalInfo: {
              firstName: personalInfo.firstName || '',
              lastName: personalInfo.lastName || '',
              email: user?.email || personalInfo.email || '',
              phone: personalInfo.phone || '',
              address: personalInfo.address || '',
              city: personalInfo.city || '',
              country: personalInfo.country || '',
              postalCode: personalInfo.postalCode || '',
              cin: personalInfo.cin || '',
              profession: personalInfo.profession || '',
              organization: personalInfo.organization || ''
            }
          };
        }).filter(request => request !== null); // Remove any null entries

        setRequests(transformedRequests);

        // Calculate stats
        const stats = {
          totalRequests: transformedRequests.length,
          pending: transformedRequests.filter(req => req.status === 'pending').length,
          approved: transformedRequests.filter(req => req.status === 'approved').length,
          rejected: transformedRequests.filter(req => req.status === 'rejected').length,
        };
        setStats(stats);

        setError(null);
      } else {
        throw new Error(response.data.message || "Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Échec du chargement des demandes. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Compass, text: "Tableau de bord", path: "/dashboard" },
    { icon: Package, text: "Mon Équipement", path: "/my-equipment" },
    { icon: ClipboardList, text: "Demandes", path: "/requests" },
    { icon: MessageSquare, text: "Messages", path: "/chat" },
    { icon: Heart, text: "Favoris", path: "/favorites" },
    { icon: User, text: "Profil", path: "/profile" },
    { icon: Settings, text: "Paramètres", path: "/settings" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setActiveMenuItem(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login2");
  };

  // Filter requests based on search query and selected filter
  const filteredRequests = requests.filter(
    (req) => {
      const matchesSearch = 
        req.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = 
        selectedFilter === "all" || 
        req.status === selectedFilter;
      
      return matchesSearch && matchesFilter;
    }
  );

  const handleApprove = async (requestId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/orders/${requestId}/status`, {
        status: 'approved'
      });
      
      if (response.data.success) {
        // Update state to reflect changes
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId 
              ? { ...req, status: 'approved' } 
              : req
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
        
        setModalOpen(false);
        setSelectedRequest(null);
      } else {
        throw new Error(response.data.message || "Failed to approve request");
      }
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Échec de l'approbation de la demande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/orders/${requestId}/status`, {
        status: 'rejected'
      });
      
      if (response.data.success) {
        // Update state to reflect changes
        setRequests(prev => 
          prev.map(req => 
            req._id === requestId 
              ? { ...req, status: 'rejected' } 
              : req
          )
        );
        
        // Update stats
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          rejected: prev.rejected + 1
        }));
        
        setModalOpen(false);
        setSelectedRequest(null);
      } else {
        throw new Error(response.data.message || "Failed to reject request");
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Échec du rejet de la demande. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Format price with Moroccan Dirham
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD'
    }).format(price);
  };

  // Show authentication check
  if (!authChecked || !isLoggedIn) {
    return <AuthenticationRequired isLoading={!authChecked} />;
  }

  return (
    <div className="flex h-screen bg-[#f0f7ff]">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        handleMenuClick={handleMenuClick}
        handleLogout={handleLogout}
      />

      <div
        className={`flex-1 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <DashboardHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userData={userData}
        />

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Demandes</p>
                  <h3 className="text-2xl font-bold">{stats.totalRequests}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">En attente</p>
                  <h3 className="text-2xl font-bold">{stats.pending}</h3>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Approuvées</p>
                  <h3 className="text-2xl font-bold">{stats.approved}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Refusées</p>
                  <h3 className="text-2xl font-bold">{stats.rejected}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Requests Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Demandes de Location</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedFilter === "all" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Toutes
                </button>
                <button 
                  onClick={() => setSelectedFilter("pending")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedFilter === "pending" 
                      ? "bg-amber-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  En attente
                </button>
                <button 
                  onClick={() => setSelectedFilter("approved")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedFilter === "approved" 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Approuvées
                </button>
                <button 
                  onClick={() => setSelectedFilter("rejected")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedFilter === "rejected" 
                      ? "bg-red-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Refusées
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-60">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucune demande trouvée
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? "Aucune demande ne correspond à votre recherche." 
                    : selectedFilter !== "all" 
                      ? `Vous n'avez pas de demandes ${
                          selectedFilter === "pending" ? "en attente" : 
                          selectedFilter === "approved" ? "approuvées" : 
                          "refusées"
                        }.` 
                      : "Vous n'avez pas encore reçu de demandes de location."}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Équipement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Demandeur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Période
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr 
                          key={request._id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => openRequestDetails(request)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0">
                                <img 
                                  className="h-12 w-12 rounded-md object-cover" 
                                  src={request.equipmentPhoto} 
                                  alt={request.equipmentName} 
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.equipmentName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex-shrink-0">
                                <img 
                                  className="h-8 w-8 rounded-full" 
                                  src={request.requesterPhoto} 
                                  alt={request.requesterName} 
                                />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.requesterName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(request.startDate)} - {formatDate(request.endDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(request.totalPrice)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : request.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status === "pending"
                                ? "En attente"
                                : request.status === "approved"
                                ? "Approuvée"
                                : "Refusée"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                openRequestDetails(request);
                              }}
                            >
                              Détails
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

      {/* Request Details Modal */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
            {/* Header with gradient background */}
            <div className="relative h-24 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl">
              <div className="absolute -bottom-12 left-6 flex items-end space-x-3">
                <div className="h-24 w-24 rounded-xl border-4 border-white shadow-lg overflow-hidden">
                  <img 
                    className="h-full w-full object-cover"
                    src={selectedRequest.equipmentPhoto}
                    alt={selectedRequest.equipmentName}
                  />
                </div>
                <div className="mb-3">
                  <h2 className="text-xl font-bold text-white mb-1">{selectedRequest.equipmentName}</h2>
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                      selectedRequest.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : selectedRequest.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedRequest.status === "pending"
                      ? "En attente"
                      : selectedRequest.status === "approved"
                      ? "Approuvée"
                      : "Refusée"}
                  </span>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 pt-16">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Equipment Details */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Equipment Details Card */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-blue-600" />
                      Détails de l'équipement
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">ID de l'équipement</p>
                        <p className="text-sm font-medium">{selectedRequest.equipmentId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Prix total</p>
                        <p className="text-sm font-medium text-blue-600">{formatPrice(selectedRequest.totalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Période de location</p>
                        <p className="text-sm font-medium">{formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date de la demande</p>
                        <p className="text-sm font-medium">{new Date(selectedRequest.createdAt).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message Card */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
                      Message du demandeur
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{selectedRequest.message}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Requester Details */}
                <div className="space-y-4">
                  {/* Requester Profile Card */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-gray-800">
                        {selectedRequest.personalInfo.firstName} {selectedRequest.personalInfo.lastName}
                      </h3>
                      {selectedRequest.personalInfo.cin && (
                        <p className="text-xs text-gray-500 mt-1">CIN: {selectedRequest.personalInfo.cin}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs">{selectedRequest.personalInfo.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs">{selectedRequest.personalInfo.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs">{selectedRequest.personalInfo.address}, {selectedRequest.personalInfo.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Card */}
                  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                    <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Informations supplémentaires
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Profession</p>
                        <p className="text-sm font-medium">{selectedRequest.personalInfo.profession}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Organisation</p>
                        <p className="text-sm font-medium">{selectedRequest.personalInfo.organization}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRequest.status === "pending" && (
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    disabled={loading}
                    className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center text-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Refuser
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approuver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;