import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Function to fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/v1/user/get-all-users"); // Replace with your API endpoint
      if (response.data && response.data.data) {
        setUsers(response.data.data.map(user => ({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
        })));
      }
      // console.log(users);
      
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  // UseEffect to fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Full Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Gender</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {users.map((user, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{user.fullName}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.phone}</td>
                <td className="py-3 px-6 text-left">{user.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;



// import React, { useState } from 'react';

// const UserManagement = () => {
//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: 'John Doe',
//       email: 'john@example.com',
//       role: 'member',
//       joinDate: '2024-01-15',
//       status: 'active',
//       membershipType: 'premium',
//       assignedWorkoutPlan: 'Full Body Beginner',
//       lastActive: '2024-03-20',
//       progress: {
//         workoutsCompleted: 24,
//         currentStreak: 3,
//         attendance: '80%'
//       },
//       personalInfo: {
//         age: 28,
//         weight: '75kg',
//         height: '175cm',
//         fitnessGoals: ['Weight Loss', 'Muscle Gain']
//       }
//     }
//   ]);

//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: 'member',
//     membershipType: 'basic',
//     status: 'active',
//     personalInfo: {
//       age: '',
//       weight: '',
//       height: '',
//       fitnessGoals: []
//     }
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedUser) {
//       setUsers(prev =>
//         prev.map(user =>
//           user.id === selectedUser.id
//             ? { ...user, ...formData }
//             : user
//         )
//       );
//     } else {
//       setUsers(prev => [
//         ...prev,
//         {
//           ...formData,
//           id: Date.now(),
//           joinDate: new Date().toISOString().split('T')[0],
//           lastActive: new Date().toISOString().split('T')[0],
//           progress: {
//             workoutsCompleted: 0,
//             currentStreak: 0,
//             attendance: '0%'
//           }
//         }
//       ]);
//     }
//     setIsEditing(false);
//     setSelectedUser(null);
//   };

//   const handleDeleteUser = (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       setUsers(prev => prev.filter(user => user.id !== id));
//     }
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   const renderUserDetails = (user) => (
//     <div className="space-y-4">
//       <h3 className="text-lg font-bold">User Details</h3>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <h4 className="font-semibold">Personal Information</h4>
//           <p>Age: {user.personalInfo.age}</p>
//           <p>Weight: {user.personalInfo.weight}</p>
//           <p>Height: {user.personalInfo.height}</p>
//         </div>
//         <div>
//           <h4 className="font-semibold">Membership Details</h4>
//           <p>Type: {user.membershipType}</p>
//           <p>Join Date: {user.joinDate}</p>
//           <p>Status: {user.status}</p>
//         </div>
//       </div>
//       <div>
//         <h4 className="font-semibold">Progress Overview</h4>
//         <p>Workouts Completed: {user.progress.workoutsCompleted}</p>
//         <p>Current Streak: {user.progress.currentStreak} days</p>
//         <p>Attendance: {user.progress.attendance}</p>
//       </div>
//       <div>
//         <h4 className="font-semibold">Workout Plan</h4>
//         <p>Current Plan: {user.assignedWorkoutPlan || 'None assigned'}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">User Management</h2>
//         <button
//           onClick={() => setIsEditing(true)}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add New User
//         </button>
//       </div>

//       <div className="mb-6 flex gap-4">
//         <input
//           type="text"
//           placeholder="Search users..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded p-2 flex-grow"
//         />
//         <select
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border rounded p-2"
//         >
//           <option value="all">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Email</th>
//               <th className="border p-2">Role</th>
//               <th className="border p-2">Membership</th>
//               <th className="border p-2">Status</th>
//               <th className="border p-2">Last Active</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map(user => (
//               <tr key={user.id}>
//                 <td className="border p-2">{user.name}</td>
//                 <td className="border p-2">{user.email}</td>
//                 <td className="border p-2">{user.role}</td>
//                 <td className="border p-2">{user.membershipType}</td>
//                 <td className="border p-2">{user.status}</td>
//                 <td className="border p-2">{user.lastActive}</td>
//                 <td className="border p-2">
//                   <button
//                     onClick={() => {
//                       setSelectedUser(user);
//                       setFormData(user);
//                       setIsEditing(true);
//                     }}
//                     className="text-blue-500 mr-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteUser(user.id)}
//                     className="text-red-500 mr-2"
//                   >
//                     Delete
//                   </button>
//                   <button
//                     onClick={() => setSelectedUser(user)}
//                     className="text-green-500"
//                   >
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md">
//             <h2 className="text-xl font-bold mb-4">
//               {selectedUser ? 'Edit User' : 'Add New User'}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block mb-1">Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1">Role</label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 >
//                   <option value="member">Member</option>
//                   <option value="trainer">Trainer</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block mb-1">Membership Type</label>
//                 <select
//                   name="membershipType"
//                   value={formData.membershipType}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 >
//                   <option value="basic">Basic</option>
//                   <option value="premium">Premium</option>
//                   <option value="pro">Pro</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block mb-1">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                   className="w-full border rounded p-2"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="suspended">Suspended</option>
//                 </select>
//               </div>
//               <div className="flex gap-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsEditing(false);
//                     setSelectedUser(null);
//                   }}
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-4 py-2 rounded"
//                 >
//                   {selectedUser ? 'Save Changes' : 'Add User'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {selectedUser && !isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
//             {renderUserDetails(selectedUser)}
//             <button
//               onClick={() => setSelectedUser(null)}
//               className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;