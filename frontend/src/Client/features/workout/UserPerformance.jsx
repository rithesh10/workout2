import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../../config/config";

const UserPerformance = () => {
  const [user, setUser] = useState({});
  const [perform, setPerform] = useState(null);

  // Fetch user data from localStorage
  const fetchUserData = async () => {
    try {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        const parsedUser = JSON.parse(storedData);
        setUser(parsedUser);
        return parsedUser;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch performance data from API based on user ID
  const fetchPerformance = async (userId) => {
    try {
      const response = await axios.get(
        `${config.backendUrl}/workoutPerformance/${userId}`
      );
      if (response && response.data) {
        setPerform(response.data.users[0].workouts);
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      if (userData?._id) {
        fetchPerformance(userData._id);
      }
    };
    fetchData();
  }, []);

  // Helper function to format the date in a professional way
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group workouts by date and consolidate exercises for each date
  const groupWorkoutsByDate = (workouts) => {
    return workouts.reduce((grouped, workout) => {
      const date = workout.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(...workout.todayExercises);
      return grouped;
    }, {});
  };

  return (
    // <div className=" min-h-screen w-screen overflow-x-hidden bg-black flex items-center justify-center p-6">
      <div className="min-h-screen w-screen overflow-x-hidden  bg-white shadow-lg rounded-lg overflow-hidden">
        <header className=" bg-black text-white py-6 px-8 text-center">
          <h1 className="text-3xl font-bold">User Performance</h1>
          <p className="mt-2 text-lg">Track and review your workout progress</p>
        </header>

        <main className="p-8 bg-black  00">
          {perform === null ? (
            <div className="text-center py-12">
              <p className="text-gray-900 bg-black text-xl animate-pulse">
                Loading performance data...
              </p>
            </div>
          ) : Object.keys(groupWorkoutsByDate(perform)).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupWorkoutsByDate(perform)).map(
                ([date, exercises], index) => (
                  <div key={index} className="bg-gray-800   rounded-lg p-6 shadow">
                    <h3 className="text-2xl text-white font-semibold  mb-4">
                      {formatDate(date)}
                    </h3>
                    <div className="space-y-6  bg-black">
                      {exercises.map((exercise, exIndex) => (
                        <div
                          key={exIndex}
                          className="bg-gray-700 border-1 border-white   p-4 rounded-lg shadow-md"
                        >
                          <h4 className="text-xl font-medium  text-white">
                            {exercise.workoutName}
                          </h4>
                          <div className="mt-4 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {exercise.sets.map((set, setIndex) => (
                              <div
                                key={setIndex}
                                className=" bg-gray-600 text-black p-4 rounded-lg shadow-sm "
                              >
                                <p className="text-sm text-white">
                                  <strong>Set:</strong> {set.set}
                                </p>
                                <p className="text-sm text-white">
                                  <strong>Reps:</strong> {set.rep}
                                </p>
                                <p className="text-sm text-white">
                                  <strong>Weight:</strong> {set.weight} kg
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
              <NotFound/>
              </p>
            </div>
          )}
        </main>
      </div>
    // </div>
  );
};

export default UserPerformance;
