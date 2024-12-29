import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [adminDetails, setAdminDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  useEffect(() => {
    const storedData = localStorage.getItem('adminData');
    if (storedData) {
      const admin = JSON.parse(storedData); // Converts back to object
      console.log('Retrieved schema data:', admin);
      setAdminDetails({
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone || '',
        gender:admin.gender // If phone is missing, set it as an empty string
      });
    } else {
      console.log('No user data found in localStorage.');
    }
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${config.backendUrl}/change-user-details`,
        adminDetails,
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      setError('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setError('Password mismatch');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${config.backendUrl}/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert('Password changed successfully');
        setIsChangingPassword(false);
      }
    } catch (err) {
      setError('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 text-black rounded-lg shadow-md w-screen overflow-x-auto mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>

      {/* Admin Info Display */}
      <div className="mb-6">
        <div>
          <label className="font-medium">Full Name:</label>
          <input
            type="text"
            value={adminDetails.fullName}
            onChange={(e) =>
              setAdminDetails({ ...adminDetails, fullName: e.target.value })
            }
            className="w-full p-2 mt-2 border bg-gray-300  border-gray-300 rounded-lg"
            disabled={!isEditing}
          />
        </div>
        <div className="mt-4">
          <label className="font-medium">Email:</label>
          <input
            type="email"
            value={adminDetails.email}
            onChange={(e) =>
              setAdminDetails({ ...adminDetails, email: e.target.value })
            }
            className="w-full p-2 mt-2 border bg-gray-300  border-gray-300 rounded-lg"
            disabled
          />
        </div>
        {/* <div className="mt-4">
          <label className="font-medium">Phone:</label>
          <input
            type="text"
            value={adminDetails.phone}
            onChange={(e) =>
              setAdminDetails({ ...adminDetails, phone: e.target.value })
            }
            className="w-full p-2 mt-2 border border-gray-300 rounded"
            disabled={!isEditing}
          />
        </div> */}
      </div>

      {/* Edit Profile Button and Save Button */}
      {!isEditing ? (
        <button
          onClick={handleEditProfile}
          className="bg-gray-900 text-white p-2 rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          Edit Profile
        </button>
      ) : (
        <button
          onClick={handleSaveProfile}
          className="bg-gray-900 text-white p-2 rounded hover:bg-gray-700 w-full sm:w-auto"
        >
          Save Profile
        </button>
      )}

      {/* Change Password Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Change Password</h3>
        <button
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          className="mt-4 bg-gray-900 text-white p-2 rounded hover:bg-gray-700"
        >
          Change Password
        </button>

        {/* Password Change Form */}
        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="mt-4">
            <div className="mt-4">
              <label className="font-medium">Old Password:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 mt-2 border bg-gray-300  border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mt-4">
              <label className="font-medium">New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mt-2 border bg-gray-300  border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mt-4">
              <label className="font-medium">Confirm New Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mt-2 border bg-gray-300  border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>

      {/* Display Errors */}
      {error && (
        <div className="mt-4 text-red-600 text-sm">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
