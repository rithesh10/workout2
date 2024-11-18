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
import axios from 'axios';

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
      const response = await axios.post(
        'http://localhost:4000/api/v1/user/get-user',
        {}, // Empty payload
        { withCredentials: true } // Ensure cookies are sent
      );
      setUser(response.data.data); // Update state with user data
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
        'http://localhost:4000/api/v1/user/get-user-workout-plan',
        {}, // Empty payload
        { withCredentials: true } // Ensure cookies are sent
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

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    // Make an API call to update user information
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
      'http://localhost:4000/api/v1/user/change-password', // Change to your API endpoint
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
      <div>Loading...</div>
    );
  }

  if (userError || workoutError) {
    return (
      <div>
        {userError && <p>{userError}</p>}
        {workoutError && <p>{workoutError}</p>}
      </div>
    );
  };

  return (
  <>
  {(loadingUser||loadingWorkout) &&(
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {
    <div className="min-h-screen w-screen overflow-x-hidden bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 px-6 py-8">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-500" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                  <Camera className="w-4 h-4 text-blue-500" />
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
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-blue-500 text-sm font-medium rounded bg-white border border-blue-500 hover:bg-blue-500 hover:text-black py-2 px-4"
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-1 text-white" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleSubmitInfo}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleInfoChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInfoChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full  bg-white rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleInfoChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md  bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Age (Calculated)
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={workout.age || ''} // Assuming user.age exists
                        disabled={!isEditing}
                        className="mt-1 block w-full  bg-white rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-gray-100"
                      />
                    </div>

                    {/* <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={user.location || ''}
                        onChange={handleInfoChange}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div> */}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center">
                          <Weight className="w-4 h-4 mr-2" />
                          Weight
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={workout.weight || ''}
                          onChange={handleInfoChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full  bg-white rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center">
                          <Ruler className="w-4 h-4 mr-2" />
                          Height
                        </label>
                        <input
                          type="text"
                          name="height"
                          value={workout.height || ''}
                          onChange={handleInfoChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full  bg-white rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-indigo-600"
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
                {/* <h2 className="text-xl font-semibold text-gray-800">Change Password</h2> */}
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="flex items-center text-blue-500 text-sm font-medium rounded bg-white border border-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4"
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
                    <label className="text-sm font-medium  text-gray-600">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full rounded-md border  bg-white border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-600"
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
