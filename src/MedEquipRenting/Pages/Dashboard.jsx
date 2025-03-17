import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import { 
  Bell, Search, ChevronLeft, ChevronRight, 
  Compass, TrendingUp, User, Heart, Plus, LogOut,
  Package, Settings, Edit, Trash2, X,
} from 'lucide-react';
import logo from "/caduceus.png";

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("/dashboard");
  const [equipment, setEquipment] = useState([]);
  const [stats, setStats] = useState({
    totalEquipment: 0,
    active: 0,
    pending: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rentalPeriod: 'day',
    condition: '',
    availability: 'available',
    location: '',
    image: null,
  });

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
      setActiveMenuItem(location.pathname);
      fetchData();
    } else {
      // Redirect to login if not logged in
      navigate('/login2');
    }
  }, [location, navigate]);

  // Fetch equipment and stats from API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch equipment
      const equipmentRes = await axios.get(`${API_URL}/equipment`);
      setEquipment(equipmentRes.data);
      
      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/stats`);
      setStats(statsRes.data);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Échec du chargement des données. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Compass, text: "Tableau de bord", path: "/dashboard" },
    { icon: Package, text: "Mon Équipement", path: "/my-equipment" },
    { icon: TrendingUp, text: "Analytiques", path: "/analytics" },
    { icon: User, text: "Profil", path: "/profile" },
    { icon: Heart, text: "Favoris", path: "/favorites" },
    { icon: Plus, text: "Ajouter Équipement", path: "/add-equipment" },
    { icon: Settings, text: "Paramètres", path: "/settings" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setActiveMenuItem(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login2');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleAddEquipment = () => {
    setFormMode('add');
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      rentalPeriod: 'day',
      condition: '',
      availability: 'available',
      location: '',
      image: null,
    });
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleEditEquipment = (item) => {
    setFormMode('edit');
    setCurrentEquipment(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: item.price || '',
      rentalPeriod: item.rentalPeriod || 'day',
      condition: item.condition || '',
      availability: item.availability || 'available',
      location: item.location || '',
      image: null, 
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleDeleteClick = (item) => {
    setEquipmentToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!equipmentToDelete) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/equipment/${equipmentToDelete._id}`);
      
      // Remove deleted item from state
      setEquipment(prev => prev.filter(item => item._id !== equipmentToDelete._id));
      
      // Close modal
      setIsDeleteModalOpen(false);
      setEquipmentToDelete(null);
      
      // Refresh data to update stats
      fetchData();
    } catch (err) {
      console.error('Error deleting equipment:', err);
      setError('Échec de la suppression de l\'équipement. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEquipmentToDelete(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataObj.append('image', formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataObj.append(key, formData[key]);
        }
      });
      
      let response;
      
      if (formMode === 'add') {
        // Send POST request to add equipment
        response = await axios.post(`${API_URL}/equipment`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Add new equipment to state
        setEquipment(prev => [response.data, ...prev]);
      } else if (formMode === 'edit' && currentEquipment) {
        // Send PUT request to update equipment
        response = await axios.put(`${API_URL}/equipment/${currentEquipment._id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update equipment in state
        setEquipment(prev => 
          prev.map(item => item._id === currentEquipment._id ? response.data : item)
        );
      }
      
      // Reset form and close form view
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        rentalPeriod: 'day',
        condition: '',
        availability: 'available',
        location: '',
        image: null,
      });
      setShowAddForm(false);
      setShowEditForm(false);
      setCurrentEquipment(null);
      
      // Refresh data to update stats
      fetchData();
    } catch (err) {
      console.error('Error saving equipment:', err);
      setError(`Échec de ${formMode === 'add' ? 'l\'ajout' : 'la mise à jour'} de l\'équipement. Veuillez réessayer.`);
    } finally {
      setLoading(false);
    }
  };

  // Filter equipment based on search query
  const filteredEquipment = equipment.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`bg-gradient-to-b from-[#084b88] to-[#082a4d] text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } fixed h-full z-40 shadow-xl`}
      >
        <div className="flex items-center justify-between p-4">
          <div className={`flex items-center ${!isSidebarOpen && 'justify-center w-full'}`}>
            <div className="h-10 w-10 rounded-3xl bg-gradient-to-br from-[#37aaf8] to-[#0070cc] flex items-center justify-center mr-2 shadow-md">
              <img src={logo} alt="MediShare" className="h-7" />
            </div>
            {isSidebarOpen && (
              <span className="font-semibold text-xl">
                MediShare
              </span>
            )}
          </div>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.text}
                className={`flex items-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  activeMenuItem === item.path 
                    ? "bg-[#0058a6] text-white" 
                    : "text-[#e0f0fe] hover:bg-[#0058a6]/50"
                }`}
                onClick={() => handleMenuClick(item.path)}
              >
                <item.icon size={20} className={isSidebarOpen ? "mr-3" : "mx-auto"} />
                {isSidebarOpen && <span>{item.text}</span>}
              </div>
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-[#0058a6]">
          <button 
            onClick={handleLogout} 
            className={`flex items-center text-red-300 hover:text-red-100 hover:bg-red-900/20 py-3 px-4 rounded-xl w-full transition-colors ${
              !isSidebarOpen && 'justify-center'
            }`}
          >
            <LogOut size={20} className={isSidebarOpen ? "mr-3" : ""} />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-[#e0f0fe] text-[#0070cc] transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <h1 className="text-xl font-semibold text-[#084b88]">Bienvenue sur votre tableau de bord</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#37aaf8]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un équipement..."
                className="bg-[#f0f7ff] rounded-full pl-10 pr-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-[#108de4] text-sm"
              />
            </div>
            
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-[#e0f0fe] text-[#0070cc] transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-[#084b88] text-sm font-medium mb-2">Équipement Total</h3>
              <p className="text-3xl font-bold text-[#0070cc]">{stats.totalEquipment}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-[#084b88] text-sm font-medium mb-2">Annonces Actives</h3>
              <p className="text-3xl font-bold text-green-500">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-[#084b88] text-sm font-medium mb-2">Annonces En Attente</h3>
              <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-[#084b88] text-sm font-medium mb-2">Revenu Total</h3>
              <p className="text-3xl font-bold text-[#0070cc]">{stats.revenue} MAD</p>
            </div>
          </div>
          
          {/* My Equipment Section */}
          <div className="bg-[#e0f0fe] shadow-sm p-6 mb-8 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#084b88]">Mon Équipement</h2>
                <p className="text-md text-[#108de4] mt-1">Gérez vos annonces d'équipement médical</p>
              </div>
              <button 
                onClick={handleAddEquipment}
                className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Ajouter Nouvel Équipement
              </button>
            </div>
            
            {loading && <div className="text-center py-8">Chargement...</div>}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                {error}
                <button 
                  onClick={() => setError(null)} 
                  className="absolute top-0 right-0 p-3"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {!loading && !error && filteredEquipment.length === 0 ? (
              <div className="text-center py-16 px-6 bg-[#f0f7ff] rounded-xl">
                <div className="rounded-full p-4 bg-[#e0f0fe] text-[#0070cc] mx-auto w-22 h-22 flex items-center justify-center mb-4">
                  <Package size={60} />
                </div>
                <h3 className="font-semibold text-lg text-[#084b88] mb-2">Aucun équipement trouvé</h3>
                <p className="text-[#108de4] mb-6 max-w-md mx-auto">
                  Vous n'avez pas encore ajouté d'équipement médical. Ajoutez votre premier article pour commencer à le louer.
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
             

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredEquipment.map((item) => (
    <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-50 bg-gray-200 relative">
        {item.image ? (
          <img 
            src={`http://localhost:5000${item.image}`} 
            alt={item.name} 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-[#f0f7ff]">
            <Package size={64} className="text-[#0070cc]" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#084b88] mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {item.description.length > 100 
            ? `${item.description.substring(0, 28)}...` 
            : item.description}
        </p>
        <p className="text-[#0070cc] font-bold">
          {item.price} MAD/{item.rentalPeriod === 'day' ? 'jour' : 'mois'}
        </p>
        
        {/* Edit and Delete buttons */}
        <div className="flex justify-end space-x-2 -mt-7">
          <button 
            onClick={() => handleEditEquipment(item)}
            className="p-2 bg-[#e0f0fe] text-[#0070cc] rounded-full hover:bg-[#0070cc] hover:text-white transition-colors"
            title="Modifier"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => handleDeleteClick(item)}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#084b88]">Confirmer la Suppression</h3>
                  <button 
                    onClick={cancelDelete}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="mb-6">
                  Êtes-vous sûr de vouloir supprimer "{equipmentToDelete?.name}" ? Cette action ne peut pas être annulée.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Equipment Form (Add/Edit) */}
          {(showAddForm || showEditForm) && (
            <div className="bg-white p-8 shadow-lg rounded-xl">
              <h2 className="text-2xl font-semibold text-[#084b88] mb-4">
                {formMode === 'add' ? 'Ajouter Nouvel Équipement' : 'Modifier Équipement'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Nom de l'Équipement</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Catégorie</label>
                  <input 
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Prix</label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Période de Location</label>
                  <select
                    value={formData.rentalPeriod}
                    onChange={(e) => setFormData({ ...formData, rentalPeriod: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                  >
                    <option value="day">Jour</option>
                    <option value="month">Mois</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">État</label>
                  <input 
                    type="text"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Disponibilité</label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                  >
                    <option value="available">Disponible</option>
                    <option value="not-available">Non Disponible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Emplacement</label>
                  <input 
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#084b88]">Image</label>
                  {formMode === 'edit' && (
                    <p className="text-sm text-gray-500 mb-2">
                      {currentEquipment?.image ? 'Laissez vide pour conserver l\'image actuelle' : 'Pas d\'image actuelle'}
                    </p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 bg-[#f0f7ff] border border-[#ccc] rounded-lg"
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-700 text-white py-3 px-6 rounded-lg"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0070cc] hover:bg-[#0058a6] text-white py-3 px-6 rounded-lg"
                    disabled={loading}
                  >
                    {loading ? (formMode === 'add' ? 'Ajout en cours...' : 'Mise à jour...') : (formMode === 'add' ? 'Ajouter Équipement' : 'Mettre à jour Équipement')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;