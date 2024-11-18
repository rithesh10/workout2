import React, { useState ,useEffect} from 'react';
import axios from 'axios';

import { 
  Activity, 
  TrendingUp,
  Heart,
  PlusCircle,
  Calendar,
  Users,
  BarChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

// console.log(user);

const Dashboard = () => {
const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const response = await axios.post(
                'http://localhost:4000/api/v1/user/get-user',
                {}, // Empty payload
                { withCredentials: true } // Ensure cookies are sent
            );
            setUser(response.data.data); // Update the state with user data
        } catch (err) {
            console.error("Error fetching user:", err);
            setUser(null); // Handle error by setting user to null
        } finally {
            setLoading(false); // Stop the loading spinner
        }
    };

    useEffect(() => {
        getUser(); // Fetch user data when the component mounts
    }, []);
    console.log(user)

    if (loading) {
        return <p>Loading...</p>; // Show a loading indicator while fetching data
    }

    if (!user) {
        return <p>Error: User data could not be loaded. Please <a href="/login">log in</a>.</p>; // Handle missing user data
    }

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gray-100">
      <div className="w-full max-w-screen-xl mx-auto flex-1 px-4 py-10 sm:px-6 md:px-8 lg:px-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.fullName}!</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Activity className="h-8 w-8 text-blue-500" />}
            title="Active Workouts"
            value="3"
            subtitle="Current week"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8 text-green-500" />}
            title="Progress"
            value="85%"
            subtitle="Goal completion"
          />
          <StatCard
            icon={<Heart className="h-8 w-8 text-red-500" />}
            title="Calories Burned"
            value="1,250"
            subtitle="This week"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickAction
            icon={<PlusCircle className="h-6 w-6" />}
            title="Create Workout Plan"
            description="Generate a personalized workout plan based on your goals"
            link="/generateWorout"
          />
          <QuickAction
            icon={<PlusCircle className="h-6 w-6" />}
            title="Create Diet Plan"
            description="Generate a personalized workout plan based on your goals"
            link="/dietplan"
          />
          <QuickAction
            icon={<Calendar className="h-6 w-6" />}
            title="Track Progress"
            description="Monitor your fitness journey and see your progress"
            link="/exerciseTracker"
          />
          {/* <QuickAction
            icon={<Users className="h-6 w-6" />}
            title="Join Community"
            description="Connect with others and share your fitness experiences"
            link="/community"
          /> */}
          <QuickAction
            icon={<BarChart className="h-6 w-6" />}
            title="Analyze Data"
            description="Dive into your fitness data and uncover insights"
            link="/analytics"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        {icon}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, title, description, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        to={link}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Dashboard;
