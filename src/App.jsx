import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashBoard';
import PrivateRoute from './components/PrivateRoute';
import CreateShipment from './pages/CreateShipment';
import Shipments from './pages/shipments';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import TrackShipment from './pages/TrackShipment';
import { ToastContainer } from 'react-toastify';



function App() {
  return (
    <>

      <BrowserRouter>

        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
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

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/shipment/:id" element={<TrackShipment />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>

      <ToastContainer />
    </>
  )
}



export default App
