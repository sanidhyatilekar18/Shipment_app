import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';

function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      const q = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShipments(data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (shipmentId, newStatus) => {
    try {
      const shipmentRef = doc(db, 'shipments', shipmentId);
      await updateDoc(shipmentRef, { status: newStatus });
      fetchShipments(); // Refresh the table
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading shipments...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard - All Shipments</h2>

      {shipments.length === 0 ? (
        <p>No shipments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Sender</th>
                <th className="border p-2">Receiver</th>
                <th className="border p-2">Package</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Change Status</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="border p-2">{shipment.sender}</td>
                  <td className="border p-2">{shipment.receiver}</td>
                  <td className="border p-2">{shipment.packageSize}</td>
                  <td className="border p-2">{shipment.address}</td>
                  <td className="border p-2">{shipment.phone}</td>
                  <td className="border p-2">{shipment.status}</td>
                  <td className="border p-2">
                    <select
                      value={shipment.status}
                      onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    {shipment.createdAt?.toDate().toLocaleString() || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
