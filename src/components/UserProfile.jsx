import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserProfile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-200 text-black rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>

      <div className="flex flex-col items-center space-y-4">
    
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl text-black">
            {currentUser.email.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="text-center">
          <p className="text-lg font-semibold">{currentUser.displayName || 'User'}</p>
          <p className="text-black">{currentUser.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
