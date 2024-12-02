
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Clock, Dumbbell, Target, AlertCircle, } from 'lucide-react';
import { FaYoutube } from "react-icons/fa6";
const ExerciseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { exercise } = location.state;

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Exercise Not Found</h2>
          <p className="text-gray-600 mb-4">The exercise details you're looking for are not available.</p>
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

  // Demo data (replace with actual data from your exercise object)
  const exerciseDetails = {
    // ...exercise,
    // duration: '30-45 mins',
    // equipment: ['Barbell', 'Weight Plates', 'Bench'],
    // difficulty: 'Intermediate',
    // targetMuscles: ['Primary: ' + exercise.category, 'Secondary: Supporting Muscles'],
    steps: [
      'Set up the equipment properly',
      'Maintain proper form throughout',
      'Control the movement',
      'Focus on muscle engagement'
    ],
    tips: [
      'Keep your core tight',
      'Breathe steadily',
      'Maintain proper posture',
      'Start with lighter weights'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50  w-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center bg-gray-900 text-white rounded transition-colors mb-6"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Duration */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-black mr-2" />
                  <h3 className="font-semibold">Duration</h3>
                </div>
                {/* <p className="text-gray-600">{exerciseDetails.duration}</p> */}
              </div>

              {/* Equipment */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Dumbbell className="w-5 h-5 text-black mr-2" />
                  <h3 className="font-semibold">Equipment</h3>
                </div>
                <ul className="text-gray-600">
                  {/* {exerciseDetails.equipment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))} */}
                </ul>
              </div>

              {/* Difficulty */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-black mr-2" />
                  <h3 className="font-semibold">Difficulty</h3>
                </div>
                <p className="text-gray-600">{exercise.difficulty}</p>
              </div>

              {/* Target Muscles */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="w-5 h-5 text-black mr-2" />
                  <h3 className="font-semibold">Target Muscles</h3>
                </div>
                <ul className="text-gray-600">
                  {exercise.muscleGroup}
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-8">
              {/* Steps */}
              <div>
                <h2 className="text-xl font-bold mb-4">How to Perform</h2>
                <ol className="list-decimal list-inside space-y-3 text-gray-700">
                  {/* {exerciseDetails.steps.map((step, index) => (
                    <li key={index} className="pl-2">{step}</li>
                  ))} */}
                 { exercise.performing}
                </ol>
              </div>

              {/* Tips */}
              <div>
                <h2 className="text-xl font-bold mb-4">Tips & Safety</h2>
                <ul className="list-disc list-inside space-y-3 text-gray-700">
                  {exerciseDetails.tips.map((tip, index) => (
                    <li key={index} className="pl-2">{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Video Section */}
              {/* {exercise.ytLink && ( */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Video Tutorial</h2>
                  <a 
                    href={exercise.ytLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaYoutube className="w-5 h-5 mr-2" />
                    Watch on YouTube
                  </a>
                </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;