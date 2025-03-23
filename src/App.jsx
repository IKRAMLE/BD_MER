import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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





const App = () => {
  return (
    <Router>
      <Routes>

        {/* Route for Medical Equipment Renting and its login */}
        <Route path="/" element={<MedicalEquipment />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/signup2" element={<SignUpPage2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/rent-equip" element={<RentEquip />} /> 
        <Route path="/profile" element={<Profile />} />

           {/* Protected routes */}
           <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/my-equipment" element={<AuthGuard><MyEquipment /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
      </Routes>
    </Router>
  );
};

export default App;
