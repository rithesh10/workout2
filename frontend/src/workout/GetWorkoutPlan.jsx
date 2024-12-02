import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, resolvePath } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

// Context for search functionality
const SearchContext = createContext();

// Search Provider
const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const fetchExercises = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/user/get-exercises',
        {},
        { withCredentials: true }
      );
      setExercises(response.data.data || []);
      console.log(response.data.data)
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleExerciseSelect = (exercise) => {
    navigate(`/getexercise`, { state: { exercise } });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, searchResults, handleSearch, handleExerciseSelect }}>
      {loading ? <Spinner/> : children}
    </SearchContext.Provider>
  );
};

// Custom Hook for using Search Context
const useSearch = () => {
  return useContext(SearchContext);
};

// Search Bar Component
const SearchBar = ({ className = '' }) => {
  const { searchQuery, searchResults, handleSearch, handleExerciseSelect } = useSearch();

  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="flex items-center bg-white rounded-full p-2 w-full">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search exercises..."
          className="bg-transparent w-full focus:outline-none text-black"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white text-black shadow-lg rounded-b-lg mt-1 max-h-64 overflow-y-auto">
          {searchResults.map((exercise) => (
            <div
              key={exercise.id}
              className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
              onClick={() => handleExerciseSelect(exercise)}
            >
              <div className="font-semibold">{exercise.name}</div>
              <div className="text-xs text-gray-500">{exercise.muscleGroup}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Navbar and Search Component
const NavbarWorkout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <nav className="bg-gray-900 w-full w-screen text-white p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <SearchBar />
        <div className="hidden text-white  md:flex space-x-4">
          <h5>Workouts</h5>
          <h5>diets</h5>
          {/* <h</h5> */}
          {/* <Link to="/workouts" className="hover:text-gray-300">Workouts</Link>
          <Link to="/diet" className="hover:text-gray-300">Diet</Link>
          <Link to="/profile" className="hover:text-gray-300">Profile</Link> */
          
        }
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute  text-white top-full left-0 w-full bg-gray-800 p-4">
          <Link to="/workouts" className="block py-2 text-white hover:text-gray-300">Workouts</Link>
          <Link to="/diet" className="block py-2 hover:text-gray-300">Diet</Link>
          <Link to="/profile" className="block py-2 hover:text-gray-300">Profile</Link>
        </div>
      )}
    </nav>
  );
};

// Workout Plan Component
const GetWorkoutPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/v1/user/get-user-workout-plan',
          {},
          { withCredentials: true }
        );
        setWorkoutPlan(response.data.data);
      } catch (err) {
        console.error('Error fetching workout plan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkoutPlan();
  }, []);

  if (loading) return <></>;
  if (!workoutPlan) return <p>Error: Could not load workout plan.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl overflow-x-auto">
        <div className='text-center font-bold text-2xl'>current workout plan</div>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-900 text-white uppercase">
            <tr>
              <th className="px-6 py-4">Day</th>
              <th className="px-6 py-4">Exercise</th>
              <th className="px-6 py-4">Sets</th>
              <th className="px-6 py-4">Reps</th>
            </tr>
          </thead>
          <tbody>
            {workoutPlan.dailyWorkouts.map((workout, dayIndex) => (
              <React.Fragment key={dayIndex}>
                <tr className="bg-blue-50 font-bold">
                  <td colSpan="4" className="px-6 py-3 text-black text-lg">
                    {workout.day}
                  </td>
                </tr>
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <tr key={exerciseIndex} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">{exercise.name}</td>
                    <td className="px-6 py-4">{exercise.sets}</td>
                    <td className="px-6 py-4">{exercise.reps}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Unified Component
export default function WorkoutPage() {

  return (
    <SearchProvider>
      <NavbarWorkout />
      <GetWorkoutPlan />
    </SearchProvider>
  );
}
