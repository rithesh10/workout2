import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit, Search, User, Mail, Phone, UserX } from 'lucide-react';
import axios from "axios";

const UserProfile = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/v1/user/get-all-users");
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

  useEffect(() => {
    fetchUsers();
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-blue-200">
        <div className="animate-pulse text-2xl font-semibold text-blue-600">
          Loading Users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-600">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="container mx-auto bg-white rounded-2xl shadow-2xl p-6">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search users by name or email" 
            className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User List or Quote */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="bg-white border-2 border-blue-100 rounded-2xl p-5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => openUserModal(user)}
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <User className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-blue-50 rounded-2xl">
            <blockquote className="italic text-2xl text-gray-700 font-light">
              {quotes[Math.floor(Math.random() * quotes.length)]}
            </blockquote>
          </div>
        )}

        {/* User Details Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition"
              >
                ✕
              </button>
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="text-blue-600" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedUser.fullName}</h2>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-3 text-blue-600" size={20} />
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 text-blue-600" size={20} />
                  <p><strong>Mobile No:</strong> {selectedUser.phone}</p>
                </div>
                <div className="flex items-center">
                  {selectedUser.gender === 'Male' ? (
                    <UserX className="mr-3 text-blue-600" size={20} />
                  ) : (
                    <UserX className="mr-3 text-pink-600" size={20} />
                  )}
                  <p><strong>Gender:</strong> {selectedUser.gender}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-6">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center">
                  <Edit className="mr-2" size={16} /> Edit
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center">
                  <Trash2 className="mr-2" size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;


// import React, { useState,useEffect } from 'react';
// import { Calendar, Plus, Trash2, Edit } from 'lucide-react';
// import axios from "axios";

// const UserProfile = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [users, setUsers] = useState([]);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:4000/api/v1/user/get-all-users");
//       if (response.data && response.data.data) {
//         setUsers(
//           response.data.data.map((user) => ({
//             id: user._id,
//             fullName: user.fullName,
//             email: user.email,
//             phone: user.phone,
//             gender: user.gender,
//           }))
//         );
//       }
//       setLoading(false);
//     } catch (err) {
//       setError(err.message || "Failed to fetch users.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);
//   // Gym admin motivational quotes
//   const quotes = [
//     `"Fitness is not about being better than someone else; it's about being better than you used to be."`,
//     `"Success is walking from failure to failure with no loss of enthusiasm."`,
//     `"Your body can stand almost anything. It's your mind that you have to convince."`
//   ];
//   console.log(users);
  
//   // Filter users based on search term
//   const filteredUsers = users.filter(user => 
//     user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );
//   console.log(filteredUsers);
  

//   // Open user details modal
//   const openUserModal = (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-lg text-gray-600">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         {error}
//       </div>
//     );
//   }
//   return (
//     <div className="container mx-auto p-4">
//       {/* Search Bar */}
//       <div className="mb-4">
//         <input 
//           type="text" 
//           placeholder="Search users by name or email" 
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* User List or Quote */}
//       {filteredUsers.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredUsers.map(user => (
//             <div 
//               key={user.id} 
//               className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
//               onClick={() => openUserModal(user)}
//             >
//               <h3 className="text-lg font-semibold">{user.fullName}</h3>
//               <p className="text-gray-600">{user.email}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center p-8 bg-gray-100 rounded-lg">
//           <blockquote className="italic text-xl text-gray-700">
//             {quotes[Math.floor(Math.random() * quotes.length)]}
//           </blockquote>
//         </div>
//       )}

//       {/* User Details Modal */}
//       {isModalOpen && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-96">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold">{selectedUser.fullName}</h2>
//               <button 
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="space-y-3">
//               <p><strong>Email:</strong> {selectedUser.email}</p>
//               <p><strong>Role:</strong> {selectedUser.role}</p>
//               <p><strong>Gender:</strong> {selectedUser.gender}</p>
//               <p><strong>Mobile No:</strong> {selectedUser.phone}</p>
//             </div>
//             <div className="flex justify-end space-x-2 mt-4">
//               <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//                 <Edit className="inline-block mr-2" size={16} /> Edit
//               </button>
//               <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
//                 <Trash2 className="inline-block mr-2" size={16} /> Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;