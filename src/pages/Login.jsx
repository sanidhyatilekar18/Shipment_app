import React from 'react'
import { useState } from 'react';
import { ADMIN_EMAILS } from '../constants/admins';
import { toast } from 'react-toastify';

import { auth, provider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userEmail = userCredential.user.email;

    if (role === 'admin') {
      if (ADMIN_EMAILS.includes(userEmail)) {
        navigate('/admin-dashboard');
      } else {
        toast.error('Access denied: Not an admin');
        return;
      }
    } else {
      navigate('/');
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
  <label className="mr-2 font-semibold">Login as:</label>
  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="border p-2 rounded w-full"
  >
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </select>
</div>

        <input
          className="w-full mb-4 p-2 border rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-3"
        >
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Sign in with Google
        </button>

        <p className="text-sm mt-4 text-center">
          Don’t have an account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login