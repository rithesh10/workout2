import React from "react";

const UserWorkout = ({ selectedWorkout, selectedUser, fetchError, onClose }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {selectedUser?.fullName}'s Latest Workout Plan
        </h2>
        {fetchError ? (
          <p className="text-red-500 mb-4">{fetchError}</p>
        ) : selectedWorkout === null ? (
          <p className="text-gray-500">No workout plan available for this user.</p>
        ) : (
          <div className="border-b pb-4 mb-4">
            <p className="mb-2">
              <strong>Fitness Goal:</strong> {selectedWorkout.FitnessGoal}
            </p>
            <p className="mb-2">
              <strong>Fitness Level:</strong> {selectedWorkout.FitnessLevel}
            </p>
            <p className="mb-2">
              <strong>Age:</strong> {selectedWorkout.age}
            </p>
            <p className="mb-2">
              <strong>Height:</strong> {selectedWorkout.height} cm
            </p>
            <p className="mb-2">
              <strong>Weight:</strong> {selectedWorkout.weight} kg
            </p>

            <h3 className="font-semibold mt-4 text-gray-700">Daily Workouts:</h3>
            {selectedWorkout.dailyWorkouts.length === 0 ? (
              <p>No workouts planned for this week.</p>
            ) : (
              selectedWorkout.dailyWorkouts.map((dailyWorkout, i) => (
                <div key={i} className="mt-4">
                  <h4 className="font-semibold text-gray-700">{dailyWorkout.day}:</h4>
                  {dailyWorkout.exercises.length === 0 ? (
                    <p className="text-gray-500">No exercises planned for this day.</p>
                  ) : (
                    <ul className="list-disc pl-6">
                      {dailyWorkout.exercises.map((exercise, j) => (
                        <li key={j} className="mb-2">
                          <p>
                            <strong>Exercise:</strong> {exercise.name}
                          </p>
                          <p>
                            <strong>Sets:</strong> {exercise.sets}
                          </p>
                          <p>
                            <strong>Reps:</strong> {exercise.reps || "N/A"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        )}
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserWorkout;