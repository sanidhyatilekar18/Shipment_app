import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/DashBoard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
<BrowserRouter>

      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>


  )
}



export default App
