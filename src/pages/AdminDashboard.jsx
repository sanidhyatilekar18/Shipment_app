import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedStatuses, setUpdatedStatuses] = useState({});
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchShipments();
  }, []);

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
      toast.error('Failed to fetch shipments');
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (shipmentId) => {
    const newStatus = updatedStatuses[shipmentId];
    if (!newStatus) return;

    try {
      const shipmentRef = doc(db, 'shipments', shipmentId);
      await updateDoc(shipmentRef, {
        status: newStatus
      });

      toast.success('Status updated successfully');
      fetchShipments(); // refresh data
    } catch (error) {
      toast.error('Error updating status');
      console.error('Error updating status:', error);
    }
  };

  const filteredShipments = statusFilter === 'All'
    ? shipments
    : shipments.filter(shipment => shipment.status === statusFilter);

  if (loading) return <p className="text-center mt-10">Loading shipments...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel - All Shipments</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-1"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {filteredShipments.length === 0 ? (
        <p className="text-center">No shipments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Sender</th>
                <th className="border p-2">Receiver</th>
                <th className="border p-2">Package</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map(shipment => (
                <tr key={shipment.id}>
                  <td className="border p-2">{shipment.sender}</td>
                  <td className="border p-2">{shipment.receiver}</td>
                  <td className="border p-2">{shipment.packageSize}</td>
                  <td className="border p-2">{shipment.address}</td>
                  <td className="border p-2">{shipment.phone}</td>
                  <td className="border p-2">
                    <select
                      value={updatedStatuses[shipment.id] || shipment.status}
                      onChange={(e) =>
                        setUpdatedStatuses(prev => ({
                          ...prev,
                          [shipment.id]: e.target.value
                        }))
                      }
                      className="border rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="border p-2">{shipment.createdAt?.toDate().toLocaleString()}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleStatusUpdate(shipment.id)}
                      disabled={
                        !updatedStatuses[shipment.id] ||
                        updatedStatuses[shipment.id] === shipment.status
                      }
                      className={`px-2 py-1 rounded text-white ${
                        updatedStatuses[shipment.id] !== shipment.status
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Update
                    </button>
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
