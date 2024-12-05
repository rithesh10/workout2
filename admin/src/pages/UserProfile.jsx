import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit, Search, User, Mail, Phone, UserX } from 'lucide-react';
import axios from "axios";
import config from '../config/config';

const UserProfile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/get-all-users`);
      if (response.data && response.data.data) {
        setUsers(
          response.data.data.map((user) => ({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
          }))
        );
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    fetchUsers();

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const quotes = [
    `"Fitness is not about being better than someone else; it's about being better than you used to be."`,
    `"Success is walking from failure to failure with no loss of enthusiasm."`,
    `"Your body can stand almost anything. It's your mind that you have to convince."`
  ];

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openUserModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 px-4">
        <div className="animate-pulse text-base sm:text-2xl font-semibold text-blue-600 text-center">
          Loading Users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50 text-red-600 px-4">
        <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-base sm:text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-6">
      <div className="container mx-auto bg-white rounded-2xl shadow-2xl p-2 sm:p-6">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={isMobile ? 16 : 20} />
          </div>
          <input 
            type="text" 
            placeholder="Search users by name or email" 
            className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User List or Quote */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="bg-white border-2 border-blue-100 rounded-2xl p-3 sm:p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => openUserModal(user)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-4">
                    <User className="text-blue-600" size={isMobile ? 18 : 24} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition truncate max-w-[200px]">
                      {user.fullName}
                    </h3>
                    {/* <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px]">{user.email}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 sm:p-10 bg-blue-50 rounded-2xl">
            <blockquote className="italic text-base sm:text-2xl text-gray-700 font-light">
              {quotes[Math.floor(Math.random() * quotes.length)]}
            </blockquote>
          </div>
        )}

        {/* User Details Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-6">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-8 relative transform transition-all">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 sm:p-2 transition"
              >
                ✕
              </button>
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                  <User className="text-blue-600" size={isMobile ? 32 : 48} />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">{selectedUser.fullName}</h2>
                <p className="text-sm sm:text-base text-gray-500">{selectedUser.email}</p>
              </div>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-2 sm:mr-3 text-blue-600" size={isMobile ? 16 : 20} />
                  <p className="text-sm sm:text-base"><strong>Email:</strong> {selectedUser.email}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 sm:mr-3 text-blue-600" size={isMobile ? 16 : 20} />
                  <p className="text-sm sm:text-base"><strong>Mobile No:</strong> {selectedUser.phone}</p>
                </div>
                <div className="flex items-center">
                  {selectedUser.gender === 'Male' ? (
                    <UserX className="mr-2 sm:mr-3 text-blue-600" size={isMobile ? 16 : 20} />
                  ) : (
                    <UserX className="mr-2 sm:mr-3 text-pink-600" size={isMobile ? 16 : 20} />
                  )}
                  <p className="text-sm sm:text-base"><strong>Gender:</strong> {selectedUser.gender}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-6">
                <button className="bg-blue-500 text-white px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-blue-600 transition flex items-center">
                  <Edit className="mr-1 sm:mr-2" size={isMobile ? 12 : 16} /> Edit
                </button>
                <button className="bg-red-500 text-white px-3 sm:px-6 py-1 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-red-600 transition flex items-center">
                  <Trash2 className="mr-1 sm:mr-2" size={isMobile ? 12 : 16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;