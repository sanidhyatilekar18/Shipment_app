import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ADMIN_EMAILS } from './constants/admins';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import CreateShipment from './pages/CreateShipment';
import Shipments from './pages/Shipments';
import AdminDashboard from './pages/AdminDashboard';
import TrackShipment from './pages/TrackShipment';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/create-shipment"
          element={
            <PrivateRoute>
              <CreateShipment />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipments"
          element={
            <PrivateRoute>
              <Shipments />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            currentUser && ADMIN_EMAILS.includes(currentUser.email)
              ? <AdminDashboard />
              : <Navigate to="/" />
          }
        />

        <Route path="/shipment/:id" element={<TrackShipment />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
