import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import UserProfile from './UserProfile';
import { ADMIN_EMAILS } from '../constants/admins';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const isAdmin = ADMIN_EMAILS.includes(auth.currentUser?.email);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  const handleUserProfile = () => {
    setShowUserProfile((prev) => !prev);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg fixed  min-w-full z-50">
      <div className="max-w-7xl mx-auto px-2 py-3 flex items-center justify-between">

        <div className="flex items-center space-x-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <img src="/ogo.png" alt="Logo" className="h-14 w-16" />
            <span className='font-bold text-4xl'>Shipster</span>
          </Link>
        </div>

        
        <div className="hidden md:flex items-center space-x-6 ">
          <Link to="/" className="text-xl font-semibold transition delay-50 duration-300 ease-out hover:-translate-y-1 hover:scale-120">Home</Link>
          {isAdmin && (
  <Link
    to="/admin-dashboard"
    className="text-xl font-semibold transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-120"
  >
    Admin Dashboard
  </Link>
)}
          <Link to="/create-shipment" className="text-xl font-semibold transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-120">Create Shipment</Link>
          <Link to="/shipments" className="text-xl font-semibold transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-120">My Shipments</Link>

          
          
          
          {auth.currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md cursor-pointer" 
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md "
            >
              Login
            </Link>
          )}
          <div className="relative mx-3 space-x-3">
            <button onClick={handleUserProfile} className="hover:text-gray-200 cursor-pointer">
              <FontAwesomeIcon icon={faUser}  size='xl'/>
            </button>
            {showUserProfile && (
              <div className="absolute right-0 mt-2 cursor-pointer">
                <UserProfile  />
              </div>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 py-3 bg-blue-500 text-white space-y-2 ">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-lg hover:text-gray-300">Home</Link>
          {isAdmin && (
  <Link
    to="/admin-dashboard"
    onClick={() => setMenuOpen(false)}
    className="block text-lg hover:text-gray-300"
  >
    Admin Dashboard
  </Link>
)}

          <Link to="/create-shipment" onClick={() => setMenuOpen(false)} className="block text-lg hover:text-gray-300">Create Shipment</Link>
          <Link to="/shipments" onClick={() => setMenuOpen(false)} className="block text-lg hover:text-gray-300">My Shipments</Link>
          <button onClick={handleLogout} className="block text-left text-lg w-full hover:text-gray-300">Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
