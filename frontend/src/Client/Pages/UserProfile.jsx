import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Edit2, 
  Save, 
  X,
  Camera,
  Calendar,
  MapPin,
  Weight,
  Ruler
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [userError, setUserError] = useState(null);
  const [workoutError, setWorkoutError] = useState(null);

  // Fetch user data from API
  const getUser = async () => {
    try {
      const response = await axios.get(
        `${config.backendUrl}/get-user`, // Empty payload
        { withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true" // Add the ngrok-specific header
          }
         } // Ensure cookies are sent
      );
      setUser(response.data.data); // Update state with user data
      console.log(response.data.data);
      
    } catch (err) {
      console.error("Error fetching user:", err);
      setUserError("Error fetching user data.");
    } finally {
      setLoadingUser(false); // Stop the loading spinner for user data
    }
  };

  const getWorkout = async () => {
    try {
      const response = await axios.post(
        `${config.backendUrl}/get-user-workout-plan`,
        {}, // Empty payload
        { withCredentials: true,
         
         } // Ensure cookies are sent
      );
      setWorkout(response.data.data); // Update state with workout data
    } catch (err) {
      console.error("Error fetching workout:", err);
      setWorkoutError("Error fetching workout data.");
    } finally {
      setLoadingWorkout(false); // Stop the loading spinner for workout data
    }
  };

  useEffect(() => {
    getUser(); // Fetch user data when component mounts
    getWorkout(); // Fetch workout data when component mounts
  }, []); // Empty dependency array to run only once on mount

  const handleInfoChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };
  const navigate=useNavigate();

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    const userData = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone
    };
    // Make an API call to update user information
    try {
      await axios.post(`${config.backendUrl}/change-user-details`,userData,{
          withCredentials:true,
         
        },
      )
    alert("Updated Successfully");
      
    } catch (error) {
      setUserError("Failed to change the user details");
      navigate("/dash")
      
      
    }
    // console.log(user);
    // await axios.put(...);
    setIsEditing(false); // Exit edit mode
  };

  const handleSubmitPassword = async (e) => {
  e.preventDefault();

  if (passwords.newPassword !== passwords.confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  try {
    // Make API call to change password
    const response = await axios.post(
      `${config.backendUrl}/change-password`, // Change to your API endpoint
      {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      },
      { withCredentials: true } // Ensure cookies are sent for authentication
    );

    // Handle success response
    alert("Password changed successfully!");
    setIsChangingPassword(false);
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  } catch (err) {
    // Handle error response
    console.error("Error changing password:", err);
    alert("Failed to change password. Please try again.");
  }
};


 if (loadingUser || loadingWorkout) {
    return (
      <div class="flex items-center justify-center min-h-screen h-screen w-screen bg-gray-100">
      <svg class="w-24 h-24 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
          </path>
        </svg>
    </div>
    
    
    );
  }

  if (userError || workoutError) {
    alert("Error fetching the data or invalid credentials");
    navigate("/");
    
  };

  return (
  <>
      {
  <div className="min-h-screen w-screen overflow-x-hidden bg-black text-gray-200 py-8">
  <div className="max-w-4xl mx-auto px-4">
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gray-700 px-6 py-8">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-600">
              <Camera className="w-4 h-4 text-gray-300" />
            </button>
          </div>
          <div className="ml-6 text-white">
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center text-sm font-medium rounded bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 text-gray-300 hover:bg-gray-600 hover:text-white py-2 px-4"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmitInfo}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleInfoChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInfoChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleInfoChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Age (Calculated)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={workout.age || 0}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-600 px-3 py-2 text-white disabled:bg-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <Weight className="w-4 h-4 mr-2" />
                      Weight
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={workout.weight || 0}
                      onChange={handleInfoChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <Ruler className="w-4 h-4 mr-2" />
                      Height
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={workout.height || ''}
                      onChange={handleInfoChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Change Password Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="flex items-center text-sm font-medium rounded bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 text-gray-300 hover:bg-gray-600 hover:text-white py-2 px-4"
            >
              {isChangingPassword ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  Change Password
                </>
              )}
            </button>
          </div>

          {isChangingPassword && (
            <form onSubmit={handleSubmitPassword}>
              <div>
                <label className="text-sm font-medium text-gray-300">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-300">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
}


</>
  );
};

export default UserProfile;
