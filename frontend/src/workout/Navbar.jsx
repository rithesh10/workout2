import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock exercise data (replace with actual API call)
const exercises = [
  { id: 1, name: 'Push Ups', category: 'Chest', description: 'Bodyweight chest exercise' },
  { id: 2, name: 'Squats', category: 'Legs', description: 'Lower body strength exercise' },
  { id: 3, name: 'Bench Press', category: 'Chest', description: 'Weight training chest exercise' },
  { id: 4, name: 'Deadlifts', category: 'Back', description: 'Compound strength exercise' },
  { id: 5, name: 'Lunges', category: 'Legs', description: 'Lower body mobility exercise' },
];

// Create context
const SearchContext = createContext();

// Provider component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.length > 1) {
      const results = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleExerciseSelect = (exercise) => {
    navigate(`/exercise/${exercise.id}`, { state: { exercise } });
    setSearchQuery('');
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider value={{
      searchQuery,
      searchResults,
      handleSearch,
      handleExerciseSelect,
      clearSearch,
      exercises
    }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for using the search context
export const useSearch = () => {
  return useContext(SearchContext);
};

// Reusable Search Component
export const SearchBar = ({ className = '' }) => {
  const { searchQuery, searchResults, handleSearch, handleExerciseSelect } = useSearch();

  return (
    <div className={`relative w-full max-w-md ${className} `}>
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

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white text-black shadow-lg rounded-b-lg mt-1 z-50 max-h-64 overflow-y-auto">
          {searchResults.map((exercise) => (
            <div 
              key={exercise.id} 
              className="p-2 hover:bg-gray-200 cursor-pointer border-b last:border-b-0"
              onClick={() => handleExerciseSelect(exercise)}
            >
              <div className="font-semibold">{exercise.name}</div>
              <div className="text-xs text-gray-500">{exercise.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Updated Navbar Component
 const NavbarWorkout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchResults } = useSearch();

  return (
    <nav className="bg-indigo-600 w-screen overflow-x-hidden top-0 text-white w-full p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Search Bar */}
        <SearchBar />

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <Link to="/workouts" className="hover:text-gray-300">Workouts</Link>
          <Link to="/diet" className="hover:text-gray-300">Diet</Link>
          <Link to="/profile" className="hover:text-gray-300">Profile</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-800 p-4">
          <Link to="/workouts" className="block py-2 hover:text-gray-300">Workouts</Link>
          <Link to="/diet" className="block py-2 hover:text-gray-300">Diet</Link>
          <Link to="/profile" className="block py-2 hover:text-gray-300">Profile</Link>
        </div>
      )}
    </nav>
  );
};
export default NavbarWorkout