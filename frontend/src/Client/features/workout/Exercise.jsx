import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PlayCircle,
  Clock,
  Dumbbell,
  Target,
  AlertCircle,
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa6';

const ExerciseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exercise } = location.state || {}; // Safely access state
  console.log(exercise.ytLink);
  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Exercise Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The exercise details you're looking for are not available.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center bg-gray-900 text-white px-4 py-2 rounded transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to exercises
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">{exercise.name}</h1>
            <p className="text-lg opacity-90">{exercise.description}</p>
          </div>

          {/* Exercise Details Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 text-black md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Difficulty */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-black mr-2" />
                  <h3 className="font-semibold">Difficulty</h3>
                </div>
                <p className="text-gray-600">{exercise.difficulty || 'N/A'}</p>
              </div>

              {/* Target Muscles */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-black mr-2" />
                  <h3 className="font-semibold">Target Muscles</h3>
                </div>
                <p className="text-gray-600">{exercise.muscleGroup || 'N/A'}</p>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-8">
              {/* Steps */}
              <div>
                <h2 className="text-xl font-bold mb-4">How to Perform</h2>
                <p className="text-gray-700">{exercise.performing || 'No instructions available.'}</p>
              </div>

              {/* Video Section */}
              {exercise.ytLink && (
                <div>
                  <h2 className="text-xl   font-bold mb-4">Video Tutorial</h2>
                  <iframe
                    className="w-full h-screen rounded-lg"
                    src={exercise.ytLink}
                    title={exercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;
