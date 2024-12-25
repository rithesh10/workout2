import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.ADMIN_URL}/loginAdmin`, {
        email,
        password,
      }, {
        withCredentials: true,
      });
      localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
      if (response.status === 200) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none"
                required
              />
            </div>

            {error && (
              <div className="text-center text-red-500 text-sm">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign In
            </button>
          </form>
          {/* <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? <a href="/admin/register" className="text-blue-600 hover:text-blue-700">Sign up</a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
