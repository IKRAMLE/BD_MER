import React from "react";
import { motion } from "framer-motion";
import { FaTint, FaWheelchair } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ServiceCards = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 gap-8">
      {/* Blood Donation Card */}
      <motion.div
        className="p-6 rounded-2xl shadow-2xl drop-shadow-lg bg-red-50 w-80 h-67 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-4 mt-4">
          <FaTint className="text-red-500 text-4xl" />
        </div>
        <h2 className="text-xl font-semibold">Don de Sang</h2>
        <p className="text-gray-600 text-sm mt-2">
          Sauvez des vies en donnant votre sang. Votre contribution est précieuse.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/blood-donation")}
          className="mt-4 px-4 py-2 rounded-full text-white font-medium bg-red-500 hover:bg-red-600"
        >
          Donner Maintenant
        </motion.button>
      </motion.div>

      {/* Medical Equipment Rental Card */}
      <motion.div
        className="p-6 rounded-2xl shadow-2xl drop-shadow-lg bg-blue-50 w-80 h-67 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex justify-center mb-4 mt-4">
          <FaWheelchair className="text-blue-500 text-4xl" />
        </div>
        <h2 className="text-xl font-semibold">Location de Matériel Médical</h2>
        <p className="text-gray-600 text-sm mt-2">
          Louez du matériel médical abordable pour faciliter votre rétablissement.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/medical-equipment")}
          className="mt-4 px-4 py-2 rounded-full text-white font-medium bg-blue-500 hover:bg-blue-600"
        >
          Louer du Matériel
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ServiceCards;
