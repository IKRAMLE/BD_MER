import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { ArrowLeft } from "lucide-react";

const API_URL = 'http://localhost:5000'; 

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching equipment with ID:", id);
        const response = await axiosInstance.get(`/equipment/${id}`);
        console.log("Equipment details API response:", response);
        
        let equipmentData;
        if (response.data.data) {
          equipmentData = response.data.data;
        } else if (response.data) {
          equipmentData = response.data;
        } else {
          throw new Error("Invalid response format");
        }
        
        // Add full URL to image
        if (equipmentData.image && !equipmentData.image.startsWith('http')) {
          equipmentData.image = `${API_URL}${equipmentData.image}`;
        }
        
        console.log("Processed equipment data:", equipmentData);
        setEquipment(equipmentData);
      } catch (error) {
        console.error("Error fetching equipment details:", error);
        setError("Impossible de charger les détails de l'équipement. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log("Starting fetch for equipment ID:", id);
      fetchEquipmentDetails();
    } else {
      console.error("No equipment ID provided");
      setError("ID d'équipement manquant");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
          <p className="text-xl">Équipement non trouvé</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Equipment image section */}
            <div className="md:w-2/5 bg-gray-100">
              {equipment.image ? (
                <img
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full h-full object-cover object-center"
                  style={{ minHeight: '300px' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '300px' }}>
                  <div className="text-gray-400 text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">Image non disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Equipment details section */}
            <div className="md:w-3/5 p-6">
              <div className="flex flex-col h-full">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
                  <p className="text-gray-600 mt-4 text-lg">{equipment.description}</p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-6">
                    {equipment.category && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Catégorie</span>
                        <span className="block mt-1 text-lg">{equipment.category}</span>
                      </div>
                    )}
                    {equipment.brand && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Marque</span>
                        <span className="block mt-1 text-lg">{equipment.brand}</span>
                      </div>
                    )}
                    {equipment.condition && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500">État</span>
                        <span className="block mt-1 text-lg">{equipment.condition}</span>
                      </div>
                    )}
                    {equipment.location && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Emplacement</span>
                        <span className="block mt-1 text-lg">{equipment.location}</span>
                      </div>
                    )}
                    <div>
                      <span className="block text-sm font-medium text-gray-500">Prix par jour</span>
                      <span className="block mt-1 text-lg font-semibold text-blue-600">{equipment.price} DH</span>
                    </div>
                    {equipment.availability && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500">Disponibilité</span>
                        <span className={`block mt-1 text-lg ${equipment.availability === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                          {equipment.availability === 'available' ? 'Disponible' : 'Non disponible'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;