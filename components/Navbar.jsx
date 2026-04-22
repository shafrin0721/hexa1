import { Link, useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { useAvatar } from '../context/AvatarContext';
import { useState, useEffect } from "react";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face";

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const { avatarUrl, isLoading } = useAvatar(); // Call hook at top level
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    } else if (storedRole) {
      setUser({ role: storedRole });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    if (user?.email) {
      const avatarKey = `hexal_profile_avatar:${user.email.toLowerCase()}`;
      localStorage.removeItem(avatarKey);
    }
    setUser(null);
    navigate('/auth');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="text-sm font-bold text-white">HEXA</span>
        </Link>
        
        <div className="hidden md:flex gap-12 text-sm">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
          <Link to="/about" className="text-white hover:text-gray-300">About</Link>
          <Link to="/contact" className="text-white hover:text-gray-300">Contact</Link>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center text-white">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="focus:outline-none"
            >
              <img 
                src={isLoading ? DEFAULT_AVATAR : (avatarUrl || DEFAULT_AVATAR)}
                alt="Profile" 
                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover" 
              />
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-gray-700">
                  {/* Dropdown content remains the same */}
                  {user && (user.role === 'admin' || localStorage.getItem('role') === 'admin') ? (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                        Signed in as <span className="text-white font-medium">{user?.name || user?.username || 'Admin'}</span>
                      </div>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📊 Admin Dashboard
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📦 My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors border-t border-gray-700"
                      >
                        🚪 Sign Out
                      </button>
                    </>
                  ) : user ? (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                        Signed in as <span className="text-white font-medium">{user?.name || user?.username || 'User'}</span>
                      </div>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📦 My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors border-t border-gray-700"
                      >
                        🚪 Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        🔑 Sign In
                      </Link>
                      <Link
                        to="/auth"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📝 Register
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;