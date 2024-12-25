import { Link, useNavigate } from "react-router-dom";
import { Home, Dumbbell, Apple, User, LogOut, Menu, X, Activity } from "lucide-react"; // Import Menu and X icons for hamburger
import { useState } from "react";
import axios from "axios";
import config from "../../config/config";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for managing the mobile menu visibility
  // const handleNavigate=async()=>{
  //   navigate("/user-performance");
  // }

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      window.history.replaceState(null, "", "/");
      localStorage.clear();
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-black sticky z-50 top-0 text-white shadow-lg">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand Name */}
          <Link to="/" className="flex no-underline items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-white" />
            <span className="font-semibold text-white text-2xl">
              FitTrack Pro
            </span>
          </Link>

          {/* Mobile Hamburger Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 bg-gray-900 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          {/* Navigation Links - For Large Screens */}
          <div className="hidden lg:flex no-underline items-center space-x-6">
            {/* <button
              style={{
                color: "white",
                // width: "150px",
                background: "black",
                cursor:"pointer"
              }}
              onClick={handleNavigate}
            >
              Performance
            </button> */}
            <NavLink to="/user-performance" icon={<Activity/>} text="Performace"/>
            <NavLink to="/getWorkoutPlan" icon={<Dumbbell />} text="Workout" />
            <NavLink to="/getDiet" icon={<Apple />} text="Diet" />
            <NavLink to="/profile" icon={<User />} text="Profile" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-black hover:text-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4">
            <NavLink to="/getWorkoutPlan" icon={<Dumbbell />} text="Workout" />
            <NavLink to="/getDiet" icon={<Apple />} text="Diet" />
            <NavLink to="/profile" icon={<User />} text="Profile" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-black hover:text-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, icon, text }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 no-underline text-white hover:text-gray-200 transition-colors"
    >
      {icon}
      <span className="text-sm">{text}</span>
    </Link>
  );
}
