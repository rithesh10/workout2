import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import config from '../config/config';
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
          headers: {
            "ngrok-skip-browser-warning": "true" // Add the ngrok-specific header
          }
        }
      );

      if (response.status === 200) {
        console.log('Login successful:', response.data);
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
      <div className="bg-white p-8 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Login</h2>
          <button onClick={closeModal} className="text-gray-400 bg-white hover:bg-gray-100 p-2 focus:outline-none focus:ring-0">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full rounded-md bg-white border-2 p-2" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full rounded-md bg-white border-2   p-2" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full py-2 bg-black text-white rounded-md">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
