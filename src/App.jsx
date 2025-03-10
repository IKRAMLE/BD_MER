import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServiceCards from "./ServiceCards";
import BloodDonation from "./Blood-Donation/Pages/BloodDonation";
import MedicalEquipment from "./MedEquipRenting/Pages/MedicalEquipment";
import Login from "./Blood-Donation/Pages/Login";
import SignUpPage from './Blood-Donation/Pages/Signup';
import Login2 from './MedEquipRenting/Pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the ServiceCards */}
        <Route path="/" element={<ServiceCards />} />

        {/* Route for Blood Donation and its associated pages */}
        <Route path="/blood-donation" element={<BloodDonation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Route for Medical Equipment Renting and its login */}
        <Route path="/medical-equipment" element={<MedicalEquipment />} />
        <Route path="/login2" element={<Login2 />} />
      </Routes>
    </Router>
  );
};

export default App;
