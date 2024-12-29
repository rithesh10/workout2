import React, { useState,useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { 
  Menu, X, 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Calendar, 
  LogOut, 
  DumbbellIcon
} from "lucide-react";
import { FaUserShield } from 'react-icons/fa';
import Dashboard from "../pages/Dashboard";
import UserManagement from "../pages/UserManagement";
import WorkoutPlans from "../pages/WorkoutPlans";
import ClassSchedule from "../pages/UserProfile";
import AdminProfile from "./AdminProfile";
import Exercises from "../pages/Exercises";
import UpdateYTLink from "../pages/Exercises";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [name,setName]=useState("");
  let admin={};
  useEffect(()=>{
    const storedData = localStorage.getItem("adminData");
    if (storedData) {
      admin=(JSON.parse(storedData)); // Converts back to object
      console.log("Retrieved schema data:", admin);
      setName(admin.fullName);
      // Access schema fields
      console.log("User ID:", admin.fullName);
      console.log("Name:", admin.email);
    } else {
      console.log("No user data found in localStorage.");
    }
  })
  const handleLogout = () => {
    window.history.replaceState(null, '', '/');
      localStorage.clear();
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
    navigate("/");
  };

  const NavLinks = [
    { 
      to: "/admin/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="mr-2" size={20} /> 
    },
    { 
      to: "/admin/users", 
      label: "User Management", 
      icon: <Users className="mr-2" size={20} /> 
    },
    { 
      to: "/admin/workouts", 
      label: "Workout Plans", 
      icon: <Dumbbell className="mr-2" size={20} /> 
    },
    { 
      to: "/admin/classes", 
      label: "Users Profile", 
      icon: <Calendar className="mr-2" size={20} /> 
    },
    {
      to:"/admin/exercise",
      label:"Exercises ",
      icon:<DumbbellIcon className="mr-2" size={20}/>
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen">
    {/* Responsive Navbar */}
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden text-white hover:text-blue-300 transition"
        >
          <Menu size={24} />
        </button>

        {/* Logo/Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {/* <h1 className="text-xl font-bold text-white">FitTrack</h1> */}
        </div>
        <div>
          <Link to="/" className="flex no-underline items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-white" />
            <span className="font-semibold text-white text-2xl">FitTrack Pro</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center mx-auto">
          {NavLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="flex items-center text-gray-200 hover:text-blue-300 transition-colors duration-300"
            >
              {link.icon}
              <span className="ml-1">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Admin Name and Logout Button */}
        <div className="flex items-center space-x-4">
          {/* Admin Profile Link */}
            <Link 
            to="/admin/profile" 
            className="text-white hover:text-blue-300 font-semibold flex items-center space-x-2"
          >
            <FaUserShield className="text-white" size={20} /> {/* Admin Icon */}
            <span>{name}</span> {/* Admin Name */}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-white hover:bg-white text-black px-4 py-2 rounded-lg transition flex items-center"
          >
            <LogOut className="mr-2" size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 z-50">
          {NavLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="flex items-center px-4 py-3 hover:bg-gray-700 transition-colors"
              onClick={closeMobileMenu}
            >
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>

    {/* Main Content Area */}
    <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-6 overflow-y-auto">
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="workouts" element={<WorkoutPlans />} />
        <Route path="classes" element={<ClassSchedule />} />
        <Route path="profile" element={<AdminProfile/>}/>
        <Route path="exercise" element={<UpdateYTLink/>}/>
      </Routes>
    </div>

    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
      <div 
        onClick={closeMobileMenu} 
        className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
      />
    )}
  </div>
  );
};

export default AdminPortal;
