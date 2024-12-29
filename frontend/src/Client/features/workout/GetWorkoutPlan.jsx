import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, resolvePath } from 'react-router-dom';
import { Dumbbell, Menu, Search, User, Utensils, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import Spinner from '../../Client/components/Spinner';
import Spinner from '../../../components/Spinner';
import PerformanceModal from './Performance';
import config from '../../../config/config';
import NotFound from '../../../components/NotFound';


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
      const response = await axios.get(
        `${config.backendUrl}/get-exercises`,
        {},
        { withCredentials: true,
         
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
    <div className={`relative w-full  max-w-lg ${className}`}>
    <div className="flex items-center bg-gray-800 rounded-full p-2 w-full border border-gray-700">
      <Search className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search exercises..."
        className="bg-transparent w-full focus:outline-none text-white placeholder-gray-500"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>

    {searchResults.length > 0 && (
      <div className="absolute  w-full bg-gray-800 text-white shadow-lg rounded-b-lg mt-1 max-h-64 overflow-y-auto border border-gray-700">
        {searchResults.map((exercise) => (
          <div
            key={exercise.id}
            className="p-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
            onClick={() => handleExerciseSelect(exercise)}
          >
            <div className="font-semibold">{exercise.name}</div>
            <div className="text-xs text-gray-400">{exercise.muscleGroup}</div>
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
    <nav className="bg-gradient-to-r from-black  to-black shadow-lg w-full p-2 text-white fixed top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo or Brand */}
        <Link to="/" className="flex items-center no-underline text-white space-x-2 text-xl font-bold">
          <Dumbbell className="h-6 w-6" />
          <span>FitTrack</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <SearchBar />
          <div className="flex items-center space-x-4">
            {/* <Link 
              to="/workouts" 
              className="flex items-center space-x-1 no-underline text-white hover:text-blue-300 transition-colors"
            >
              <Dumbbell className="h-5 w-5" />
              <span>Workouts</span>
            </Link> */}
            <Link 
              to="/getDiet" 
              className="flex items-center space-x-1 no-underline text-white hover:text-green-300 transition-colors"
            >
              <Utensils className="h-5 w-5" />
              <span>Diet</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center space-x-1 no-underline text-white hover:text-purple-300 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="focus:outline-none hover:text-gray-300 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <SearchBar />
            <div className="space-y-3 mt-4">
              <Link 
                to="/workouts" 
                className="block py-2 flex items-center space-x-2 no-underline text-white  hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Dumbbell className="h-5 w-5" />
                <span>Workouts</span>
              </Link>
              <Link 
                to="/getDiet" 
                className="block py-2 flex items-center space-x-2 no-underline text-white hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Utensils className="h-5 w-5" />
                <span>Diet</span>
              </Link>
              <Link 
                to="/profile" 
                className="block py-2 flex items-center space-x-2 no-underline text-white hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
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

  if (loading) return <NotFound/>;
  if (!workoutPlan) return  <NotFound/>;

  return (
    <div className="flex justify-center w-screen items-center min-h-screen my-10 bg-black text-gray-200 p-6">
    <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl overflow-x-auto">
      <div className="flex justify-between items-center p-4">
        <button className="bg-gradient-to-r from-indigo-600  to-purple-600 shadow-lg text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none">
          Back to Exercise
        </button>
          {/* <button className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none">
            Another Button
          </button> */}
      </div>
      <div className="text-center font-bold text-2xl text-white py-4">Current Workout Plan</div>
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="bg-gray-700 text-gray-200 uppercase">
          <tr>
            <th className="px-6 py-4">Day</th>
            <th className="px-6 py-4">Exercise</th>
            <th className="px-6 py-4">Performance</th>
            <th className="px-6 py-4">Sets</th>
            <th className="px-6 py-4">Reps</th>
          </tr>
        </thead>
        <tbody>
          {workoutPlan.dailyWorkouts.map((workout, dayIndex) => (
            <React.Fragment key={dayIndex}>
              <tr className="bg-gray-700 text-gray-100 font-bold">
                <td colSpan="5" className="px-6 py-4 text-lg">
                  {workout.day}
                </td>
              </tr>
              {workout.exercises.map((exercise, exerciseIndex) => (
                <tr key={exerciseIndex} className="border-b border-gray-600 hover:bg-gray-700">
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">{exercise.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpen(exercise.name)}
                      className="px-3 py-2 bg-gradient-to-r from-indigo-400  to-purple-400 shadow-lg text-gray-200 rounded-lg shadow-lg hover:bg-gray-500 focus:outline-none border-none transition-all"
                    >
                      Add Performance
                    </button>
                  </td>
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
    <div className='bg-black'>

    <SearchProvider>
      { <NavbarWorkout />} 
      <GetWorkoutPlan onOpenModal={openModal} />
     {isModalOpen  && < PerformanceModal
        exerciseName={exerciseName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        />}
    </SearchProvider>
        </div>
 
  );
}