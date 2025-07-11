import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
          orderBy('createdAt', 'desc')
        );
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

  const handleCancel = async (shipment) => {
    const { id, createdAt, status } = shipment;

    if (!canCancel(createdAt)) {
      toast.error("Shipment can only be cancelled within 2 hours of creation.");
      return;
    }

    if (status !== 'Pending') {
      toast.info("Only pending shipments can be cancelled.");
      return;
    }

    try {
      const shipmentRef = doc(db, 'shipments', id);
      await updateDoc(shipmentRef, { status: 'Cancelled' });

      setShipments(prev =>
        prev.map(s => (s.id === id ? { ...s, status: 'Cancelled' } : s))
      );
      toast.success("Shipment cancelled successfully.");
    } catch (error) {
      toast.error("Failed to cancel shipment.");
      console.error(error);
    }
  };


  const canCancel = (createdAt) => {
    if (!createdAt) return false;
    const now = Date.now();
    const createdTime = createdAt.toDate().getTime();
    const diff = now - createdTime;
    return diff <= 2 * 60 * 60 * 1000;
  };

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
                <th className="border p-2">Actions</th>
                <th className="border p-2">Cancel</th>
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
                  <td className="border p-2 flex flex-col gap-2">
                    <Link to={`/shipment/${shipment.id}`}>
                      <button className="text-blue-600 underline">Track</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleCancel(shipment)}
                      className="text-red-600 underline disabled:text-gray-400"
                    >
                      Cancel
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

export default Shipments;
