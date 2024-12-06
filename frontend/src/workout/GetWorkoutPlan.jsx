import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, resolvePath } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import PerformanceModal from './Performance';
import config from '../config/config';

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
        `${config.backendUrl}/get-exercises`,
        {},
        { withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true" // Add the ngrok-specific header
          }
         }
      );
      setExercises(response.data.data || []);
      // console.log(response.data.data)
      
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
    <nav className="bg-gray-900  w-screen text-white p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <SearchBar />
        <div className="hidden text-white  md:flex space-x-4">
          {/* <Link to='/profile' className="block py-2 text-white hover:text-gray-300"><User/> profile</Link> */}
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
const GetWorkoutPlan = ({onOpenModal}) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
const handleOpen=(exercise)=>{
  onOpenModal(exercise)
  // navigate('/performance')
  
}
  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await axios.post(
          `${config.backendUrl}/get-user-workout-plan`,
          {},
          { withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true" // Add the ngrok-specific header
            }
          }
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
    <div className="flex justify-center w-screen items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl overflow-x-auto">
        <div className='text-center font-bold text-2xl'>current workout plan</div>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-900 text-white uppercase">
            <tr>
              <th className="px-6 py-4">Day</th>
              <th className="px-6 py-4">Exercise</th>
              <th  className="px-6 py-4" >performance</th>
              <th className="px-6 py-4">Sets</th>
              <th className="px-6 py-4">Reps</th>
            </tr>
          </thead>
          <tbody>
            {workoutPlan.dailyWorkouts.map((workout, dayIndex) => (
              <React.Fragment key={dayIndex}>
                <tr className="bg-blue-50 font-bold">
                  <td colSpan="4" className="px-6 py-4 text-black text-lg">
                    {workout.day}
                  </td>
                </tr>
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <tr key={exerciseIndex} className="border-b hover:bg-gray-50">
                    {/* <button className="px-6 py-4 "onClick={handleOpen}> */}
                    <td className=""></td>  
                    <td className="px-6 py-4">{exercise.name}</td>
                    <button 
                      onClick={() => handleOpen(exercise.name)} 
                      className="px-3  my-3 bg-gray-300 text-black rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none  border-none transition-all"
                    >
                      Add Performance
                    </button>
                      <td className="px-6 py-4">{exercise.sets}</td>
                    <td className="px-6 py-4">{exercise.reps}</td>
                    {/* </button> */}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState('');

  const openModal = (exercise) => {
    setExerciseName(exercise); // Set the exercise name dynamically
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <SearchProvider>
      { <NavbarWorkout />} 
      <GetWorkoutPlan onOpenModal={openModal} />
     {isModalOpen  && < PerformanceModal
        exerciseName={exerciseName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />}
    </SearchProvider>
 
  );
}