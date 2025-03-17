import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User, Settings, Package, LogOut } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    } else {
      // Redirect to login if not logged in
      navigate('/login2');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login2');
  };

  if (!isLoggedIn || !userData) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f7ff] mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col items-center mb-8">
                <div className="h-24 w-24 rounded-full bg-[#108de4] flex items-center justify-center text-white text-3xl mb-4">
                  <User size={40} />
                </div>
                <h2 className="text-xl font-bold text-[#084b88]">{userData.email}</h2>
                <p className="text-[#0070cc]">Member since {new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="space-y-2">
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-lg text-[#0058a6] bg-[#f0f7ff] hover:bg-[#e0f0fe] transition-colors"
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Link>
                <Link 
                  to="/my-equipment" 
                  className="flex items-center p-3 rounded-lg text-[#0058a6] hover:bg-[#f0f7ff] transition-colors"
                >
                  <Package className="h-5 w-5 mr-3" />
                  My Equipment
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center p-3 rounded-lg text-[#0058a6] hover:bg-[#f0f7ff] transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center p-3 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-[#084b88] mb-6">Welcome back!</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[#108de4] to-[#0070cc] rounded-xl p-6 text-white shadow-md">
                  <h3 className="text-lg font-medium mb-1">Quick Access</h3>
                  <p className="text-[#e0f0fe] mb-4">Manage your medical equipment</p>
                  <Link to="/my-equipment" className="inline-block px-4 py-2 bg-white text-[#0070cc] rounded-lg hover:bg-[#f0f7ff] transition-colors">
                    Go to My Equipment
                  </Link>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-md">
                  <h3 className="text-lg font-medium mb-1">Add New Equipment</h3>
                  <p className="text-green-100 mb-4">Share your medical equipment</p>
                  <Link to="/add-equipment" className="inline-block px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                    Add Equipment
                  </Link>
                </div>
              </div>
              
              <div className="bg-[#f0f7ff] rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-[#084b88] mb-4">Recent Activity</h3>
                <p className="text-[#0070cc]">You haven't had any recent activity yet.</p>
              </div>
              
              <div className="border border-[#e0f0fe] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-[#084b88] mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#108de4]">Email</p>
                    <p className="text-[#084b88]">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#108de4]">Member Status</p>
                    <p className="text-[#084b88]">Active</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#108de4]">Last Login</p>
                    <p className="text-[#084b88]">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;