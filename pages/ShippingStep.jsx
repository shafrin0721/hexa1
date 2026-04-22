import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ShippingStep() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart(); // Get cart data from context
  
  const [selectedShipping, setSelectedShipping] = useState('standard');
  
  // Calculate totals from cart
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Delivery Friday, March 14',
      price: 12.87,
    },
    {
      id: 'express',
      name: 'Express',
      description: 'Delivered Tomorrow',
      price: 15,
    },
  ];

  // Get current shipping cost based on selection
  const getShippingCost = () => {
    const option = shippingOptions.find(opt => opt.id === selectedShipping);
    return option ? option.price : 12.87;
  };

  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  // Load saved shipping data from localStorage if returning from payment/review
  useEffect(() => {
    const savedSelectedShipping = localStorage.getItem('selectedShipping');
    if (savedSelectedShipping) {
      setSelectedShipping(savedSelectedShipping);
    }
  }, []);

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

  const handleContinue = () => {
    // Get address data from localStorage (saved in CheckoutAddress)
    const addressData = localStorage.getItem('addressData');
    let shippingData = {};
    
    if (addressData) {
      try {
        shippingData = JSON.parse(addressData);
      } catch (error) {
        console.error('Error parsing address data:', error);
      }
    }
    
    // Save shipping selection
    localStorage.setItem('selectedShipping', selectedShipping);
    localStorage.setItem('shippingCost', shippingCost.toString());
    localStorage.setItem('shippingData', JSON.stringify(shippingData));
    
    navigate('/payment', { 
      state: { 
        shippingData: shippingData,
        selectedShipping: selectedShipping,
        shippingCost: shippingCost,
        orderItems: cart,
        subtotal: subtotal,
        total: total,
        fromReview: false
      }
    });
  };

  const handleBack = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {['Address', 'Shipping', 'Payment', 'Review'].map((label, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${
                  index < 1 ? 'bg-white text-black' :
                  index === 1 ? 'bg-gray-500 text-white ring-4 ring-gray-500/50' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-base ${
                  index === 1 ? 'text-white font-semibold' : 'text-gray-300'
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-8">Shipping</h2>

                <div className="space-y-6">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedShipping(option.id)}
                      className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      <input
                        type="radio"
                        id={option.id}
                        name="shipping"
                        value={option.id}
                        checked={selectedShipping === option.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={option.id}
                          className="block text-base font-semibold cursor-pointer"
                        >
                          {option.name}
                        </label>
                        <p className="text-sm text-gray-400">{option.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${option.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 px-6 border border-gray-600 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-900 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-600 transition-all transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-6">
              <h2 className="text-xl font-semibold text-yellow-500 mb-4">Order Summary ({cartItemCount} items)</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b border-gray-800">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded-lg" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/64?text=Product';
                      }}
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

              <div className="border-t border-gray-800 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>SUBTOTAL</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-800">
                  <span>Order total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
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
}