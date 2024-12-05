import React from "react";
import { Dumbbell, User, Scale, Ruler, Target, Activity } from 'lucide-react';

const UserWorkout = ({ selectedWorkout, selectedUser, fetchError, onClose }) => {
  if (!selectedWorkout) {
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
            <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Dumbbell className="text-blue-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedUser?.fullName || "User"}'s Workout Plan
            </h2>
            <p className="text-gray-500 mb-6">No workout plan available.</p>
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

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-auto p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Dumbbell className="text-blue-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {selectedUser?.fullName}'s Workout Plan
          </h2>
        </div>

        {fetchError ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
            <p className="text-red-600">{fetchError}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Target className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Fitness Goal</p>
                  <p className="font-semibold">{selectedWorkout.FitnessGoal}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Activity className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Fitness Level</p>
                  <p className="font-semibold">{selectedWorkout.FitnessLevel}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <User className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-semibold">{selectedWorkout.age} years</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                <Scale className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-semibold">{selectedWorkout.weight} kg</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {selectedWorkout.dailyWorkouts.map((dailyWorkout, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">
                    {dailyWorkout.day}
                  </h3>
                  {dailyWorkout.exercises.length === 0 ? (
                    <p className="text-gray-500">Rest day</p>
                  ) : (
                    <div className="space-y-3">
                      {dailyWorkout.exercises.map((exercise, j) => (
                        <div key={j} className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="font-medium text-gray-800">{exercise.name}</p>
                          <div className="flex space-x-4 mt-1 text-sm text-gray-600">
                            <p>Sets: {exercise.sets}</p>
                            <p>Reps: {exercise.reps || "N/A"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserWorkout;