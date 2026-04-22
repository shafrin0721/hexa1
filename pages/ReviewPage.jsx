import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const ReviewPage = () => {
  const navigate = useNavigate();
  
  const [orderDetails, setOrderDetails] = useState({
    shippingAddress: {
      name: '',
      address: '',
      city: '',
      zipCode: '',
      number: '',
      email: ''
    },
    paymentInfo: {
      name: '',
      accountNumber: '',
      paidDate: '',
      cardType: '',
      card_last4: '',
      payment_intent_id: ''
    },
    shipping: {
      method: 'Standard shipping',
      deliveryDate: ''
    },
    items: [],
    subtotal: 0,
    shippingCost: 0,
    total: 0,
    paymentIntentId: '',
    addressId: null // Add addressId to state
  });

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const savedReviewData = localStorage.getItem('reviewOrderData');
    const addressId = localStorage.getItem('addressId');
    const addressData = localStorage.getItem('addressData');
    
    console.log('Loading review page - addressId from localStorage:', addressId);
    console.log('addressData from localStorage:', addressData);
    
    if (savedReviewData) {
      const data = JSON.parse(savedReviewData);
      
      console.log('Review data loaded:', data);
      console.log('addressId from review data:', data.addressId);
      
      setOrderDetails({
        shippingAddress: data.shippingAddress || {},
        paymentInfo: {
          name: data.paymentInfo?.name || '',
          accountNumber: data.paymentInfo?.accountNumber || '',
          paidDate: data.paymentInfo?.paidDate || '',
          cardType: data.paymentInfo?.card_type || '',
          card_last4: data.paymentInfo?.card_last4 || '',
          payment_intent_id: data.paymentIntentId || ''
        },
        shipping: {
          method: 'Standard shipping',
          deliveryDate: data.deliveryDate || ''
        },
        items: data.orderSummary?.items || [],
        subtotal: data.orderSummary?.subtotal || 0,
        shippingCost: data.shippingCost || data.orderSummary?.shipping || 0,
        total: data.orderSummary?.total || 0,
        paymentIntentId: data.paymentIntentId || '',
        addressId: data.addressId || addressId // Use addressId from review data or localStorage
      });
      setLoading(false);
    } else {
      console.log('No order data found, redirecting to payment');
      navigate('/payment');
    }
  }, [navigate]);

  const handleEdit = () => {
    navigate('/payment', { 
      state: { fromReview: true } 
    });
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    
    try {
      // Get address ID from state or localStorage
      const addressId = orderDetails.addressId || localStorage.getItem('addressId');
      const addressData = JSON.parse(localStorage.getItem('addressData') || '{}');
      
      console.log('Placing order with addressId:', addressId);
      console.log('Address data:', addressData);
      
      if (!addressId) {
        alert('Address not found. Please go back to address page.');
        navigate('/checkout');
        return;
      }
      
      // Prepare shipping address with the correct ID
      const shippingAddress = {
        addressId: parseInt(addressId), // Ensure it's a number
        firstName: addressData.firstName || orderDetails.shippingAddress.name?.split(' ')[0] || 'Unknown',
        lastName: addressData.lastName || orderDetails.shippingAddress.name?.split(' ')[1] || 'Unknown',
        email: addressData.email || orderDetails.shippingAddress.email,
        address: addressData.address || orderDetails.shippingAddress.address,
        city: addressData.city || orderDetails.shippingAddress.city,
        state: addressData.state || orderDetails.shippingAddress.state,
        zipCode: addressData.zipCode || orderDetails.shippingAddress.zipCode,
        phone: addressData.phone || orderDetails.shippingAddress.number
      };
      
      const orderData = {
        items: orderDetails.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: orderDetails.total,
        subtotal: orderDetails.subtotal,
        shipping: orderDetails.shippingCost,
        payment_intent_id: orderDetails.paymentIntentId,
        payment_info: {
          card_last4: orderDetails.paymentInfo.card_last4,
          card_type: orderDetails.paymentInfo.cardType
        },
        shipping_address: shippingAddress
      };
      
      console.log('Creating order with data:', orderData);
      
      const orderResponse = await orderAPI.createOrder(orderData);
      
      if (orderResponse.data.success) {
        console.log('Order created successfully:', orderResponse.data);
        
        // Clear all checkout data
        localStorage.removeItem('reviewOrderData');
        localStorage.removeItem('paymentData');
        localStorage.removeItem('orderSummary');
        localStorage.removeItem('addressData');
        localStorage.removeItem('addressId');
        localStorage.removeItem('shippingData');
        localStorage.removeItem('selectedShipping');
        localStorage.removeItem('shippingCost');
        
        // Navigate to success page
        navigate('/order-success', { 
          state: { 
            orderId: orderResponse.data.data.order.id,
            orderDetails: orderResponse.data.data
          } 
        });
      } else {
        throw new Error(orderResponse.data.message || 'Order creation failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-gray-400">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="flex-1 w-full max-w-full mx-auto px-4 sm:px-6 lg:px-48 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {['Address', 'Shipping', 'Payment', 'Review'].map((label, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${
                  index < 3 ? 'bg-white text-black' :
                  index === 3 ? 'bg-gray-500 text-white ring-4 ring-gray-500/50' :
                  'bg-gray-800 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-base ${
                  index === 3 ? 'text-white font-semibold' : 'text-gray-300'
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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column */}
          <div className="flex-1 bg-gray-900 rounded-xl p-6 border border-gray-800">
            {/* Shipping Address Section */}
            <div className="mb-6 pb-6 border-b border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Shipping address</h3>
                <button 
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-gray-800"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
              <div className="pl-2">
                <p className="font-semibold text-white mb-1">{orderDetails.shippingAddress.name || 'Not provided'}</p>
                <p className="text-gray-400 text-sm mb-1">
                  {orderDetails.shippingAddress.address && 
                    `${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.zipCode}`}
                </p>
                <p className="text-gray-400 text-sm mb-1">{orderDetails.shippingAddress.city}</p>
                <p className="text-gray-400 text-sm mb-1">{orderDetails.shippingAddress.number}</p>
                <p className="text-gray-400 text-sm">{orderDetails.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Information Section */}
            <div className="mb-6 pb-6 border-b border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Payment Information</h3>
                <button 
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-gray-800"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
              <div className="pl-2">
                <p className="text-white font-medium mb-1">{orderDetails.paymentInfo.name}</p>
                <p className="text-gray-400 text-sm mb-1">
                  Account number: {orderDetails.paymentInfo.accountNumber}
                </p>
                {orderDetails.paymentInfo.cardType && (
                  <p className="text-gray-400 text-sm mb-1">
                    Card type: {orderDetails.paymentInfo.cardType.toUpperCase()}
                  </p>
                )}
                <p className="text-gray-400 text-sm mb-1">Paid Date: {orderDetails.paymentInfo.paidDate}</p>
                <p className="text-gray-400 text-sm break-all">
                  Transaction ID: {orderDetails.paymentIntentId}
                </p>
              </div>
            </div>

            {/* Shipping Method Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Shipping method</h3>
                <button 
                  className="text-gray-400 hover:text-yellow-500 transition-colors text-sm font-medium px-2 py-1 rounded hover:bg-gray-800"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
              <div className="pl-2">
                <p className="text-white font-medium mb-1">{orderDetails.shipping.method}</p>
                <p className="text-gray-400 text-sm">
                  Delivery {orderDetails.shipping.deliveryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 sticky top-4">
              <h2 className="text-xl font-semibold text-yellow-500 mb-2 border-b border-gray-800 pb-3">
                Order Summary
              </h2>
              
              <div className="text-sm text-gray-400 mb-4">
                {orderDetails.items.reduce((total, item) => total + (item.quantity || 1), 0)} Item(s)
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto mb-4 custom-scrollbar">
                {orderDetails.items.map((item, index) => (
                  <div key={item.id || index} className="flex gap-3 pb-4 border-b border-gray-800">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-400 mb-1">Brand: {item.brand || 'Hexa'}</p>
                      {item.rating && (
                        <div className="text-yellow-500 text-xs mb-1">
                          {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                        </div>
                      )}
                      <p className="text-sm font-semibold text-yellow-500">
                        ${(item.price || 0).toFixed(2)} x {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-300 font-medium">
                  <span>SUBTOTAL</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300 font-medium">
                  <span>Shipping</span>
                  <span>${orderDetails.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-gray-800">
                  <span>Order total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>

            {/* Help Links */}
            <div className="mt-4 flex justify-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors font-medium">RETURN POLICY</a>
              <a href="#" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors font-medium">HELP</a>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button 
          className="w-full mt-8 mb-8 py-3 bg-white text-black border-2 border-gray-600 rounded-lg font-bold hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all transform hover:-translate-y-1"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
        </button>
      </div>
    </div>
  );
};

export default ReviewPage;