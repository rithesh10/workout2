import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const url=import.meta.env.VITE_BACKEND_URL
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
        `${url}/register`,
        updatedFormdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data)

      if (response.status === 201) {
        navigate("/login"); // Navigate to the dashboard on success
      
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Register
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 bg-white hover:bg-gray-100 p-2 rounded-md border-black focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formdata.fullName}
            onChange={(e) =>
              setFormdata({ ...formdata, fullName: e.target.value })
            }
            className="w-full rounded-md bg-white border-2 p-2 hover:borderfocus:outline-none focus:ring-2 focus:border-transparent"
          />

          <input
            type="email"
            placeholder="Email"
            value={formdata.email}
            onChange={(e) =>
              setFormdata({ ...formdata, email: e.target.value })
            }
            className="w-full rounded-md bg-white border-2 p-2 focus:outline-none focus:ring-2 focus:border-transparent"
          />

          <div className="relative flex w-full space-between">
            <div className="relative">
              <button
                type="button"
                className="flex items-center h-full px-3 border-2 border-r-0 rounded-l-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="text-lg mr-1 font-normal">
                  {selectedCountry.flag}
                </span>
                <span className="text-gray-700 mr-1">
                  {selectedCountry.code}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-1 left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      className="w-full px-4 py-2 text-left bg-white hover:bg-slate-600 hover:border-black border-2 flex items-center space-x-3 transition-all hover:text-white"
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsOpen(false);
                      }}
                    >
                      <span className="text-gray-700">{country.flag}</span>
                      <span className="text-gray-700">{country.code}</span>
                      <span className="text-gray-500">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="tel"
              placeholder="Phone number"
              value={formdata.phone}
              onChange={(e) =>
                setFormdata({ ...formdata, phone: e.target.value })
              }
              className="flex-1 rounded-r-md bg-white border-2 border-l-0 p-2 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          <div className="relative flex w-full">
            <button
              type="button"
              className="flex items-center w-full px-3 py-2 border-2 border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none"
              onClick={() => setIsGenderOpen(!isGenderOpen)}
            >
              <span className="text-gray-700">{selectedGender}</span>
              <ChevronDown className="h-4 w-4 text-gray-400 ml-auto" />
            </button>

            {isGenderOpen && (
              <div className="absolute z-10 mt-1 left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {genders.map((gender) => (
                  <button
                    key={gender}
                    className="w-full px-4 py-2 text-left bg-white hover:bg-slate-600"
                    onClick={() => {
                      setSelectedGender(gender); // Ensure gender is updated
                      setIsGenderOpen(false); // Close the dropdown
                    }}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="password"
            placeholder="Password"
            value={formdata.password}
            onChange={(e) =>
              setFormdata({ ...formdata, password: e.target.value })
            }
            className="w-full rounded-md bg-white border-2 p-2 focus:outline-none focus:ring-2 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
