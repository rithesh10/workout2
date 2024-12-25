import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserWorkout from "./UserWorkout";
import UserDiet from "./UserDiet";
import config from "../../config/config";
import UserPerformance from "./UserPerformance";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [performanceModalVisible, setPerformanceModalVisible] = useState(false); // New state
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [selectedPerformance, setSelectedPerformance] = useState(null); // New state
  const [selectedUser, setSelectedUser] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/get-all-users`);
      if (response.data && response.data.data) {
        setUsers(
          response.data.data.map((user) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
          }))
        );
        // console.log(users);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  const fetchWorkouts = async (userId) => {
    try {
      setFetchError(null);
      const response = await axios.get(
        `${config.BACKEND_URL}/get-workout/${userId}`
      );
      if (response.data && response.data.data) {
        setSelectedWorkout(response.data.data);
      } else {
        setSelectedWorkout(null); // No workout data found
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch workout plans.");
      setSelectedWorkout(null);
    }
  };

  const fetchDiet = async (userId) => {
    try {
      setFetchError(null);
      const response = await axios.get(
        `${config.BACKEND_URL}/get-diet/${userId}`
      );
      if (response.data && response.data.data) {
        setSelectedDiet(response.data.data);
      } else {
        setSelectedDiet(null); // No diet data found
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch diet plans.");
      setSelectedDiet(null);
    }
  };

  const fetchPerformance = async (userId) => {
    try {
      setFetchError(null);
      const response = await axios.get(
        `${config.BACKEND_URL}/performace/${userId}`
      );
      if (response.data && response.data.data) {
        setSelectedPerformance(response.data.data);
      } else {
        setSelectedPerformance(null); // No performance data found
      }
    } catch (err) {
      setFetchError(err.message || "Failed to fetch user performance.");
      setSelectedPerformance(null);
    }
  };

  const handleViewPerformance = async (user) => {
    setSelectedUser(user);
    setPerformanceModalVisible(true);
    await fetchPerformance(user.id);
  };

  // Close performance modal
  const closePerformanceModal = () => {
    setPerformanceModalVisible(false);
    setSelectedPerformance(null);
  };

  const handleViewWorkoutPlans = async (user) => {
    setSelectedUser(user);
    setWorkoutModalVisible(true);
    await fetchWorkouts(user.id);
  };

  const handleViewDietPlans = async (user) => {
    setSelectedUser(user);
    setDietModalVisible(true);
    await fetchDiet(user.id);
  };

  const closeWorkoutModal = () => {
    setWorkoutModalVisible(false);
    setSelectedWorkout(null);
  };

  const closeDietModal = () => {
    setDietModalVisible(false);
    setSelectedDiet(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-6 text-blue-800">
        User Management
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white shadow-lg rounded-lg border">
          <thead>
            <tr className="bg-blue-100 text-blue-800 uppercase text-xs sm:text-sm leading-normal">
              <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">
                Full Name
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden md:table-cell">
                Email
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden lg:table-cell">
                Phone
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden lg:table-cell">
                Gender
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-xs sm:text-sm font-medium">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-blue-50 transition duration-150"
              >
                <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                  <div className="flex items-center">
                    <div className="sm:hidden mr-2">
                      <strong>{user.fullName}</strong>
                    </div>
                    <div className="hidden sm:block whitespace-nowrap">
                      {user.fullName}
                    </div>
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden md:table-cell">
                  {user.email}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden lg:table-cell">
                  {user.phone}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden lg:table-cell">
                  {user.gender}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-6 text-center">
                  <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleViewWorkoutPlans(user)}
                      className="bg-indigo-500 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded hover:bg-indigo-600 transition"
                    >
                      Workout Plan
                    </button>
                    <button
                      onClick={() => handleViewDietPlans(user)}
                      className="bg-emerald-500 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded hover:bg-emerald-600 transition"
                    >
                      Diet Plan
                    </button>
                    <button
                      onClick={() => handleViewPerformance(user)}
                      className="bg-amber-500 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm rounded hover:bg-amber-600 transition"
                    >
                      Performance
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {workoutModalVisible && (
        <UserWorkout
          selectedWorkout={selectedWorkout}
          selectedUser={selectedUser}
          fetchError={fetchError}
          onClose={closeWorkoutModal}
        />
      )}
      {dietModalVisible && (
        <UserDiet
          selectedDiet={selectedDiet}
          selectedUser={selectedUser}
          fetchError={fetchError}
          onClose={closeDietModal}
        />
      )}

      {/* New Performance Modal */}
      {performanceModalVisible && (
        <UserPerformance
          selectedPerformance={selectedPerformance}
          selectedUser={selectedUser}
          fetchError={fetchError}
          onClose={closePerformanceModal}
        />
      )}
    </div>
  );
};

export default UserManagement;
