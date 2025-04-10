import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, Truck, Phone, AlertCircle, Upload } from 'lucide-react';
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
  const [deposit, setDeposit] = useState(0);
  const [receiptFile, setReceiptFile] = useState(null);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    cin: '',
    address: '',
    city: '',
    phone: ''
  });

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
    setDeposit(sum * 0.7); // 70% deposit
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedPayment) {
      setError('Veuillez sélectionner un mode de paiement');
      return;
    }

    // Validate personal information
    const requiredFields = ['firstName', 'lastName', 'cin', 'address', 'city', 'phone'];
    const missingFields = requiredFields.filter(field => !personalInfo[field]);
    if (missingFields.length > 0) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validate receipt upload for non-cash payments
    if (selectedPayment !== 'cash' && !receiptFile) {
      setError('Veuillez télécharger le reçu de paiement');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('orderData', JSON.stringify({
        items: cartItems.map(item => ({
          equipmentId: item._id,
          quantity: item.quantity,
          rentalDays: rentalPeriods[item._id],
          price: item.price
        })),
        paymentMethod: selectedPayment,
        totalAmount: total,
        depositAmount: deposit,
        personalInfo
      }));

      const response = await axiosInstance.post('/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const ownerResponse = await axiosInstance.get(`/users/${cartItems[0].ownerId}`);
      setOwnerDetails(ownerResponse.data.data);
      setShowOwnerContact(true);
      
      localStorage.removeItem('cart');
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#084b88] mb-8">Finalisation de la Commande</h1>

        {/* Personal Information Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#084b88] mb-4">Informations Personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">Prénom *</label>
              <input
                type="text"
                name="firstName"
                value={personalInfo.firstName}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">Nom *</label>
              <input
                type="text"
                name="lastName"
                value={personalInfo.lastName}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">CIN *</label>
              <input
                type="text"
                name="cin"
                value={personalInfo.cin}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">Téléphone *</label>
              <input
                type="tel"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#4e4942] mb-1">Adresse *</label>
              <input
                type="text"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">Ville *</label>
              <input
                type="text"
                name="city"
                value={personalInfo.city}
                onChange={handlePersonalInfoChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Equipment Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#084b88] mb-4">Récapitulatif de la Location</h2>
          {cartItems.map(item => (
            <div key={item._id} className="border-b border-gray-200 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#084b88]">{item.name}</h3>
                  <p className="text-sm text-[#7d7469]">Quantité: {item.quantity}</p>
                  <p className="text-sm text-[#7d7469]">Période: {rentalPeriods[item._id]} jours</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#084b88]">{calculateItemTotal(item)} MAD</p>
                  <p className="text-sm text-green-600">{getDiscountText(rentalPeriods[item._id])}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#084b88]">Total</span>
              <span className="font-bold text-[#084b88]">{total} MAD</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium text-[#084b88]">Dépôt de garantie (70%)</span>
              <span className="font-bold text-[#084b88]">{deposit} MAD</span>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-[#084b88]">
                Le dépôt de garantie sera remboursé à la fin de la location si l'équipement est retourné en bon état.
                En cas de non-retour ou de dommages, le propriétaire conservera le dépôt.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#084b88] mb-4">Méthode de Paiement</h2>
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPayment === method.id
                    ? 'border-[#0070cc] bg-blue-50'
                    : 'border-gray-200 hover:border-[#0070cc]'
                }`}
                onClick={() => setSelectedPayment(method.id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    id={method.id}
                    checked={selectedPayment === method.id}
                    onChange={() => setSelectedPayment(method.id)}
                    className="mr-3"
                  />
                  <div>
                    <label htmlFor={method.id} className="font-medium text-[#084b88]">
                      {method.name}
                    </label>
                    <p className="text-sm text-[#7d7469]">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPayment && selectedPayment !== 'cash' && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#4e4942] mb-2">
                Télécharger le reçu de paiement *
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 bg-[#0070cc] text-white rounded-lg cursor-pointer hover:bg-[#005fa3] transition-colors">
                  <Upload className="h-5 w-5 mr-2" />
                  <span>Choisir un fichier</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </label>
                {receiptFile && (
                  <span className="text-sm text-[#4e4942]">{receiptFile.name}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Order Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirmOrder}
            className="bg-[#0070cc] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#005fa3] transition-colors"
          >
            Confirmer la Commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
