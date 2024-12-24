import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';
import LoginModal from './Login.jsx';
import RegisterModal from './RegisterModal.jsx';
const url = import.meta.env.VITE_BACKEND_URL;

const LandingPage = () => {
  console.log(import.meta.env.VITE_BACKEND_URL);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
  };
  const toggleRegister = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-black">
      {/* Navigation */}
      <nav className="w-full bg-black shadow-lg fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold text-white">FitTrack</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a href="#features" className="text-white hover:text-blue-600">
                Features
              </a>
              <a href="#pricing" className="text-white hover:text-blue-600">
                {/* Pricing */}
              </a>
              <button
                onClick={toggleLogin}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 transition-all transform hover:scale-105 text-white rounded-lg hover:bg-black"
              >
                Login
              </button>
              <button
                onClick={toggleRegister}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 transition-all transform hover:scale-105 text-white rounded-lg"
              >
                Register
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-600 bg-white rounded-lg">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-black shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-black">
                Features
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-black">
                {/* Pricing */}
              </a>
              <button
                onClick={toggleLogin}
                className="block w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 transition-all transform hover:scale-105 text-white"
              >
                Login
              </button>
              <button
                onClick={toggleRegister}
                className="block w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 transition-all transform hover:scale-105 text-white"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative w-full bg-black min-h-screen">
  {/* Background for Laptops and Larger Screens */}
  <div
    className="hidden md:block absolute inset-0"
    style={{
      backgroundImage: "url('/mainGym.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  ></div>

  {/* Background for Mobile Screens */}
  <div
    className="block md:hidden absolute inset-0"
    style={{
      backgroundImage: "url('/MobileGym.jpeg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  ></div>

  {/* Text Overlay */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
    <div className="text-center">
      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block text-white">Transform Your Body</span>
        <span className="py-2 block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Track Your Progress
        </span>
      </h1>
      <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
        Your personal fitness journey starts here. Track workouts, set goals, and achieve
        results with our comprehensive fitness platform.
      </p>
      <div className="flex justify-center items-center mt-6 mt-5 sm:mt-8 sm:flex sm:justify-center">
        <button
          onClick={toggleRegister}
          className="flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 transition-all transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
</div>



      {/* Feature Cards */}
      <section id="features" className="py-16 text-white bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[hsl(var(--card))] rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-[hsl(var(--card-foreground))]">Track Workouts</h3>
              <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                Log exercises, monitor progress, and analyze your training performance.
              </p>
            </div>
            <div className="p-6 bg-[hsl(var(--popover))] rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-[hsl(var(--popover-foreground))]">Set Goals</h3>
              <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                Set personalized fitness goals and stay motivated along the way.
              </p>
            </div>
            <div className="p-6 bg-[hsl(var(--secondary))] rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-[hsl(var(--secondary-foreground))]">Get Results</h3>
              <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                Track your improvements and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showLogin && <LoginModal closeModal={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal closeModal={() => setShowRegister(false)} />}
    </div>
  );
};

export default LandingPage;
