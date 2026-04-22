import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState("#11234556423146230");

  useEffect(() => {
    if (location.state?.orderNumber) {
      setOrderNumber(location.state.orderNumber);
    }
  }, [location]);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-5">
      {/* Success Icon */}
      <div className="text-center">
        {/* Green Circle with Black Checkmark */}
        <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-black text-5xl font-bold">✓</span>
        </div>
        
        <h1 className="text-3xl font-bold text-green-500 mb-2">
          Your order was successful!
        </h1>
        
        <p className="text-xl text-gray-300 mb-4">
          Thanks for your purchase!
        </p>
        
        <p className="text-gray-400 mb-2">
          Your order number is
        </p>
        
        <p className="text-2xl font-bold text-yellow-500 mb-6">
          {orderNumber}
        </p>
        
        <p className="text-gray-400 mb-8">
          You'll receive an email confirming your order details
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/track-order")}
            className="bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-600 transition"
          >
            Track your order
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="border border-yellow-500 text-yellow-500 px-6 py-2 rounded hover:bg-yellow-500 hover:text-black transition"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;