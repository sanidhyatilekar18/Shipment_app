import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

function Sidebar({ isOpen, toggleSidebar }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

    const handleLogout = async () => {
      await signOut(auth);
        toast.success('Logged out successfully');
      navigate('/login');
    };

  if (!currentUser) return null;

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-blue-50 shadow-md z-40 transform transition-transform duration-300 ease-in-out 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-64`}
    >
      <div className="p-6 border-b font-bold text-lg text-blue-600">🚚 ShipTrack</div>
      <nav className="flex flex-col p-4 space-y-4">
        <Link to="/dashboard" onClick={toggleSidebar} className="hover:text-blue-600 text-black">Dashboard</Link>
        <Link to="/create-shipment" onClick={toggleSidebar} className="hover:text-blue-600">Create Shipment</Link>
        <Link to="/shipments" onClick={toggleSidebar} className="hover:text-blue-600">My Shipments</Link>
        <button onClick={handleLogout} className="text-left text-red-600 hover:underline">Logout</button>
      </nav>
    </div>
  );
}

export default Sidebar;
