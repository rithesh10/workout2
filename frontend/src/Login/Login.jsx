import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import config from '../config/config';
import { Link,useNavigate } from "react-router-dom"; // Import useNavigate
// const url=import.meta.env.VITE_BACKEND_URL
const LoginModal = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate inside the component

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setError(''); // Clear previous errors

      // Send login request
      const response = await axios.post(`${config.backendUrl}/login`, 
        {
          email,
          password
        }, 
        {
          withCredentials: true, // Ensure cookies are included in the request
         
        }
      );

      if (response.status === 200) {
        console.log('Login successful:', response);
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        
        // Close the modal on success
        // Redirect to the dashboard page after login
        navigate("/dash");  // Use navigate here
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
    {/* Modal Header */}
    <div className="flex justify-between items-center mb-6">
      <button 
        onClick={closeModal} 
        className="text-gray-300 bg-gray-800  hover:text-gray-100 focus:outline-none"
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-2xl font-bold text-white">Login</h2>
    </div>
    
    {/* Form */}
    <form className="space-y-5" onSubmit={handleLogin}>
      {/* Email Input */}
      <div>
        {/* <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
          Email Address
        </label> */}
        <input 
          id="email"
          type="email"
          placeholder="Enter your email" 
          className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      {/* Password Input */}
      <div>
        {/* <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
          Password
        </label> */}
        <input 
          id="password"
          type="password"
          placeholder="Enter your password" 
          className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-transform transform hover:scale-105 text-white font-medium rounded-md"
      >
        Log In
      </button>
      <Link to='/forget-password' className='block w-full text-center mt-4'> <span>Forgot password?</span>?</Link>
    </form>
  </div>
</div>

  );
};

export default LoginModal;
