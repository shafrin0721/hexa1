// frontend/src/components/CheckoutAddress.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { checkoutAPI } from '../services/api';

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id;
  
  // Calculate totals from cart
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = 12.87;
  const total = subtotal + shipping;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const [formData, setFormData] = useState({
    email: user.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const states = [
    'Select state',
    'California',
    'New York',
    'Texas',
    'Florida',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia',
    'North Carolina',
    'Michigan'
  ];

  // Load saved addresses on component mount
  useEffect(() => {
    if (userId) {
      loadSavedAddresses();
    }
  }, [userId]);

  const loadSavedAddresses = async () => {
    try {
      const response = await checkoutAPI.getAddress(userId);
      if (response.data.success && response.data.addresses.length > 0) {
        setSavedAddresses(response.data.addresses);
        
        // Check if there's a default address
        const defaultAddress = response.data.addresses.find(addr => addr.is_default === 1);
        if (defaultAddress) {
          populateFormWithAddress(defaultAddress);
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const populateFormWithAddress = (address) => {
    setFormData({
      email: address.email,
      firstName: address.first_name,
      lastName: address.last_name,
      address: address.address,
      city: address.city,
      state: address.state || '',
      zipCode: address.zipCode,
      phone: address.phone
    });
  };

  const handleAddressSelect = (address) => {
    populateFormWithAddress(address);
    setSelectedAddressId(address.id);
    setShowSavedAddresses(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (selectedAddressId) {
      setSelectedAddressId(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state || formData.state === 'Select state') {
      newErrors.state = 'Please select a state';
    }
    if (!formData.zipCode) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Enter a valid ZIP code (5 digits)';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, '');
      if (phoneClean.length < 7 || !/^\d+$/.test(phoneClean)) {
        newErrors.phone = 'Enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In CheckoutAddress.jsx, update the handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  if (!userId) {
    localStorage.setItem('redirectAfterLogin', '/checkout/address');
    navigate('/login');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    const addressData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      phone: formData.phone
    };
    
    let response;
    
    if (selectedAddressId) {
      response = await checkoutAPI.updateAddress(userId, {
        ...addressData,
        addressId: selectedAddressId
      });
    } else {
      response = await checkoutAPI.saveAddress(addressData);
    }
    
    if (response.data.success) {
      // Store address ID separately
      const addressId = response.data.addressId || selectedAddressId;
      
      // Store complete address data with ID
      const completeAddressData = {
        id: addressId,
        ...formData
      };
      
      localStorage.setItem('addressData', JSON.stringify(completeAddressData));
      localStorage.setItem('addressId', addressId); // Store ID separately
      
      navigate('/checkout/shipping');
    } else {
      setErrors({ submit: response.data.message || 'Failed to save address' });
    }
  } catch (error) {
    console.error('Error saving address:', error);
    setErrors({ 
      submit: error.response?.data?.message || 'Failed to save address. Please try again.' 
    });
  } finally {
    setIsSubmitting(false);
  }
};

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

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps - matching PaymentPage style */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {['Address', 'Shipping', 'Payment', 'Review'].map((label, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${
                  index === 0 ? 'bg-gray-500 text-white ring-4 ring-gray-500/50' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-base ${
                  index === 0 ? 'text-white font-semibold' : 'text-gray-300'
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

        {/* Saved Addresses Section - Added without changing existing style */}
        {savedAddresses.length > 0 && (
          <div className="max-w-2xl mx-auto mb-6">
            <button
              onClick={() => setShowSavedAddresses(!showSavedAddresses)}
              className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
            >
              {showSavedAddresses ? 'Hide saved addresses' : 'Use a saved address'}
            </button>
            
            {showSavedAddresses && (
              <div className="mt-3 space-y-3">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-yellow-500 transition-colors"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">
                          {address.first_name} {address.last_name}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">{address.address}</p>
                        <p className="text-gray-400 text-sm">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-gray-400 text-sm">{address.phone}</p>
                      </div>
                      {address.is_default === 1 && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Address Form - matching PaymentPage form styling */}
          <div className="flex-1 space-y-6">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 inline-block">
                Shipping Address
              </h2>

              {/* Error message display */}
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" id="addressForm">
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* First Name + Last Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
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
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                {/* City / State / Zip Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="San Francisco"
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.state ? 'border-red-500' : 'border-gray-700'
                      }`}
                    >
                      {states.map((state, idx) => (
                        <option key={idx} value={state === 'Select state' ? '' : state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="94105"
                      className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 555-5555"
                    className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: Order Summary - with Continue button inside (matching PaymentPage style) */}
          <div className="lg:w-96">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-4">
              <h2 className="text-xl font-semibold text-yellow-500 mb-4">
                Order Summary ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b border-gray-800">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
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

              {/* Totals */}
              <div className="border-t border-gray-800 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>SUBTOTAL</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-800">
                  <span>ORDER TOTAL</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="text-center text-xs font-bold tracking-wider text-yellow-500/80 bg-yellow-500/10 py-2 px-3 rounded-full mt-5">
                ✦ TRUST GOD'S PLAN ✦
              </div>

              {/* Continue Button - NOW INSIDE ORDER SUMMARY (matching PaymentPage) */}
              <button
                type="submit"
                form="addressForm"
                disabled={isSubmitting}
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Processing...' : 'Continue to Shipping'}
              </button>
            </div>

            {/* Footer Links */}
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

export default CheckoutAddress;