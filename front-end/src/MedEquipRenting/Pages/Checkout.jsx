import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, Truck, Phone, AlertCircle } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';

const paymentMethods = [
  {
    id: 'bank',
    name: 'Virement Bancaire',
    description: 'Transfert direct vers notre compte bancaire'
  },
  {
    id: 'wafacash',
    name: 'Wafacash',
    description: 'Paiement via Wafacash'
  },
  {
    id: 'cashplus',
    name: 'CashPlus',
    description: 'Paiement via CashPlus'
  },
  {
    id: 'cash',
    name: 'Paiement à la livraison',
    description: 'Payez en espèces à la réception'
  }
];

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [rentalPeriods, setRentalPeriods] = useState({});
  const [customPeriods, setCustomPeriods] = useState({});
  const [periodTypes, setPeriodTypes] = useState({});
  const [showOwnerContact, setShowOwnerContact] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      // Get cart items from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Fetch full equipment details for each item
      const itemsWithDetails = await Promise.all(
        cart.map(async (item) => {
          const response = await axiosInstance.get(`/equipment/${item.id}`);
          return {
            ...response.data.data,
            quantity: item.quantity,
            days: item.days || 7 // Default to 7 days if not set
          };
        })
      );

      setCartItems(itemsWithDetails);
      
      // Initialize rental periods
      const periods = {};
      itemsWithDetails.forEach(item => {
        periods[item._id] = item.days;
      });
      setRentalPeriods(periods);
      
      // Calculate total
      calculateTotal(itemsWithDetails, periods);
    } catch (error) {
      console.error('Error loading cart items:', error);
      setError('Erreur lors du chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (days) => {
    if (days >= 30) {
      return days >= 60 ? 0.10 : 0.05; // 10% for 60+ days, 5% for 30+ days
    }
    return 0;
  };

  const calculateItemTotal = (item) => {
    const days = rentalPeriods[item._id];
    const basePrice = item.price * item.quantity * days;
    const discount = calculateDiscount(days);
    return basePrice * (1 - discount);
  };

  const handlePeriodChange = (itemId, days) => {
    setRentalPeriods(prev => {
      const updated = { ...prev, [itemId]: days };
      calculateTotal(cartItems, updated);
      return updated;
    });
  };

  const handlePeriodTypeChange = (itemId, type) => {
    setPeriodTypes(prev => ({ ...prev, [itemId]: type }));
    
    // Convert current value to days based on new type
    const currentValue = customPeriods[itemId] || 1;
    let days;
    switch (type) {
      case 'week':
        days = currentValue * 7;
        break;
      case 'month':
        days = currentValue * 30;
        break;
      default:
        days = currentValue;
    }
    handlePeriodChange(itemId, days);
  };

  const handleCustomPeriodChange = (itemId, value) => {
    const numValue = parseInt(value) || 1;
    setCustomPeriods(prev => ({ ...prev, [itemId]: numValue }));
    
    // Convert to days based on period type
    let days;
    switch (periodTypes[itemId]) {
      case 'week':
        days = numValue * 7;
        break;
      case 'month':
        days = numValue * 30;
        break;
      default:
        days = numValue;
    }
    handlePeriodChange(itemId, days);
  };

  const getDiscountText = (days) => {
    const discount = calculateDiscount(days);
    if (discount > 0) {
      return `(-${discount * 100}% de réduction)`;
    }
    return '';
  };

  const calculateTotal = (items = cartItems, periods = rentalPeriods) => {
    const sum = items.reduce((acc, item) => {
      return acc + calculateItemTotal(item);
    }, 0);
    setTotal(sum);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPayment) {
      setError('Veuillez sélectionner un mode de paiement');
      return;
    }

    try {
      // Create order in backend
      const orderData = {
        items: cartItems.map(item => ({
          equipmentId: item._id,
          quantity: item.quantity,
          rentalDays: rentalPeriods[item._id],
          price: item.price
        })),
        paymentMethod: selectedPayment,
        totalAmount: total
      };

      const response = await axiosInstance.post('/orders', orderData);
      
      // Get owner details
      const ownerResponse = await axiosInstance.get(`/users/${cartItems[0].ownerId}`);
      setOwnerDetails(ownerResponse.data.data);
      setShowOwnerContact(true);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Update cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: 0 }));
    } catch (error) {
      console.error('Error confirming order:', error);
      setError('Erreur lors de la confirmation de la commande');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0070cc]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-center text-[#0070cc]">
            <AlertCircle className="h-12 w-12" />
          </div>
          <p className="text-center mt-4 text-[#084b88]">{error}</p>
        </div>
      </div>
    );
  }

  if (showOwnerContact && ownerDetails) {
    return (
      <div className="min-h-screen bg-[#f0f7ff] p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#084b88] mb-6">Commande Confirmée</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              Votre commande a été confirmée avec succès. Contactez le propriétaire pour finaliser la location.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#084b88] flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Coordonnées du Propriétaire
            </h3>
            
            <div className="bg-[#f0f7ff] rounded-lg p-4">
              <p className="font-medium text-[#084b88]">{ownerDetails.name}</p>
              <p className="text-[#0070cc]">{ownerDetails.phone}</p>
              <p className="text-[#4e4942] mt-2">{ownerDetails.email}</p>
            </div>

            <div className="mt-6 text-sm text-[#7d7469]">
              <p>* Veuillez contacter le propriétaire pour:</p>
              <ul className="list-disc ml-5 mt-2">
                <li>Confirmer la disponibilité aux dates souhaitées</li>
                <li>Organiser la livraison ou le retrait</li>
                <li>Finaliser le paiement selon la méthode choisie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f7ff] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#084b88] mb-6">Finaliser la Commande</h2>

          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center gap-4 bg-[#f0f7ff] rounded-lg p-4">
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-medium text-[#084b88]">{item.name}</h3>
                  <p className="text-sm text-[#4e4942] mb-2">{item.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#0070cc]" />
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={customPeriods[item._id] || 1}
                          onChange={(e) => handleCustomPeriodChange(item._id, e.target.value)}
                          className="w-16 border border-[#bae0fd] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070cc]"
                        />
                        <select
                          value={periodTypes[item._id] || 'day'}
                          onChange={(e) => handlePeriodTypeChange(item._id, e.target.value)}
                          className="border border-[#bae0fd] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070cc]"
                        >
                          <option value="day">Jours</option>
                          <option value="week">Semaines</option>
                          <option value="month">Mois</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-[#0070cc] font-medium">
                        {calculateItemTotal(item).toFixed(2)} DH
                      </span>
                      {calculateDiscount(rentalPeriods[item._id]) > 0 && (
                        <span className="text-green-600 text-xs">
                          {getDiscountText(rentalPeriods[item._id])}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#084b88] mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Mode de Paiement
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(method => (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedPayment === method.id
                      ? 'border-[#0070cc] bg-[#f0f7ff]'
                      : 'border-[#bae0fd] hover:border-[#7cc7fc]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-[#084b88]">{method.name}</p>
                    <p className="text-sm text-[#4e4942]">{method.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Total and Confirm */}
          <div className="border-t border-[#bae0fd] pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-[#084b88]">Total</span>
              <span className="text-2xl font-bold text-[#0070cc]">{total} DH</span>
            </div>
            
            <button
              onClick={handleConfirmOrder}
              className="w-full py-3 bg-[#0070cc] hover:bg-[#005ba6] text-white font-medium rounded-lg transition-colors"
            >
              Confirmer la commande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
