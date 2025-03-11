import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, Search, ChevronLeft, ChevronRight, 
  Compass, TrendingUp, User, Heart, Calendar, Plus, LogOut 
} from 'lucide-react';
import logo from "/logo.png";
import Ikram from "/Profile.png";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("/");

  useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location]);

  const menuItems = [
    { icon: Compass, text: "Browse", path: "/" },
    { icon: TrendingUp, text: "Trending", path: "/trending" },
    { icon: User, text: "Profile", path: "/profile" },
    { icon: Plus, text: "Add Equipment", path: "/add-equipment" },
    { icon: Heart, text: "Favorites", path: "/favorites" },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setActiveMenuItem(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f1efee]">
      {/* Sidebar */}
      <div className={`bg-[#084b88] text-white w-64 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed top-0 left-0 h-full z-40`}>
        <nav className="flex flex-col p-4 space-y-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          {menuItems.map((item) => (
            <div
              key={item.text}
              className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer transition-all duration-200 ${activeMenuItem === item.path ? "bg-[#37aaf8]" : "hover:bg-[#0058a6]"}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <item.icon size={20} className="text-white" />
              <span>{item.text}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-[#0058a6]">
          <button onClick={handleLogout} className="flex items-center space-x-4 text-red-400 hover:text-red-600 hover:bg-[#0d4071] p-2 rounded-lg w-full">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
          <div className="text-sm">&copy; 2025 MediShare</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-4 border-b border-[#e5e3e0] bg-[#f9f8f7] fixed top-0 left-0 w-full text-[#4e4942] shadow-md z-50">
          <div className="flex items-center space-x-8">
            <button className="p-2 rounded-full hover:bg-[#d5d1cc] transition-colors" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <img src={logo} alt="MediShare" className="h-10" />
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[#958a80]" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
                className="bg-[#e5e3e0] rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#108de4]"
              />
            </div>
            <Bell size={24} className="text-[#4e4942] hover:text-[#084b88] cursor-pointer" />
            <div className="w-8 h-8 bg-[#a39991] rounded-full overflow-hidden">
              <img src={Ikram} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            </div>
          </div>
        </nav>
        
        {/* Placeholder for Content */}
        <main className="mt-16 p-6">
          <h1 className="text-2xl font-semibold text-[#4e4942]">Welcome to MediShare Dashboard</h1>
          <p className="text-[#7d7469]">Manage your medical equipment rentals efficiently.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
