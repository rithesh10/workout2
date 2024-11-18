import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Play, 
  Square, 
  RefreshCw, 
  ChevronLeft,
  Dumbbell
} from 'lucide-react';

const exercises = [
  { id: 1, name: 'leftbicep_curl', description: 'Upper body strength exercise' },
  { id: 2, name: 'rightbicep_curl', description: 'Lower body compound exercise' },
  { id: 3, name: 'Lunges', description: 'Lower body unilateral exercise' },
  { id: 4, name: 'Plank', description: 'Core stability exercise' }
];

const ExerciseModal = ({ isOpen, onClose, onSelectExercise }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black w-screen overflow-x-hidden bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Exercise</h2>
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                onClick={() => {
                  onSelectExercise(exercise.name.toLowerCase());
                  onClose();
                }}
              >
                <div className="flex items-center">
                  <Dumbbell className="w-5 h-5 text-blue-500 mr-3" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            className="mt-6 w-full p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ExerciseTracker = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercise, setExercise] = useState(null);
  const [isCameraRunning, setIsCameraRunning] = useState(false);

  const startCamera = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/start_camera', { method: 'POST' });
      if (response.ok) {
        setIsCameraRunning(true);
      } else {
        alert('Error: Could not start camera.');
      }
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const stopCamera = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/stop_camera', { method: 'POST' });
      if (response.ok) {
        setIsCameraRunning(false);
      } else {
        alert('Error: Could not stop camera.');
      }
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  const resetCounter = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/reset_counter', { method: 'POST' });
      if (!response.ok) {
        alert('Error: Could not reset counter.');
      }
    } catch (error) {
      console.error('Error resetting counter:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (isCameraRunning) {
        stopCamera();
      }
    };
  }, [isCameraRunning]);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50">
      <div className="w-full h-full p-4">
        <div className="bg-white rounded-lg shadow-lg h-full">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-500" />
              Exercise Tracker
            </h1>
          </div>

          {!exercise ? (
            <div className="text-center py-12">
              <Dumbbell className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Ready to start your workout?
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Choose Exercise
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-120px)]">
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Exercise: {exercise}
                </h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Change Exercise
                </button>
              </div>

              <div className="flex justify-center space-x-4 px-4 py-2">
                <button
                  onClick={startCamera}
                  disabled={isCameraRunning}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    isCameraRunning
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  } transition-colors`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </button>
                <button
                  onClick={stopCamera}
                  disabled={!isCameraRunning}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    !isCameraRunning
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  } transition-colors`}
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </button>
                <button
                  onClick={resetCounter}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reset
                </button>
              </div>

              {isCameraRunning && (
                <div className="flex-1 p-4">
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={`http://127.0.0.1:8000/${exercise}`}
                      alt="Video Feed"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectExercise={setExercise}
      />
    </div>
  );
};

export default ExerciseTracker;