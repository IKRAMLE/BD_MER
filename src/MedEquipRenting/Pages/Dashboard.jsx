import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, Search, ChevronLeft, ChevronRight, 
  Compass, TrendingUp, User, Heart, Calendar, Plus, LogOut,
  Package, Settings, PieChart, Bookmark
} from 'lucide-react';
import logo from "/public/caduceus.png";

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

  useEffect(() => {
    setActiveMenuItem(location.pathname);
    
    // Load equipment data from localStorage
    const loadEquipment = () => {
      const storedEquipment = localStorage.getItem('equipment');
      if (storedEquipment) {
        const parsedEquipment = JSON.parse(storedEquipment);
        setEquipment(parsedEquipment);
        
        // Calculate stats
        setStats({
          totalEquipment: parsedEquipment.length,
          active: parsedEquipment.filter(item => item.status === 'active').length,
          pending: parsedEquipment.filter(item => item.status === 'pending').length,
          revenue: parsedEquipment.reduce((total, item) => total + (item.price || 0), 0)
        });
      } else {
        // Initialize with sample data if none exists
        const sampleEquipment = [
          {
            id: '1',
            name: 'Wheelchair - Foldable Premium',
            image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
            price: 300,
            timeUnit: 'week',
            location: 'Casablanca',
            category: 'Mobility',
            status: 'active'
          },
          {
            id: '2',
            name: 'Oxygen Concentrator - 5L',
            image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
            price: 450,
            timeUnit: 'week',
            location: 'Rabat',
            category: 'Respiratory',
            status: 'active'
          },
          {
            id: '3',
            name: 'Hospital Bed - Electric Adjustable',
            image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
            price: 800,
            timeUnit: 'month',
            location: 'Marrakech',
            category: 'Home Care',
            status: 'pending'
          }
        ];
        
        localStorage.setItem('equipment', JSON.stringify(sampleEquipment));
        setEquipment(sampleEquipment);
        
        // Set initial stats
        setStats({
          totalEquipment: sampleEquipment.length,
          active: sampleEquipment.filter(item => item.status === 'active').length,
          pending: sampleEquipment.filter(item => item.status === 'pending').length,
          revenue: sampleEquipment.reduce((total, item) => total + (item.price || 0), 0)
        });
      }
    };
    
    loadEquipment();
  }, [location]);

  const menuItems = [
    { icon: Compass, text: "Dashboard", path: "/dashboard" },
    { icon: Package, text: "My Equipment", path: "/my-equipment" },
    { icon: TrendingUp, text: "Analytics", path: "/analytics" },
    { icon: User, text: "Profile", path: "/profile" },
    { icon: Heart, text: "Favorites", path: "/favorites" },
    { icon: Plus, text: "Add Equipment", path: "/add-equipment" },
    { icon: Settings, text: "Settings", path: "/settings" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setActiveMenuItem(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login2');
  };

  return (
    <div className="flex h-screen bg-[#f0f7ff]">
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
            {isSidebarOpen && <span>Sign Out</span>}
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
            <h1 className="text-xl font-semibold text-[#084b88]">Welcome to Your Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#37aaf8]" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
                className="bg-[#f0f7ff] rounded-full pl-10 pr-4 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-[#108de4] text-sm"
              />
            </div>
            
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-[#e0f0fe] text-[#0070cc] transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3 border-l pl-4 border-[#e0f0fe]">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#108de4] to-[#0058a6] flex items-center justify-center text-white font-medium">
                U
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#084b88]">User Name</p>
                <p className="text-xs text-[#108de4]">Equipment Owner</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
              <div className="rounded-full p-3 bg-[#e0f0fe] text-[#0070cc] mr-4">
                <Package size={24} />
              </div>
              <div>
                <p className="text-sm text-[#108de4]">Total Equipment</p>
                <p className="text-2xl font-semibold text-[#084b88]">{stats.totalEquipment}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
              <div className="rounded-full p-3 bg-green-100 text-green-600 mr-4">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-[#108de4]">Active Listings</p>
                <p className="text-2xl font-semibold text-[#084b88]">{stats.active}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
              <div className="rounded-full p-3 bg-[#f1efee] text-[#958a80] mr-4">
                <Bookmark size={24} />
              </div>
              <div>
                <p className="text-sm text-[#108de4]">Pending Requests</p>
                <p className="text-2xl font-semibold text-[#084b88]">{stats.pending}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
              <div className="rounded-full p-3 bg-[#bae0fd] text-[#0070cc] mr-4">
                <PieChart size={24} />
              </div>
              <div>
                <p className="text-sm text-[#108de4]">Total Revenue</p>
                <p className="text-2xl font-semibold text-[#084b88]">{stats.revenue} DH</p>
              </div>
            </div>
          </div>
          
          {/* Recent Equipment */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#084b88]">Your Equipment</h2>
              <button className="text-sm font-medium text-[#0070cc] hover:text-[#084b88]">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map((item) => (
                <div key={item.id} className="border border-[#e0f0fe] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'active' ? 'bg-[#108de4] text-white' : 'bg-[#a39991] text-white'
                    }`}>
                      {item.status === 'active' ? 'Active' : 'Pending'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-[#084b88] mb-1">{item.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-[#0070cc] text-sm">{item.location}</p>
                      <p className="font-semibold text-[#084b88]">{item.price} DH<span className="text-xs text-[#108de4]">/{item.timeUnit}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;