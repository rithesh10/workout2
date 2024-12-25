import React from "react";
import { Utensils, Flame, Clock } from 'lucide-react';

const UserDiet = ({ selectedDiet, selectedUser, fetchError, onClose }) => {
  // Normalize diet data
  const dietData = Array.isArray(selectedDiet) 
    ? selectedDiet[0] 
    : selectedDiet;

  // If there's a fetch error
  if (fetchError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-100 to-red-200 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-red-300">
          <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error
          </h2>
          <p className="text-red-700 mb-6">{fetchError}</p>
          <button 
            onClick={onClose} 
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Check if diet data is valid
  if (!dietData || !dietData.dailyDiet || dietData.dailyDiet.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-300">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No Diet Data
          </h2>
          <p className="text-gray-600 mb-6">No diet information found for this user.</p>
          <button 
            onClick={onClose} 
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Calculate total calories and macro breakdown
  const calculateDietMetrics = () => {
    const totalCalories = dietData.dailyDiet.reduce((total, meal) => 
      total + meal.FoodItems.reduce((mealTotal, item) => mealTotal + item.calories, 0), 
      0
    );

    const totalProtein = dietData.dailyDiet.reduce((total, meal) => 
      total + meal.FoodItems.reduce((mealTotal, item) => mealTotal + (item.protein || 0), 0), 
      0
    );

    const totalCarbs = dietData.dailyDiet.reduce((total, meal) => 
      total + meal.FoodItems.reduce((mealTotal, item) => mealTotal + (item.carbs || 0), 0), 
      0
    );

    const totalFat = dietData.dailyDiet.reduce((total, meal) => 
      total + meal.FoodItems.reduce((mealTotal, item) => mealTotal + (item.fat || 0), 0), 
      0
    );

    return { 
      totalCalories, 
      totalProtein: totalProtein.toFixed(1), 
      totalCarbs: totalCarbs.toFixed(1), 
      totalFat: totalFat.toFixed(1) 
    };
  };

  const dietMetrics = calculateDietMetrics();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-green-100 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-200">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Diet Plan - {selectedUser?.fullName || 'User'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-300 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Diet Overview */}
        <div className="grid md:grid-cols-3 gap-6 p-6">
          {[
            { label: 'Total Calories', value: dietMetrics.totalCalories, color: 'blue' },
            { label: 'Total Protein (g)', value: dietMetrics.totalProtein, color: 'green' },
            { label: 'Total Carbs (g)', value: dietMetrics.totalCarbs, color: 'amber' }
          ].map((metric, index) => (
            <div 
              key={index} 
              className={`bg-${metric.color}-50 p-6 rounded-lg border-2 border-${metric.color}-200 shadow-md hover:shadow-xl transition duration-300`}
            >
              <h3 className={`text-lg font-semibold text-${metric.color}-700 mb-2`}>{metric.label}</h3>
              <p className={`text-4xl font-bold text-${metric.color}-800`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Detailed Meal Log */}
        <div className="bg-gray-50 p-6 m-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Meal Details</h3>
          {dietData.dailyDiet.map((meal, index) => (
            <div 
              key={index} 
              className="mb-6 p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between mb-4">
                <h4 className="text-xl font-semibold text-green-700">{meal.typeOfMeal}</h4>
                <span className="text-gray-600 font-medium flex items-center">
                  <Flame className="mr-2 text-orange-500" size={20} />
                  {meal.FoodItems.reduce((total, item) => total + item.calories, 0)} calories
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="p-3 text-left text-green-800 font-semibold">Food Item</th>
                      <th className="p-3 text-left text-green-800 font-semibold">Quantity</th>
                      <th className="p-3 text-left text-green-800 font-semibold">Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meal.FoodItems.map((food, foodIndex) => (
                      <tr 
                        key={foodIndex} 
                        className="border-b border-gray-200 hover:bg-green-50 transition duration-150"
                      >
                        <td className="p-3">{food.foodName}</td>
                        <td className="p-3">{food.quantity}</td>
                        <td className="p-3">{food.calories}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 m-6 rounded-lg border-2 border-purple-200">
          <h3 className="text-xl font-bold text-purple-800 mb-6">Nutrition Breakdown</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-purple-700 mb-2">Total Fat (g):</p>
              <p className="text-3xl font-bold text-purple-900">{dietMetrics.totalFat}</p>
            </div>
            <div>
              <p className="text-purple-700 mb-2">Fitness Goal:</p>
              <p className="text-xl font-semibold text-purple-800">
                {dietData.fitnessGoal || 'Not Specified'}
              </p>
            </div>
            <div>
              <p className="text-purple-700 mb-2">Fitness Level:</p>
              <p className="text-xl font-semibold text-purple-800">
                {dietData.fitnessLevel || 'Not Specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDiet;


