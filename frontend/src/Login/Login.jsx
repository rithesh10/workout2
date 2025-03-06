import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import config from '../config/config';
import { Link, useNavigate } from "react-router-dom";

const LoginModal = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post(`${config.backendUrl}/login`, { email, password }, { withCredentials: true });
      
      if (response.status === 200) {
        if (response.data.data.user.role === "user") {
          navigate("/dash");
          localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        } else if (response.data.data.user.role === "admin") {
          localStorage.setItem('adminData', JSON.stringify(response.data.data.user));
          navigate('/admin/dashboard');
        }
        closeModal();
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Login</h2>
          <button onClick={closeModal} className="text-gray-300 hover:text-gray-100 focus:outline-none">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <input 
              type="email"
              placeholder="Enter your email" 
              className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div>
            <input 
              type="password"
              placeholder="Enter your password" 
              className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-transform transform hover:scale-105 text-white font-medium rounded-md"
          >
            Log In
          </button>

          <div className="flex justify-between items-center mt-4">
            <Link 
              to="/forget-password" 
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
