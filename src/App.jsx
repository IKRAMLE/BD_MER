import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MedicalEquipment from "./MedEquipRenting/Pages/MedicalEquipment";
import Login2 from './MedEquipRenting/Pages/Login';
import SignUpPage2 from './MedEquipRenting/Pages/Signup';
import ForgotPassword from "./MedEquipRenting/Pages/Forgotpassword";
import Dashboard from "./MedEquipRenting/Pages/Dashboard";
import MyEquipment from "./MedEquipRenting/Pages/MyEquipment";
import RentEquip from "./MedEquipRenting/Pages/RentEquip";
import Profile from "./MedEquipRenting/Pages/Profile"
import Settings from "./MedEquipRenting/Pages/Settings";
import AuthGuard from "./MedEquipRenting/Components/AuthGuard";
import EquipmentDetails from "./MedEquipRenting/Pages/EquipmentDetails";
import Favoris from "./MedEquipRenting/Pages/Favoris";
import Checkout from './MedEquipRenting/Pages/Checkout';
import AdminDashboard from "./MedEquipRenting/Pages/admin/AdminDashboard";
import AdminUsers from "./MedEquipRenting/Pages/admin/Users";
import AdminEquipment from "./MedEquipRenting/Pages/admin/AdminEquipment";
import AdminSettings from "./MedEquipRenting/Pages/admin/Settings";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MedicalEquipment />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/signup2" element={<SignUpPage2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/rent-equip" element={<RentEquip />} /> 
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Protected routes with Layout */}
        <Route >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-equipment" element={<MyEquipment />} />
          <Route path="/requests" element={<div>Requests Page</div>} />
          <Route path="/chat" element={<div>Chat Page</div>} />
          <Route path="/favorites" element={<Favoris />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

            {/*Admin protected routes */}
          <Route path="/admin/dashboard" element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } />
          <Route path="/admin/users" element={
            <AuthGuard>
              <AdminUsers />
            </AuthGuard>
          } />
          <Route path="/admin/equipment" element={
            <AuthGuard>
              <AdminEquipment />
            </AuthGuard>
          } />
          <Route path="/admin/settings" element={
            <AuthGuard>
              <AdminSettings />
            </AuthGuard>
          } />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
