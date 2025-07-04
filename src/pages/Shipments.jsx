import React from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


function Shipments() {
  const [shipments, setShipments] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const q = query(
          collection(db, 'shipments'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShipments(data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [currentUser]);
  if (loading) return <p className="text-center mt-10">Loading shipments...</p>;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Shipments</h2>

      {shipments.length === 0 ? (
        <p>No shipments found. <Link className="text-blue-600" to="/create-shipment">Create one</Link>.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Sender</th>
                <th className="border p-2">Receiver</th>
                <th className="border p-2">Package</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Track</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="border p-2">{shipment.sender}</td>
                  <td className="border p-2">{shipment.receiver}</td>
                  <td className="border p-2">{shipment.packageSize}</td>
                  <td className="border p-2">{shipment.address}</td>
                  <td className="border p-2">{shipment.status}</td>
                  <td className="border p-2">
                    {shipment.createdAt?.toDate().toLocaleString() || "—"}
                  </td>
                  <td className="border p-2 text-center">
                    <Link to={`/shipment/${shipment.id}`}>
                      <button className="text-blue-600 underline">Track</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Shipments

