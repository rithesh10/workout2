import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Dumbbell, Calendar, TrendingUp } from "lucide-react";
import config from "../../config/config";

const Dashboard = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [latestStats, setLatestStats] = useState(null); // State for today's stats
  const [statsFor30DaysAgo, setStatsFor30DaysAgo] = useState(null); // State for stats from 30 days ago

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/get-all-users`);
      if (response.data && response.data.data) {
        setUsers(
          response.data.data.map((user) => ({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            role: user.role,
            workouts: user.workouts,
            createdAt: user.createdAt,
          }))
        );
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  const getDate30DaysAgo = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 30); // Subtract 30 days
    return currentDate.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
  };

  const fetchLatestStats = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/latest`);
      setLatestStats(response.data.data);
    } catch (err) {
      console.error("Error fetching latest stats:", err);
    }
  };

  const fetchStatsFor30DaysAgo = async () => {
    try {
      const date30DaysAgo = getDate30DaysAgo(); // Get the correct date 30 days ago
      console.log(date30DaysAgo); // Just for debugging
      
      // API request to fetch stats for 30 days ago
      const response = await axios.get(`${config.backendUrl}/date/${date30DaysAgo}`);
      console.log(response.status);
      console.log(response.data.data);
      setStatsFor30DaysAgo(response.data.data);
    } catch (err) {
      console.error("Error fetching stats for 30 days ago:", err);
    }
  };

  useEffect(() => {
    fetchLatestStats();
    fetchStatsFor30DaysAgo();
    fetchUsers();
  }, []);

  const calculateChangePercentage = (current, past) => {
    if (past === 0) return 0;
    return ((current - past) / past) * 100;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  const stats = [
    {
      icon: <Users className="text-blue-500 w-8 h-8" />,
      title: "Total Users",
      value: users.length,
      change: latestStats && statsFor30DaysAgo
        ? `${calculateChangePercentage(latestStats.totalUsers, statsFor30DaysAgo.totalUsers).toFixed(2)}%`
        : "+0%",
    },
    {
      icon: <Dumbbell className="text-green-500 w-8 h-8" />,
      title: "Active Workout Plans",
      value: users.filter((user) => user.workouts !== null).length,
      change: latestStats && statsFor30DaysAgo
        ? `${calculateChangePercentage(latestStats.activeWorkouts, statsFor30DaysAgo.activeWorkouts).toFixed(2)}%`
        : "+0%",
    },
    {
      icon: <Calendar className="text-purple-500 w-8 h-8" />,
      title: "Total Classes",
      value: latestStats ? latestStats.activeWorkouts : 0,
      change: latestStats && statsFor30DaysAgo
        ? `${calculateChangePercentage(latestStats.activeWorkouts, statsFor30DaysAgo.activeWorkouts).toFixed(2)}%`
        : "+0%",
    },
    {
      icon: <TrendingUp className="text-red-500 w-8 h-8" />,
      title: "Monthly Revenue",
      value: latestStats ? latestStats.revenue : 0,
      change: latestStats && statsFor30DaysAgo
        ? `${calculateChangePercentage(latestStats.revenue, statsFor30DaysAgo.revenue).toFixed(2)}%`
        : "+0%",
    },
  ];

  return (
    <div className="space-y-6 w-screen text-gray-800 overflow-x-hidden">
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
              <p className="text-2xl text-black font-bold">{stat.value}</p>
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
          <ul className="space-y-3 text-black">
            {users.slice(0, 5).map((user, index) => (
              <li key={index} className="flex justify-between border-b pb-2 last:border-b-0">
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
            {[{ name: "Yoga Class", time: "6:00 PM" }, { name: "Weight Training", time: "7:30 PM" }].map((cls, index) => (
              <li key={index} className="flex justify-between border-b pb-2 last:border-b-0">
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
