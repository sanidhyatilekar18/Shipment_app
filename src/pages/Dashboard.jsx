import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate,Link } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
      <Link to="/shipments">
  <button className="bg-green-600 text-white px-4 py-2 rounded mt-4">
    View My Shipments
  </button>
</Link>
    </div>
  );
}

export default Dashboard;
