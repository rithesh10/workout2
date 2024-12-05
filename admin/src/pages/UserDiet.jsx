import React from "react";
import { Utensils, Flame, Clock } from 'lucide-react';

const UserDiet = ({ selectedDiet, selectedUser, fetchError, onClose }) => {
  // Handle missing or malformed data gracefully
  if (!selectedDiet) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
          >
            ✕
          </button>
          
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Utensils className="text-red-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedUser?.fullName || "User"}'s Diet Plan
            </h2>
            <p className="text-gray-500 mb-6">No diet plan available for this user.</p>
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { dailyDiet, fitnessGoal, fitnessLevel } = selectedDiet;

  // Calculate total calories
  const totalCalories = dailyDiet.reduce((total, meal) => 
    total + meal.FoodItems.reduce((mealTotal, item) => mealTotal + item.calories, 0), 
    0
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative max-h-[90vh] overflow-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Utensils className="text-green-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedUser?.fullName || "User"}'s Diet Plan
          </h2>
          <p className="text-gray-500">Fitness Goal: {fitnessGoal}</p>
          <p className="text-gray-500">Fitness Level: {fitnessLevel}</p>
        </div>

        {fetchError && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
            <p className="text-red-600">{fetchError}</p>
          </div>
        )}

        <div className="space-y-4">
          {dailyDiet.map((meal, index) => (
            <div key={meal._id || index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">{meal.typeOfMeal}</h3>
                <div className="flex items-center text-gray-500">
                  <Flame className="mr-2" size={16} />
                  <span>
                    {meal.FoodItems.reduce((total, item) => total + item.calories, 0)} calories
                  </span>
                </div>
              </div>
              <ul className="space-y-1">
                {meal.FoodItems.map((food, foodIndex) => (
                  <li 
                    key={food._id || foodIndex} 
                    className="flex justify-between text-gray-600"
                  >
                    <span>{food.foodName}</span>
                    <span>
                      {food.quantity} ({food.calories} cal)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <Clock className="mr-2 text-blue-600" size={20} />
              <span className="font-bold text-gray-700">Total Calories: {totalCalories}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDiet;