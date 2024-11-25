import { Link, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Apple, User, LogOut } from 'lucide-react';
import axios from 'axios';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/v1/user/logout', {}, {
        withCredentials: true,
      });
      console.log(response.data);
      // Redirect to the login page after successful logout
      window.history.replaceState(null, '', '/');
      localStorage.clear();
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
      navigate('/login');
    } catch (error) {
      console.log(error);
      // Optionally, add a message for failed logout
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand Name */}
          <Link to="/" className="flex no-underline items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-white" />
            <span className="font-semibold text-white text-2xl">FitTrack Pro</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex no-underline items-center space-x-6">
            <NavLink to="/getWorkoutPlan" icon={<Dumbbell />} text="Workout" />
            <NavLink to="/diet" icon={<Apple />} text="Diet" />
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
