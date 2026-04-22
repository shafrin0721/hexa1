// frontend/src/components/AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const user = localStorage.getItem('user');
      
      console.log('Checking admin access:', { token: !!token, role, user });
      
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      // Check if user is admin
      if (role === 'admin') {
        setIsAdmin(true);
      } else if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setIsAdmin(parsedUser.role === 'admin');
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    };

    checkAdminAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // Just return Outlet - let the parent route handle the layout
  return <Outlet />;
};

export default AdminRoute;