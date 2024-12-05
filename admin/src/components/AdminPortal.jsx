import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserManagement from "../pages/UserManagement";
import WorkoutPlans from "../pages/WorkoutPlans";
import ClassSchedule from "../pages/UserProfile";

const AdminPortal = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              User Management
            </Link>
            <Link
              to="/admin/workouts"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Workout Plans
            </Link>
            <Link
              to="/admin/classes"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Users Profile
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-end items-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </nav>

        {/* Content Routes */}
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route index element={<Dashboard />} /> {/* Default route */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="workouts" element={<WorkoutPlans />} />
            <Route path="classes" element={<ClassSchedule />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
