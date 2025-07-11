import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white pb-40 pt-10 px-4 text-center flex flex-col items-center">
        <img src="heroimg.png" alt="Hero" className="mx-auto mb-6 h-100 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-120" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Shipster 🚚</h1>
        <p className="text-lg md:text-xl mb-6">
          Your smart solution to <span className="font-bold">Create</span> <span className="font-bold">track</span> and <span className="font-bold">manage</span> shipments effortlessly.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/login">
            <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
              Register
            </button>
          </Link>
        </div>
      </header>

      
      <section className="py-18 px-6  bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-10 text-blue-700">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2">📦 Create Shipment</h3>
            <p>Create and schedule your delivery by entering details easily.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🚚 Track Your Parcel</h3>
            <p>View live updates of your shipment with real-time tracking.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">✅ Get Delivered</h3>
            <p>Your package arrives safely, and you stay informed throughout.</p>
          </div>
        </div>
      </section>

      <div className="bg-white py-12 px-6 lg:px-20">
  <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">Why Choose Shipster?</h2>
  <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    
    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-800 mb-2">🚀 Fast Delivery</h3>
      <p className="text-gray-700">Shipments reach their destination quickly and efficiently with real-time tracking updates.</p>
    </div>

    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-800 mb-2">🛡️ Safe Package Handling</h3>
      <p className="text-gray-700">Each package is handled with care and security, ensuring zero damage during transit.</p>
    </div>

    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-800 mb-2">📦 Real-Time Tracking</h3>
      <p className="text-gray-700">Track your shipment from pickup to delivery with live updates on location and status.</p>
    </div>

    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-800 mb-2">🔐 Secure Authentication</h3>
      <p className="text-gray-700">User accounts are secured using Firebase authentication and OTP verification.</p>
    </div>

    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-800 mb-2">📊 Shipment History</h3>
      <p className="text-gray-700">View and manage all your past shipments in one convenient place.</p>
    </div>

    <div className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-blue-800 mb-2">🧑‍💼 Admin Control Panel</h3>
      <p className="text-gray-700">Admins can view and manage all user shipments, update statuses, and maintain control.</p>
    </div>

  </div>
</div>


    
      <footer className="bg-blue-600 text-white text-center py-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Shipster. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
