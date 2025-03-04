import React from "react";
import { useNavigate } from "react-router-dom";

const MedicalEquipment = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-600">Medical Equipment Rental</h1>
      <p className="mt-2 text-gray-700">
        Find affordable medical equipment rentals to support your recovery journey.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 rounded-full text-white font-medium bg-blue-500 hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  );
};

export default MedicalEquipment;
