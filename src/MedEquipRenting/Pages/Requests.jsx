import React, { useState, useEffect } from 'react';
import { Check, X, Eye, MessageCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/orders/owner');
      setRequests(response.data.data);
    } catch (err) {
      setError('Erreur lors du chargement des demandes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axiosInstance.put(`/api/orders/${orderId}/status`, { status });
      // Refresh requests
      loadRequests();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    }
  };

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070cc] mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#084b88] mb-6">Demandes de Location</h1>

        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#084b88]">
                    Commande #{request._id.slice(-6)}
                  </h2>
                  <p className="text-[#4e4942]">
                    {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'approved')}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'rejected')}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleChat(request.userId)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {request.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 bg-[#f0f7ff] rounded-lg">
                    <img
                      src={`http://localhost:5000${item.equipmentId.image}`}
                      alt={item.equipmentId.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#084b88]">{item.equipmentId.name}</h3>
                      <p className="text-sm text-[#4e4942]">
                        {item.quantity} × {item.rentalDays} jours
                      </p>
                      <p className="text-[#0070cc] font-medium">{item.price} DH</p>
                    </div>
                  </div>
                ))}
              </div>

              {['bank', 'wafacash', 'cashplus'].includes(request.paymentMethod) && (
                <div className="mt-4 p-4 bg-[#f0f7ff] rounded-lg">
                  <h3 className="font-medium text-[#084b88] mb-2">Preuve de Paiement</h3>
                  <img
                    src={`http://localhost:5000${request.paymentProof}`}
                    alt="Preuve de paiement"
                    className="max-w-md rounded-lg"
                  />
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-[#bae0fd] pt-4">
                <div>
                  <span className="text-[#4e4942]">Méthode de paiement:</span>
                  <span className="ml-2 font-medium text-[#084b88]">
                    {request.paymentMethod === 'bank' && 'Virement Bancaire'}
                    {request.paymentMethod === 'wafacash' && 'Wafacash'}
                    {request.paymentMethod === 'cashplus' && 'CashPlus'}
                    {request.paymentMethod === 'cash' && 'Paiement à la livraison'}
                  </span>
                </div>
                <div>
                  <span className="text-[#4e4942]">Total:</span>
                  <span className="ml-2 font-bold text-[#0070cc]">{request.totalAmount} DH</span>
                </div>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center text-[#4e4942]">
              Aucune demande de location pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
