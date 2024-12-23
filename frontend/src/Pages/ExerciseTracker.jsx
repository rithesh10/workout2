import React, { useState } from "react";

const ExerciseTracker = () => {
  const [exerciseType, setExerciseType] = useState("");
  const [videoStreamUrl, setVideoStreamUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const startCamera = async () => {
    try {
      const response = await fetch("http://localhost:8000/start_camera", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setIsRunning(true);
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to start camera");
      }
    } catch (error) {
      setErrorMessage("Error starting the camera: " + error.message);
    }
  };

  const stopCamera = async () => {
    try {
      const response = await fetch("http://localhost:8000/stop_camera", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setIsRunning(false);
        setExerciseType("");
        setVideoStreamUrl("");
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "Failed to stop camera");
      }
    } catch (error) {
      setErrorMessage("Error stopping the camera: " + error.message);
    }
  };

  const resetCounter = async () => {
    try {
      const response = await fetch("http://localhost:8000/reset_counter", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to reset counters");
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error resetting counters: " + error.message);
    }
  };

  const selectExercise = (type) => {
    setExerciseType(type);
    setVideoStreamUrl(`http://localhost:8000/${type}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden items-center  h-screen bg-black p-4">
      <h1 className="text-4xl font-bold text-white mb-4">Exercise Tracker</h1>
      {errorMessage && (
        <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
      )}
      <div className="flex flex-col items-center  bg-gray-700 shadow-lg rounded-lg p-6 w-full max-w-md">
        {!isRunning ? (
          <button
            onClick={startCamera}
            className="bg-blue-500 text-white px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Stop Camera
          </button>
        )}
        {isRunning && (
          <>
            <button
              onClick={resetCounter}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Reset Counters
            </button>
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              <button
                onClick={() => selectExercise("left_bicep_curl")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Left Bicep Curl
              </button>
              <button
                onClick={() => selectExercise("right_bicep_curl")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Right Bicep Curl
              </button>
              <button
                onClick={() => selectExercise("squat")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Squat
              </button>
              <button
                onClick={() => selectExercise("shoulder_press")}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Shoulder Press
              </button>
            </div>
          </>
        )}
      </div>
      {isRunning && exerciseType && (
        <div className="mt-6 bg-gray-700 shadow-lg rounded-lg p-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Current Exercise: {exerciseType}
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={videoStreamUrl}
              alt="Exercise Stream"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseTracker;
