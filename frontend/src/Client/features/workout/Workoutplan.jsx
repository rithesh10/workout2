import { useState } from 'react';
import axios from 'axios';
import config from '../../../config/config';

export default function WorkoutPlan() {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight:'',
    FitnessGoal: '',
    FitnessLevel: '',
    message: ''
  });
  const [workoutPlan, setworkoutPlan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.FitnessGoal || !formData.FitnessLevel || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      const response = await axios.post(
        `${config.backendUrl}/generate`, // Replace with your backend URL
        formData,
        { withCredentials: true,
          
         }
      );
      console.log(response.data);
      console.log(response.data.data)
      
      setworkoutPlan(response.data.data);
    } catch (err) {
      setError('Failed to generate diet plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(workoutPlan);
  
  

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-black flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-white mb-8 text-center">Create Your Workout Plan</h1>
  
    {/* Form Section */}
    <div className="rounded-xl shadow-lg p-6 w-full bg-gray-900  max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium bg- text-white mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Weight</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Fitness Goal</label>
            <input
              type="text"
              name="FitnessGoal"
              value={formData.FitnessGoal}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., muscle gain"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Fitness Level</label>
            <input
              type="text"
              name="FitnessLevel"
              value={formData.FitnessLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., beginner"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Message</label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Request specifics, e.g., a workout plan"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className={`text-white ${isLoading ? 'bg-gray-500' : 
            'bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400'
          } font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2  border-none dark:focus:ring-gray inline-flex items-center`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5614 82.5438 25.8019C85.4127 29.6136 87.2585 33.8127 88.0324 38.2124L93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </>
          ) : (
            'Generate Workout Plan'
          )}
        </button>
      </form>
    </div>
  
    {/* Display Diet Plan */}
    {workoutPlan && (
      <div className="bg-white rounded-lg shadow-lg mt-12 w-full max-w-4xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Workout Plan for {formData.FitnessGoal}</h2>
        <div className="space-y-8">
          {workoutPlan.dailyWorkouts.map((workout, index) => (
            <div className="bg-white p-5 rounded-lg shadow-sm" key={index}>
              <h3 className="text-xl font-semibold text-blue-600">{workout.day}</h3>
              <ul className="mt-4 space-y-3">
                {workout.exercises.map((exercise) => (
                  <li key={exercise._id} className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">{exercise.name}</span>
                    <span>{exercise.sets}</span>
                    <span>{exercise.reps} Reps</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>  
    )}
  </div>
  
  );
}
