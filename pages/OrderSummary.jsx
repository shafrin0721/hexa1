import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import avatar from "../assets/avatar.jpg";
import logo from "../assets/logo.png";
import productImg from "../assets/t-6.jpg";

function OrderSummary1() {
  const { cart } = useCart();
  const navigate = useNavigate();

  // Calculate totals from cart
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = 12.87;
  const total = subtotal + shipping;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      return;
    }
    // Just navigate to address page, don't create order yet
    navigate("/address");
  };

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="bg-black text-white p-5 font-sans min-h-screen">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="border border-gray-600 rounded p-8">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
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
    <div className="bg-black text-white p-5 font-sans min-h-screen">
      {/* Showing item count */}
      <div className="max-w-2xl mx-auto mb-4 p-3 bg-gray-900 rounded border border-gray-700">
        <p className="text-gray-300">
          Total Items: <span className="text-yellow-500 font-bold">{cartItemCount}</span>
        </p>
      </div>

      {/* Order Summary Container */}
      <div className="border border-gray-500 p-5 m-5">
        <h2 className="text-center mt-5 text-gray-100 text-2xl font-bold">Order Summary</h2>

        {/* Table */}
        <div className="border border-gray-300 mx-[2cm]">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-2.5 border-b border-gray-300 font-bold">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {/* Table Rows */}
          {cart.map((item) => (
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] py-12 border-b border-gray-300 items-center" key={item.id}>
              <div className="flex items-center gap-4 pl-5">
                <img src={item.image || productImg} className="w-[70px] h-[70px] object-cover" alt={item.name} />
                <div>
                  <span className="block">{item.name}</span>
                  {item.variant && (
                    <span className="text-sm text-gray-400">{item.variant}</span>
                  )}
                </div>
              </div>
              <span>${Number(item.price).toFixed(2)}</span>
              <span>{item.quantity}</span>
              <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 px-4 max-w-md ml-auto">
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg">
            <span>Order Total</span>
            <span className="text-yellow-500">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-5">
          <button 
            onClick={() => navigate("/products")}
            className="bg-gray-600 text-white px-8 py-3 rounded hover:bg-gray-700 transition"
          >
            Continue Shopping
          </button>
          <button 
            onClick={handleProceedToCheckout}
            className="bg-yellow-500 text-white px-8 py-3 rounded hover:bg-yellow-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary1;