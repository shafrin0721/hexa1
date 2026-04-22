import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  // TypeScript types (<boolean>, <string> වැනි) ඉවත් කරන ලදී
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Parameter එකේ තිබූ type definition එක ඉවත් කරන ලදී
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const endpoint = isLogin ? 'login' : 'register';

    const dataToSend = isLogin 
      ? { email: formData.email, password: formData.password } 
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
        // Backend port එක 5001 ලෙස ඇති බව පරීක්ෂා කරන්න
        const response = await axios.post(`http://localhost:5001/api/auth/${endpoint}`, dataToSend);
        
        if (response.data.success) {
            if (isLogin) {
                setSuccess(`Welcome back, ${response.data.user?.name || 'User'}!`);
                
                // Token සහ Role එක localStorage හි තැන්පත් කිරීම
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.user?.role); 

                setTimeout(() => {
                    // Admin හෝ Customer මත පදනම්ව අදාළ පිටුවට යොමු කිරීම [cite: 10, 36]
                    if (response.data.user?.role === 'admin') {
                        navigate('/admin'); 
                    } else {
                        navigate('/'); 
                    }
                }, 1500);
            } else {
                setSuccess('Registration successful! Please login.');
                setFormData({ name: '', email: '', password: '' });
                setIsLogin(true);
            }
        }
    } catch (err) {
        // catch block එකේ තිබූ 'any' type එක ඉවත් කරන ලදී
        setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center justify-center px-6 font-sans">
      <div className="w-full max-w-[400px]">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold tracking-tight mb-2">
            {isLogin ? 'Log in' : 'Create an account'}
          </h1>
          <p className="text-[#A1A1A1] text-[14px]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
              className="text-white hover:underline ml-1"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAuth} className="space-y-5">
          {error && <p className="text-red-500 text-center text-[13px] bg-red-500/10 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-500 text-center text-[13px] bg-green-500/10 py-2 rounded-lg">{success}</p>}

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-[13px] font-medium text-[#E1E1E1]">What should we call you?</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your profile name"
                className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-xl text-sm placeholder:text-[#555] focus:outline-none focus:border-white transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-[13px] font-medium text-[#E1E1E1]">What's your email?</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-xl text-sm placeholder:text-[#555] focus:outline-none focus:border-white transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[13px] font-medium text-[#E1E1E1]">
                {isLogin ? 'Enter your password' : 'Create a password'}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[12px] text-[#A1A1A1] hover:text-white flex items-center gap-1 transition-colors"
              >
                 {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-xl text-sm placeholder:text-[#555] focus:outline-none focus:border-white transition-all"
              required
            />
            {!isLogin && (
                <p className="text-[11px] text-[#666] leading-tight">Use 8 or more characters with a mix of letters, numbers & symbols</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-white text-black font-bold rounded-full text-[14px] hover:bg-[#E5E5E5] active:scale-[0.98] transition-all"
          >
            {isLogin ? 'Log in' : 'Create an account'}
          </button>
        </form>

        {/* Figma Style Social Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#333]"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#555]">
            <span className="bg-[#0E0E0E] px-4">OR Continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center py-2.5 bg-white text-black rounded-full hover:bg-[#D1D1D1] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.04c-5.5 0-10 4.5-10 10c0 5 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.34 21.16 22 17.04 22 12.04c0-5.5-4.5-10-10-10Z"/></svg>
          </button>
          <button className="flex items-center justify-center py-2.5 bg-white text-black rounded-full hover:bg-[#D1D1D1] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h5.14c-.22 1.2-1.27 3.51-5.14 3.51-3.33 0-6.05-2.76-6.05-6.15s2.72-6.15 6.05-6.15c1.9 0 3.17.81 3.9 1.5l2.16-2.08C16.81 3.14 14.61 2.2 12.18 2.2c-5.41 0-9.8 4.39-9.8 9.8s4.39 9.8 9.8 9.8c5.65 0 9.41-3.98 9.41-9.58c0-.64-.07-1.12-.24-1.12Z"/></svg>
          </button>
          <button className="flex items-center justify-center py-2.5 bg-white text-black rounded-full hover:bg-[#D1D1D1] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.78c.9-.04 2.1-.83 3.5-.68c1.65.17 2.85.83 3.56 1.88-3.48 2.1-2.93 6.63.4 8.04c-.66 1.7-1.57 3.01-2.57 2.95zm-3.44-14.33c-.05-2.22 1.83-4.14 3.94-4.25c.23 2.51-2.31 4.51-3.94 4.25z"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;