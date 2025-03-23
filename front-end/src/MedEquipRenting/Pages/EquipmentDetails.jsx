import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { ArrowLeft, Package, MapPin, Calendar, Tag, Star, Clock, Shield } from "lucide-react";

const API_URL = 'http://localhost:5000';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
        
        if (equipmentData.image && !equipmentData.image.startsWith('http')) {
          equipmentData.image = `${API_URL}${equipmentData.image}`;
        }
        
        console.log("Processed equipment data:", equipmentData);
        setEquipment(equipmentData);
        setSelectedImage(equipmentData.image);
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
      <div className="flex h-screen items-center justify-center bg-[#f0f7ff]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0070cc] mx-auto"></div>
          <p className="mt-4 text-[#0d4071] font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f7ff]">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border border-[#e0f0fe]">
          <div className="text-[#0070cc] mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-[#084b88] text-xl font-medium mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#0070cc] text-white rounded-lg hover:bg-[#0058a6] transition-colors duration-200"
          >
            <ArrowLeft className="inline-block mr-2 h-5 w-5" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f7ff]">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto border border-[#e0f0fe]">
          <Package className="h-16 w-16 mx-auto text-[#7cc7fc] mb-4" />
          <p className="text-xl text-[#084b88] font-medium mb-6">Équipement non trouvé</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#0070cc] text-white rounded-lg hover:bg-[#0058a6] transition-colors duration-200"
          >
            <ArrowLeft className="inline-block mr-2 h-5 w-5" />
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-[#0070cc] hover:text-[#0058a6] mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="font-medium">Retour</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e0f0fe]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden bg-[#f9f8f7]">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={equipment.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-20 w-20 text-[#b8b2ab]" />
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#084b88] mb-2">{equipment.name}</h1>
                <p className="text-[#4e4942] text-lg leading-relaxed">{equipment.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#f0f7ff] p-4 rounded-lg">
                  <div className="flex items-center text-[#0070cc] mb-2">
                    <Tag className="h-5 w-5 mr-2" />
                    <span className="font-medium">Prix</span>
                  </div>
                  <p className="text-2xl font-bold text-[#084b88]">{equipment.price} DH<span className="text-sm text-[#7d7469] font-normal">/{equipment.rentalPeriod}</span></p>
                </div>

                <div className="bg-[#f0f7ff] p-4 rounded-lg">
                  <div className="flex items-center text-[#0070cc] mb-2">
                    <Star className="h-5 w-5 mr-2" />
                    <span className="font-medium">État</span>
                  </div>
                  <p className="text-lg font-medium text-[#084b88]">{equipment.condition}</p>
                </div>

                <div className="bg-[#f0f7ff] p-4 rounded-lg">
                  <div className="flex items-center text-[#0070cc] mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="font-medium">Emplacement</span>
                  </div>
                  <p className="text-lg font-medium text-[#084b88]">{equipment.location}</p>
                </div>

                <div className="bg-[#f0f7ff] p-4 rounded-lg">
                  <div className="flex items-center text-[#0070cc] mb-2">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">Disponibilité</span>
                  </div>
                  <p className={`text-lg font-medium ${equipment.availability === 'available' ? 'text-[#108de4]' : 'text-[#a39991]'}`}>
                    {equipment.availability === 'available' ? 'Disponible' : 'Non disponible'}
                  </p>
                </div>
              </div>

              <div className="bg-[#f0f7ff] p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#084b88] mb-4">Informations supplémentaires</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#7d7469]">Catégorie</span>
                    <p className="text-[#084b88] font-medium mt-1">{equipment.category}</p>
                  </div>
                  {equipment.brand && (
                    <div>
                      <span className="text-[#7d7469]">Marque</span>
                      <p className="text-[#084b88] font-medium mt-1">{equipment.brand}</p>
                    </div>
                  )}
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
