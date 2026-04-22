import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, BarChart3, Users, ShoppingCart, Lock, Search, Bell, Home, LogOut, User } from 'lucide-react';

export default function AdminLayout({ children }) { 
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Truck, label: 'Logistics', path: '/admin/logistics' },
    { icon: BarChart3, label: 'Charts and Tables', path: '/admin/charts' },
    { icon: ShoppingCart, label: 'Inventory', path: '/admin/inventory' },
    { icon: Users, label: 'Customer Management', path: '/admin/customers' },
    { icon: Lock, label: 'Sales', path: '/admin/sales' },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user', e);
      }
    } else if (storedRole === 'admin') {
      setUser({ role: 'admin', name: 'Admin' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/auth');
    window.location.reload();
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            {/* Improved Logo Design - HEXA with gradient and better visibility */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center rounded-lg shadow-md">
              <span className="text-white font-bold text-lg tracking-tight">H</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent hidden sm:inline">
              HEXA
            </span>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Divider */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                <Home size={20} />
                <span className="font-medium">Back to Store</span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-800">
                {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Search size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative transition">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Dropdown */}
              <div className="relative group">
                <button className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold hover:opacity-90 transition">
                  {getUserInitial()}
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                    Signed in as <span className="text-gray-700 font-medium">{user?.name || 'Admin'}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}