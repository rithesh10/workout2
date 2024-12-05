import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserWorkout from "./UserWorkout";
import UserDiet from "./UserDiet";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [dietModalVisible, setDietModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/v1/user/get-all-users");
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
      const response = await axios.get(`http://127.0.0.1:4000/api/v1/user/get-workout/${userId}`);
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
      const response = await axios.get(`http://127.0.0.1:4000/api/v1/user/get-diet/${userId}`);
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
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-lg rounded-lg border">
          <thead>
            <tr className="bg-blue-100 text-blue-800 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Full Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Gender</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-medium">
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-blue-50 transition duration-150"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">{user.fullName}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.phone}</td>
                <td className="py-3 px-6 text-left">{user.gender}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleViewWorkoutPlans(user)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    View Workout Plan
                  </button>
                  <button
                    onClick={() => handleViewDietPlans(user)}
                    className="bg-green-500 text-white px-4 py-2 ml-2 rounded hover:bg-green-600 transition"
                  >
                    View Diet Plan
                  </button>
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
    </div>
  );
};

export default UserManagement;
