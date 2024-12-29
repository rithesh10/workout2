import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config/config';
import { Loader2 } from 'lucide-react';

const UpdateYTLink = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [ytLink, setYtLink] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.backendUrl}/get-exercises`);
        setExercises(response.data.data);
      } catch (error) {
        setMessage('Failed to fetch exercises. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExercise) {
      setMessage('Please select an exercise.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${config.backendUrl}/updateExercise/${selectedExercise._id}`,
        { ytLink }
      );
      setMessage(response.data.message || 'YouTube link updated successfully!');
      setYtLink('');
      setSelectedExercise(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update YouTube link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" mx-auto p-4 w-screen overflow-x-hidden">
      <div className="bg-white px-10 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl px-10 font-bold text-gray-800 mb-4">
            Update Exercise Video Link
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center  py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <div className="mb-6 ">
              <label 
                htmlFor="exercise" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Exercise
              </label>
              <select
                id="exercise"
                className="w-full px-3 bg-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                onChange={(e) => {
                  const exercise = exercises.find((ex) => ex._id === e.target.value);
                  setSelectedExercise(exercise);
                }}
                value={selectedExercise?._id || ""}
              >
                <option value="">-- Choose an Exercise --</option>
                {exercises.map((exercise) => (
                  <option key={exercise._id} value={exercise._id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedExercise && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="ytLink" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    YouTube Link
                  </label>
                  <input
                    type="url"
                    id="ytLink"
                    value={ytLink}
                    onChange={(e) => setYtLink(e.target.value)}
                    placeholder="Enter the YouTube video URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </span>
                  ) : (
                    'Update Link'
                  )}
                </button>
              </form>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded-md ${
                message.includes('success') 
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateYTLink;