import React, { useState } from "react";
import Modal from "react-modal";
import config from "../../config/config";

const ExerciseTracker = () => {
  const [exerciseType, setExerciseType] = useState("");
  const [videoStreamUrl, setVideoStreamUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const routes = {
    push_up: "Push Up",
    left_bicep_curl: "Left Bicep Curl",
    right_bicep_curl: "Right Bicep Curl",
    lunge: "Lunge",
    plank: "Plank",
    deadlift: "Deadlift",
    side_plank: "Side Plank",
    shoulder_press: "Shoulder Press",
    squat: "Squat",
  };

  const startCamera = async () => {
    try {
      const response = await fetch(`${config.flaskUrl}/start_camera`, {
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
      const response = await fetch(`${config.flaskUrl}/stop_camera`, {
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
      const response = await fetch(`${config.flaskUrl}/reset_counter`, {
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
    setExerciseType(routes[type]);
    setVideoStreamUrl(`${config.flaskUrl}/${type}`);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden items-center h-screen bg-black p-4">
      <h1 className="text-4xl font-bold text-white mb-4">Exercise Tracker</h1>
      {errorMessage && (
        <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
      )}
      <div className="flex flex-col items-center bg-gray-700 shadow-lg rounded-lg p-6 w-full max-w-md">
        {!isRunning ? (
          <button
            onClick={startCamera}
            className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-red-700 to-red-900 hover:opacity-90"
          >
            Stop Camera
          </button>
        )}
        {isRunning && (
          <>
            <button
              onClick={resetCounter}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-700 hover:opacity-90"
            >
              Reset Counters
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 hover:opacity-90"
            >
              Select Exercise
            </button>
          </>
        )}
      </div>

      {isRunning && exerciseType && (
        <div className="mt-6 bg-gray-700 shadow-lg rounded-lg p-4 w-full max-w-lg">
          <h2 className="text-lg font-semibold text-white mb-2">
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

      {/* Modal for selecting exercise */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-white mb-4">Select Exercise</h2>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(routes).map(([key, value]) => (
            <button
              key={key}
              onClick={() => selectExercise(key)}
              className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-800 hover:opacity-90"
            >
              {value}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 text-white px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ExerciseTracker;
