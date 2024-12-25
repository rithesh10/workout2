import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Activity,
  TrendingUp,
  Heart,
  PlusCircle,
  Calendar,
  Users,
  BarChart,
} from "lucide-react";
import { Link } from "react-router-dom";

// console.log(user);

const Dashboard = () => {
  // const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  let user = {};
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      user = JSON.parse(storedData); // Converts back to object
      console.log("Retrieved schema data:", user);
      setName(user.fullName);
      // Access schema fields
      console.log("User ID:", user.fullName);
      console.log("Name:", user.email);
    } else {
      console.log("No user data found in localStorage.");
    }
  });

  // if (loading) {
  //   return <p>Loading...</p>; // Show a loading indicator while fetching data
  // }

  if (!user) {
    return (
      <p>
        Error: User data could not be loaded. Please <a href="/login">log in</a>
        .
      </p>
    ); // Handle missing user data
  }

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-black text-gray-100">
    <div className="w-full max-w-screen-xl mx-auto flex-1 px-4 py-10 sm:px-6 md:px-8 lg:px-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {name}!
        </h1>
        <p className="text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Activity className="h-8 w-8 text-blue-400" />}
            title="Active Workouts"
            value="3"
            subtitle="Current week"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8 text-green-400" />}
            title="Progress"
            value="85%"
            subtitle="Goal completion"
          />
          <StatCard
            icon={<Heart className="h-8 w-8 text-red-400" />}
            title="Calories Burned"
            value="1,250"
            subtitle="This week"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            icon={<PlusCircle className="h-6 w-6 text-gray-200" />}
            title="Create Workout Plan"
            description="Generate a personalized workout plan based on your goals"
            link="/generateWorout"
          />
          <QuickAction
            icon={<PlusCircle className="h-6 w-6 text-gray-200" />}
            title="Create Diet Plan"
            description="Generate a personalized workout plan based on your goals"
            link="/dietplan"
          />
          <QuickAction
            icon={<Calendar className="h-6 w-6 text-gray-200" />}
            title="Track Progress"
            description="Monitor your fitness journey and see your progress"
            link="/exerciseTracker"
          />
        </div>
      </div>
      <hr />
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
          
        {icon}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="text-3xl font-bold text-gray-100">{value}</div>
          <p className="text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, title, description, link }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link
        to={link}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent border-0 no-underline rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Dashboard;
