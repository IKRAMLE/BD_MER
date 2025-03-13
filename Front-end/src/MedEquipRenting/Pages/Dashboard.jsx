import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, Search, ChevronLeft, ChevronRight, 
  Compass, TrendingUp, User, Heart, Calendar, Plus, LogOut,
  Package, Settings, PieChart, Bookmark
} from 'lucide-react';
import logo from "/caduceus.png";

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
        // Use sampleEquipment if nothing in localStorage
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
    navigate('/profile');
  };

  const handleAddEquipment = () => {
    navigate('/add-equipment');
  };

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
           
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main>
          {/* My Equipment Section */}
          <div className="bg-[#e0f0fe] shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#084b88]">My Equipment</h2>
                <p className="text-md text-[#108de4] mt-1">Manage your medical equipment listings</p>
              </div>
              <button 
                onClick={handleAddEquipment}
                className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Add New Equipment
              </button>
            </div>
            
              <div className="text-center py-16 px-6 bg-[#f0f7ff] rounded-xl">
                <div className="rounded-full p-4 bg-[#e0f0fe] text-[#0070cc] mx-auto w-22 h-22 flex items-center justify-center mb-4">
                  <Package size={60} />
                </div>
                <h3 className="font-semibold text-lg text-[#084b88] mb-2">No equipment found</h3>
                <p className="text-[#108de4] mb-6 max-w-md mx-auto">
                  You haven't added any medical equipment yet. Add your first item to start renting it out.
                </p>
                <button 
                  onClick={handleAddEquipment}
                  className="bg-[#0070cc] hover:bg-[#0058a6] text-white px-6 py-3 rounded-lg flex items-center mx-auto"
                >
                  <Plus size={20} className="mr-2" />
                  Add Your First Equipment
                </button>
              </div>
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default Dashboard;