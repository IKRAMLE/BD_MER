import React from "react";
import {
  LayoutDashboard,
  BarChart,
  Users,
  Package,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white flex flex-col justify-between border-r border-gray-200">
      {/* Logo and Brand */}
      <div className="px-7 py-6">
        <div className="flex items-center gap-3 ">
          <div className="bg-blue-500 text-white p-2 rounded-lg ">
            <div>
              <LayoutDashboard size={20} />
            </div>
          </div>
          <span className="text-[#084b88] font-bold text-2xl">MediShare</span>
        </div>
      </div>
      <hr />
      {/* Navigation Menu */}
      <div className="flex-grow py-4 px-4">
        <ul>
          <li className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </li>
          <li className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
            <BarChart size={20} />
            <span>Analytics</span>
          </li>
          <li className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
            <Users size={20} />
            <span>Users</span>
          </li>
          <li className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
            <Package size={20} />
            <span>Equipment</span>
          </li>
        </ul>

        <div className="px-5 pt-8 pb-4 text-gray-500">Settings</div>
        <ul>
          <li className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer">
            <SettingsIcon size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </div>
      <hr />
      {/* Logout Button */}
      <div className="p-5 pt-6">
        <button className="flex items-center text-blue-500 gap-2 hover:text-blue-700 px-3 ">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
