import { useMemo } from 'react';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, dispatch } = useCart();

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    [cart]
  );
  const shipping = 12.87;
  const total = subtotal + shipping;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleIncrement = (id) => {
    dispatch({ type: 'INCREMENT', payload: id });
  };

  const handleDecrement = (id) => {
    dispatch({ type: 'DECREMENT', payload: id });
  };

  const handleRemove = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handlePayNow = () => {
    if (cart.length > 0) {
      window.location.href = '/order-summary';
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-center gap-6 py-16 px-6">
        <ShoppingBag size={64} className="text-[#d4af37] opacity-70" />
        <h2 className="text-4xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-lg text-gray-400 max-w-md mb-4">Start shopping to add items to your cart</p>
        <Link 
          to="/products" 
          className="inline-block px-12 py-4 bg-gradient-to-r from-[#d4af37] to-[#f4e27a] text-black font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-20 min-h-[70vh]">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        Shopping Cart ({cartItemCount})
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
        {/* Cart Items Section */}
        <section className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-6 px-8 py-6 bg-black/30 font-semibold text-white uppercase text-sm tracking-wide">
            <span>PRODUCT</span>
            <span>PRICE</span>
            <span>QTY</span>
            <span>SUBTOTAL</span>
            <span></span>
          </div>

          {/* Cart Items */}
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-6 px-8 py-6 items-center border-b border-[#2a2a2a] hover:bg-[#d4af37]/5 transition-colors"
            >
              {/* Product Info */}
              <div className="flex gap-4 items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <h4 className="text-lg text-white mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.variant || 'Classic Tee'}</p>
                </div>
              </div>

              {/* Price */}
              <div className="font-semibold text-[#d4af37] text-center">
                ${Number(item.price).toFixed(2)}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 justify-center">
                <button 
                  className="w-8 h-8 rounded-md border border-[#2a2a2a] bg-[#121212] text-white flex items-center justify-center transition-all hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37]"
                  onClick={() => handleDecrement(item.id)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-[24px] text-center font-semibold text-white">
                  {item.quantity}
                </span>
                <button 
                  className="w-8 h-8 rounded-md border border-[#2a2a2a] bg-[#121212] text-white flex items-center justify-center transition-all hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37]"
                  onClick={() => handleIncrement(item.id)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="font-semibold text-[#d4af37] text-center">
                ${Number(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove Button */}
              <button 
                className="w-9 h-9 rounded-lg border border-[#2a2a2a] bg-transparent text-gray-400 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
                onClick={() => handleRemove(item.id)} 
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </section>

        {/* Cart Summary */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-8 h-fit sticky top-[120px]">
          <div className="flex justify-between mb-3 text-gray-400 text-base">
            <span>SUBTOTAL</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3 text-gray-400 text-base">
            <span>Shipping</span>
            <span>$12.87</span>
          </div>
          <div className="text-xl font-bold text-white my-5 pt-4 border-t border-[#2a2a2a] flex justify-between">
            <span>ORDER TOTAL</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handlePayNow}
            className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#f4e27a] text-black font-bold text-lg rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)]"
          >
            PROCEED TO CHECKOUT →
          </button>
        </div>
      </div>
    </div>
  );
}