// LandingPage.js
import React, { useState } from 'react';
import { X, Menu } from 'lucide-react';
// import LoginModal from './LoginModal';
// import RegisterModal from './RegisterModal';
import LoginModal from './Login.jsx';
import RegisterModal from './RegisterModal.jsx';

const LandingPage = () => {
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
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50">
      {/* Navigation */}
      <nav className="w-full bg-white shadow-lg fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="ml-2 text-xl font-bold text-gray-800">FitFlow</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
              <button 
                onClick={toggleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              <button 
                onClick={toggleRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Register
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Features</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Pricing</a>
              <button onClick={toggleLogin} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600">
                Login
              </button>
              <button onClick={toggleRegister} className="block w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Register
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative w-full bg-white">
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Transform Your Body</span>
                <span className="block text-blue-600">Track Your Progress</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                Your personal fitness journey starts here. Track workouts, set goals, and achieve results with our comprehensive fitness platform.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <button
                  onClick={toggleRegister}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800">Track Workouts</h3>
              <p className="mt-2 text-gray-600">Log exercises, monitor progress, and analyze your training performance.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800">Set Goals</h3>
              <p className="mt-2 text-gray-600">Set personalized fitness goals and stay motivated along the way.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-gray-800">Get Results</h3>
              <p className="mt-2 text-gray-600">Track your improvements and celebrate your achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showLogin && <LoginModal closeModal={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal closeModal
      ={() => setShowRegister(false)} />}
    </div>
  );
};

export default LandingPage;
