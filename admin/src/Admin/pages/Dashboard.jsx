import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Dumbbell, Calendar, TrendingUp } from "lucide-react";
import config from "../../config/config";

const Dashboard = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [workuts,setWorkouts]=useState([]);
  

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/get-all-users`
); // Replace with your API endpoint
      if (response.data && response.data.data) {
        setUsers(response.data.data.map(user => ({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          createdAt: user.createdAt, // Include createdAt for sorting recent users
        })));
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Dynamically calculate stats based on users state
  const stats = [
    {
      icon: <Users className="text-blue-500 w-8 h-8" />,
      title: "Total Users",
      value: users.length,
      change: "+12%"
    },
    {
      icon: <Dumbbell className="text-green-500 w-8 h-8" />,
      title: "Active Workout Plans",
      value: 45,
      change: "+5%"
    },
    {
      icon: <Calendar className="text-purple-500 w-8 h-8" />,
      title: "Total Classes",
      value: 20,
      change: "+3%"
    },
    {
      icon: <TrendingUp className="text-red-500 w-8 h-8" />,
      title: "Monthly Revenue",
      value: "$45,000",
      change: "+8%"
    }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  // Sort users by `createdAt` to display the most recent ones
  const recentUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow"
          >
            <div>{stat.icon}</div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-green-600 text-xs">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <ul className="space-y-3">
            {recentUsers.map((user, index) => (
              <li 
                key={index} 
                className="flex justify-between border-b pb-2 last:border-b-0"
              >
                <span>{user.fullName}</span>
                <span className="text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <ul className="space-y-3">
            {[
              { name: "Yoga Class", time: "6:00 PM" },
              { name: "Weight Training", time: "7:30 PM" },
              { name: "Cardio Blast", time: "8:45 PM" }
            ].map((cls, index) => (
              <li
                key={index}
                className="flex justify-between border-b pb-2 last:border-b-0"
              >
                <span>{cls.name}</span>
                <span className="text-gray-500">{cls.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
