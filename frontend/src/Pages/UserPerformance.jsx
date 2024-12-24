import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserPerformance.css"; // Import the CSS file

const UserPerformance = () => {
  const [user, setUser] = useState({});
  const [perform, setPerform] = useState(null); // Initialize as null to clearly differentiate loading state

  // Fetch user data from localStorage
  const fetchUserData = async () => {
    try {
      const storedData = localStorage.getItem("userData");
      console.log("Retrieved stored user data:", storedData); // Log the stored data

      if (storedData) {
        const parsedUser = JSON.parse(storedData); // Converts back to object
        console.log("Parsed user data:", parsedUser); // Log parsed user data
        setUser(parsedUser); // Update user state
        return parsedUser; // Return parsedUser for further use
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch performance data from API based on user ID
  const fetchPerformance = async (userId) => {
    try {
      console.log("Fetching performance data for userId:", userId); // Log the userId being used
      const response = await axios.get(`http://localhost:4000/api/v1/user/workoutPerformance/${userId}`);
      console.log("Performance API Response:", response); // Log the API response
      console.log(response.data.user)
      if (response && response.data) {
        setPerform(response.data.users[0].workouts); // Update performance state
      } else {
        console.error("No performance data found in the API response.");
      }
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData(); // Fetch user data first
      console.log("Fetched userData:", userData); // Log user data after fetching
      if (userData?._id) {
        fetchPerformance(userData._id); // Fetch performance data if userId is available
      } else {
        console.error("User data is missing the _id field.");
      }
    };
    fetchData();
  }, []);

  // Log perform state after it's set
  useEffect(() => {
    console.log("Current performance data:", perform);
  }, [perform]);

  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="user-performance-container">
      <h1>User Performance</h1>
      {perform === null ? (
        <p className="loading-message">Loading...</p> // Fallback message while data is being fetched
      ) : perform.length > 0 ? (
        <div className="performance-data">
          {perform.map((workout, index) => (
            <div key={index} className="workout-item">
              <h3>{formatDate(workout.date)}</h3> {/* Format and display the date */}
              {workout.todayExercises.map((exercise, exIndex) => (
                <div key={exIndex} className="exercise-item">
                  <h4>{exercise.workoutName}</h4> {/* Workout name */}
                  <div className="sets-list">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="set-details">
                        <p><strong>Set:</strong> {set.set}</p> {/* Set number */}
                        <p><strong>Reps:</strong> {set.rep}</p> {/* Repetitions */}
                        <p><strong>Weight:</strong> {set.weight} kg</p> {/* Weight */}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="loading-message">No performance data available.</p> // Message when no data is found
      )}
    </div>
  );
};

export default UserPerformance;
