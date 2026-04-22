import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { paymentAPI } from '../services/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart(); // Get cart data from context
  
  const getEmptyFormData = () => ({
    cardNumber: '',
    cardType: '',
    cvv: '',
    expiryDate: '',
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: ''
  });

  const [formData, setFormData] = useState(getEmptyFormData());
  
  // Calculate order summary from cart (same as CartPage and OrderSummary1)
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = 12.87;
  const total = subtotal + shipping;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const orderSummary = {
    items: cart.map(item => ({
      ...item,
      price: Number(item.price)
    })),
    subtotal: subtotal,
    shipping: shipping,
    total: total
  };
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const cardTypeOptions = [
    { value: 'visa', label: 'Visa', logo: 'https://cdn.simpleicons.org/visa' },
    { value: 'mastercard', label: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
  ];

  const clearAllStoredData = () => {
    const comingFromReview = location.state?.fromReview === true;
    if (!comingFromReview) {
      localStorage.removeItem('paymentData');
      localStorage.removeItem('orderId');
      localStorage.removeItem('orderSummary');
      localStorage.removeItem('paymentIntentId');
      localStorage.removeItem('shippingData');
      localStorage.removeItem('addressData');
      localStorage.removeItem('cartData');
      localStorage.removeItem('checkoutData');
    }
  };

  const loadExistingData = () => {
    const savedPaymentData = localStorage.getItem('paymentData');
    const comingFromReview = location.state?.fromReview === true;
    
    if (comingFromReview && savedPaymentData) {
      try {
        const paymentData = JSON.parse(savedPaymentData);
        setFormData({
          cardNumber: paymentData.cardNumber || '',
          cardType: paymentData.cardType || '',
          cvv: paymentData.cvv || '',
          expiryDate: paymentData.expiryDate || '',
          email: paymentData.email || '',
          firstName: paymentData.firstName || '',
          lastName: paymentData.lastName || '',
          address: paymentData.address || '',
          city: paymentData.city || '',
          state: paymentData.state || '',
          zipCode: paymentData.zipCode || '',
          phoneNumber: paymentData.phoneNumber || ''
        });
        return true;
      } catch (error) {
        console.error('Error loading saved payment data:', error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const comingFromReview = location.state?.fromReview === true;
    
    if (!comingFromReview) {
      clearAllStoredData();
    }
    
    const dataLoaded = loadExistingData();
    if (!dataLoaded && !comingFromReview) {
      setFormData(getEmptyFormData());
      setErrors({});
    }
  }, [location.state]);

  useEffect(() => {
    if (formData.cardNumber || formData.email || formData.firstName) {
      localStorage.setItem('paymentData', JSON.stringify(formData));
    }
  }, [formData]);

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Please add items to your cart before proceeding to checkout.</p>
            <button 
              onClick={() => navigate("/products")}
              className="bg-yellow-500 text-white px-8 py-3 rounded hover:bg-yellow-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else {
      const cleanedNumber = formData.cardNumber.replace(/\s/g, '');
      if (cleanedNumber.length < 15 || cleanedNumber.length > 16) {
        newErrors.cardNumber = 'Card number must be 15-16 digits';
      }
    }
    
    if (!formData.cardType) {
      newErrors.cardType = 'Please select card type';
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else {
      if (!/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = `CVV must be 3 digits`;
      }
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month));
      const today = new Date();
      if (expiryDate < today) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = '';
      for (let i = 0; i < cleaned.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += ' ';
        }
        formatted += cleaned[i];
      }
      value = formatted.slice(0, 19);
    }
    
    if (name === 'cardType') {
      setFormData({ ...formData, [name]: value });
      if (errors.cardType) {
        setErrors({ ...errors, cardType: '' });
      }
      return;
    }
    
    if (name === 'expiryDate') {
      let cleaned = value.replace(/\D/g, '');
      if (cleaned.length >= 2) {
        cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      value = cleaned.slice(0, 5);
    }
    
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  setPaymentStatus({ type: 'processing', message: 'Processing payment...' });
  
  try {
    // Get address ID from localStorage
    const addressId = localStorage.getItem('addressId');
    const addressData = JSON.parse(localStorage.getItem('addressData') || '{}');
    const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
    
    console.log('Address ID from localStorage:', addressId);
    console.log('Address Data:', addressData);
    
    if (!addressId) {
      throw new Error('No address found. Please go back to address page.');
    }
    
    const getTestPaymentToken = (cardType) => {
      const tokens = {
        'visa': 'pm_card_visa',
        'mastercard': 'pm_card_mastercard',
      };
      return tokens[cardType] || 'pm_card_visa';
    };
    
    const paymentMethodToken = getTestPaymentToken(formData.cardType);
    
    const paymentData = {
      amount: orderSummary.total,
      payment_method_token: paymentMethodToken,
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      billing_address: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phoneNumber: formData.phoneNumber,
        email: formData.email
      }
    };
    
    const paymentResponse = await paymentAPI.processPayment(paymentData);
    
    if (paymentResponse.data.success && paymentResponse.data.payment_status === 'succeeded') {
      setPaymentStatus({ type: 'success', message: 'Payment successful! Redirecting to review...' });

      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      const cardLast4 = cleanCardNumber.slice(-4);
      
      const reviewData = {
        orderSummary: {
          items: orderSummary.items,
          subtotal: orderSummary.subtotal,
          total: orderSummary.total,
          shipping: orderSummary.shipping
        },
        paymentIntentId: paymentResponse.data.payment_intent_id,
        paymentInfo: {
          card_last4: cardLast4,
          card_type: formData.cardType,
          name: `${formData.firstName} ${formData.lastName}`,
          accountNumber: `**** **** **** ${cardLast4}`,
          paidDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        },
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          number: formData.phoneNumber,
          email: formData.email
        },
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        }),
        userInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        },
        // CRITICAL: Add addressId to reviewData
        addressId: addressId,
        shippingCost: shippingData.cost || orderSummary.shipping
      };
      
      console.log('Saving review data with addressId:', addressId);
      localStorage.setItem('reviewOrderData', JSON.stringify(reviewData));
      
      setTimeout(() => {
        navigate('/review');
      }, 1500);
    } else {
      throw new Error('Payment failed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    setPaymentStatus({ 
      type: 'error', 
      message: error.response?.data?.message || error.message || 'Payment failed. Please try again.' 
    });
    setTimeout(() => setPaymentStatus(null), 5000);
  } finally {
    setIsSubmitting(false);
  }
};

  const CardTypeDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCardType = cardTypeOptions.find(opt => opt.value === formData.cardType);

    return (
      <div className="relative" ref={dropdownRef}>
        <div 
          className={`w-[90%] h-10 px-3 border rounded-lg bg-gray-300 cursor-pointer flex items-center justify-between ${
            errors.cardType ? 'border-red-500' : 'border-gray-700'
          } hover:border-gray-500 transition-colors`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1 h-full flex items-center justify-center">
            {selectedCardType ? (
              <img 
                src={selectedCardType.logo} 
                alt={selectedCardType.label} 
                className="h-full w-auto max-w-full object-contain" 
              />
            ) : (
              <span className="text-gray-500 text-sm">Select card type</span>
            )}
          </div>
          <span className="text-gray-600 text-xs ml-2">{isOpen ? '▲' : '▼'}</span>
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-300 border border-gray-700 rounded-lg shadow-lg z-10">
            {cardTypeOptions.map(option => (
              <div
                key={option.value}
                className={`h-10 px-3 cursor-pointer flex items-center justify-center hover:bg-gray-400 transition-colors relative ${
                  formData.cardType === option.value ? 'bg-gray-700' : ''
                }`}
                onClick={() => {
                  handleChange({ target: { name: 'cardType', value: option.value } });
                  setIsOpen(false);
                }}
              >
                <img 
                  src={option.logo} 
                  alt={option.label} 
                  className="h-full w-auto max-w-full object-contain" 
                />
                {formData.cardType === option.value && (
                  <span className="text-green-500 absolute right-3">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {['Address', 'Shipping', 'Payment', 'Review'].map((label, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${
                  index < 2 ? 'bg-white text-black' :
                  index === 2 ? 'bg-gray-500 text-white ring-4 ring-gray-500/50' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-base ${
                  index === 2 ? 'text-white font-semibold' : 'text-gray-300'
                }`}>
                  {label}
                </span>
              </div>
              {index < 3 && (
                <span className="text-gray-500 text-base font-medium">---</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Payment Status Message */}
        {paymentStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            paymentStatus.type === 'processing' ? 'bg-blue-900/50 text-blue-200 border border-blue-500' :
            paymentStatus.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-500' :
            'bg-red-900/50 text-red-200 border border-red-500'
          }`}>
            <div className="flex items-center gap-2">
              <span>{paymentStatus.type === 'processing' && '⏳'}</span>
              <span>{paymentStatus.type === 'success' && '✅'}</span>
              <span>{paymentStatus.type === 'error' && '❌'}</span>
              <span>{paymentStatus.message}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Forms */}
          <div className="flex-1 space-y-6">
            {/* Payment Information Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 inline-block">
                Payment Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Card number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength="19"
                    className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                </div>

                {/* Three columns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Card Type</label>
                    <CardTypeDropdown />
                    {errors.cardType && <p className="mt-1 text-sm text-red-500">{errors.cardType}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.expiryDate && <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      maxLength="3"
                      value={formData.cvv}
                      onChange={handleChange}
                      className={`w-full px-2 py-1 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono tracking-wider h-10 ${
                        errors.cvv ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
                    <small className="text-xs text-gray-500 mt-1 block">3 digits</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 inline-block">
                Billing address
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="your@email.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    }`} 
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      placeholder="John" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-700'
                      }`} 
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      placeholder="Doe" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-700'
                      }`} 
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    placeholder="123 Main St" 
                    value={formData.address} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-700'
                    }`} 
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="San Francisco" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-700'
                      }`} 
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                    <input 
                      type="text" 
                      name="state" 
                      placeholder="CA" 
                      value={formData.state} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code</label>
                    <input 
                      type="text" 
                      name="zipCode" 
                      placeholder="94105" 
                      value={formData.zipCode} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-700'
                      }`} 
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber" 
                      placeholder="+1 555-555-5555" 
                      value={formData.phoneNumber} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-700'
                      }`} 
                    />
                    {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-4">
              <h2 className="text-xl font-semibold text-yellow-500 mb-4">Order Summary ({cartItemCount} items)</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {orderSummary.items.map((item, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b border-gray-800">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm">{item.name}</h4>
                      {item.variant && (
                        <p className="text-xs text-gray-400 mt-1">{item.variant}</p>
                      )}
                      <p className="text-sm font-semibold text-yellow-500 mt-1">
                        ${Number(item.price).toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>SUBTOTAL</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Shipping</span>
                  <span>${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-800">
                  <span>ORDER TOTAL</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handleSubmit} 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Continue'}
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">RETURN POLICY</a>
              <a href="#" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">HELP</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;