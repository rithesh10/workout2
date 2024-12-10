import React, { useEffect } from 'react';

const UserPerformance = ({ 
  selectedPerformance, 
  selectedUser, 
  fetchError, 
  onClose 
}) => {
  // Extensive logging for debugging
  useEffect(() => {
    console.group('UserPerformance Debug');
    console.log('selectedPerformance:', selectedPerformance);
    console.log('selectedUser:', selectedUser);
    console.log('fetchError:', fetchError);
    console.groupEnd();
  }, [selectedPerformance, selectedUser, fetchError]);

  // Normalize performance data
  const performanceData = Array.isArray(selectedPerformance) 
    ? selectedPerformance[0] 
    : selectedPerformance;

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

  // Check if performance data is valid
  if (!performanceData || !performanceData.workouts || performanceData.workouts.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border-2 border-blue-300">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No Performance Data
          </h2>
          <p className="text-gray-600 mb-6">No performance information found for this user.</p>
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

  // Flatten workout details
  const workoutDetails = performanceData.workouts.flatMap(workout => 
    workout.todayExercises.map(exercise => ({
      name: exercise.workoutName,
      sets: exercise.sets,
      date: new Date(workout.date).toLocaleDateString()
    }))
  );

  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    const totalWorkouts = performanceData.workouts.length;
    
    const totalSets = workoutDetails.reduce((acc, workout) => 
      acc + workout.sets.length, 0);
    
    const totalReps = workoutDetails.reduce((acc, workout) => 
      acc + workout.sets.reduce((setAcc, set) => setAcc + set.rep, 0), 0);
    
    const averageWeight = workoutDetails.reduce((acc, workout) => 
      acc + workout.sets.reduce((setAcc, set) => setAcc + set.weight, 0), 0) / (totalSets || 1);

    return {
      totalWorkouts,
      totalSets,
      totalReps,
      averageWeight: averageWeight.toFixed(2)
    };
  };

  const performanceMetrics = calculatePerformanceMetrics();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-indigo-100 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-indigo-200">
        {/* Header */}
        <div className="bg-amber-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Performance - {selectedUser?.fullName || 'User'}
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

        {/* Performance Overview */}
        <div className="grid md:grid-cols-3 gap-6 p-6">
          {[
            { label: 'Total Workouts', value: performanceMetrics.totalWorkouts, color: 'blue' },
            { label: 'Total Sets', value: performanceMetrics.totalSets, color: 'green' },
            { label: 'Total Reps', value: performanceMetrics.totalReps, color: 'amber' }
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

        {/* Detailed Workout Log */}
        <div className="bg-gray-50 p-6 m-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Workout Details</h3>
          {workoutDetails.map((workout, index) => (
            <div 
              key={index} 
              className="mb-6 p-6 bg-white rounded-lg shadow-md border-2 border-gray-100 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between mb-4">
                <h4 className="text-xl font-semibold text-indigo-700">{workout.name}</h4>
                <span className="text-gray-600 font-medium">{workout.date}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="p-3 text-left text-indigo-800 font-semibold">Set</th>
                      <th className="p-3 text-left text-indigo-800 font-semibold">Reps</th>
                      <th className="p-3 text-left text-indigo-800 font-semibold">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workout.sets.map((set, setIndex) => (
                      <tr 
                        key={setIndex} 
                        className="border-b border-gray-200 hover:bg-indigo-50 transition duration-150"
                      >
                        <td className="p-3">{set.set}</td>
                        <td className="p-3">{set.rep}</td>
                        <td className="p-3">{set.weight}</td>
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
          <h3 className="text-xl font-bold text-purple-800 mb-6">Performance Insights</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-purple-700 mb-2">Average Weight (kg):</p>
              <p className="text-3xl font-bold text-purple-900">{performanceMetrics.averageWeight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPerformance;