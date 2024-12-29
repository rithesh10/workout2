import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../config/config";
const url=import.meta.env.VITE_BACKEND_URL
console.log(url);
const RegisterModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+91",
    flag: "IN",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Male");
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [formdata, setFormdata] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "", // Gender is initialized but needs to be set on submit
  });
  const [error, setError] = useState(null);

  const countries = [
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+86", flag: "🇨🇳", name: "China" },
    { code: "+81", flag: "🇯🇵", name: "Japan" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+7", flag: "🇷🇺", name: "Russia" },
    { code: "+55", flag: "🇧🇷", name: "Brazil" },
  ];

  const genders = ["Male", "Female", "Other"];

  const validateForm = () => {
    const { fullName, email, password, phone } = formdata;
    if (!fullName || !email || !password || !phone) {
      setError("All fields are required.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Assign selected gender to formdata before sending
    const updatedFormdata = {
      ...formdata,
      gender: selectedGender, // Assign gender value to formdata
    };
    console.log(updatedFormdata);
    setFormdata(updatedFormdata);
    selectedGender;

    try {
      const response = await axios.post(
        `${config.backendUrl}/register`,
        updatedFormdata,
       
      );
      console.log(response?.data)

      if (response.status === 201) {
        navigate("/"); // Navigate to the dashboard on success
      
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md mx-4 shadow-xl">
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Register</h2>
        <button
          onClick={closeModal}
          className="text-gray-300 hover:text-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
  
      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
  
      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Full Name Input */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formdata.fullName}
            onChange={(e) => setFormdata({ ...formdata, fullName: e.target.value })}
            className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
          />
        </div>
  
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formdata.email}
            onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
            className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
          />
        </div>
  
        {/* Phone Number with Country Dropdown */}
        <div className="relative flex items-center">
          <button
            type="button"
            className="flex items-center px-3 border border-gray-600 rounded-l-md bg-gray-700 text-white hover:bg-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="mr-1">{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          <input
            type="tel"
            placeholder="Phone number"
            value={formdata.phone}
            onChange={(e) => setFormdata({ ...formdata, phone: e.target.value })}
            className="flex-1 rounded-r-md bg-gray-700 border border-l-0 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 p-2.5"
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                className="w-full px-4 py-2 text-left text-white hover:bg-indigo-500"
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
              >
                <span>{country.flag}</span>
                <span className="ml-2">{country.code}</span>
                <span className="ml-4 text-gray-400">{country.name}</span>
              </button>
            ))}
          </div>
        )}
  
        {/* Gender Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white flex justify-between items-center hover:bg-gray-600 focus:ring-2 focus:ring-indigo-500"
            onClick={() => setIsGenderOpen(!isGenderOpen)}
          >
            {selectedGender || "Select Gender"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
          {isGenderOpen && (
            <div className="absolute z-10 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto w-full">
              {genders.map((gender) => (
                <button
                  key={gender}
                  className="w-full px-4 py-2 text-left text-white hover:bg-indigo-500"
                  onClick={() => {
                    setSelectedGender(gender);
                    setIsGenderOpen(false);
                  }}
                >
                  {gender}
                </button>
              ))}
            </div>
          )}
        </div>
  
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formdata.password}
            onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
            className="w-full rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
          />
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-md hover:opacity-90 focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
        >
          Create Account
        </button>
      </form>
    </div>
  </div>
  
  );
};

export default RegisterModal;
