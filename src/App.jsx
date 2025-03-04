import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ServiceCards from "./ServiceCards";
import BloodDonation from "./Blood-Donation/Pages/BloodDonation";
import MedicalEquipment from "./MedEquipRenting/Pages/MedicalEquipment";
import Login from "./Blood-Donation/Pages/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ServiceCards />} />
        <Route path="/blood-donation" element={<BloodDonation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/medical-equipment" element={<MedicalEquipment />} />
      </Routes>
    </Router>
  );
};

export default App;
