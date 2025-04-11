import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, Truck, Phone, AlertCircle, Upload, ArrowLeft } from 'lucide-react';
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
  const [fieldErrors, setFieldErrors] = useState({});

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
            days: item.days || 1, // Default to 1 if not set
            rentalPeriod: response.data.data.rentalPeriod || 'day' // Get rental period from database
          };
        })
      );

      setCartItems(itemsWithDetails);
      
      // Initialize rental periods and period types
      const periods = {};
      const periodTypes = {};
      itemsWithDetails.forEach(item => {
        periods[item._id] = item.days;
        periodTypes[item._id] = item.rentalPeriod;
      });
      setRentalPeriods(periods);
      setPeriodTypes(periodTypes);
      
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
      return days >= 60 ? 0.10 : 0.05; 
    }
    return 0;
  };

  const calculateItemTotal = (item) => {
    const days = rentalPeriods[item._id];
    const periodType = periodTypes[item._id] || item.rentalPeriod || 'day';
    const basePrice = item.price * item.quantity;
    
    if (periodType === 'month') {
      return basePrice * Math.ceil(days / 30); 
    } else {
      return basePrice * days; 
    }
  };

  const calculateDeposit = (item) => {
    const basePrice = item.price * item.quantity;
    return basePrice * 0.7; 
  };

  const getPeriodText = (item) => {
    const periodType = periodTypes[item._id] || item.rentalPeriod || 'day';
    return periodType === 'month' ? 'mois' : 'jour';
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
    if (type === 'month') {
      days = currentValue * 30;
    } else {
      days = currentValue;
    }
    handlePeriodChange(itemId, days);
  };

  const handleCustomPeriodChange = (itemId, value) => {
    const numValue = parseInt(value) || 1;
    setCustomPeriods(prev => ({ ...prev, [itemId]: numValue }));
    
    // Convert to days based on period type
    let days;
    if (periodTypes[itemId] === 'month') {
      days = numValue * 30;
    } else {
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
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePersonalInfo = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'cin', 'address', 'city', 'phone'];
    
    requiredFields.forEach(field => {
      if (!personalInfo[field]) {
        errors[field] = 'Ce champ est obligatoire';
      }
    });

    // Validate phone number format
    if (personalInfo.phone && !/^[0-9]{10}$/.test(personalInfo.phone)) {
      errors.phone = 'Le numéro de téléphone doit contenir 10 chiffres';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleConfirmOrder = async () => {
    // Validate personal information
    if (!validatePersonalInfo()) {
      return;
    }

    if (!selectedPayment) {
      setError('Veuillez sélectionner un mode de paiement');
      return;
    }

    if (selectedPayment !== 'cash' && !receiptFile) {
      setError('Veuillez télécharger le reçu de paiement');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          equipmentId: item._id,
          quantity: item.quantity,
          rentalDays: rentalPeriods[item._id],
          price: item.price,
          rentalPeriod: periodTypes[item._id] || item.rentalPeriod || 'day'
        })),
        paymentMethod: selectedPayment,
        totalAmount: total,
        personalInfo
      };

      // Create FormData for file upload
      const formData = new FormData();
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }
      formData.append('orderData', JSON.stringify(orderData));

      // Submit order to backend
      const response = await axiosInstance.post('/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success message
        alert('Commande créée avec succès! L\'équipement sera disponible après approbation du propriétaire.');
        
        // Redirect to orders page
        navigate('/orders');
      } else {
        setError(response.data.message || 'Erreur lors de la création de la commande');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
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
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#084b88] hover:text-[#0070cc] transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-[#084b88]">Finalisation de la Commande</h1>
          <div className="w-20"></div> {/* Empty div for spacing */}
        </div>

        {/* Personal Information Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#084b88] mb-4">Informations Personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={personalInfo.firstName}
                onChange={handlePersonalInfoChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent ${
                  fieldErrors.firstName ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={personalInfo.lastName}
                onChange={handlePersonalInfoChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent ${
                  fieldErrors.lastName ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">
                CIN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cin"
                value={personalInfo.cin}
                onChange={handlePersonalInfoChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent ${
                  fieldErrors.cin ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.cin && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.cin}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent ${
                  fieldErrors.phone ? 'border-red-500' : ''
                }`}
                required
                pattern="[0-9]{10}"
                title="Veuillez entrer un numéro de téléphone valide (10 chiffres)"
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#4e4942] mb-1">
                Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent ${
                  fieldErrors.address ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.address && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4e4942] mb-1">
                Ville <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={personalInfo.city}
                onChange={handlePersonalInfoChange}
                className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0070cc] focus:border-transparent ${
                  fieldErrors.city ? 'border-red-500' : ''
                }`}
                required
              />
              {fieldErrors.city && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.city}</p>
              )}
            </div>
          </div>
          <div className="mt-4 text-sm text-[#7d7469]">
            <p><span className="text-red-500">*</span> Champs obligatoires</p>
          </div>
        </div>

        {/* Equipment Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#084b88] mb-4">Récapitulatif de la Location</h2>
          {cartItems.map(item => (
            <div key={item._id} className="border-b border-gray-200 py-4">
              <div className="flex gap-4">
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#084b88]">{item.name}</h3>
                      <p className="text-sm text-[#7d7469]">Quantité: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
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
                          value={periodTypes[item._id] || item.rentalPeriod || 'day'}
                          onChange={(e) => handlePeriodTypeChange(item._id, e.target.value)}
                          className="border border-[#bae0fd] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0070cc]"
                        >
                          <option value="day">Jours</option>
                          <option value="month">Mois</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7d7469]">Prix par {getPeriodText(item)}:</span>
                      <span className="font-medium text-[#084b88]">{item.price} MAD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7d7469]">Prix pour la période:</span>
                      <span className="font-medium text-[#084b88]">
                        {calculateItemTotal(item)} MAD
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7d7469]">Dépôt de garantie (70%):</span>
                      <span className="font-medium text-[#084b88]">{calculateDeposit(item)} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#084b88]">Total pour la période</span>
                <span className="font-bold text-[#084b88]">{total} MAD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#084b88]">Dépôt de garantie total (70%)</span>
                <span className="font-bold text-[#084b88]">{deposit} MAD</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="font-bold text-lg text-[#084b88]">Total à payer</span>
                <span className="font-bold text-lg text-[#084b88]">{total + deposit} MAD</span>
              </div>
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
