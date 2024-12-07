import React from "react";
import { Dumbbell, User, Scale, Target, Activity } from 'lucide-react';

const UserWorkout = ({ selectedWorkout, selectedUser, fetchError, onClose }) => {
  // Normalize workout data
  const workoutData = Array.isArray(selectedWorkout) 
    ? selectedWorkout[0] 
    : selectedWorkout;

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

  // Check if workout data is valid
  if (!workoutData || !workoutData.dailyWorkouts || workoutData.dailyWorkouts.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-300">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No Workout Data
          </h2>
          <p className="text-gray-600 mb-6">No workout information found for this user.</p>
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

  // Calculate workout metrics
  const calculateWorkoutMetrics = () => {
    const totalWorkoutDays = workoutData.dailyWorkouts.filter(day => day.exercises.length > 0).length;
    const totalExercises = workoutData.dailyWorkouts.reduce((total, day) => 
      total + day.exercises.length, 0
    );
    const averageExercisesPerDay = (totalExercises / totalWorkoutDays).toFixed(1);

    return {
      totalWorkoutDays,
      totalExercises,
      averageExercisesPerDay
    };
  };

  const workoutMetrics = calculateWorkoutMetrics();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-200">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Workout Plan - {selectedUser?.fullName || 'User'}
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

        {/* Workout Overview */}
        <div className="grid md:grid-cols-3 gap-6 p-6">
          {[
            { label: 'Total Workout Days', value: workoutMetrics.totalWorkoutDays, color: 'blue' },
            { label: 'Total Exercises', value: workoutMetrics.totalExercises, color: 'green' },
            { label: 'Avg. Exercises/Day', value: workoutMetrics.averageExercisesPerDay, color: 'amber' }
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

        {/* User Details */}
        <div className="bg-gray-50 p-6 m-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Fitness Profile</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                icon: Target, 
                label: 'Fitness Goal', 
                value: workoutData.FitnessGoal || 'Not Specified',
                color: 'blue'
              },
              { 
                icon: Activity, 
                label: 'Fitness Level', 
                value: workoutData.FitnessLevel || 'Not Specified',
                color: 'green'
              },
              { 
                icon: User, 
                label: 'Age', 
                value: `${workoutData.age} years`,
                color: 'amber'
              },
              { 
                icon: Scale, 
                label: 'Weight', 
                value: `${workoutData.weight} kg`,
                color: 'purple'
              }
            ].map((detail, index) => (
              <div 
                key={index} 
                className={`bg-${detail.color}-50 p-4 rounded-lg flex items-center space-x-4 border-2 border-${detail.color}-200 hover:shadow-md transition duration-300`}
              >
                <detail.icon className={`text-${detail.color}-600`} size={24} />
                <div>
                  <p className={`text-sm text-${detail.color}-700`}>{detail.label}</p>
                  <p className="font-semibold text-gray-800">{detail.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Workout Log */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 m-6 rounded-lg border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-800 mb-6">Weekly Workout Breakdown</h3>
          <div className="space-y-4">
            {workoutData.dailyWorkouts.map((dailyWorkout, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md border-2 border-indigo-100 hover:shadow-xl transition duration-300"
              >
                <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                  <h4 className="font-semibold text-lg text-indigo-800">
                    {dailyWorkout.day}
                  </h4>
                </div>
                <div className="p-4">
                  {dailyWorkout.exercises.length === 0 ? (
                    <p className="text-gray-500 italic">Rest day</p>
                  ) : (
                    <div className="space-y-3">
                      {dailyWorkout.exercises.map((exercise, exerciseIndex) => (
                        <div 
                          key={exerciseIndex} 
                          className="bg-gray-50 p-3 rounded-lg hover:bg-indigo-50 transition duration-200"
                        >
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-800">{exercise.name}</p>
                            <div className="flex space-x-4 text-sm text-gray-600">
                              <span>Sets: {exercise.sets}</span>
                              <span>Reps: {exercise.reps || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWorkout;