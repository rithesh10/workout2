import React from 'react';
import { Home, RefreshCw } from 'lucide-react';

const NotFound = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Large 404 Text */}
        <h1 className="text-8xl font-bold text-gray-800">404</h1>
        
        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Oops! The page you're looking for seems to have vanished into the digital void.
          </p>
        </div>

        {/* Illustration - Simple geometric shapes */}
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-300 rounded-full opacity-20 animate-pulse delay-100"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-pulse delay-200"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={goToHome}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
          
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;